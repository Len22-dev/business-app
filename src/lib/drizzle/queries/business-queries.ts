import { eq, and, sql} from 'drizzle-orm';
import { db } from '../drizzle';

import type {
  Business,
  BusinessUser, 
  Subscription, 
  User, 
  UserRole,
} from '../types';
import { businessPermissionsSchema, businessSchema, createBusinessUserSchema, updateBusinessSchema } from '../../zod/businessSchema';
import { z } from 'zod';
import { createBusinessSchema, uuidSchema, paginationSchema } from '../../zod/businessSchema';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/zod/errorSchema';
import { userQueries } from './user-queries';
import { DashboardStats } from '@/types';
import { businesses, businessUsers } from '../schema/businesses-schema';
import { sales } from '../schema/sales-schema';
import { expenses } from '../schema/expenses-schema';
import { inventory } from '../schema/inventory-schema';

type BusinessWithUsers = Business & {
  businessUsers: (BusinessUser & {
    user: User;
  })[];
  subscription?: Subscription;
};

type BusinessPermissions = z.infer<typeof businessPermissionsSchema>;

export const businessQueries = {
  // Get business by ID with users
  async getById(businessId: string): Promise<BusinessWithUsers | null> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);

      const result = await db.query.businesses.findFirst({
        where: and(
          eq(businesses.id, validatedBusinessId),
          eq(businesses.isActive, true)
        ),
        with: {
          businessUsers: {
            where: eq(businessUsers.isActive, true),
            with: {
              user: true,
            },
          },
          subscription: true,
        },
      });
      const businessUser = result as BusinessWithUsers | null;
      return businessUser;
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid business ID: ${error.errors[0].message}`);
      }
      console.error('Error fetching business by ID:', error);
      throw new DatabaseError('Failed to fetch business', error);
    }
  },

  // Get businesses for user with pagination
  async getByUserId(
    userId: string,
    paginationData: unknown = {}
  ): Promise<{ businesses: z.infer<typeof businessSchema>[]; total: number }> {
    try {
      const validatedUserId = uuidSchema.parse(userId);
      const { limit, offset } = paginationSchema.parse(paginationData);

      // Get total count
      const totalResult = await db
        .select({ count: businesses.id })
        .from(businesses)
        .innerJoin(businessUsers, eq(businesses.id, businessUsers.businessId))
        .where(
          and(
            eq(businessUsers.userId, validatedUserId),
            eq(businesses.isActive, true),
            eq(businessUsers.isActive, true)
          )
        );

      const total = totalResult.length;

      // Get paginated results
      const result = await db
        .select({
          id: businesses.id,
          name: businesses.name,
          slug: businesses.slug,
          shortName: businesses.shortName,
          businessType: businesses.businessType,
          industry: businesses.industry,
          description: businesses.description,
          country: businesses.country,
          email: businesses.email,
          phone: businesses.phone,
          website: businesses.website,
          logo: businesses.logo,
          address: businesses.address,
          taxId: businesses.taxId,
          currency: businesses.currency,
          timezone: businesses.timezone,
          fiscalYearStart: businesses.fiscalYearStart,
          isActive: businesses.isActive,
          created_at: businesses.created_at,
          updated_at: businesses.updated_at,
          deleted_at: businesses.deleted_at,
        })
        .from(businesses)
        .innerJoin(businessUsers, eq(businesses.id, businessUsers.businessId))
        .where(
          and(
            eq(businessUsers.userId, validatedUserId),
            eq(businesses.isActive, true),
            eq(businessUsers.isActive, true)
          )
        )
        .limit(limit)
        .offset(offset);

      return { businesses: result as z.infer<typeof businessSchema>[], total };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      console.error('Error fetching businesses by user ID:', error);
      throw new DatabaseError('Failed to fetch businesses', error);
    }
  },

  // Create new business
  async create(businessData: unknown): Promise<Business> {
    try {
      const validatedData = createBusinessSchema.parse(businessData);

      const [business] = await db
        .insert(businesses)
        .values({
          ...validatedData,
          fiscalYearStart: validatedData.fiscalYearStart ? validatedData.fiscalYearStart : undefined,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();

      return business;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      console.error('Error creating business:', error);
      throw new DatabaseError('Failed to create business', error);
    }
  },

  // Create business with owner (transaction)
  async createWithOwner(
    businessData: unknown,
    userId: string
  ): Promise<{ business: Business; businessUser: BusinessUser }> {
    try {
      const validatedBusinessData = createBusinessSchema.parse(businessData);
      const validatedUserId = uuidSchema.parse(userId);

      // Verify user exists
      const user = await userQueries.getUserById(validatedUserId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      return await db.transaction(async (tx) => {
        const [business] = await tx
          .insert(businesses)
          .values({
            ...validatedBusinessData,
            fiscalYearStart: validatedBusinessData.fiscalYearStart ? validatedBusinessData.fiscalYearStart : undefined,
            created_at: new Date(),
            updated_at: new Date(),
          })
          .returning();

        const [businessUser] = await tx
          .insert(businessUsers)
          .values({
            businessId: business.id,
            userId: validatedUserId,
            role: 'owner' as UserRole,
            isActive: true,
            created_at: new Date(),
            updated_at: new Date(),
          })
          .returning();

        return { business, businessUser };
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof NotFoundError) {
        throw error;
      }
      console.error('Error creating business with owner:', error);
      throw new DatabaseError('Failed to create business with owner', error);
    }
  },

  // Update business
  async update(businessId: string, businessData: unknown): Promise<Business> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);
      const validatedData = updateBusinessSchema.parse(businessData);

      const existingBusiness = await this.getById(validatedBusinessId);
      if (!existingBusiness) {
        throw new NotFoundError('Business not found');
      }

      const [business] = await db
        .update(businesses)
        .set({
          ...validatedData,
          updated_at: new Date(),
        })
        .where(eq(businesses.id, validatedBusinessId))
        .returning();

      return business;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof NotFoundError) {
        throw error;
      }
      console.error('Error updating business:', error);
      throw new DatabaseError('Failed to update business', error);
    }
  },

  // Add user to business
  async addUser(
    businessId: string,
    userId: string,
    role: UserRole,
    permissions?: BusinessPermissions
  ): Promise<z.infer<typeof createBusinessUserSchema>> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);
      const validatedUserId = uuidSchema.parse(userId);
      const validatedPermissions = businessPermissionsSchema.parse(permissions);

      // Verify business and user exist
      const business = await this.getById(validatedBusinessId);
      if (!business) {
        throw new NotFoundError('Business not found');
      }

      const user = await userQueries.getUserById(validatedUserId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Check if user is already in business
      const existingBusinessUser = await this.getUserRole(validatedBusinessId, validatedUserId);
      if (existingBusinessUser) {
        throw new ValidationError('User is already a member of this business');
      }

      const [businessUser] = await db
        .insert(businessUsers)
        .values({
          businessId: validatedBusinessId,
          userId: validatedUserId,
          role,
          permissions: validatedPermissions,
          isActive: true,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();

      return businessUser as z.infer<typeof createBusinessUserSchema>;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      console.error('Error adding user to business:', error);
      throw new DatabaseError('Failed to add user to business', error);
    }
  },

  // Get user role in business
  async getUserRole(businessId: string, userId: string): Promise<BusinessUser | null> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);
      const validatedUserId = uuidSchema.parse(userId);

      const result = await db.query.businessUsers.findFirst({
        where: and(
          eq(businessUsers.businessId, validatedBusinessId),
          eq(businessUsers.userId, validatedUserId),
          eq(businessUsers.isActive, true)
        ),
      });

      return result ?? null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      console.error('Error fetching user role:', error);
      throw new DatabaseError('Failed to fetch user role', error);
    }
  },

  // Remove user from business (soft delete)
  async removeUser(businessId: string, userId: string): Promise<BusinessUser> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);
      const validatedUserId = uuidSchema.parse(userId);

      const existingBusinessUser = await this.getUserRole(validatedBusinessId, validatedUserId);
      if (!existingBusinessUser) {
        throw new NotFoundError('User is not a member of this business');
      }

      const [businessUser] = await db
        .update(businessUsers)
        .set({
          isActive: false,
          updated_at: new Date(),
        })
        .where(
          and(
            eq(businessUsers.businessId, validatedBusinessId),
            eq(businessUsers.userId, validatedUserId)
          )
        )
        .returning();

      return businessUser;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof NotFoundError) {
        throw error;
      }
      console.error('Error removing user from business:', error);
      throw new DatabaseError('Failed to remove user from business', error);
    }
  },

  // Soft delete business
  async softDelete(businessId: string): Promise<Business> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);

      const existingBusiness = await this.getById(validatedBusinessId);
      if (!existingBusiness) {
        throw new NotFoundError('Business not found');
      }

      const [business] = await db
        .update(businesses)
        .set({
          isActive: false,
          updated_at: new Date(),
          deleted_at: new Date(),
        })
        .where(eq(businesses.id, validatedBusinessId))
        .returning();

      return business;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid business ID: ${error.errors[0].message}`);
      }
      if (error instanceof NotFoundError) {
        throw error;
      }
      console.error('Error soft deleting business:', error);
      throw new DatabaseError('Failed to delete business', error);
    }
  },
};

export async function getDashboardStats(businessId: string): Promise<DashboardStats> {
  try {
    const validatedBusinessId = uuidSchema.parse(businessId);

    // Get total sales
    const [salesResult] = await db
      .select({ total: sql<number>`COALESCE(SUM(${sales.totalAmount}), 0)` })
      .from(sales)
      .where(eq(sales.businessId, validatedBusinessId));

    // Get total expenses
    const [expensesResult] = await db
      .select({ total: sql<number>`COALESCE(SUM(${expenses.totalAmount}), 0)` })
      .from(expenses)
      .where(eq(expenses.businessId, validatedBusinessId));

    // Get total inventory items
    const [inventoryResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(inventory)
      .where(eq(inventory.businessId, validatedBusinessId));

    // Get team members count
    const [teamResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(businessUsers)
      .where(
        and(
          eq(businessUsers.businessId, validatedBusinessId),
          eq(businessUsers.isActive, true)
        )
      );

    return {
      totalSales: Number(salesResult.total),
      totalExpenses: Number(expensesResult.total),
      totalInventory: Number(inventoryResult.count),
      teamMembers: Number(teamResult.count),
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(`Invalid business ID: ${error.errors[0].message}`);
    }
    console.error('Error fetching dashboard stats:', error);
    throw new DatabaseError('Failed to fetch dashboard stats', error);
  }
}

// Export custom error classes for use in other modules
export { ValidationError, DatabaseError, NotFoundError };
export type { BusinessPermissions };