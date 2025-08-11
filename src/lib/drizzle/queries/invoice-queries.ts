import { eq, and, sql, desc, gte, lte, ilike } from 'drizzle-orm';
import { db } from '../drizzle';
import { invoices, invoiceItems, } from '../schema/invoice-schema';
import type { Invoice, InvoiceItem, Customer, Product, Sale, InvoiceStatus } from '../types';
import { z } from 'zod';
import { uuidSchema, paginationSchema } from '../../zod/generalSchema';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/zod/errorSchema';

// Invoice schemas
const createInvoiceSchema = z.object({
  businessId: uuidSchema,
  customerId: uuidSchema.optional(),
  saleId: uuidSchema.optional(),
  invoiceNumber: z.string().min(1).max(50),
  issueDate: z.date().default(() => new Date()),
  dueDate: z.date(),
  subtotal: z.number().positive(),
  taxAmount: z.number().min(0).default(0),
  discountAmount: z.number().min(0).default(0),
  totalAmount: z.number().positive(),
  paidAmount: z.number().min(0).default(0),
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']).default('draft'),
  notes: z.string().optional(),
  terms: z.string().optional(),
});

const updateInvoiceSchema = createInvoiceSchema.partial();

const createInvoiceItemSchema = z.object({
  invoiceId: uuidSchema,
  productId: uuidSchema.optional(),
  description: z.string().min(1),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  totalPrice: z.number().positive(),
});

type InvoiceWithDetails = Invoice & {
  customer?: Customer;
  sale?: Sale;
  invoiceItems?: (InvoiceItem & {
    product?: Product;
  })[];
};

export type InvoiceFilters = {
  search?: string;
  status?: string;
  customerId?: string;
  startDate?: string;
  endDate?: string;
  overdue?: boolean;
};

export const invoiceQueries = {
  // Get invoice by ID
  async getById(invoiceId: string): Promise<InvoiceWithDetails | null> {
    try {
      const validatedId = uuidSchema.parse(invoiceId);
      const invoiceid = await db.query.invoices.findFirst({
        where: eq(invoices.id, validatedId),
        with: {
          customer: true,
          sale: true,
          invoiceItems: {
            with: {
              product: true,
            },
          },
        },
      });
      return invoiceid as InvoiceWithDetails | null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid invoice ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to fetch invoice', error);
    }
  },

  // Get invoices by business ID
  async getByBusinessId(
    businessId: string,
    filters: InvoiceFilters = {},
    paginationData: z.infer<typeof paginationSchema> = { page: 1, limit: 10 }
  ): Promise<{ invoices: InvoiceWithDetails[]; total: number }> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);
      const { page = 1, limit = 10 } = paginationSchema.parse(paginationData);
      const offset = (page - 1) * limit;

      const whereConditions = [eq(invoices.businessId, validatedBusinessId)];

      if (filters.search) {
        const searchTerm = `%${filters.search}%`;
        whereConditions.push(ilike(invoices.invoiceNumber, searchTerm));
      }

      if (filters.status) {
        whereConditions.push(eq(invoices.invoiceStatus, filters.status as InvoiceStatus));
      }

      if (filters.customerId) {
        whereConditions.push(eq(invoices.customerId, filters.customerId));
      }

      if (filters.startDate) {
        whereConditions.push(gte(invoices.issueDate, new Date(filters.startDate)));
      }

      if (filters.endDate) {
        whereConditions.push(lte(invoices.issueDate, new Date(filters.endDate)));
      }

      if (filters.overdue) {
        whereConditions.push(
          and(
            eq(invoices.invoiceStatus, 'paid'),
          ),
            lte(invoices.dueDate, new Date()),
        );
      }

      const whereClause = and(...whereConditions);

      // Get total count
      const totalResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(invoices)
        .where(whereClause);

      const total = Number(totalResult[0]?.count || 0);

      // Get paginated results
      const result = await db.query.invoices.findMany({
        where: whereClause,
        with: {
          customer: true,
          sale: true,
          invoiceItems: {
            with: {
              product: true,
            },
          },
        },
        limit,
        offset,
        orderBy: [desc(invoices.issueDate)],
      });
      const typedResult = result as InvoiceWithDetails[];
      return { invoices: typedResult, total };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to fetch invoices', error);
    }
  },

  // Create invoice
  async create(invoiceData: z.infer<typeof createInvoiceSchema>): Promise<Invoice> {
    try {
      const validatedData = createInvoiceSchema.parse(invoiceData);

      const [invoice] = await db
        .insert(invoices)
        .values({
          ...validatedData,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();

      return invoice;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to create invoice', error);
    }
  },

  // Create invoice with items (transaction)
  async createWithItems(
    invoiceData: z.infer<typeof createInvoiceSchema>,
    items: z.infer<typeof createInvoiceItemSchema>[]
  ): Promise<InvoiceWithDetails> {
    try {
      const validatedInvoiceData = createInvoiceSchema.parse(invoiceData);
      const validatedItems = items.map(item => createInvoiceItemSchema.parse(item));

      return await db.transaction(async (tx) => {
        // Create invoice
        const [invoice] = await tx
          .insert(invoices)
          .values({
            ...validatedInvoiceData,
            created_at: new Date(),
            updated_at: new Date(),
          })
          .returning();

        // Create invoice items
        const invoiceItemsData = validatedItems.map(item => ({
          ...item,
          invoiceId: invoice.id,
          createdAt: new Date(),
        }));

         await tx
          .insert(invoiceItems)
          .values(invoiceItemsData)
          .returning();

        // Get complete invoice with relations
        const completeInvoice = await tx.query.invoices.findFirst({
          where: eq(invoices.id, invoice.id),
          with: {
            customer: true,
            sale: true,
            invoiceItems: {
              with: {
                product: true,
              },
            },
          },
        });

        return completeInvoice as InvoiceWithDetails;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to create invoice with items', error);
    }
  },

  // Update invoice
  async update(invoiceId: string, updateData: z.infer<typeof updateInvoiceSchema>): Promise<Invoice> {
    try {
      const validatedId = uuidSchema.parse(invoiceId);
      const validatedData = updateInvoiceSchema.parse(updateData);

      const [invoice] = await db
        .update(invoices)
        .set({
          ...validatedData,
          updated_at: new Date(),
        })
        .where(eq(invoices.id, validatedId))
        .returning();

      if (!invoice) throw new NotFoundError('Invoice not found');
      return invoice;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to update invoice', error);
    }
  },

  // Mark invoice as sent
  async markAsSent(invoiceId: string): Promise<Invoice> {
    try {
      const validatedId = uuidSchema.parse(invoiceId);

      const [invoice] = await db
        .update(invoices)
        .set({
          invoiceStatus: 'sent',
          updated_at: new Date(),
        })
        .where(eq(invoices.id, validatedId))
        .returning();

      if (!invoice) throw new NotFoundError('Invoice not found');
      return invoice;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid invoice ID: ${error.errors[0].message}`);
      }
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to mark invoice as sent', error);
    }
  },

  // Mark invoice as paid
  async markAsPaid(invoiceId: string, paidAmount?: number): Promise<Invoice> {
    try {
      const validatedId = uuidSchema.parse(invoiceId);

      const existingInvoice = await this.getById(validatedId);
      if (!existingInvoice) {
        throw new NotFoundError('Invoice not found');
      }

      const finalPaidAmount = paidAmount ?? existingInvoice.totalAmount;

      const [invoice] = await db
        .update(invoices)
        .set({
          invoiceStatus: 'paid',
          paidAmount: finalPaidAmount,
          updated_at: new Date(),
        })
        .where(eq(invoices.id, validatedId))
        .returning();

      return invoice;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid invoice ID: ${error.errors[0].message}`);
      }
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to mark invoice as paid', error);
    }
  },

  // Cancel invoice
  async cancel(invoiceId: string, reason?: string): Promise<Invoice> {
    try {
      const validatedId = uuidSchema.parse(invoiceId);

      const [invoice] = await db
        .update(invoices)
        .set({
          invoiceStatus: 'cancelled',
          notes: reason,
          updated_at: new Date(),
        })
        .where(eq(invoices.id, validatedId))
        .returning();

      if (!invoice) throw new NotFoundError('Invoice not found');
      return invoice;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid invoice ID: ${error.errors[0].message}`);
      }
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to cancel invoice', error);
    }
  },

  // Get overdue invoices
  async getOverdue(businessId: string): Promise<InvoiceWithDetails[]> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);
      const today = new Date();

      const overdueInvoices = await db.query.invoices.findMany({
        where: and(
          eq(invoices.businessId, validatedBusinessId),
          lte(invoices.dueDate, today),
          sql`${invoices.invoiceStatus} != 'paid'`,
          sql`${invoices.invoiceStatus} != 'cancelled'`
        ),
        with: {
          customer: true,
          sale: true,
          invoiceItems: {
            with: {
              product: true,
            },
          },
        },
        orderBy: [invoices.dueDate],
      });
      return overdueInvoices as InvoiceWithDetails[];
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid business ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to fetch overdue invoices', error);
    }
  },

  // Get invoices summary
  async getInvoicesSummary(
    businessId: string,
    startDate?: string,
    endDate?: string
  ): Promise<{
    totalInvoices: number;
    totalAmount: number;
    paidAmount: number;
    outstandingAmount: number;
    overdueAmount: number;
    draftInvoices: number;
    sentInvoices: number;
    paidInvoices: number;
    overdueInvoices: number;
  }> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);
      const whereConditions = [eq(invoices.businessId, validatedBusinessId)];

      if (startDate) {
        whereConditions.push(gte(invoices.issueDate, new Date(startDate)));
      }

      if (endDate) {
        whereConditions.push(lte(invoices.issueDate, new Date(endDate)));
      }

      const [summary] = await db
        .select({
          totalInvoices: sql<number>`COUNT(*)`,
          totalAmount: sql<number>`COALESCE(SUM(${invoices.totalAmount}), 0)`,
          paidAmount: sql<number>`COALESCE(SUM(${invoices.paidAmount}), 0)`,
          outstandingAmount: sql<number>`COALESCE(SUM(${invoices.totalAmount} - ${invoices.paidAmount}), 0)`,
          overdueAmount: sql<number>`COALESCE(SUM(CASE WHEN ${invoices.dueDate} < NOW() AND ${invoices.invoiceStatus} != 'paid' THEN ${invoices.totalAmount} - ${invoices.paidAmount} ELSE 0 END), 0)`,
          draftInvoices: sql<number>`COUNT(CASE WHEN ${invoices.invoiceStatus} = 'draft' THEN 1 END)`,
          sentInvoices: sql<number>`COUNT(CASE WHEN ${invoices.invoiceStatus} = 'sent' THEN 1 END)`,
          paidInvoices: sql<number>`COUNT(CASE WHEN ${invoices.invoiceStatus} = 'paid' THEN 1 END)`,
          overdueInvoices: sql<number>`COUNT(CASE WHEN ${invoices.dueDate} < NOW() AND ${invoices.invoiceStatus} != 'paid' AND ${invoices.invoiceStatus} != 'cancelled' THEN 1 END)`,
        })
        .from(invoices)
        .where(and(...whereConditions));

      return {
        totalInvoices: Number(summary.totalInvoices),
        totalAmount: Number(summary.totalAmount),
        paidAmount: Number(summary.paidAmount),
        outstandingAmount: Number(summary.outstandingAmount),
        overdueAmount: Number(summary.overdueAmount),
        draftInvoices: Number(summary.draftInvoices),
        sentInvoices: Number(summary.sentInvoices),
        paidInvoices: Number(summary.paidInvoices),
        overdueInvoices: Number(summary.overdueInvoices),
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid business ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to fetch invoices summary', error);
    }
  },

  // Get invoices by customer
  async getByCustomerId(
    customerId: string,
    paginationData: z.infer<typeof paginationSchema> = { page: 1, limit: 10 }
  ): Promise<{ invoices: InvoiceWithDetails[]; total: number }> {
    try {
      const validatedCustomerId = uuidSchema.parse(customerId);
      const { page = 1, limit = 10 } = paginationSchema.parse(paginationData);
      const offset = (page - 1) * limit;

      // Get total count
      const totalResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(invoices)
        .where(eq(invoices.customerId, validatedCustomerId));

      const total = Number(totalResult[0]?.count || 0);

      // Get paginated results
      const result = await db.query.invoices.findMany({
        where: eq(invoices.customerId, validatedCustomerId),
        with: {
          customer: true,
          sale: true,
          invoiceItems: {
            with: {
              product: true,
            },
          },
        },
        limit,
        offset,
        orderBy: [desc(invoices.issueDate)],
      });
      const typedResult = result as InvoiceWithDetails[];
      return { invoices: typedResult, total };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid customer ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to fetch customer invoices', error);
    }
  },

  // Generate next invoice number
  async generateInvoiceNumber(businessId: string, prefix: string = 'INV'): Promise<string> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);
      const currentYear = new Date().getFullYear();
      const yearPrefix = `${prefix}-${currentYear}`;

      // Get the latest invoice number for this year
      const [latestInvoice] = await db
        .select({ invoiceNumber: invoices.invoiceNumber })
        .from(invoices)
        .where(
          and(
            eq(invoices.businessId, validatedBusinessId),
            ilike(invoices.invoiceNumber, `${yearPrefix}%`)
          )
        )
        .orderBy(desc(invoices.invoiceNumber))
        .limit(1);

      let nextNumber = 1;
      if (latestInvoice) {
        const lastNumberPart = latestInvoice.invoiceNumber.split('-').pop();
        if (lastNumberPart && !isNaN(parseInt(lastNumberPart))) {
          nextNumber = parseInt(lastNumberPart) + 1;
        }
      }

      return `${yearPrefix}-${nextNumber.toString().padStart(4, '0')}`;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid business ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to generate invoice number', error);
    }
  },
};