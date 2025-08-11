import { eq, and, desc, sql, ilike } from 'drizzle-orm';
import { db } from '../drizzle';
import { banks } from '../schema/banking-schema';
import type { Bank } from '../types';
import { z } from 'zod';
import { uuidSchema, paginationSchema } from '../../zod/businessSchema';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/zod/errorSchema';
import { createBankSchema } from '@/lib/zod/bankingSchema';

// Query parameter schema
const bankQuerySchema = z.object({
  businessId: uuidSchema,
  search: z.string().optional(),
  sortBy: z.enum(['created_at', 'bankName']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  ...paginationSchema.shape,
});

type BankQueryParams = z.infer<typeof bankQuerySchema>;

export const bankQueries = {
  // Get bank by ID
  async getById(bankId: string): Promise<Bank | null> {
    try {
      const validatedId = uuidSchema.parse(bankId);
      const result = await db.query.banks.findFirst({
        where: eq(banks.id, validatedId),
      });
      return result as Bank | null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to fetch bank', error);
    }
  },

  // Get banks with filtering and pagination
  async getMany(queryParams: unknown): Promise<{
    banks: Bank[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      const { businessId, search, sortBy, sortOrder, limit, offset } = bankQuerySchema.parse(queryParams);
      const whereConditions = [eq(banks.businessId, businessId)];
      if (search) {
        whereConditions.push(ilike(banks.bankName, `%${search}%`));
      }
      // Get total count
      const [totalResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(banks)
        .where(and(...whereConditions));
      const total = Number(totalResult.count);
      const totalPages = Math.ceil(total / limit);
      const currentPage = Math.floor(offset / limit) + 1;
      // Order by
      const orderByClause = sortOrder === 'desc'
        ? desc(banks[sortBy])
        : banks[sortBy];
      // Get paginated results
      const results = await db.query.banks.findMany({
        where: and(...whereConditions),
        orderBy: orderByClause,
        limit,
        offset,
      });
      return {
        banks: results as Bank[],
        total,
        totalPages,
        currentPage,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to fetch banks', error);
    }
  },

  // Create bank
  async create(bankData: Record<string, unknown>): Promise<z.infer <typeof createBankSchema>> {
    try {
      // Add zod validation here if you have a schema
      const validatedData = createBankSchema.parse(bankData);
      const [bank] = await db
        .insert(banks)
        .values({
          ...validatedData,
          created_at: new Date(),
          updated_at: new Date(),
          businessId: bankData.businessId as string,
          bankName: bankData.bankName as string,
          accountName: bankData.accountName as string,
          accountNumber: bankData.accountNumber as string,
        })
        .returning();
      return bank as z.infer<typeof createBankSchema>;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to create bank', error);
    }
  },

  // Update bank
  async update(bankId: string, bankData: Record<string, unknown>): Promise<Bank> {
    try {
      const validatedId = uuidSchema.parse(bankId);
      // Add zod validation here if you have a schema
      // const validatedData = updateBankSchema.parse(bankData);
      const [bank] = await db
        .update(banks)
        .set({
          ...bankData,
          updated_at: new Date(),
        })
        .where(eq(banks.id, validatedId))
        .returning();
      if (!bank) throw new NotFoundError('Bank not found');
      return bank;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to update bank', error);
    }
  },

  // Soft delete bank
  async delete(bankId: string): Promise<Bank> {
    try {
      const validatedId = uuidSchema.parse(bankId);
      const [bank] = await db
        .update(banks)
        .set({
          deleted_at: new Date(),
          updated_at: new Date(),
        })
        .where(eq(banks.id, validatedId))
        .returning();
      if (!bank) throw new NotFoundError('Bank not found');
      return bank;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to delete bank', error);
    }
  },
};

export { ValidationError, DatabaseError, NotFoundError };
export type { BankQueryParams };
