import { z } from "zod";

export const subscriptionStatusEnum = z.enum(['active', 'inactive', 'cancelled', 'past_due', 'trialing']);

export const subscriptionPlanSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  name: z.string().max(100, { message: "Name too long" }).min(1, { message: "Name is required" }),
  description: z.string().optional(),
  price: z.number().int().min(0, { message: "Price must be non-negative" }),
  currency: z.string().length(3, { message: "Currency code must be 3 characters" }).default('NGN'),
  billingCycle: z.string().max(20, { message: "Billing cycle too long" }),
  maxEmployees: z.number().int().min(1, { message: "Max employees must be at least 1" }),
  features: z.array(z.string()).optional(),
  businessTypes: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
});

export const createSubscriptionPlanSchema = subscriptionPlanSchema.omit({
  id: true,
  createdAt: true,
});

export const updateSubscriptionPlanSchema = createSubscriptionPlanSchema.partial();

export const subscriptionSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  planId: z.string().uuid({ message: "Invalid UUID format" }),
  status: subscriptionStatusEnum.default('trialing'),
  currentPeriodStart: z.date(),
  currentPeriodEnd: z.date(),
  trialEnd: z.date().optional(),
  cancelledAt: z.date().optional(),
  lastPaymentDate: z.date().optional(),
  nextPaymentDate: z.date().optional(),
  amount: z.number().int().min(0).default(0),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const createSubscriptionSchema = subscriptionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateSubscriptionSchema = createSubscriptionSchema.partial();