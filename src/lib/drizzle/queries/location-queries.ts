import { eq, and, ilike, asc, sql, } from 'drizzle-orm';
import { db } from '../drizzle';
import { products } from '../schema/products-schema';
import { locations } from '../schema';
import type { Location } from '../types';
import { z } from 'zod';
import { uuidSchema, paginationSchema } from '../../zod/generalSchema';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/zod/errorSchema';
import { inventory } from '../schema';
import { createLocationSchema, updateLocationSchema } from '@/lib/zod/productSchema';

// Location schemas
// const createLocationSchema = z.object({
//   businessId: uuidSchema,
//   name: z.string().min(1).max(255),
//   description: z.string().optional(),
//   //type: z.enum(['product', 'expense', 'income']),
//   isActive: z.boolean().default(true),
// });

// const updateLocationSchema = createLocationSchema.partial();

// type Location = Location & {
//   children?: Location[];
//   parent?: Location;
//   productCount?: number;
//   transactionCount?: number;
//   expenseCount?: number;
// };

export type LocationFilters = {
  search?: string;
 // type?: string;
  isActive?: boolean;
//  parentId?: string;
};

export const locationQueries = {
  // Get location by ID
  async getById(locationId: string): Promise<Location | null> {
    try {
      const validatedId = uuidSchema.parse(locationId);
      const location = await db.query.locations.findFirst({
        where: eq(locations.id, validatedId),
        // with: {
        //   parent: true,
        //   children: true,
        // },
      });
      return location as Location | null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid location ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to fetch location', error);
    }
  },

  // Get locations by business ID
  async getByBusinessId(
    businessId: string,
    filters: LocationFilters = {},
    paginationData: z.infer<typeof paginationSchema> = { page: 1, limit: 50 }
  ): Promise<{ locations: Location[]; total: number }> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);
      const { page = 1, limit = 50 } = paginationSchema.parse(paginationData);
      const offset = (page - 1) * limit;

      const whereConditions = [eq(locations.businessId, validatedBusinessId)];

      if (filters.search) {
        const searchTerm = `%${filters.search}%`;
        whereConditions.push(ilike(locations.name, searchTerm));
      }

      // if (filters.type) {
      //   whereConditions.push(eq(locations.type, filters.type as string));
      // }

      if (filters.isActive !== undefined) {
        whereConditions.push(eq(locations.isActive, filters.isActive));
      }

      // if (filters.parentId) {
      //   whereConditions.push(eq(locations.parentId, filters.parentId));
      // }

      const whereClause = and(...whereConditions);

      // Get total count
      const totalResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(locations)
        .where(whereClause);

      const total = Number(totalResult[0]?.count || 0);

      // Get paginated results
      const result = await db.query.locations.findMany({
        where: whereClause,
        // with: {
        //   parent: true,
        //   children: true,
        // },
        limit,
        offset,
        orderBy: [asc(locations.name)],
      });
      const newResult = result as Location[];
      return { locations: newResult, total };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to fetch locations', error);
    }
  },

  // Get root locations (no parent)
  // async getRootLocations(businessId: string, type?: string): Promise<Location[]> {
  //   try {
  //     const validatedBusinessId = uuidSchema.parse(businessId);
  //     const whereConditions = [
  //       eq(locations.businessId, validatedBusinessId),
  //       eq(locations.isActive, true),
  //       sql`${locations.parentId} IS NULL`,
  //     ];

  //     if (type) {
  //       whereConditions.push(eq(locations.type, type as string));
  //     }

  //     const result = await db.query.locations.findMany({
  //       where: and(...whereConditions),
  //       with: {
  //         children: {
  //           where: eq(locations.isActive, true),
  //         },
  //       },
  //       orderBy: [asc(locations.name)],
  //     });
  //     const typedResult = result as Location[];
  //     return typedResult;
  //   } catch (error) {
  //     if (error instanceof z.ZodError) {
  //       throw new ValidationError(`Invalid business ID: ${error.errors[0].message}`);
  //     }
  //     throw new DatabaseError('Failed to fetch root locations', error);
  //   }
  // },

  async getMany(businessId: string,): Promise<Location[]> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);
      const result = await db.query.locations.findMany({
        where: (
          eq(locations.businessId, validatedBusinessId),
          eq(locations.isActive, true)
        ),
        orderBy: [asc(locations.name)],
      }); 
      const typedResult = result as Location[];
   return typedResult;
  }catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid business ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to fetch root locations', error);
    }

  },

  // // Get location tree (hierarchical structure)
  // async getLocationTree(businessId: string, type?: string): Promise<Location[]> {
  //   try {
  //     const validatedBusinessId = uuidSchema.parse(businessId);
  //     const whereConditions = [
  //       eq(locations.businessId, validatedBusinessId),
  //       eq(locations.isActive, true),
  //     ];

  //     if (type) {
  //       whereConditions.push(eq(locations.type, type as string));
  //     }

  //     const allLocations = await db.query.locations.findMany({
  //       where: and(...whereConditions),
  //       orderBy: [asc(locations.name)],
  //     });

  //     // Build tree structure
  //     const locationMap = new Map<string, Location>();
  //     const rootLocations: Location[] = [];

  //     // First pass: create map of all locations
  //     allLocations.forEach(location => {
  //       locationMap.set(location.id, { ...location, children: [] } as Location);
  //     });

  //     // Second pass: build tree structure
  //     allLocations.forEach(location => {
  //       const location = locationMap.get(location.id)!;
  //       if (location.parentId) {
  //         const parent = locationMap.get(location.parentId);
  //         if (parent) {
  //           parent.children!.push(location);
  //         }
  //       } else {
  //         rootLocations.push(location);
  //       }
  //     });

  //     return rootLocations;
  //   } catch (error) {
  //     if (error instanceof z.ZodError) {
  //       throw new ValidationError(`Invalid business ID: ${error.errors[0].message}`);
  //     }
  //     throw new DatabaseError('Failed to fetch location tree', error);
  //   }
  // },

  // Get locations with usage counts
  async getLocationsWithCounts(businessId: string, ): Promise<Location[]> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);
      const whereConditions = [
        eq(locations.businessId, validatedBusinessId),
        eq(locations.isActive, true),
      ];

      // if (type) {
      //   whereConditions.push(eq(locations.type, type as string));
      // }

      const result = await db
        .select({
          location: locations,
          productCount: sql<number>`COUNT(DISTINCT ${products.id})`,
        })
        .from(locations)
        .leftJoin(products, and(
          and(eq(locations.id, inventory.locationId), eq(inventory.productId, products.id)),
          eq(products.isActive, true)
        ))
        .where(and(...whereConditions))
        .groupBy(locations.id)
        .orderBy(asc(locations.name));

      return result.map(item => ({
        ...item.location,
        productCount: Number(item.productCount),
      }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid business ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to fetch locations with counts', error);
    }
  },

  // Create location
  async create(locationData: z.infer<typeof createLocationSchema>): Promise<Location> {
    try {
      const validatedData = createLocationSchema.parse(locationData);

      // Check if parent exists (if provided)
      // if (validatedData.parentId) {
      //   const parent = await this.getById(validatedData.parentId);
      //   if (!parent) {
      //     throw new ValidationError('Parent location not found');
      //   }
      //   if (parent.businessId !== validatedData.businessId) {
      //     throw new ValidationError('Parent location must belong to the same business');
      //   }
      // }

      const [location] = await db
        .insert(locations)
        .values({
          ...validatedData,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();

      return location;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof ValidationError) throw error;
      throw new DatabaseError('Failed to create location', error);
    }
  },

  // Update location
  async update(locationId: string, updateData: z.infer<typeof updateLocationSchema>): Promise<Location> {
    try {
      const validatedId = uuidSchema.parse(locationId);
      const validatedData = updateLocationSchema.parse(updateData);

      // Check if location exists
      const existingLocation = await this.getById(validatedId);
      if (!existingLocation) {
        throw new NotFoundError('Location not found');
      }

      // Check if parent exists and is valid (if being updated)
      // if (validatedData.parentId) {
      //   if (validatedData.parentId === validatedId) {
      //     throw new ValidationError('Location cannot be its own parent');
      //   }
      //   const parent = await this.getById(validatedData.parentId);
      //   if (!parent) {
      //     throw new ValidationError('Parent location not found');
      //   }
        // if (parent.businessId !== existingLocation.businessId) {
        //   throw new ValidationError('Parent location must belong to the same business');
        // }
   //   },

      const [location] = await db
        .update(locations)
        .set({
          ...validatedData,
          updated_at: new Date(),
        })
        .where(eq(locations.id, validatedId))
        .returning();

      return location as Location;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof ValidationError || error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to update location', error);
    }
  },

  // Soft delete location
  async softDelete(locationId: string): Promise<Location> {
    try {
      const validatedId = uuidSchema.parse(locationId);

      // Check if location has children
      const children = await db.query.locations.findMany({
        where: and(
          // eq(locations.parentId, validatedId),
          eq(locations.isActive, true)
        ),
      });

      if (children.length > 0) {
        throw new ValidationError('Cannot delete location with active sublocations');
      }

      // Check if location is being used
      const [productCount] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(inventory)
        .where(and(
          eq(inventory.locationId, validatedId),
        ));

      if (Number(productCount.count) > 0) {
        throw new ValidationError('Cannot delete location with active products');
      }

      const [location] = await db
        .update(locations)
        .set({
          isActive: false,
          updated_at: new Date(),
          deleted_at: new Date(),
        })
        .where(eq(locations.id, validatedId))
        .returning();

      if (!location) throw new NotFoundError('Location not found');
      return location as Location;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid location ID: ${error.errors[0].message}`);
      }
      if (error instanceof ValidationError || error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to delete location', error);
    }
  },
};