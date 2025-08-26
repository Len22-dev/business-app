import { eq, and, sql, desc, gte, lte, ilike } from 'drizzle-orm';
import { db } from '../drizzle';
import { payments } from '../schema';
import { invoices } from '../schema';
import type { Payment, Invoice, Customer, Vendor } from '../types';
import { z } from 'zod';
import { uuidSchema, paginationSchema } from '../../zod/businessSchema';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/zod/errorSchema';
import { createPaymentSchema, paymentSchema, updatePaymentSchema } from '@/lib/zod/paymentSchema';
import { PaymentMethod, PaymentStatus } from '@/lib/types';

// Payment schemas
// const createPaymentSchema = z.object({
//   businessId: uuidSchema,
//   invoiceId: uuidSchema.optional(),
//   customerId: uuidSchema.optional(),
//   vendorId: uuidSchema.optional(),
//   amount: z.number().positive(),
//   paymentDate: z.date().default(() => new Date()),
//   paymentMethod: z.string().max(50).optional(),
//   reference: z.string().max(100).optional(),
//   status: z.enum(['pending', 'completed', 'failed', 'refunded']).default('pending'),
//   notes: z.string().optional(),
// });

// const updatePaymentSchema = createPaymentSchema.partial();

type PaymentWithDetails = z.infer<typeof createPaymentSchema> & {
  invoice?: Invoice;
  customer?: Customer;
  vendor?: Vendor;
};

export type PaymentFilters = {
  search?: string;
  status?: string;
  paymentMethod?: string;
  customerId?: string;
  vendorId?: string;
  startDate?: string;
  endDate?: string;
};

export const paymentQueries = {
  // Get payment by ID
  async getById(paymentId: string): Promise<PaymentWithDetails | null> {
    try {
      const validatedId = uuidSchema.parse(paymentId);
      const newPayments = await db.query.payments.findFirst({
        where: eq(payments.id, validatedId),
      });
      return newPayments as PaymentWithDetails
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid payment ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to fetch payment', error);
    }
  },

  // Get payments by business ID
  async getByBusinessId(
    businessId: string,
    filters: PaymentFilters = {},
    paginationData: z.infer<typeof paginationSchema> = { page: 1, limit: 10, offset: 0 }
  ): Promise<{ payments: PaymentWithDetails[]; total: number }> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);
      const { page = 1, limit = 10 } = paginationSchema.parse(paginationData);
      const offset = (page - 1) * limit;

      const whereConditions = [eq(payments.businessId, validatedBusinessId)];

      if (filters.search) {
        const searchTerm = `%${filters.search}%`;
        whereConditions.push(ilike(payments.reference, searchTerm));
      }

      if (filters.status) {
        whereConditions.push(eq(payments.paymentStatus, filters.status as PaymentStatus));
      }

      if (filters.paymentMethod) {
        whereConditions.push(eq(payments.paymentMethod, filters.paymentMethod as PaymentMethod));
      }

      if (filters.customerId) {
        whereConditions.push(eq(payments.sourceId, filters.customerId));
      }

      if (filters.vendorId) {
        whereConditions.push(eq(payments.sourceId, filters.vendorId));
      }

      if (filters.startDate) {
        whereConditions.push(gte(payments.paymentDate, new Date(filters.startDate)));
      }

      if (filters.endDate) {
        whereConditions.push(lte(payments.paymentDate, new Date(filters.endDate)));
      }

      const whereClause = and(...whereConditions);

      // Get total count
      const totalResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(payments)
        .where(whereClause);

      const total = Number(totalResult[0]?.count || 0);

      // Get paginated results
      const result = await db.query.payments.findMany({
        where: whereClause,
        limit,
        offset,
        orderBy: [desc(payments.paymentDate)],
      });

      return { payments: result, total };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to fetch payments', error);
    }
  },

  // Create payment
  async create(paymentData: z.infer<typeof createPaymentSchema>) {
    try {
      const validatedData = createPaymentSchema.parse(paymentData);

      const [payment] = await db
        .insert(payments)
        .values({
          ...validatedData,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return payment;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to create payment', error);
    }
  },

  // Create payment and update invoice (transaction)
  async createForInvoice(
    paymentData: z.infer<typeof createPaymentSchema>,
    invoiceId: string
  ): Promise<{ payment: Payment; invoice: Invoice }> {
    try {
      const validatedData = createPaymentSchema.parse(paymentData);
      const validatedInvoiceId = uuidSchema.parse(invoiceId);

      return await db.transaction(async (tx) => {
        // Create payment
        const [payment] = await tx
          .insert(payments)
          .values({
            ...validatedData,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        // Update invoice paid amount
        const [invoice] = await tx
          .update(invoices)
          .set({
            paidAmount: sql`${invoices.paidAmount} + ${payment.amount}`,
            invoiceStatus: sql`CASE 
              WHEN ${invoices.paidAmount} + ${payment.amount} >= ${invoices.totalAmount} THEN 'paid'::invoice_status
              ELSE ${invoices.invoiceStatus}
            END`,
            updated_at: new Date(),
          })
          .where(eq(invoices.id, validatedInvoiceId))
          .returning();

        return { payment, invoice };
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to create payment for invoice', error);
    }
  },

  // Update payment
  async update(paymentId: string, updateData: z.infer<typeof updatePaymentSchema>): Promise<Payment> {
    try {
      const validatedId = uuidSchema.parse(paymentId);
      const validatedData = updatePaymentSchema.parse(updateData);

      const [payment] = await db
        .update(payments)
        .set({
          ...validatedData,
          updatedAt: new Date(),
        })
        .where(eq(payments.id, validatedId))
        .returning();

      if (!payment) throw new NotFoundError('Payment not found');
      return payment;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to update payment', error);
    }
  },

  // Mark payment as completed
  async markAsCompleted(paymentId: string): Promise<Payment> {
    try {
      const validatedId = uuidSchema.parse(paymentId);

      const [payment] = await db
        .update(payments)
        .set({
          paymentStatus: 'paid',
          updatedAt: new Date(),
        })
        .where(eq(payments.id, validatedId))
        .returning();

      if (!payment) throw new NotFoundError('Payment not found');
      return payment;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid payment ID: ${error.errors[0].message}`);
      }
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to mark payment as completed', error);
    }
  },

  // Mark payment as failed
  async markAsFailed(paymentId: string, reason?: string): Promise<Payment> {
    try {
      const validatedId = uuidSchema.parse(paymentId);

      const [payment] = await db
        .update(payments)
        .set({
          paymentStatus: 'failed',
          notes: reason,
          updatedAt: new Date(),
        })
        .where(eq(payments.id, validatedId))
        .returning();

      if (!payment) throw new NotFoundError('Payment not found');
      return payment;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid payment ID: ${error.errors[0].message}`);
      }
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to mark payment as failed', error);
    }
  },

  // Refund payment
  async refund(paymentId: string, refundAmount?: number, reason?: string): Promise<Payment> {
    try {
      const validatedId = uuidSchema.parse(paymentId);

      const existingPayment = await this.getById(validatedId);
      if (!existingPayment) {
        throw new NotFoundError('Payment not found');
      }

      if (existingPayment.paymentStatus !== 'paid') {
        throw new ValidationError('Only fully paid payments can be refunded');
      }

      const finalRefundAmount = refundAmount ?? existingPayment.amount;

      if (finalRefundAmount > existingPayment.amount) {
        throw new ValidationError('Refund amount cannot exceed payment amount');
      }

      return await db.transaction(async (tx) => {
        // Update payment status
        const [payment] = await tx
          .update(payments)
          .set({
            paymentStatus: 'refunded',
            notes: reason,
            updatedAt: new Date(),
          })
          .where(eq(payments.id, validatedId))
          .returning();

        // If payment was for an invoice, update invoice paid amount
        if (payment.sourceType === "sales") {
          await tx
            .update(invoices)
            .set({
              paidAmount: sql`${invoices.paidAmount} - ${finalRefundAmount}`,
              invoiceStatus: sql`CASE 
                WHEN ${invoices.paidAmount} - ${finalRefundAmount} < ${invoices.totalAmount} THEN 'sent'::invoice_status
                ELSE ${invoices.invoiceStatus}
              END`,
              updated_at: new Date(),
            })
            .where(eq(invoices.id, payment.sourceId));
        }

        return payment;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid payment ID: ${error.errors[0].message}`);
      }
      if (error instanceof ValidationError || error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to refund payment', error);
    }
  },

  // Get payments by invoice
  async getByInvoiceId(invoiceId: string): Promise<PaymentWithDetails[]> {
    try {
      const validatedInvoiceId = uuidSchema.parse(invoiceId);

      const paymentWithInvoice = await db.query.payments.findMany({
        where: eq(payments.sourceId, validatedInvoiceId),
        orderBy: [desc(payments.paymentDate)],
      });

      return paymentWithInvoice
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid invoice ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to fetch invoice payments', error);
    }
  },

  // Get payments by customer
  async getByCustomerId(
    customerId: string,
    paginationData: z.infer<typeof paginationSchema> = { page: 1, limit: 10, offset:0 }
  ): Promise<{ payments: PaymentWithDetails[]; total: number }> {
    try {
      const validatedCustomerId = uuidSchema.parse(customerId);
      const { page = 1, limit = 10 } = paginationSchema.parse(paginationData);
      const offset = (page - 1) * limit;

      // Get total count
      const totalResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(payments)
        .where(and(
          eq(payments.sourceId, validatedCustomerId),
          eq(payments.sourceType, 'sales')
        ));

      const total = Number(totalResult[0]?.count || 0);

      // Get paginated results
      const result = await db.query.payments.findMany({
        where: eq(payments.sourceId, validatedCustomerId),
        // with: {
          // invoice: true,
          // customer: true,
          // vendor: true,
        // },
        limit,
        offset,
        orderBy: [desc(payments.paymentDate)],
      });

      return { payments: result, total };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid customer ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to fetch customer payments', error);
    }
  },

  // Get payments summary
  async getPaymentsSummary(
    businessId: string,
    startDate?: string,
    endDate?: string
  ): Promise<{
    totalPayments: number;
    totalAmount: number;
    completedPayments: number;
    completedAmount: number;
    pendingPayments: number;
    pendingAmount: number;
    failedPayments: number;
    refundedPayments: number;
    refundedAmount: number;
    byPaymentMethod: Array<{
      method: string;
      count: number;
      amount: number;
    }>;
  }> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);
      const whereConditions = [eq(payments.businessId, validatedBusinessId)];

      if (startDate) {
        whereConditions.push(gte(payments.paymentDate, new Date(startDate)));
      }

      if (endDate) {
        whereConditions.push(lte(payments.paymentDate, new Date(endDate)));
      }

      // Get main summary
      const [summary] = await db
        .select({
          totalPayments: sql<number>`COUNT(*)`,
          totalAmount: sql<number>`COALESCE(SUM(${payments.amount}), 0)`,
          completedPayments: sql<number>`COUNT(CASE WHEN ${payments.paymentStatus} = 'completed' THEN 1 END)`,
          completedAmount: sql<number>`COALESCE(SUM(CASE WHEN ${payments.paymentStatus} = 'completed' THEN ${payments.amount} ELSE 0 END), 0)`,
          pendingPayments: sql<number>`COUNT(CASE WHEN ${payments.paymentStatus} = 'pending' THEN 1 END)`,
          pendingAmount: sql<number>`COALESCE(SUM(CASE WHEN ${payments.paymentStatus} = 'pending' THEN ${payments.amount} ELSE 0 END), 0)`,
          failedPayments: sql<number>`COUNT(CASE WHEN ${payments.paymentStatus} = 'failed' THEN 1 END)`,
          refundedPayments: sql<number>`COUNT(CASE WHEN ${payments.paymentStatus} = 'refunded' THEN 1 END)`,
          refundedAmount: sql<number>`COALESCE(SUM(CASE WHEN ${payments.paymentStatus} = 'refunded' THEN ${payments.amount} ELSE 0 END), 0)`,
        })
        .from(payments)
        .where(and(...whereConditions));

      // Get by payment method
      const byPaymentMethod = await db
        .select({
          method: sql<string>`COALESCE(${payments.paymentMethod}, 'Unknown')`,
          count: sql<number>`COUNT(*)`,
          amount: sql<number>`COALESCE(SUM(${payments.amount}), 0)`,
        })
        .from(payments)
        .where(and(...whereConditions))
        .groupBy(payments.paymentMethod)
        .orderBy(desc(sql`SUM(${payments.amount})`));

      return {
        totalPayments: Number(summary.totalPayments),
        totalAmount: Number(summary.totalAmount),
        completedPayments: Number(summary.completedPayments),
        completedAmount: Number(summary.completedAmount),
        pendingPayments: Number(summary.pendingPayments),
        pendingAmount: Number(summary.pendingAmount),
        failedPayments: Number(summary.failedPayments),
        refundedPayments: Number(summary.refundedPayments),
        refundedAmount: Number(summary.refundedAmount),
        byPaymentMethod: byPaymentMethod.map(item => ({
          method: item.method,
          count: Number(item.count),
          amount: Number(item.amount),
        })),
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid business ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to fetch payments summary', error);
    }
  },

  // Get recent payments
  async getRecent(businessId: string, limit: number = 10): Promise<z.infer<typeof paymentSchema>[]> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);

      const recentPayment = await db.query.payments.findMany({
        where: eq(payments.businessId, validatedBusinessId),
        // with: {
          // invoice: true,
          // customer: true,
          // vendor: true,
        // },
        limit,
        orderBy: [desc(payments.paymentDate)],
      });
      return recentPayment 
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid business ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to fetch recent payments', error);
    }
  },
};