import { eq, and, desc, sql, ilike } from 'drizzle-orm';
import { db } from '../drizzle';
import { expenses } from '../schema';
import type { Expense, Vendor, Category } from '../types';
import { z } from 'zod';
import { uuidSchema, paginationSchema } from '../../zod/businessSchema';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/zod/errorSchema';
import { createExpenseSchema } from '@/lib/zod/expenseSchema';

// Extended type for expense with vendor and category
export type ExpenseWithRelations = Expense & { vendor?: Vendor, category?: Category };

// Query parameter schema
const expenseQuerySchema = z.object({
  businessId: uuidSchema,
  categoryId: uuidSchema.optional(),
  vendorId: uuidSchema.optional(),
  search: z.string().optional(),
  sortBy: z.enum(['reference', 'totalAmount', 'created_at']).default('reference'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  ...paginationSchema.shape,
});

type ExpenseQueryParams = z.infer<typeof expenseQuerySchema>;

export const expenseQueries = {
  // Get expense by ID with relations
  async getById(expenseId: string): Promise<ExpenseWithRelations | null> {
    try {
      const validatedId = uuidSchema.parse(expenseId);
      const result = await db.query.expenses.findFirst({
        where: eq(expenses.id, validatedId),
        with: { vendor: true, category: true },
      });
      return result as ExpenseWithRelations | null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to fetch expense', error);
    }
  },

  // Get expenses with filtering and pagination
  async getMany(queryParams: unknown): Promise<{
    expenses: ExpenseWithRelations[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      const { businessId, categoryId, vendorId, search, sortBy, sortOrder, limit, offset } = expenseQuerySchema.parse(queryParams);
      const whereConditions = [eq(expenses.businessId, businessId)];
      if (categoryId) whereConditions.push(eq(expenses.categoryId, categoryId));
      if (vendorId) whereConditions.push(eq(expenses.reference, vendorId));
      if (search) {
        whereConditions.push(ilike(expenses.notes, `%${search}%`));
      }
      // Get total count
      const [totalResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(expenses)
        .where(and(...whereConditions));
      const total = Number(totalResult.count);
      const totalPages = Math.ceil(total / limit);
      const currentPage = Math.floor(offset / limit) + 1;
      // Order by
      const orderByClause = sortOrder === 'desc'
        ? desc(expenses[sortBy])
        : expenses[sortBy];
      // Get paginated results
      const results = await db.query.expenses.findMany({
        where: and(...whereConditions),
        with: { vendor: true, category: true },
        orderBy: orderByClause,
        limit,
        offset,
      });
      return {
        expenses: results as ExpenseWithRelations[],
        total,
        totalPages,
        currentPage,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to fetch expenses', error);
    }
  },

  // Create expense
  async create(expenseData: Record<string, unknown>): Promise<z.infer<typeof createExpenseSchema>> {

    try {
      // Add zod validation here if you have a schema
      const validatedData = createExpenseSchema.parse(expenseData);
      const [expense] = await db
        .insert(expenses)
        .values({
          ...validatedData,
          created_at: new Date(),
          updated_at: new Date(),
          businessId: expenseData.businessId as string,
        })
        .returning();
      return expense as z.infer<typeof createExpenseSchema>;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to create expense', error);
    }
  },

  // Update expense
  async update(expenseId: string, expenseData: Record<string, unknown>): Promise<Expense> {
    try {
      const validatedId = uuidSchema.parse(expenseId);
      // Add zod validation here if you have a schema
      // const validatedData = updateExpenseSchema.parse(expenseData);
      const [expense] = await db
        .update(expenses)
        .set({
          ...expenseData,
          updated_at: new Date(),
        })
        .where(eq(expenses.id, validatedId))
        .returning();
      if (!expense) throw new NotFoundError('Expense not found');
      return expense;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to update expense', error);
    }
  },

  // Soft delete expense
  async delete(expenseId: string): Promise<Expense> {
    try {
      const validatedId = uuidSchema.parse(expenseId);
      const [expense] = await db
        .update(expenses)
        .set({
          deleted_at: new Date(),
          updated_at: new Date(),
        })
        .where(eq(expenses.id, validatedId))
        .returning();
      if (!expense) throw new NotFoundError('Expense not found');
      return expense;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to delete expense', error);
    }
  },
};

export { ValidationError, DatabaseError, NotFoundError };
export type {  ExpenseQueryParams }; 