import { eq, and, sql, desc, gte, lte, ilike } from 'drizzle-orm';
import { db } from '../drizzle';
import { purchases, purchaseItems } from '../schema/purchase-schema';
import {  products } from '../schema/products-schema';
import type { Purchase, PurchaseItem, Vendor, Product } from '../types';
import { z } from 'zod';
import { uuidSchema, paginationSchema } from '@/lib/zod/businessSchema';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/zod/errorSchema';
import { inventory, journalEntries, ledgerEntries, stockMovements, transactions } from '../schema';
import { createPurchaseItemSchema, createPurchaseSchema } from '@/lib/zod/purchaseSchema';


const updatePurchaseSchema = createPurchaseSchema.partial();


type PurchaseWithDetails = Purchase & {
  vendor?: Vendor;
  purchaseItems?: (PurchaseItem & {
    product?: Product;
  })[];
};

export type PurchaseFilters = {
  search?: string;
  status?: string;
  vendorId?: string;
  startDate?: string;
  endDate?: string;
};

export const purchaseQueries = {
  // Get purchase by ID
  async getById(purchaseId: string): Promise<PurchaseWithDetails | null> {
    try {
      const validatedId = uuidSchema.parse(purchaseId);
      const result = await db.query.purchases.findFirst({
        where: eq(purchases.id, validatedId),
        with: {
          vendor: true,
          purchaseItems: {
            with: {
              product: true,
            },
          },
        },
      });
      return result as PurchaseWithDetails | null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid purchase ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to fetch purchase', error);
    }
  },

  // Get purchases by business ID
  async getByBusinessId(
    businessId: string,
    filters: PurchaseFilters = {},
    paginationData: z.infer<typeof paginationSchema> = { page: 1, limit: 10, offset:0 }
  ): Promise<{ purchases: PurchaseWithDetails[]; total: number }> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);
      const { page = 1, limit = 10 } = paginationSchema.parse(paginationData);
      const offset = (page - 1) * limit;

      const whereConditions = [eq(purchases.businessId, validatedBusinessId)];

      if (filters.search) {
        const searchTerm = `%${filters.search}%`;
        whereConditions.push(ilike(purchases.purchaseNumber, searchTerm));
      }

      if (filters.status) {
        whereConditions.push(eq(purchases.purchaseStatus, filters.status as string ));
      }

      if (filters.vendorId) {
        whereConditions.push(eq(purchases.vendorId, filters.vendorId));
      }

      if (filters.startDate) {
        whereConditions.push(gte(purchases.purchaseDate, new Date(filters.startDate)));
      }

      if (filters.endDate) {
        whereConditions.push(lte(purchases.purchaseDate, new Date(filters.endDate)));
      }

      const whereClause = and(...whereConditions);

      // Get total count
      const totalResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(purchases)
        .where(whereClause);

      const total = Number(totalResult[0]?.count || 0);

      // Get paginated results
      const result = await db.query.purchases.findMany({
        where: whereClause,
        with: {
          vendor: true,
          purchaseItems: {
            with: {
              product: true,
            },
          },
        },
        limit,
        offset,
        orderBy: [desc(purchases.purchaseDate)],
      });
      const purchasesWithDetails = result as PurchaseWithDetails[];
      return { purchases: purchasesWithDetails, total };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to fetch purchases', error);
    }
  },

  // Create purchase
  async create(purchaseData: z.infer<typeof createPurchaseSchema>): Promise<Purchase> {
    try {
      const validatedData = createPurchaseSchema.parse(purchaseData);

      const [purchase] = await db
        .insert(purchases)
        .values({
          ...validatedData,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();

      return purchase;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to create purchase', error);
    }
  },

  // Create purchase with items (transaction)
  async createWithItems(
    purchaseData: z.infer<typeof createPurchaseSchema>,
    items: z.infer<typeof createPurchaseItemSchema>[]
  ): Promise<PurchaseWithDetails> {
    try {
      const validatedPurchaseData = createPurchaseSchema.parse(purchaseData);
      const validatedItems = items.map(item => createPurchaseItemSchema.parse(item));

      return await db.transaction(async (tx) => {
        // Create purchase
        const [purchase] = await tx
          .insert(purchases)
          .values({
            ...validatedPurchaseData,
            created_at: new Date(),
            updated_at: new Date(),
          })
          .returning();

        // Create purchase items
        const purchaseItemsData = validatedItems.map(item => ({
          ...item,
          purchaseId: purchase.id,
          createdAt: new Date(),
        }));
        await tx.insert(purchaseItems).values(purchaseItemsData).returning();

        // For each purchase item, create stock movement and update inventory
        for (const item of validatedItems) {
         
          // Update inventory (increment onHandQuantity)
          const inventoryRecord = await tx.query.inventory.findFirst({
            where: and(
              eq(inventory.productId, item.productId),
              eq(inventory.locationId, validatedPurchaseData.locationId ?? '')
            ),
          });
          if (inventoryRecord) {
            await tx.update(inventory)
              .set({
                onHandQuantity: (inventoryRecord?.onHandQuantity || 0) + item.quantity,
                updated_at: new Date(),
              })
              .where(eq(inventory.id, inventoryRecord.id));
          }
          // Create stock movement (in)
           await tx.insert(stockMovements).values({
             businessId: purchase.businessId ?? '',
             inventoryId: inventoryRecord?.id ?? '',
             productId: item.productId ?? '',
             locationId: validatedPurchaseData.locationId ?? '', // ensure locationId is in purchaseData
             movementType: 'in',
             status: purchase.purchaseStatus === 'completed' ? 'Confirmed' : 'Pending',
             confirmedQuantity: item.quantity,
             unitCost: item.unitCost,
             totalCost: item.totalCost,
             referenceId: purchase.id,
             referenceDocumentId: '',
             referenceType: 'purchase',
             notes: 'Purchase stock movement',
             createdAt: new Date(),
           });
        }


        // If purchase is completed, create transaction and ledger entries
        if (purchase.purchaseStatus === 'completed') {
          // Insert transaction record
          await tx.insert(transactions).values({
            businessId: purchase.businessId ?? '',
           // item: `Purchase #${purchase.purchaseNumber}`,
            transactionType: 'expense',
            totalAmount: purchase.totalAmount,
            //description: 'Purchase transaction',
            createdBy: purchase.createdBy ?? '',
            approvedBy: purchase.createdBy ?? '',
            transactionDate: purchase.purchaseDate,
            entityId: purchase.id,
            transactionStatus: 'completed',
            created_at: new Date(),
            updated_at: new Date(),
          });
          // Insert journal entry
          const [journalEntry] = await tx.insert(journalEntries).values({
            businessId: purchase.businessId,
            date: purchase.purchaseDate ?? new Date(),
            memo: `Purchase #${purchase.purchaseNumber}`,
            reference: purchase.id,
            createdBy: purchase.createdBy,
            created_at: new Date(),
            updated_at: new Date(),
          }).returning();


          // Insert ledger entries (double-entry)
          // Debit: Inventory (1200) or Expense (6000), Credit: Cash (1000) or Accounts Payable (2000)
          await tx.insert(ledgerEntries).values([
            {
              journalEntryId: journalEntry.id,
              accountId: '1200', // Inventory
              businessId: purchase.businessId,
              debitAmount: purchase.totalAmount,
              creditAmount: 0,
              description: 'Inventory purchase',
              referenceType: 'purchase',
              relatedVendorId: purchase.vendorId,
              created_at: new Date(),
              updated_at: new Date(),
            },
            {
              journalEntryId: journalEntry.id,
              accountId: purchase.paidAmount > 0 ? '1000' : '2000', // Cash or AP
              businessId: purchase.businessId,
              debitAmount: 0,
              creditAmount: purchase.totalAmount,
              description: 'Cash/AP for purchase',
              referenceType: 'purchase',
              relatedVendorId: purchase.vendorId,
              created_at: new Date(),
              updated_at: new Date(),
            },
          ]);
        }

        // Get complete purchase with relations
        const completePurchase = await tx.query.purchases.findFirst({
          where: eq(purchases.id, purchase.id),
          with: {
            vendor: true,
            purchaseItems: {
              with: {
                product: true,
              },
            },
          },
        });

        return completePurchase as PurchaseWithDetails;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to create purchase with items', error);
    }
  },

  // Update purchase
  async update(purchaseId: string, updateData: z.infer<typeof updatePurchaseSchema>): Promise<Purchase> {
    try {
      const validatedId = uuidSchema.parse(purchaseId);
      const validatedData = updatePurchaseSchema.parse(updateData);

      const [purchase] = await db
        .update(purchases)
        .set({
          ...validatedData,
          updated_at: new Date(),
        })
        .where(eq(purchases.id, validatedId))
        .returning();

      if (!purchase) throw new NotFoundError('Purchase not found');
      return purchase;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to update purchase', error);
    }
  },

  // Cancel purchase
  async cancel(purchaseId: string, reason?: string): Promise<Purchase> {
    try {
      const validatedId = uuidSchema.parse(purchaseId);

      const [purchase] = await db
        .update(purchases)
        .set({
          purchaseStatus: 'cancelled',
          notes: reason,
          updated_at: new Date(),
        })
        .where(eq(purchases.id, validatedId))
        .returning();

      if (!purchase) throw new NotFoundError('Purchase not found');
      return purchase;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid purchase ID: ${error.errors[0].message}`);
      }
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to cancel purchase', error);
    }
  },

  // Soft delete purchase
  async delete(purchaseId: string): Promise<Purchase> {
    try {
      const validatedId = uuidSchema.parse(purchaseId);
      const [purchase] = await db
        .update(purchases)
        .set({
          updated_at: new Date(),
          deleted_at: new Date(),
        })
        .where(eq(purchases.id, validatedId))
        .returning();
      if (!purchase) throw new NotFoundError('Purchase not found');
      return purchase;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to delete purchase', error);
    }
  },

  // Get purchases summary
  async getPurchasesSummary(
    businessId: string,
    startDate?: string,
    endDate?: string
  ): Promise<{
    totalPurchases: number;
    totalAmount: number;
    averageOrderValue: number;
    completedPurchases: number;
    pendingPurchases: number;
    cancelledPurchases: number;
  }> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);
      const whereConditions = [eq(purchases.businessId, validatedBusinessId)];

      if (startDate) {
        whereConditions.push(gte(purchases.purchaseDate, new Date(startDate)));
      }

      if (endDate) {
        whereConditions.push(lte(purchases.purchaseDate, new Date(endDate)));
      }

      const [summary] = await db
        .select({
          totalPurchases: sql<number>`COUNT(*)`,
          totalAmount: sql<number>`COALESCE(SUM(${purchases.totalAmount}), 0)`,
          averageOrderValue: sql<number>`COALESCE(AVG(${purchases.totalAmount}), 0)`,
          completedPurchases: sql<number>`COUNT(CASE WHEN ${purchases.purchaseStatus} = 'completed' THEN 1 END)`,
          pendingPurchases: sql<number>`COUNT(CASE WHEN ${purchases.purchaseStatus} = 'pending' THEN 1 END)`,
          cancelledPurchases: sql<number>`COUNT(CASE WHEN ${purchases.purchaseStatus} = 'cancelled' THEN 1 END)`,
        })
        .from(purchases)
        .where(and(...whereConditions));

      return {
        totalPurchases: Number(summary.totalPurchases),
        totalAmount: Number(summary.totalAmount),
        averageOrderValue: Number(summary.averageOrderValue),
        completedPurchases: Number(summary.completedPurchases),
        pendingPurchases: Number(summary.pendingPurchases),
        cancelledPurchases: Number(summary.cancelledPurchases),
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid business ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to fetch purchases summary', error);
    }
  },

  // Get purchases by vendor
  async getByVendorId(
    vendorId: string,
    paginationData: z.infer<typeof paginationSchema> = { page: 1, limit: 10, offset:0}
  ): Promise<{ purchases: PurchaseWithDetails[]; total: number }> {
    try {
      const validatedVendorId = uuidSchema.parse(vendorId);
      const { page = 1, limit = 10 } = paginationSchema.parse(paginationData);
      const offset = (page - 1) * limit;

      // Get total count
      const totalResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(purchases)
        .where(eq(purchases.vendorId, validatedVendorId));

      const total = Number(totalResult[0]?.count || 0);

      // Get paginated results
      const result = await db.query.purchases.findMany({
        where: eq(purchases.vendorId, validatedVendorId),
        with: {
          vendor: true,
          purchaseItems: {
            with: {
              product: true,
            },
          },
        },
        limit,
        offset,
        orderBy: [desc(purchases.purchaseDate)],
      });
      const purchasesWithDetails = result as PurchaseWithDetails[];
      return { purchases: purchasesWithDetails, total };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid vendor ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to fetch vendor purchases', error);
    }
  },

  // Get most purchased products
  async getMostPurchasedProducts(
    businessId: string,
    limit: number = 10,
    startDate?: string,
    endDate?: string
  ): Promise<Array<{
    product: Product;
    totalQuantity: number;
    totalAmount: number;
  }>> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);
      const whereConditions = [eq(purchases.businessId, validatedBusinessId)];

      if (startDate) {
        whereConditions.push(gte(purchases.purchaseDate, new Date(startDate)));
      }

      if (endDate) {
        whereConditions.push(lte(purchases.purchaseDate, new Date(endDate)));
      }

      const result = await db
        .select({
          product: products,
          totalQuantity: sql<number>`SUM(${purchaseItems.quantity})`,
          totalAmount: sql<number>`SUM(${purchaseItems.totalCost})`
        })
        .from(purchaseItems)
        .innerJoin(purchases, eq(purchaseItems.purchaseId, purchases.id))
        .innerJoin(products, eq(purchaseItems.productId, products.id))
        .where(and(...whereConditions))
        .groupBy(products.id)
        .orderBy(desc(sql`SUM(${purchaseItems.quantity})`))
        .limit(limit);

      return result.map(item => ({
        product: item.product,
        totalQuantity: Number(item.totalQuantity),
        totalAmount: Number(item.totalAmount),
      }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid business ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to fetch most purchased products', error);
    }
  },
};