import { eq, and, ilike, desc, countDistinct } from 'drizzle-orm';
import { db } from '../drizzle';
import { businessUsers } from '../schema';
import { users } from '../schema';
import type { BusinessUser, Business, User, UserRole } from '../types';
import { z } from 'zod';
import { uuidSchema, paginationSchema } from '../../zod/businessSchema';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/zod/errorSchema';

// Business User schemas
const createBusinessUserSchema = z.object({
  businessId: uuidSchema,
  userId: uuidSchema,
  role: z.enum(['owner', 'admin', 'manager', 'employee', 'accountant']),
  permissions: z.record(z.unknown()).optional(),
  isActive: z.boolean().default(true),
});

const updateBusinessUserSchema = createBusinessUserSchema.partial();

type BusinessUserWithRelations = BusinessUser & {
  business?: Business;
  user?: User;
};

export type BusinessUserFilters = {
  search?: string;
  role?: string;
  isActive?: boolean;
};

export const businessUserQueries = {
  // Get business user by ID
  async getById(businessUserId: string): Promise<BusinessUserWithRelations | null> {
    try {
      const validatedId = uuidSchema.parse(businessUserId);
      const businessUser = await db.query.businessUsers.findFirst({
        where: eq(businessUsers.id, validatedId),
        with: {
          business: true,
          user: true,
        },
      });
      return businessUser as BusinessUserWithRelations | null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid business user ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to fetch business user', error);
    }
  },

  // Get business users by business ID
  async getByBusinessId(
    businessId: string,
    filters: BusinessUserFilters = {},
    paginationData: z.infer<typeof paginationSchema> = { page: 1, limit: 10, offset: 0}
  ): Promise<{ businessUsers: BusinessUserWithRelations[]; total: number }> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);
      const { page = 1, limit = 10 } = paginationSchema.parse(paginationData);
      const offset = (page - 1) * limit;

      const whereConditions = [eq(businessUsers.businessId, validatedBusinessId)];

      if (filters.search) {
        const searchTerm = `%${filters.search}%`;
        whereConditions.push(ilike(users.fullName, searchTerm));
      }

      if (filters.role) {
        whereConditions.push(eq(businessUsers.role, filters.role as  UserRole));
      }

      if (filters.isActive !== undefined) {
        whereConditions.push(eq(businessUsers.isActive, filters.isActive));
      }

      const whereClause = and(...whereConditions);

      // Get total count
      const totalResult = await db
        .select({ count: countDistinct(users.id) } )
        .from(businessUsers)
        .innerJoin(users, eq(businessUsers.userId, users.id))
        .where(whereClause);

      const total = Number(totalResult[0]?.count || 0);

      // Get paginated results
      const result = await db.query.businessUsers.findMany({
        where: whereClause,
        with: {
          business: true,
          user: true,
        },
        limit,
        offset,
        orderBy: [desc(businessUsers.created_at)],
      });
      const newBusinessUsers = result as BusinessUserWithRelations[];
      return { businessUsers: newBusinessUsers, total };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to fetch business users', error);
    }
  },

  // Get user's businesses
  async getUserBusinesses(userId: string): Promise<BusinessUserWithRelations[]> {
    try {
      const validatedUserId = uuidSchema.parse(userId);
    const  userBusinesses = await db.query.businessUsers.findMany({
        where: and(
          eq(businessUsers.userId, validatedUserId),
          eq(businessUsers.isActive, true)
        ),
        with: {
          business: true,
        },
        orderBy: [desc(businessUsers.joinedAt)],
      });
      return userBusinesses as BusinessUserWithRelations[];
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid user ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to fetch user businesses', error);
    }
  },

  // Create business user relationship
  async create(businessUserData: z.infer<typeof createBusinessUserSchema>): Promise<BusinessUser> {
    try {
      const validatedData = createBusinessUserSchema.parse(businessUserData);

      // Check if relationship already exists
      const existing = await db.query.businessUsers.findFirst({
        where: and(
          eq(businessUsers.businessId, validatedData.businessId),
          eq(businessUsers.userId, validatedData.userId)
        ),
      });

      if (existing) {
        throw new ValidationError('User is already associated with this business');
      }

      const [businessUser] = await db
        .insert(businessUsers)
        .values({
          ...validatedData,
          joinedAt: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();

      return businessUser;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof ValidationError) throw error;
      throw new DatabaseError('Failed to create business user', error);
    }
  },

  // Update business user
  async update(businessUserId: string, updateData: z.infer<typeof updateBusinessUserSchema>): Promise<BusinessUser> {
    try {
      const validatedId = uuidSchema.parse(businessUserId);
      const validatedData = updateBusinessUserSchema.parse(updateData);

      const [businessUser] = await db
        .update(businessUsers)
        .set({
          ...validatedData,
          updated_at: new Date(),
        })
        .where(eq(businessUsers.id, validatedId))
        .returning();

      if (!businessUser) throw new NotFoundError('Business user not found');
      return businessUser;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to update business user', error);
    }
  },

  // Remove user from business (soft delete)
  async removeFromBusiness(businessUserId: string): Promise<BusinessUser> {
    try {
      const validatedId = uuidSchema.parse(businessUserId);

      const [businessUser] = await db
        .update(businessUsers)
        .set({
          isActive: false,
          updated_at: new Date(),
          deleted_at: new Date(),
        })
        .where(eq(businessUsers.id, validatedId))
        .returning();

      if (!businessUser) throw new NotFoundError('Business user not found');
      return businessUser;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid business user ID: ${error.errors[0].message}`);
      }
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to remove user from business', error);
    }
  },

  // Check if user has access to business
  async hasAccess(userId: string, businessId: string): Promise<boolean> {
    try {
      const validatedUserId = uuidSchema.parse(userId);
      const validatedBusinessId = uuidSchema.parse(businessId);

      const businessUser = await db.query.businessUsers.findFirst({
        where: and(
          eq(businessUsers.userId, validatedUserId),
          eq(businessUsers.businessId, validatedBusinessId),
          eq(businessUsers.isActive, true)
        ),
      });

      return !!businessUser;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to check business access', error);
    }
  },
};