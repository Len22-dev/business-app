import { eq, and, desc, sql, ilike } from 'drizzle-orm';
import { db } from '../drizzle';
import { products } from '../schema';
import type { Product, Category } from '../types';
import { z } from 'zod';
import { createProductSchema, updateProductSchema } from '../../zod/productSchema';
import { uuidSchema, paginationSchema } from '@/lib/zod/businessSchema';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/zod/errorSchema';

// Extended type for product with category
export type ProductWithCategory = Product & { category?: Category };

// Query parameter schema
const productQuerySchema = z.object({
  businessId: uuidSchema,
  categoryId: uuidSchema.optional(),
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  sortBy: z.enum(['name', 'created_at', 'unitPrice', 'sku']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  ...paginationSchema.shape,
});

type ProductQueryParams = z.infer<typeof productQuerySchema>;

export const productQueries = {
  // Get product by ID with category
  async getById(productId: string): Promise<ProductWithCategory | null> {
    try {
      const validatedId = uuidSchema.parse(productId);
      const result = await db.query.products.findFirst({
        where: eq(products.id, validatedId),
        with: { category: true },
      });
      return result as ProductWithCategory | null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to fetch product', error);
    }
  },

  // Get products with filtering and pagination
  async getMany(queryParams: unknown): Promise<{
    products: ProductWithCategory[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      const { businessId, categoryId, search, isActive, sortBy, sortOrder, limit, offset } = productQuerySchema.parse(queryParams);
      const whereConditions = [eq(products.businessId, businessId)];
      if (categoryId) whereConditions.push(eq(products.categoryId, categoryId));
      if (typeof isActive === 'boolean') whereConditions.push(eq(products.isActive, isActive));
      if (search) {
        whereConditions.push(ilike(products.name, `%${search}%`));
      }
      // Get total count
      const [totalResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(products)
        .where(and(...whereConditions));
      const total = Number(totalResult.count);
      const totalPages = Math.ceil(total / limit);
      const currentPage = Math.floor(offset / limit) + 1;
      // Order by
      const orderByClause = sortOrder === 'desc'
        ? desc(products[sortBy])
        : products[sortBy];
      // Get paginated results
      const results = await db.query.products.findMany({
        where: and(...whereConditions),
        with: { category: true },
        orderBy: orderByClause,
        limit,
        offset,
      });
      return {
        products: results as ProductWithCategory[],
        total,
        totalPages,
        currentPage,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to fetch products', error);
    }
  },

  // Create product
  async create(productData: unknown): Promise<Product> {
    try {
      const validatedData = createProductSchema.parse(productData);
      const [product] = await db
        .insert(products)
        .values({
          ...validatedData,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();
      return product;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to create product', error);
    }
  },

  // Update product
  async update(productId: string, productData: unknown): Promise<Product> {
    try {
      const validatedId = uuidSchema.parse(productId);
      const validatedData = updateProductSchema.parse(productData);
      const [product] = await db
        .update(products)
        .set({
          ...validatedData,
          updated_at: new Date(),
        })
        .where(eq(products.id, validatedId))
        .returning();
      if (!product) throw new NotFoundError('Product not found');
      return product;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to update product', error);
    }
  },

  // Soft delete product
  async delete(productId: string): Promise<Product> {
    try {
      const validatedId = uuidSchema.parse(productId);
      const [product] = await db
        .update(products)
        .set({
          isActive: false,
          updated_at: new Date(),
        })
        .where(eq(products.id, validatedId))
        .returning();
      if (!product) throw new NotFoundError('Product not found');
      return product;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to delete product', error);
    }
  },
};

export { ValidationError, DatabaseError, NotFoundError };
export type {  ProductQueryParams };
