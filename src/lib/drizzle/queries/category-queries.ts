import { eq, and, ilike, asc, sql, } from 'drizzle-orm';
import { db } from '../drizzle';
import { categories, products } from '../schema/products-schema';
import {  expenses } from '../schema/expenses-schema';
import {  transactions } from '../schema/transactions-schema';
import type { Category } from '../types';
import { z } from 'zod';
import { uuidSchema, paginationSchema } from '@/lib/zod/businessSchema';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/zod/errorSchema';

// Category schemas
const createCategorySchema = z.object({
  businessId: uuidSchema,
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  parentId: uuidSchema.optional(),
  type: z.enum(['product', 'expense', 'income']),
  isActive: z.boolean().default(true),
});

const updateCategorySchema = createCategorySchema.partial();

type CategoryWithChildren = Category & {
  children?: Category[];
  parent?: Category;
  productCount?: number;
  transactionCount?: number;
  expenseCount?: number;
};

export type CategoryFilters = {
  search?: string;
  type?: string;
  isActive?: boolean;
  parentId?: string;
};

export const categoryQueries = {
  // Get category by ID
  async getById(categoryId: string): Promise<CategoryWithChildren | null> {
    try {
      const validatedId = uuidSchema.parse(categoryId);
      const category = await db.query.categories.findFirst({
        where: eq(categories.id, validatedId),
        with: {
          parent: true,
          children: true,
        },
      });
      return category as CategoryWithChildren | null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid category ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to fetch category', error);
    }
  },

  // Get categories by business ID
  async getByBusinessId(
    businessId: string,
    filters: CategoryFilters = {},
    paginationData: z.infer<typeof paginationSchema> = { page: 1, limit: 50, offset: 0 }
  ): Promise<{ categories: CategoryWithChildren[]; total: number }> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);
      const { page = 1, limit = 50 } = paginationSchema.parse(paginationData);
      const offset = (page - 1) * limit;

      const whereConditions = [eq(categories.businessId, validatedBusinessId)];

      if (filters.search) {
        const searchTerm = `%${filters.search}%`;
        whereConditions.push(ilike(categories.name, searchTerm));
      }

      if (filters.type) {
        whereConditions.push(eq(categories.type, filters.type as string));
      }

      if (filters.isActive !== undefined) {
        whereConditions.push(eq(categories.isActive, filters.isActive));
      }

      if (filters.parentId) {
        whereConditions.push(eq(categories.parentId, filters.parentId));
      }

      const whereClause = and(...whereConditions);

      // Get total count
      const totalResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(categories)
        .where(whereClause);

      const total = Number(totalResult[0]?.count || 0);

      // Get paginated results
      const result = await db.query.categories.findMany({
        where: whereClause,
        with: {
          parent: true,
          children: true,
        },
        limit,
        offset,
        orderBy: [asc(categories.name)],
      });
      const newResult = result as CategoryWithChildren[];
      return { categories: newResult, total };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to fetch categories', error);
    }
  },

  // Get root categories (no parent)
  async getRootCategories(businessId: string, type?: string): Promise<CategoryWithChildren[]> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);
      const whereConditions = [
        eq(categories.businessId, validatedBusinessId),
        eq(categories.isActive, true),
        sql`${categories.parentId} IS NULL`,
      ];

      if (type) {
        whereConditions.push(eq(categories.type, type as string));
      }

      const result = await db.query.categories.findMany({
        where: and(...whereConditions),
        with: {
          children: {
            where: eq(categories.isActive, true),
          },
        },
        orderBy: [asc(categories.name)],
      });
      const typedResult = result as CategoryWithChildren[];
      return typedResult;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid business ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to fetch root categories', error);
    }
  },

  async getMany(businessId: string,): Promise<CategoryWithChildren[]> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);
      const result = await db.query.categories.findMany({
        where: (
          eq(categories.businessId, validatedBusinessId),
          eq(categories.type, 'product'),
          eq(categories.isActive, true)
        ),
        with: {
          parent: true,
          children: true,
        },
        orderBy: [asc(categories.name)],
      }); 
      const typedResult = result as CategoryWithChildren[];
   return typedResult;
  }catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid business ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to fetch root categories', error);
    }

  },

  // Get category tree (hierarchical structure)
  async getCategoryTree(businessId: string, type?: string): Promise<CategoryWithChildren[]> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);
      const whereConditions = [
        eq(categories.businessId, validatedBusinessId),
        eq(categories.isActive, true),
      ];

      if (type) {
        whereConditions.push(eq(categories.type, type as string));
      }

      const allCategories = await db.query.categories.findMany({
        where: and(...whereConditions),
        orderBy: [asc(categories.name)],
      });

      // Build tree structure
      const categoryMap = new Map<string, CategoryWithChildren>();
      const rootCategories: CategoryWithChildren[] = [];

      // First pass: create map of all categories
      allCategories.forEach(category => {
        categoryMap.set(category.id, { ...category, children: [] } as CategoryWithChildren);
      });

      // Second pass: build tree structure
      allCategories.forEach(category => {
        const categoryWithChildren = categoryMap.get(category.id)!;
        if (category.parentId) {
          const parent = categoryMap.get(category.parentId);
          if (parent) {
            parent.children!.push(categoryWithChildren);
          }
        } else {
          rootCategories.push(categoryWithChildren);
        }
      });

      return rootCategories;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid business ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to fetch category tree', error);
    }
  },

  // Get categories with usage counts
  async getCategoriesWithCounts(businessId: string, type?: string): Promise<CategoryWithChildren[]> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);
      const whereConditions = [
        eq(categories.businessId, validatedBusinessId),
        eq(categories.isActive, true),
      ];

      if (type) {
        whereConditions.push(eq(categories.type, type as string));
      }

      const result = await db
        .select({
          category: categories,
          productCount: sql<number>`COUNT(DISTINCT ${products.id})`,
          transactionCount: sql<number>`COUNT(DISTINCT ${transactions.id})`,
          expenseCount: sql<number>`COUNT(DISTINCT ${expenses.id})`,
        })
        .from(categories)
        .leftJoin(products, and(
          eq(categories.id, products.categoryId),
          eq(products.isActive, true)
        ))
        .leftJoin(transactions, eq(categories.id, transactions.categoryId))
        .leftJoin(expenses, eq(categories.id, expenses.categoryId))
        .where(and(...whereConditions))
        .groupBy(categories.id)
        .orderBy(asc(categories.name));

      return result.map(item => ({
        ...item.category,
        productCount: Number(item.productCount),
        transactionCount: Number(item.transactionCount),
        expenseCount: Number(item.expenseCount),
      }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid business ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to fetch categories with counts', error);
    }
  },

  // Create category
  async create(categoryData: z.infer<typeof createCategorySchema>): Promise<Category> {
    try {
      const validatedData = createCategorySchema.parse(categoryData);

      // Check if parent exists (if provided)
      if (validatedData.parentId) {
        const parent = await this.getById(validatedData.parentId);
        if (!parent) {
          throw new ValidationError('Parent category not found');
        }
        if (parent.businessId !== validatedData.businessId) {
          throw new ValidationError('Parent category must belong to the same business');
        }
      }

      const [category] = await db
        .insert(categories)
        .values({
          ...validatedData,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();

      return category;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof ValidationError) throw error;
      throw new DatabaseError('Failed to create category', error);
    }
  },

  // Update category
  async update(categoryId: string, updateData: z.infer<typeof updateCategorySchema>): Promise<Category> {
    try {
      const validatedId = uuidSchema.parse(categoryId);
      const validatedData = updateCategorySchema.parse(updateData);

      // Check if category exists
      const existingCategory = await this.getById(validatedId);
      if (!existingCategory) {
        throw new NotFoundError('Category not found');
      }

      // Check if parent exists and is valid (if being updated)
      if (validatedData.parentId) {
        if (validatedData.parentId === validatedId) {
          throw new ValidationError('Category cannot be its own parent');
        }
        const parent = await this.getById(validatedData.parentId);
        if (!parent) {
          throw new ValidationError('Parent category not found');
        }
        if (parent.businessId !== existingCategory.businessId) {
          throw new ValidationError('Parent category must belong to the same business');
        }
      }

      const [category] = await db
        .update(categories)
        .set({
          ...validatedData,
          updated_at: new Date(),
        })
        .where(eq(categories.id, validatedId))
        .returning();

      return category as Category;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof ValidationError || error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to update category', error);
    }
  },

  // Soft delete category
  async softDelete(categoryId: string): Promise<Category> {
    try {
      const validatedId = uuidSchema.parse(categoryId);

      // Check if category has children
      const children = await db.query.categories.findMany({
        where: and(
          eq(categories.parentId, validatedId),
          eq(categories.isActive, true)
        ),
      });

      if (children.length > 0) {
        throw new ValidationError('Cannot delete category with active subcategories');
      }

      // Check if category is being used
      const [productCount] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(products)
        .where(and(
          eq(products.categoryId, validatedId),
          eq(products.isActive, true)
        ));

      if (Number(productCount.count) > 0) {
        throw new ValidationError('Cannot delete category with active products');
      }

      const [category] = await db
        .update(categories)
        .set({
          isActive: false,
          updated_at: new Date(),
          deleted_at: new Date(),
        })
        .where(eq(categories.id, validatedId))
        .returning();

      if (!category) throw new NotFoundError('Category not found');
      return category as Category;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid category ID: ${error.errors[0].message}`);
      }
      if (error instanceof ValidationError || error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to delete category', error);
    }
  },
};