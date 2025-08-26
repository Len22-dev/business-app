import { eq, and, sql, desc, gte, lte, ilike, } from 'drizzle-orm';
import { db } from '../drizzle';
import { sales, saleItems } from '../schema/sales-schema';
import {  products } from '../schema/products-schema';
import type { Sale, SaleItem, Customer, Product } from '../types';
import { z } from 'zod';
import { uuidSchema, paginationSchema } from '../../zod/businessSchema';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/zod/errorSchema';
import { SaleStatus } from '@/lib/types';
import { createSaleItemSchema, createSalesSchema, updateSalesSchema } from '@/lib/zod/salesSchema';
import { stockMovements, inventory  } from '../schema/inventory-schema';
import { ledgerEntries, journalEntries, transactions } from '../schema';

// Local sale item schema for createWithItems function
// const localCreateSaleItemSchema = z.object({
//   productId: uuidSchema,
//   quantity: z.number().int().positive(),
//   unitPrice: z.number().positive(),
//   totalPrice: z.number().positive(),
// });

type SaleWithDetails = Sale & {
  customer?: Customer;
  saleItems?: (SaleItem & {
    product?: Product;
  })[];
};

export type SaleFilters = {
  search?: string;
  status?: string;
  customerId?: string;
  startDate?: string;
  endDate?: string;
};

export const saleQueries = {
  // Get sale by ID
  async getById(saleId: string): Promise<SaleWithDetails | null> {
    try {
      const validatedId = uuidSchema.parse(saleId);
      const result = await db.query.sales.findFirst({
        where: eq(sales.id, validatedId),
        with: {
          customer: true,
          saleItems: {
            with: {
              product: true,
            },
          },
        },
      });
      return result as SaleWithDetails | null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid sale ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to fetch sale', error);
    }
  },

  // Get sales by business ID
  async getByBusinessId(
    businessId: string,
    filters: SaleFilters = {},
    paginationData: z.infer<typeof paginationSchema> = { page: 1, limit: 10, offset:0 }
  ): Promise<{ sales: SaleWithDetails[]; total: number }> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);
      const { page = 1, limit = 10 } = paginationSchema.parse(paginationData);
      const offset = (page - 1) * limit;

      const whereConditions = [eq(sales.businessId, validatedBusinessId)];

      if (filters.search) {
        const searchTerm = `%${filters.search}%`;
        whereConditions.push(ilike(sales.saleNumber, searchTerm));
      }

      if (filters.status) {
        whereConditions.push(eq(sales.salesStatus, filters.status as SaleStatus));
      }

      if (filters.customerId) {
        whereConditions.push(eq(sales.customerId, filters.customerId));
      }

      if (filters.startDate) {
        whereConditions.push(gte(sales.saleDate, new Date(filters.startDate)));
      }

      if (filters.endDate) {
        whereConditions.push(lte(sales.saleDate, new Date(filters.endDate)));
      }

      const whereClause = and(...whereConditions);

      // Get total count
      const totalResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(sales)
        .where(whereClause);

      const total = Number(totalResult[0]?.count || 0);

      // Get paginated results
      const result = await db.query.sales.findMany({
        where: whereClause,
        with: {
          customer: true,
          saleItems: {
            with: {
              product: true,
            },
          },
        },
        limit,
        offset,
        orderBy: [desc(sales.saleDate)],
      });
      const typedResult = result as SaleWithDetails[];
      return { sales: typedResult, total };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to fetch sales', error);
    }
  },

  // Create sale
  async create(saleData: z.infer<typeof createSalesSchema>): Promise<Sale> {
    try {
      const validatedData = createSalesSchema.parse(saleData);

      const [sale] = await db
        .insert(sales)
        .values(
          validatedData
        )
        .returning();

      return sale;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to create sale', error);
    }
  },

  // Create sale with items (transaction)
  async createWithItems(
    saleData: z.infer<typeof createSalesSchema>,
    items: z.infer<typeof createSaleItemSchema>[]
  ): Promise<SaleWithDetails> {
    try {
      const validatedSaleData = createSalesSchema.parse(saleData);
      const validatedItems = items.map(item => createSaleItemSchema.parse(item));
    //  const isCompleted = validatedSaleData.salesStatus === 'sold';

      return await db.transaction(async (tx) => {
        // Create sale
        const [sale] = await tx
          .insert(sales)
          .values({
            ...validatedSaleData,
            created_at: new Date(),
            updated_at: new Date(),
          })
          .returning();

        // Create sale items
        const saleItemsData = validatedItems.map(item => ({
          ...item,
          saleId: sale.id,
          createdAt: new Date(),
        }));
        await tx.insert(saleItems).values(saleItemsData).returning();

        // For each sale item, create stock movement and update inventory
        for (const item of validatedItems) {
          // Create stock movement (out)
          await tx.insert(stockMovements).values({
            productId: item.productId,
            locationId: validatedSaleData.locationId, // ensure locationId is in saleData
            movementType: 'out',
            status: validatedSaleData.salesStatus === 'paid' ? 'Confirmed' : 'Pending',
            confirmedQuantity: item.quantity,
            unitCost: item.unitPrice,
            totalCost: item.totalPrice,
            referenceId: sale.id,
            referenceType: 'sale',
            notes: 'Sale stock movement',
            createdAt: new Date(),
          });
          // Update inventory (decrement onHandQuantity)
          const inventoryRecord = await tx.query.inventory.findFirst({
            where: and(
              eq(inventory.productId, item.productId),
              eq(inventory.locationId, validatedSaleData.locationId ?? '')
            ),
          });
          if (inventoryRecord) {
            await tx.update(inventory)
              .set({
                onHandQuantity: (inventoryRecord?.onHandQuantity || 0) - item.quantity,
                updated_at: new Date(),
              })
              .where(eq(inventory.id, inventoryRecord.id));
          }
        }

        // If sale is completed, create transaction and ledger entries
        if (validatedSaleData.salesStatus === 'paid') {
          // Insert transaction record
          await tx.insert(transactions).values({
            businessId: sale.businessId,
            //item: `Sale #${sale.saleNumber}`,
            transactionType: 'sales',
            totalAmount: sale.totalAmount,
            categoryId: sale.id,
            approvedBy: sale.createdBy,
            createdBy: sale.createdBy,
            //description: 'Sale transaction',
            transactionDate: sale.saleDate,
            referenceId: sale.id,
            transactionStatus: 'completed',
            created_at: new Date(),
            updated_at: new Date(),
          });
          // Insert journal entry
          const [journalEntry] = await tx.insert(journalEntries).values({
            businessId: sale.businessId,
            date: sale.saleDate ?? new Date(),
            memo: `Sale #${sale.saleNumber}`,
            reference: sale.id,
            createdBy: sale.createdBy,
            created_at: new Date(),
            updated_at: new Date(),
          }).returning();
          // Insert ledger entries (double-entry)
          // Debit: Cash (1000) or Accounts Receivable (1100), Credit: Sales Revenue (4000)
          await tx.insert(ledgerEntries).values([
            {
              journalEntryId: journalEntry.id,
              accountId: sale.paidAmount && sale.paidAmount > 0 ? '1000' : '1100', // Cash or AR
              businessId: sale.businessId,
              debitAmount: sale.totalAmount,
              creditAmount: 0,
              description: 'Sale income',
              referenceType: 'sale',
              relatedCustomerId: sale.customerId,
              created_at: new Date(),
              updated_at: new Date(),
            },
            {
              journalEntryId: journalEntry.id,
              accountId: '4000', // Sales Revenue
              businessId: sale.businessId,
              debitAmount: 0,
              creditAmount: sale.totalAmount,
              description: 'Sales revenue',
              referenceType: 'sale',
              relatedCustomerId: sale.customerId,
              created_at: new Date(),
              updated_at: new Date(),
            },
            // COGS and Inventory (if tracking profit/loss)
            {
              journalEntryId: journalEntry.id,
              accountId: '5000', // Cost of Goods Sold
              businessId: sale.businessId,
              debitAmount: saleItemsData.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
              creditAmount: 0,
              description: 'COGS',
              referenceType: 'sale',
              relatedCustomerId: sale.customerId,
              created_at: new Date(),
              updated_at: new Date(),
            },
            {
              journalEntryId: journalEntry.id,
              accountId: '1200', // Inventory
              businessId: sale.businessId,
              debitAmount: 0,
              creditAmount: saleItemsData.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
              description: 'Inventory reduction',
              referenceType: 'sale',
              relatedCustomerId: sale.customerId,
              created_at: new Date(),
              updated_at: new Date(),
            },
          ]);
        }

        // Get complete sale with relations
        const completeSale = await tx.query.sales.findFirst({
          where: eq(sales.id, sale.id),
          with: {
            customer: true,
            saleItems: {
              with: {
                product: true,
              },
            },
          },
        });

        return completeSale as SaleWithDetails;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to create sale with items', error);
    }
  },

  // Update sale
  async update(saleId: string, updateData: z.infer<typeof updateSalesSchema>): Promise<Sale> {
    try {
      const validatedId = uuidSchema.parse(saleId);
      const validatedData = updateSalesSchema.parse(updateData);

      const [sale] = await db
        .update(sales)
        .set({
          ...validatedData,
          updated_at: new Date(),
        })
        .where(eq(sales.id, validatedId))
        .returning();

      if (!sale) throw new NotFoundError('Sale not found');
      return sale;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to update sale', error);
    }
  },

  // Cancel sale
  async cancel(saleId: string, reason?: string): Promise<Sale> {
    try {
      const validatedId = uuidSchema.parse(saleId);

      const [sale] = await db
        .update(sales)
        .set({
          salesStatus: 'cancelled',
          notes: reason,
          updated_at: new Date(),
        })
        .where(eq(sales.id, validatedId))
        .returning();

      if (!sale) throw new NotFoundError('Sale not found');
      return sale;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid sale ID: ${error.errors[0].message}`);
      }
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to cancel sale', error);
    }
  },

  // Get sales summary
  async getSalesSummary(
    businessId: string,
    startDate?: string,
    endDate?: string
  ): Promise<{
    totalSales: number;
    totalRevenue: number;
    averageOrderValue: number;
    completedSales: number;
    pendingSales: number;
    cancelledSales: number;
  }> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);
      const whereConditions = [eq(sales.businessId, validatedBusinessId)];

      if (startDate) {
        whereConditions.push(gte(sales.saleDate, new Date(startDate)));
      }

      if (endDate) {
        whereConditions.push(lte(sales.saleDate, new Date(endDate)));
      }

      const [summary] = await db
        .select({
          totalSales: sql<number>`COUNT(*)`,
          totalRevenue: sql<number>`COALESCE(SUM(${sales.totalAmount}), 0)`,
          averageOrderValue: sql<number>`COALESCE(AVG(${sales.totalAmount}), 0)`,
          completedSales: sql<number>`COUNT(CASE WHEN ${sales.salesStatus} = 'sold' THEN 1 END)`,
          pendingSales: sql<number>`COUNT(CASE WHEN ${sales.salesStatus} = 'pending' THEN 1 END)`,
          cancelledSales: sql<number>`COUNT(CASE WHEN ${sales.salesStatus} = 'cancelled' THEN 1 END)`,
        })
        .from(sales)
        .where(and(...whereConditions));

      return {
        totalSales: Number(summary.totalSales),
        totalRevenue: Number(summary.totalRevenue),
        averageOrderValue: Number(summary.averageOrderValue),
        completedSales: Number(summary.completedSales),
        pendingSales: Number(summary.pendingSales),
        cancelledSales: Number(summary.cancelledSales),
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid business ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to fetch sales summary', error);
    }
  },

  // Get top selling products
  async getTopSellingProducts(
    businessId: string,
    limit: number = 10,
    startDate?: string,
    endDate?: string
  ): Promise<Array<{
    product: Product;
    totalQuantity: number;
    totalRevenue: number;
  }>> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);
      const whereConditions = [eq(sales.businessId, validatedBusinessId)];

      if (startDate) {
        whereConditions.push(gte(sales.saleDate, new Date(startDate)));
      }

      if (endDate) {
        whereConditions.push(lte(sales.saleDate, new Date(endDate)));
      }

      const result = await db
        .select({
          product: products,
          totalQuantity: sql<number>`SUM(${saleItems.quantity})`,
          totalRevenue: sql<number>`SUM(${saleItems.totalPrice})`,
        })
        .from(saleItems)
        .innerJoin(sales, eq(saleItems.saleId, sales.id))
        .innerJoin(products, eq(saleItems.productId, products.id))
        .where(and(...whereConditions))
        .groupBy(products.id)
        .orderBy(desc(sql`SUM(${saleItems.quantity})`))
        .limit(limit);

      return result.map(item => ({
        product: item.product,
        totalQuantity: Number(item.totalQuantity),
        totalRevenue: Number(item.totalRevenue),
      }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid business ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to fetch top selling products', error);
    }
  },

  // Get sales by customer
  async getByCustomerId(
    customerId: string,
    paginationData: z.infer<typeof paginationSchema> = { page: 1, limit: 10, offset: 0 }
  ): Promise<{ sales: SaleWithDetails[]; total: number }> {
    try {
      const validatedCustomerId = uuidSchema.parse(customerId);
      const { page = 1, limit = 10 } = paginationSchema.parse(paginationData);
      const offset = (page - 1) * limit;

      // Get total count
      const totalResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(sales)
        .where(eq(sales.customerId, validatedCustomerId));

      const total = Number(totalResult[0]?.count || 0);

      // Get paginated results
      const result = await db.query.sales.findMany({
        where: eq(sales.customerId, validatedCustomerId),
        with: {
          customer: true,
          saleItems: {
            with: {
              product: true,
            },
          },
        },
        limit,
        offset,
        orderBy: [desc(sales.saleDate)],
      });
      const typedResult = result as SaleWithDetails[];
      return { sales: typedResult, total };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid customer ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to fetch customer sales', error);
    }
  },
};