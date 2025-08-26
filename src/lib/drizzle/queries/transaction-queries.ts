import { eq, and, desc, asc, sql, gte, lte, ilike, inArray, isNull, or, SQL } from 'drizzle-orm';
import { db } from '../drizzle';

import type {
  Transaction,
  Category,
} from '../types';
import {
  createTransactionSchema,
  TransactionFormData,
  transactionFormSchemas,
  updateTransactionSchema,
} from '../../zod/transactionSchema';
import { z } from 'zod';
import { paginationSchema, uuidSchema } from '../../zod/businessSchema';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/zod/errorSchema';
import { businesses, categories, transactionLineItems, transactions } from '../schema';

// Extended types for queries with relations
type TransactionWithCategory = Transaction & {
  category?: Category;
};

// Query parameter schemas
const transactionQuerySchema = z.object({
  businessId: uuidSchema,
  type: z.enum(['sales', 'expense', 'transfer', 'payment', 'payroll', 'purchase', 'journal']).optional(),
  status: z.enum(['pending', 'completed', 'cancelled', 'failed']).optional(),
  categoryId: uuidSchema.optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  minAmount: z.number().min(0).optional(),
  maxAmount: z.number().min(0).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['transactionDate', 'totalAmount', 'createdBy', 'created_at']).default('transactionDate'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  ...paginationSchema.shape,
});

const bulkUpdateSchema = z.object({
  transactionIds: z.array(uuidSchema).min(1, 'At least one transaction ID is required'),
  updates: z.object({
    transactionType: z.enum(['sales', "expense" , "transfer" , "sales" , "payment" , "payroll" , "purchase" , "journal" ]).optional(),
    status: z.enum(['pending', 'completed', 'cancelled', 'failed']).optional(),
    categoryId: uuidSchema.optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  }),
});

const transactionStatsSchema = z.object({
  businessId: uuidSchema,
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  groupBy: z.enum(['day', 'week', 'month', 'year']).default('month'),
});

type TransactionQueryParams = z.infer<typeof transactionQuerySchema>;
type BulkUpdateParams = z.infer<typeof bulkUpdateSchema>;
type TransactionStatsParams = z.infer<typeof transactionStatsSchema>;

// Helper to format transaction number
function formatTransactionNumber(num: number): string {
  return `TXN${num.toString().padStart(5, '0')}`;
}

export const transactionQueries = {
  async createTransactionWithTransactionItem(data: TransactionFormData) {
    const validatedData = transactionFormSchemas.parse(data);

    return await db.transaction(async (tx) => {
      // create 
      
      const transactionData = {
        businessesId: validatedData.businessId,
        categoryId: validatedData.categoryId,
        transactionNumber: Date.now(),
        transactionType: validatedData.transactionType,
        transactionStatus: validatedData.transactionStatus,
        totalAmount: validatedData.totalAmount,
        entityId: validatedData.entityId,
        entityType: validatedData.entityType,
        referenceNumber: validatedData.referenceNumber,
        transactionDate: validatedData.transactionDate || new Date(),
        createdBy: validatedData.createdBy,
        attachments: validatedData.receiptUrl ? [validatedData.receiptUrl] : [],
        metadata: validatedData.metadata || {},
        approvedBy: validatedData.approvedBy,
      };

      const [transaction] = await tx.insert(transactions).values(transactionData).returning();
      
      const transactionItemsData = {
        transactionId: transaction.id,
        productId: '',
        item: validatedData.item,
        description: validatedData.description,
        subtotalAmount: validatedData.subtotalAmount,
        quantity: validatedData.quantity,
        unitAmount: validatedData.unitAmount,
        taxAmount: validatedData.taxAmount,
        discountAmount: validatedData.discountAmount,
        metadata: validatedData.metadata || {}, // Assuming metadata is optional and can be null
      };

   const [transactionItems] = await tx.insert(transactionLineItems).values({
                ...transactionItemsData,
              }).returning();
            
      return {
        transaction,
        transactionItems,
      };
  });
},




  // Get transaction by ID with category
  async getById(transactionId: string, businessId: string): Promise<TransactionWithCategory | null> {
    try {
      const validatedTransactionId = uuidSchema.parse(transactionId);
      const validatedBusinessId = uuidSchema.parse(businessId);

      const result = await db.query.transactions.findFirst({
        where: and(
          eq(transactions.id, validatedTransactionId),
          eq(transactions.businessId, validatedBusinessId)
        ),
        with: {
          category: true,
          transactionLineItems: true,
        },
      });

      return result as TransactionWithCategory | null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      console.error('Error fetching transaction by ID:', error);
      throw new DatabaseError('Failed to fetch transaction', error);
    }
  },

  // Get transactions with advanced filtering and pagination
  async getMany(queryParams: unknown): Promise<{
    transactions: (TransactionWithCategory & { formattedTransactionNumber: string })[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      const {
        businessId,
        type,
        status,
        categoryId,
        startDate,
        endDate,
        minAmount,
        maxAmount,
        search,
        sortBy,
        sortOrder,
        limit,
        offset,
      } = transactionQuerySchema.parse(queryParams);

      // Build where conditions
      const whereConditions = [eq(transactions.businessId, businessId)];

      if (type) {
        whereConditions.push(eq(transactions.transactionType, type));
      }

      if (status) {
        whereConditions.push(eq(transactions.transactionStatus, status));
      }

      if (categoryId) {
        whereConditions.push(eq(transactions.categoryId, categoryId));
      }

      if (startDate) {
        whereConditions.push(gte(transactions.transactionDate, new Date(startDate)));
      }

      if (endDate) {
        whereConditions.push(lte(transactions.transactionDate, new Date(endDate)));
      }

      if (minAmount !== undefined) {
        whereConditions.push(gte(transactions.totalAmount, minAmount));
      }

      if (maxAmount !== undefined) {
        whereConditions.push(lte(transactions.totalAmount, maxAmount));
      }

      if (search) {
        const searchConditions: SQL<unknown>[] = [];
        if (transactions.approvedBy) {
          searchConditions.push(ilike(transactions.approvedBy, `%${search}%`));
        }
        
        if (transactions.entityId) {
          searchConditions.push(ilike(transactions.entityId, `%${search}%`));
        } 

        if (searchConditions.length === 1) {
          whereConditions.push(searchConditions[0]);
        } else if (searchConditions.length > 1) {
          whereConditions.push(or(...searchConditions));
        }
      }
      // Get total count for pagination
      const [totalResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(transactions)
        .where(and(...whereConditions.filter(Boolean)));

      const total = Number(totalResult.count);
      const totalPages = Math.ceil(total / limit);
      const currentPage = Math.floor(offset / limit) + 1;

      // Build order by clause
      const validSortColumns = ['transactionDate', 'totalAmount', 'createdBy', 'created_at'];
      const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'transactionDate';
      const orderByClause = sortOrder === 'desc' 
        ? desc(transactions[sortColumn]) 
        : asc(transactions[sortColumn]);

      // Get paginated results with relations
      const results = await db.query.transactions.findMany({
        where: and(...whereConditions.filter(Boolean)),
        with: {
          category: true,
          transactionLineItems: true,
        },
        orderBy: orderByClause,
        limit,
        offset,
      });
      // Add formattedTransactionNumber to each transaction
      const transactionsWithFormattedNumber = results.map(txn => ({
        ...txn,
        formattedTransactionNumber: formatTransactionNumber(txn.transactionNumber),
      }));
      return {
        transactions: transactionsWithFormattedNumber as (TransactionWithCategory & { formattedTransactionNumber: string })[],
        total,
        totalPages,
        currentPage,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      console.error('Error fetching transactions:', error);
      throw new DatabaseError('Failed to fetch transactions', error);
    }
  },

  // Create new transaction
  async create(transactionData: TransactionFormData) {
    console.log('Received transactionData:', JSON.stringify(transactionData, null, 2));

    try {
      const validatedData = createTransactionSchema.parse(transactionData);
      console.log('Validation passed, validatedData:', JSON.stringify(validatedData, null, 2));

      // Verify business exists and user has access
      await this.verifyBusinessAccess(validatedData.businessId);

      // Verify category exists if provided
      if (validatedData.categoryId) {
        await this.verifyCategoryAccess(validatedData.categoryId, validatedData.businessId);
      }

      const [transaction] = await db
        .insert(transactions)
        .values({
          ...validatedData,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();

      return {
        ...transaction,
        formattedTransactionNumber: formatTransactionNumber(transaction.transactionNumber),
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log('Zod validation errors:', error.errors);
        throw new ValidationError(`Validation failed: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
      }
      if (error instanceof NotFoundError) {
        throw error;
      }
      console.error('Error creating transaction:', error);
      throw new DatabaseError('Failed to create transaction', error);
    }
  },

  // Create multiple transactions in a single transaction
  async createMany(transactionsData: unknown[]): Promise<(Transaction & { formattedTransactionNumber: string })[]> {
    try {
      const validatedTransactions = transactionsData.map(data => 
        createTransactionSchema.parse(data)
      );

      // Verify all transactions belong to the same business
      const businessIds = [...new Set(validatedTransactions.map(t => t.businessId))];
      if (businessIds.length > 1) {
        throw new ValidationError('All transactions must belong to the same business');
      }

      const businessId = businessIds[0];
      await this.verifyBusinessAccess(businessId);

      // Verify all categories exist if provided
      const categoryIds = validatedTransactions
        .map(t => t.categoryId)
        .filter(Boolean) as string[];
      
      if (categoryIds.length > 0) {
        await this.verifyCategoriesExist(categoryIds, businessId);
      }

      return await db.transaction(async (tx) => {
        const results: (Transaction & { formattedTransactionNumber: string })[] = [];
        
        for (const transactionData of validatedTransactions) {
          const [transaction] = await tx
            .insert(transactions)
            .values({
              ...transactionData,
              created_at: new Date(),
              updated_at: new Date(),
            })
            .returning();
          
          results.push({
            ...transaction,
            formattedTransactionNumber: formatTransactionNumber(transaction.transactionNumber),
          });
        }
        
        return results;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      console.error('Error creating multiple transactions:', error);
      throw new DatabaseError('Failed to create transactions', error);
    }
  },

  // Update transaction
  async update(transactionId: string, transactionData: unknown, businessId: string): Promise<Transaction> {
    try {
      const validatedTransactionId = uuidSchema.parse(transactionId);
      const validatedBusinessId = uuidSchema.parse(businessId);
      const validatedData = updateTransactionSchema.parse(transactionData);

      // Verify transaction exists and belongs to business
      const existingTransaction = await this.getById(validatedTransactionId, validatedBusinessId);
      if (!existingTransaction) {
        throw new NotFoundError('Transaction not found');
      }

      // Verify category exists if being updated
      if (validatedData.categoryId) {
        await this.verifyCategoryAccess(validatedData.categoryId, validatedBusinessId);
      }

      const [transaction] = await db
        .update(transactions)
        .set({
          ...validatedData,
          updated_at: new Date(),
        })
        .where(
          and(
            eq(transactions.id, validatedTransactionId),
            eq(transactions.businessId, validatedBusinessId)
          )
        )
        .returning();

      return transaction;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof NotFoundError) {
        throw error;
      }
      console.error('Error updating transaction:', error);
      throw new DatabaseError('Failed to update transaction', error);
    }
  },

  // Bulk update transactions
  async bulkUpdate(updateData: unknown, businessId: string): Promise<Transaction[]> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);
      const { transactionIds, updates } = bulkUpdateSchema.parse(updateData);

      // Verify all transactions exist and belong to business
      const existingTransactions = await db
        .select()
        .from(transactions)
        .where(
          and(
            inArray(transactions.id, transactionIds),
            eq(transactions.businessId, validatedBusinessId)
          )
        );

      if (existingTransactions.length !== transactionIds.length) {
        throw new NotFoundError('One or more transactions not found');
      }

      // Verify category exists if being updated
      if (updates.categoryId) {
        await this.verifyCategoryAccess(updates.categoryId, validatedBusinessId);
      }

      const updatedTransactions = await db
        .update(transactions)
        .set({
          ...updates,
          updated_at: new Date(),
        })
        .where(
          and(
            inArray(transactions.id, transactionIds),
            eq(transactions.businessId, validatedBusinessId)
          )
        )
        .returning();

      return updatedTransactions;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof NotFoundError) {
        throw error;
      }
      console.error('Error bulk updating transactions:', error);
      throw new DatabaseError('Failed to bulk update transactions', error);
    }
  },

  // Soft delete transaction
  async delete(transactionId: string, businessId: string): Promise<Transaction> {
    try {
      const validatedTransactionId = uuidSchema.parse(transactionId);
      const validatedBusinessId = uuidSchema.parse(businessId);

      // Verify transaction exists and belongs to business
      const existingTransaction = await this.getById(validatedTransactionId, validatedBusinessId);
      if (!existingTransaction) {
        throw new NotFoundError('Transaction not found');
      }

      const [transaction] = await db
        .update(transactions)
        .set({
          deleted_at: new Date(),
          updated_at: new Date(),
        })
        .where(
          and(
            eq(transactions.id, validatedTransactionId),
            eq(transactions.businessId, validatedBusinessId)
          )
        )
        .returning();

      return transaction;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof NotFoundError) {
        throw error;
      }
      console.error('Error deleting transaction:', error);
      throw new DatabaseError('Failed to delete transaction', error);
    }
  },

  // Get transaction statistics
  async getStats(statsParams: unknown): Promise<{
    totalIncome: number;
    totalExpenses: number;
    netAmount: number;
    transactionCount: number;
    averageTransaction: number;
    periodData: Array<{
      period: string;
      income: number;
      expenses: number;
      net: number;
      count: number;
    }>;
  }> {
    try {
      const { businessId, startDate, endDate, groupBy } = transactionStatsSchema.parse(statsParams);

      const whereConditions = [
        eq(transactions.businessId, businessId),
        isNull(transactions.deleted_at),
      ];

      if (startDate) {
        whereConditions.push(gte(transactions.transactionDate, new Date(startDate)));
      }

      if (endDate) {
        whereConditions.push(lte(transactions.transactionDate, new Date(endDate)));
      }

      // Get overall statistics
      const [overallStats] = await db
        .select({
          totalIncome: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.transactionType} = 'income' THEN ${transactions.totalAmount} ELSE 0 END), 0)`,
          totalExpenses: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.transactionType} = 'expense' THEN ${transactions.totalAmount} ELSE 0 END), 0)`,
          transactionCount: sql<number>`COUNT(*)`,
          averageTransaction: sql<number>`COALESCE(AVG(${transactions.totalAmount}), 0)`,
        })
        .from(transactions)
        .where(and(...whereConditions));

      const totalIncome = Number(overallStats.totalIncome);
      const totalExpenses = Number(overallStats.totalExpenses);
      const netAmount = totalIncome - totalExpenses;
      const transactionCount = Number(overallStats.transactionCount);
      const averageTransaction = Number(overallStats.averageTransaction);

      // Get period-based data
      const dateFormat = this.getDateFormat(groupBy);
      const periodData = await db
        .select({
          period: sql<string>`TO_CHAR(${transactions.transactionDate}, ${dateFormat})`,
          income: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.transactionType} = 'income' THEN ${transactions.totalAmount} ELSE 0 END), 0)`,
          expenses: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.transactionType} = 'expense' THEN ${transactions.totalAmount} ELSE 0 END), 0)`,
          count: sql<number>`COUNT(*)`,
        })
        .from(transactions)
        .where(and(...whereConditions))
        .groupBy(sql`TO_CHAR(${transactions.transactionDate}, ${dateFormat})`)
        .orderBy(sql`TO_CHAR(${transactions.transactionDate}, ${dateFormat})`);

      const formattedPeriodData = periodData.map(item => ({
        period: item.period,
        income: Number(item.income),
        expenses: Number(item.expenses),
        net: Number(item.income) - Number(item.expenses),
        count: Number(item.count),
      }));

      return {
        totalIncome,
        totalExpenses,
        netAmount,
        transactionCount,
        averageTransaction,
        periodData: formattedPeriodData,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      console.error('Error fetching transaction statistics:', error);
      throw new DatabaseError('Failed to fetch transaction statistics', error);
    }
  },

  // Get transactions by category
  async getByCategory(businessId: string, categoryId: string, queryParams: unknown = {}): Promise<{
    transactions: (TransactionWithCategory & { formattedTransactionNumber: string })[];
    total: number;
  }> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);
      const validatedCategoryId = uuidSchema.parse(categoryId);
      const { limit, offset } = paginationSchema.parse(queryParams);

      // Verify category belongs to business
      await this.verifyCategoryAccess(validatedCategoryId, validatedBusinessId);

      const whereConditions = [
        eq(transactions.businessId, validatedBusinessId),
        eq(transactions.categoryId, validatedCategoryId),
        isNull(transactions.deleted_at),
      ];

      // Get total count
      const [totalResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(transactions)
        .where(and(...whereConditions));

      const total = Number(totalResult.count);

      // Get transactions
      const results = await db.query.transactions.findMany({
        where: and(...whereConditions),
        with: {
          category: true,
        },
        orderBy: desc(transactions.transactionDate),
        limit,
        offset,
      });
      // Add formattedTransactionNumber to each transaction
      const transactionsWithFormattedNumber = results.map(txn => ({
        ...txn,
        formattedTransactionNumber: formatTransactionNumber(txn.transactionNumber),
      }));
      return {
        transactions: transactionsWithFormattedNumber as (TransactionWithCategory & { formattedTransactionNumber: string })[],
        total,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof NotFoundError) {
        throw error;
      }
      console.error('Error fetching transactions by category:', error);
      throw new DatabaseError('Failed to fetch transactions by category', error);
    }
  },

  // Helper methods for validation
  async verifyBusinessAccess(businessId: string): Promise<void> {
    const business = await db.query.businesses.findFirst({
      where: and(
        eq(businesses.id, businessId),
        eq(businesses.isActive, true)
      ),
    });

    if (!business) {
      throw new NotFoundError('Business not found or inactive');
    }
  },

  async verifyCategoryAccess(categoryId: string, businessId: string): Promise<void> {
    const category = await db.query.categories.findFirst({
      where: and(
        eq(categories.id, categoryId),
        eq(categories.businessId, businessId),
        eq(categories.isActive, true)
      ),
    });

    if (!category) {
      throw new NotFoundError('Category not found or does not belong to business');
    }
  },

  async verifyCategoriesExist(categoryIds: string[], businessId: string): Promise<void> {
    const existingCategories = await db
      .select({ id: categories.id })
      .from(categories)
      .where(
        and(
          inArray(categories.id, categoryIds),
          eq(categories.businessId, businessId),
          eq(categories.isActive, true)
        )
      );

    if (existingCategories.length !== categoryIds.length) {
      throw new NotFoundError('One or more categories not found or do not belong to business');
    }
  },

  // Helper method for date formatting
  getDateFormat(groupBy: 'day' | 'week' | 'month' | 'year'): string {
    switch (groupBy) {
      case 'day':
        return "'YYYY-MM-DD'";
      case 'week':
        return "'YYYY-\"W\"WW'";
      case 'month':
        return "'YYYY-MM'";
      case 'year':
        return "'YYYY'";
      default:
        return "'YYYY-MM'";
    }
  },
};

// Export error classes and types for use in other modules
export { ValidationError, DatabaseError, NotFoundError };
export type { 
  TransactionWithCategory, 
  TransactionQueryParams, 
  BulkUpdateParams, 
  TransactionStatsParams 
};