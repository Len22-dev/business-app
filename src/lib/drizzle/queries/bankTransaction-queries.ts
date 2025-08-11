import { eq, and, desc, sql, ilike } from 'drizzle-orm';
import { db } from '../drizzle';
import { bankTransactions } from '../schema/banking-schema';
import type { BankTransaction, NewBankTransaction } from '../types';
import { z } from 'zod';
import { uuidSchema, paginationSchema } from '../../zod/businessSchema';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/zod/errorSchema';
import { createBankTransactionSchema, updateBankTransactionSchema } from '@/lib/zod/bankingSchema';

// Query parameter schema
const bankTransactionQuerySchema = z.object({
  businessId: uuidSchema,
  bankId: uuidSchema.optional(),
  search: z.string().optional(),
  sortBy: z.enum(['transactionDate', 'amount', 'created_at']).default('transactionDate'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  ...paginationSchema.shape,
});

type BankTransactionQueryParams = z.infer<typeof bankTransactionQuerySchema>;

export const bankTransactionQueries = {
  // Get bank transaction by ID
  async getById(transactionId: string): Promise<BankTransaction | null> {
    try {
      const validatedId = uuidSchema.parse(transactionId);
      const result = await db.query.bankTransactions.findFirst({
        where: eq(bankTransactions.id, validatedId),
      });
      return result as BankTransaction | null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to fetch bank transaction', error);
    }
  },

  // Get bank transactions with filtering and pagination
  async getMany(queryParams: unknown): Promise<{
    bankTransactions: BankTransaction[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      const { businessId, bankId, search, sortBy, sortOrder, limit, offset } = bankTransactionQuerySchema.parse(queryParams);
      const whereConditions = [eq(bankTransactions.businessId, businessId)];
      if (bankId) whereConditions.push(eq(bankTransactions.bankId, bankId));
      if (search) {
        whereConditions.push(ilike(bankTransactions.description, `%${search}%`));
      }
      // Get total count
      const [totalResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(bankTransactions)
        .where(and(...whereConditions));
      const total = Number(totalResult.count);
      const totalPages = Math.ceil(total / limit);
      const currentPage = Math.floor(offset / limit) + 1;
      // Order by
      const orderByClause = sortOrder === 'desc'
        ? desc(bankTransactions[sortBy])
        : bankTransactions[sortBy];
      // Get paginated results
      const results = await db.query.bankTransactions.findMany({
        where: and(...whereConditions),
        orderBy: orderByClause,
        limit,
        offset,
      });
      return {
        bankTransactions: results as BankTransaction[],
        total,
        totalPages,
        currentPage,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to fetch bank transactions', error);
    }
  },

  // Create bank transaction
  async create(transactionData: Record<string, unknown>): Promise<NewBankTransaction> {
    try {
      // Add zod validation here if you have a schema
      const validatedData = createBankTransactionSchema.parse(transactionData);
      const [transaction] = await db
        .insert(bankTransactions)
        .values({
          ...validatedData,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();
      return transaction;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to create bank transaction', error);
    }
  },

  // Update bank transaction
  async update(transactionId: string, transactionData: Record<string, unknown>): Promise<BankTransaction> {
    try {
      const validatedId = uuidSchema.parse(transactionId);
      // Add zod validation here if you have a schema
       const validatedData = updateBankTransactionSchema.parse(transactionData);
      const [transaction] = await db
        .update(bankTransactions)
        .set({
          ...validatedData,
          updated_at: new Date(),
        })
        .where(eq(bankTransactions.id, validatedId))
        .returning();
      if (!transaction) throw new NotFoundError('Bank transaction not found');
      return transaction;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to update bank transaction', error);
    }
  },

  // Soft delete bank transaction
  async delete(transactionId: string): Promise<BankTransaction> {
    try {
      const validatedId = uuidSchema.parse(transactionId);
      const [transaction] = await db
        .update(bankTransactions)
        .set({
          deleted_at: new Date(),
          updated_at: new Date(),
        })
        .where(eq(bankTransactions.id, validatedId))
        .returning();
      if (!transaction) throw new NotFoundError('Bank transaction not found');
      return transaction;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to delete bank transaction', error);
    }
  },
};

export { ValidationError, DatabaseError, NotFoundError };
export type { BankTransactionQueryParams };
