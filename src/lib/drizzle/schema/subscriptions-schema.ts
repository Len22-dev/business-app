import { pgTable, text, uuid, varchar, timestamp, integer, jsonb, pgEnum, boolean } from "drizzle-orm/pg-core";
import { businesses } from "./businesses-schema";
import { relations } from "drizzle-orm";

 const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'inactive', 'cancelled', 'past_due', 'trialing']);

export const subscriptionPlans = pgTable('subscription_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  price: integer('price').notNull(),
  currency: varchar('currency', { length: 3 }).default('NGN'),
  billingCycle: varchar('billing_cycle', { length: 20 }).notNull(), // monthly, yearly
  maxEmployees: integer('max_employees').notNull(),
  features: jsonb('features'), // Array of included features
  businessTypes: jsonb('business_types'), // Array of supported business types
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});


export const subscriptions = pgTable('subscriptions', {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
    planId: uuid('plan_id').notNull().references(() => subscriptionPlans.id),    status: subscriptionStatusEnum('status').default('trialing'),
    currentPeriodStart: timestamp('current_period_start').notNull(),
    currentPeriodEnd: timestamp('current_period_end').notNull(),
    trialEnd: timestamp('trial_end'),
    cancelledAt: timestamp('cancelled_at'),
    lastPaymentDate: timestamp('last_payment_date'),
    nextPaymentDate: timestamp('next_payment_date'),
    amount: integer('amount').notNull().default(0), // Amount in cents
    metadata: jsonb('metadata'),
    ...timestamps,
  });
  
  export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
    business: one(businesses, {
      fields: [subscriptions.businessId],
      references: [businesses.id],
    }),
     plan: one(subscriptionPlans, {
    fields: [subscriptions.planId],
    references: [subscriptionPlans.id],
  }),
  }));