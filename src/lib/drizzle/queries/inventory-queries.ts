import { eq, and, sql, desc, lte,  } from 'drizzle-orm';
import { db } from '../drizzle';
import { inventory  } from '../schema/inventory-schema';
import {  products, categories } from '../schema/products-schema';

import type { Inventory, Product, Category } from '../types';
import { z } from 'zod';
import { uuidSchema, paginationSchema } from '../../zod/businessSchema';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/zod/errorSchema';
import { createInventorySchema, updateInventorySchema } from '@/lib/zod/inventorySchema';




// Inventory schemas
// const createInventorySchema = z.object({
//   businessId: uuidSchema,
//   productId: uuidSchema,
//   quantity: z.number().int().min(0).default(0),
//   reservedQuantity: z.number().int().min(0).default(0),
//   reorderLevel: z.number().int().min(0).default(0),
//   maxStockLevel: z.number().int().min(0).optional(),
//   location: z.string().max(255).optional(),
//   lastRestocked: z.date().optional(),
// });

// const updateInventorySchema = createInventorySchema.partial();

const adjustInventorySchema = z.object({
  productId: uuidSchema,
  quantityChange: z.number().int(),
  reason: z.string().min(1).max(500),
});

const bulkAdjustmentSchema = z.object({
  adjustments: z.array(adjustInventorySchema).min(1).max(50),
});

type InventoryWithProduct = Inventory & {
  product?: Product & {
    category?: Category;
  } ;
};

export type InventoryFilters = {
  lowStock?: boolean;
  outOfStock?: boolean;
  location?: string;
};

export const inventoryQueries = {
  // Get inventory by ID
  async getById(inventoryId: string): Promise<InventoryWithProduct | null> {
    try {
      const validatedId = uuidSchema.parse(inventoryId);
      const inventoryItem = await db.query.inventory.findFirst({
        where: eq(inventory.id, validatedId),
        with: {
          product: {
            with: {
              category: true,
            },
          },
        },

      });
      const typedResult = inventoryItem as InventoryWithProduct | null;
      return typedResult ?? null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid inventory ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to fetch inventory', error);
    }
  },

  // Get inventory by product ID
  async getByProductId(productId: string): Promise<InventoryWithProduct | null> {
    try {
      const validatedProductId = uuidSchema.parse(productId);
      const productWithId = await db.query.inventory.findFirst({
        where: eq(inventory.productId, validatedProductId),
        with: {
          product: {
            with: {
              category: true,
            },
          },
        },
      });
      const typedResult = productWithId as InventoryWithProduct | null;
      return typedResult ?? null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid product ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to fetch inventory', error);
    }
  },

  // Get inventory by business ID
  async getByBusinessId(
    businessId: string,
    filters: InventoryFilters = {},
    paginationData: z.infer<typeof paginationSchema> = { page: 1, limit: 10, offset:0 }
  ): Promise<{ inventory: InventoryWithProduct[]; total: number }> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);
      const { page = 1, limit = 10 } = paginationSchema.parse(paginationData);
      const offset = (page - 1) * limit;

      const whereConditions = [eq(inventory.businessId, validatedBusinessId)];

      if (filters.lowStock) {
        whereConditions.push(lte(inventory.availableQuantity, inventory.reorderLevel));
      }

      if (filters.outOfStock) {
        whereConditions.push(eq(inventory.availableQuantity, 0));
      }

      if (filters.location) {
        whereConditions.push(eq(inventory.locationId, uuidSchema.parse(filters.location)));
      }

      const whereClause = and(...whereConditions);

      // Get total count
      const totalResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(inventory)
        .where(whereClause);

      const total = Number(totalResult[0]?.count || 0);

      // Get paginated results
      const result = await db.query.inventory.findMany({
        where: whereClause,
        with: {
          product: {
            with: {
              category: true,
            },
          },
        },
        limit,
        offset,
        orderBy: [desc(inventory.updated_at)],
      });
      const typedResult = result as InventoryWithProduct[];
      return { inventory: typedResult, total };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to fetch inventory', error);
    }
  },

  // Get low stock items
  async getLowStock(businessId: string): Promise<InventoryWithProduct[]> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);
      const lowStock = await db.query.inventory.findMany({
        where: and(
          eq(inventory.businessId, validatedBusinessId),
          lte(inventory.availableQuantity, inventory.reorderLevel)
        ),
        with: {
          product: {
            with: {
              category: true,
            },
          },
        },
        orderBy: [inventory.availableQuantity],
      });
      return lowStock as InventoryWithProduct[];
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid business ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to fetch low stock items', error);
    }
  },

  // Get out of stock items
  async getOutOfStock(businessId: string): Promise<InventoryWithProduct[]> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);
      const outOfStock = await db.query.inventory.findMany({
        where: and(
          eq(inventory.businessId, validatedBusinessId),
          eq(inventory.availableQuantity, 0)
        ),
        with: {
          product: {
            with: {
              category: true,
            },
          },
        },
        orderBy: [desc(inventory.updated_at)],
      });
      return outOfStock as InventoryWithProduct[];
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid business ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to fetch out of stock items', error);
    }
  },

  // Create inventory record
  async create(inventoryData: z.infer<typeof createInventorySchema>) {
    try {
      const validatedData = createInventorySchema.parse(inventoryData);

      // Check if inventory already exists for this product
      const existing = await this.getByProductId(validatedData.productId);
      if (existing) {
        throw new ValidationError('Inventory record already exists for this product');
      }

      const [inventoryRecord] = await db
        .insert(inventory)
        .values({
          ...validatedData,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();

      return inventoryRecord as z.infer<typeof createInventorySchema>;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof ValidationError) throw error;
      throw new DatabaseError('Failed to create inventory', error);
    }
  },

  // Update inventory
  async update(inventoryId: string, updateData: z.infer<typeof updateInventorySchema>): Promise<z.infer<typeof updateInventorySchema>> {
    try {
      const validatedId = uuidSchema.parse(inventoryId);
      const validatedData = updateInventorySchema.parse(updateData);

      const [inventoryRecord] = await db
        .update(inventory)
        .set({
          ...validatedData,
          updated_at: new Date(),
        })
        .where(eq(inventory.id, validatedId))
        .returning();

      if (!inventoryRecord) throw new NotFoundError('Inventory record not found');
      return inventoryRecord as z.infer<typeof updateInventorySchema>;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to update inventory', error);
    }
  },

  // Adjust inventory quantity
  async adjustQuantity(productId: string, adjustment: number): Promise<Inventory> {
    try {
      const validatedProductId = uuidSchema.parse(productId);

      const existingInventory = await this.getByProductId(validatedProductId);
      if (!existingInventory) {
        throw new NotFoundError('Inventory record not found');
      }

      const newQuantity = (existingInventory.availableQuantity || 0) + adjustment;
      if (newQuantity < 0) {
        throw new ValidationError('Insufficient inventory quantity');
      }

      

      const [inventoryRecord] = await db
        .update(inventory)
        .set({
          availableQuantity: newQuantity,
          lastRestocked: adjustment > 0 ? new Date() : existingInventory.lastRestocked,
          updated_at: new Date(),
        })
        .where(eq(inventory.productId, validatedProductId))
        .returning();

      return inventoryRecord;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid product ID: ${error.errors[0].message}`);
      }
      if (error instanceof ValidationError || error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to adjust inventory quantity', error);
    }
  },

  // Reserve inventory
  async reserveQuantity(productId: string, quantity: number): Promise<Inventory> {
    try {
      const validatedProductId = uuidSchema.parse(productId);

      const existingInventory = await this.getByProductId(validatedProductId);
      if (!existingInventory) {
        throw new NotFoundError('Inventory record not found');
      }

      const availableQuantity = (existingInventory.availableQuantity || 0) - (existingInventory.reservedQuantity || 0);
      if (availableQuantity < quantity) {
        throw new ValidationError('Insufficient available inventory');
      }

      const [inventoryRecord] = await db
        .update(inventory)
        .set({
          reservedQuantity: (existingInventory.reservedQuantity || 0) + quantity,
          updated_at: new Date(),
        })
        .where(eq(inventory.productId, validatedProductId))
        .returning();

      return inventoryRecord;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid product ID: ${error.errors[0].message}`);
      }
      if (error instanceof ValidationError || error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to reserve inventory', error);
    }
  },

  // Release reserved inventory
  async releaseReservedQuantity(productId: string, quantity: number): Promise<Inventory> {
    try {
      const validatedProductId = uuidSchema.parse(productId);

      const existingInventory = await this.getByProductId(validatedProductId);
      if (!existingInventory) {
        throw new NotFoundError('Inventory record not found');
      }

      const newReservedQuantity = Math.max(0, (existingInventory.reservedQuantity || 0) - quantity);

      const [inventoryRecord] = await db
        .update(inventory)
        .set({
          reservedQuantity: newReservedQuantity,
          updated_at: new Date(),
        })
        .where(eq(inventory.productId, validatedProductId))
        .returning();

      return inventoryRecord;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid product ID: ${error.errors[0].message}`);
      }
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to release reserved inventory', error);
    }
  },

  // Bulk inventory adjustments
  async bulkAdjustQuantities(businessId: string, adjustmentData: z.infer<typeof bulkAdjustmentSchema>): Promise<Inventory[]> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);
      const { adjustments } = bulkAdjustmentSchema.parse(adjustmentData);

      return await db.transaction(async (tx) => {
        const results: Inventory[] = [];

        for (const adjustment of adjustments) {
          const existingInventory = await tx.query.inventory.findFirst({
            where: and(
              eq(inventory.productId, adjustment.productId),
              eq(inventory.businessId, validatedBusinessId)
            ),
          });

          if (!existingInventory) {
            throw new NotFoundError(`Inventory record not found for product ${adjustment.productId}`);
          }

          const newQuantity = (existingInventory.availableQuantity || 0) + adjustment.quantityChange;
          if (newQuantity < 0) {
            throw new ValidationError(`Insufficient inventory for product ${adjustment.productId}`);
          }

          const [updatedInventory] = await tx
            .update(inventory)
            .set({
              availableQuantity: newQuantity,
              lastRestocked: adjustment.quantityChange > 0 ? new Date() : existingInventory.lastRestocked,
              updated_at: new Date(),
            })
            .where(eq(inventory.productId, adjustment.productId))
            .returning();

          results.push(updatedInventory);
        }

        return results;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof ValidationError || error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to bulk adjust inventory', error);
    }
  },

  // Get inventory valuation
  async getInventoryValuation(businessId: string): Promise<{
    totalValue: number;
    totalQuantity: number;
    byCategory: Array<{
      categoryId: string;
      categoryName: string;
      value: number;
      quantity: number;
    }>;
  }> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);

      // Get total valuation
      const [totalResult] = await db
        .select({
          totalValue: sql<number>`COALESCE(SUM(${inventory.availableQuantity} * ${products.costPrice}), 0)`,
          totalQuantity: sql<number>`COALESCE(SUM(${inventory.availableQuantity}), 0)`,
        })
        .from(inventory)
        .innerJoin(products, eq(inventory.productId, products.id))
        .where(
          and(
            eq(inventory.businessId, validatedBusinessId),
            eq(products.isActive, true)
          )
        );

      // Get valuation by category
      const categoryResults = await db
        .select({
          categoryId: categories.id,
          categoryName: categories.name,
          value: sql<number>`COALESCE(SUM(${inventory.availableQuantity} * ${products.costPrice}), 0)`,
          quantity: sql<number>`COALESCE(SUM(${inventory.availableQuantity}), 0)`,
        })
        .from(inventory)
        .innerJoin(products, eq(inventory.productId, products.id))
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(
          and(
            eq(inventory.businessId, validatedBusinessId),
            eq(products.isActive, true)
          )
        )
        .groupBy(categories.id, categories.name);

      return {
        totalValue: Number(totalResult.totalValue),
        totalQuantity: Number(totalResult.totalQuantity),
        byCategory: categoryResults.map(result => ({
          categoryId: result.categoryId || 'uncategorized',
          categoryName: result.categoryName || 'Uncategorized',
          value: Number(result.value),
          quantity: Number(result.quantity),
        })),
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid business ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to fetch inventory valuation', error);
    }
  },

  // Get available quantity (total - reserved)
  getAvailableQuantity(inventoryRecord: Inventory): number {
    return Math.max(0, (inventoryRecord.availableQuantity || 0) - (inventoryRecord.reservedQuantity || 0));
  },

  // Check if item needs reordering
  needsReordering(inventoryRecord: Inventory): boolean {
    return (inventoryRecord.availableQuantity || 0) <= (inventoryRecord.reorderLevel || 0);
  },
};



