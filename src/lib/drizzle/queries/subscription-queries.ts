import { eq, and, desc,  lte, count } from 'drizzle-orm';
import { db } from '../drizzle';
import { subscriptionPlans, subscriptions } from '../schema/subscriptions-schema';
import type { Subscription, Business, SubscriptionStatus } from '../types';
import { z } from 'zod';
import { uuidSchema, paginationSchema } from '../../zod/businessSchema';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/zod/errorSchema';
import { createSubscriptionSchema } from '@/lib/zod/subscriptionSchema';

// Subscription schemas
// const createSubscriptionSchema = z.object({
  // businessId: uuidSchema,
  // planName: z.string().min(1).max(50),
  // status: z.enum(['active', 'inactive', 'cancelled', 'past_due', 'trialing']).default('trialing'),
  // currentPeriodStart: z.date(),
  // currentPeriodEnd: z.date(),
  // trialEnd: z.date().optional(),
  // amount: z.number().positive().optional(),
  // currency: z.string().length(3).default('USD'),
  // stripeSubscriptionId: z.string().optional(),
  // metadata: z.record(z.unknown()).optional(),
// });

const updateSubscriptionSchema = createSubscriptionSchema.partial();

type SubscriptionWithBusiness = Subscription & {
  business?: Business;
};

export type SubscriptionFilters = {
  status?: string;
  planName?: string;
};

export const subscriptionQueries = {
  // Get subscription by ID
  async getById(subscriptionId: string): Promise<SubscriptionWithBusiness | null> {
    try {
      const validatedId = uuidSchema.parse(subscriptionId);
      const result = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.id, validatedId),
        with: {
          business: true,
        },
      });
      return result as SubscriptionWithBusiness | null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid subscription ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to fetch subscription', error);
    }
  },

  // Get subscription by business ID
  async getByBusinessId(businessId: string): Promise<SubscriptionWithBusiness | null> {
    try {
      const validatedBusinessId = uuidSchema.parse(businessId);
      const result = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.businessId, validatedBusinessId),
        with: {
          business: true,
        },
        orderBy: [desc(subscriptions.created_at)],
      });
      return result as SubscriptionWithBusiness | null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid business ID: ${error.errors[0].message}`);
      }
      throw new DatabaseError('Failed to fetch subscription', error);
    }
  },

  // Get all subscriptions with filters
  async getAll(
    filters: SubscriptionFilters = {},
    paginationData: z.infer<typeof paginationSchema> = { page: 1, limit: 10, offset: 0 }
  ): Promise<{ subscriptions: SubscriptionWithBusiness[]; total: number }> {
    try {
      const { page = 1, limit = 10 } = paginationSchema.parse(paginationData);
      const offset = (page - 1) * limit;

      const whereConditions = [];

      if (filters.status) {
        whereConditions.push(eq(subscriptions.status, filters.status as SubscriptionStatus));
      }

      if (filters.planName) {
        whereConditions.push(eq(subscriptionPlans.name, filters.planName));
      }

      const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

      // Get total count
      const totalResult = await db
        .select({ count: count(subscriptions.id) })
        .from(subscriptions)
        .where(whereClause);

      const total = Number(totalResult[0]?.count || 0);

      // Get paginated results
      const result = await db.query.subscriptions.findMany({
        where: whereClause,
        with: {
          business: true,
        },
        limit,
        offset,
        orderBy: [desc(subscriptions.created_at)],
      });
      const typedResult = result as SubscriptionWithBusiness[];
      return { subscriptions: typedResult, total };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to fetch subscriptions', error);
    }
  },

  // Create subscription
  async create(subscriptionData: z.infer<typeof createSubscriptionSchema>): Promise<Subscription> {
    try {
      const validatedData = createSubscriptionSchema.parse(subscriptionData);

      const [subscription] = await db
        .insert(subscriptions)
        .values({
          ...validatedData,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();

      return subscription;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to create subscription', error);
    }
  },

  // Update subscription
  async update(subscriptionId: string, updateData: z.infer<typeof updateSubscriptionSchema>): Promise<Subscription> {
    try {
      const validatedId = uuidSchema.parse(subscriptionId);
      const validatedData = updateSubscriptionSchema.parse(updateData);

      const [subscription] = await db
        .update(subscriptions)
        .set({
          ...validatedData,
          updated_at: new Date(),
        })
        .where(eq(subscriptions.id, validatedId))
        .returning();

      if (!subscription) throw new NotFoundError('Subscription not found');
      return subscription;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to update subscription', error);
    }
  },

  // Cancel subscription
  async cancel(subscriptionId: string): Promise<Subscription> {
    try {
      const validatedId = uuidSchema.parse(subscriptionId);

      const [subscription] = await db
        .update(subscriptions)
        .set({
          status: 'cancelled',
          cancelledAt: new Date(),
          updated_at: new Date(),
        })
        .where(eq(subscriptions.id, validatedId))
        .returning();

      if (!subscription) throw new NotFoundError('Subscription not found');
      return subscription;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Invalid subscription ID: ${error.errors[0].message}`);
      }
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to cancel subscription', error);
    }
  },

  // Get expiring subscriptions
  async getExpiring(days: number = 7): Promise<SubscriptionWithBusiness[]> {
    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + days);

      const result = await db.query.subscriptions.findMany({
        where: and(
          eq(subscriptions.status, 'active'),
          lte(subscriptions.currentPeriodEnd, expiryDate)
        ),
        with: {
          business: true,
        },
        orderBy: [subscriptions.currentPeriodEnd],
      });
      return result as SubscriptionWithBusiness[];
    } catch (error) {
      throw new DatabaseError('Failed to fetch expiring subscriptions', error);
    }
  },

  // Get active subscriptions
  async getActive(): Promise<SubscriptionWithBusiness[]> {
    try {
      const result = await db.query.subscriptions.findMany({
        where: eq(subscriptions.status, 'active'),
        with: {
          business: true,
        },
        orderBy: [desc(subscriptions.created_at)],
      });
      return result as SubscriptionWithBusiness[];
    } catch (error) {
      throw new DatabaseError('Failed to fetch active subscriptions', error);
    }
  },

  // Get subscriptions with filtering and pagination (for API route)
  async getMany(queryParams: unknown): Promise<{
    subscriptions: SubscriptionWithBusiness[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      // Accepts businessId, status, plan, page, limit
      const schema = z.object({
        businessId: uuidSchema,
        status: z.string().optional(),
        plan: z.string().optional(),
        page: z.coerce.number().default(1),
        limit: z.coerce.number().default(10),
      });
      const { businessId, status, plan, page, limit } = schema.parse(queryParams);
      const offset = (page - 1) * limit;
      const whereConditions = [eq(subscriptions.businessId, businessId)];
      if (status) whereConditions.push(eq(subscriptions.status, status as SubscriptionStatus));
      if (plan) whereConditions.push(eq(subscriptionPlans.name, plan));
      // Get total count
      const totalResult = await db
        .select({ count: count(subscriptions.id) })
        .from(subscriptions)
        .where(and(...whereConditions));
      const total = Number(totalResult[0]?.count || 0);
      const totalPages = Math.ceil(total / limit);
      const currentPage = page;
      // Get paginated results
      const result = await db.query.subscriptions.findMany({
        where: and(...whereConditions),
        with: { business: true },
        limit,
        offset,
        orderBy: [desc(subscriptions.created_at)],
      });
      return {
        subscriptions: result as SubscriptionWithBusiness[],
        total,
        totalPages,
        currentPage,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new DatabaseError('Failed to fetch subscriptions', error);
    }
  },

  // Soft delete subscription
  async delete(subscriptionId: string): Promise<Subscription> {
    try {
      const validatedId = uuidSchema.parse(subscriptionId);
      const [subscription] = await db
        .update(subscriptions)
        .set({
          deleted_at: new Date(),
          updated_at: new Date(),
        })
        .where(eq(subscriptions.id, validatedId))
        .returning();
      if (!subscription) throw new NotFoundError('Subscription not found');
      return subscription;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to delete subscription', error);
    }
  },
};