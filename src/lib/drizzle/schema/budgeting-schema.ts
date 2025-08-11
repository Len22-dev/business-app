import { pgTable, text, uuid, varchar,  integer, index, boolean } from "drizzle-orm/pg-core";
import { businesses } from "./businesses-schema";
import { accounts } from "./accounts-schema";
import { timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}

// --- Budgeting ---
export const budgets = pgTable('budgets', {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),
    fiscalPeriodId: uuid('fiscal_period_id').references(() => fiscalPeriods.id, { onDelete: 'cascade' }).notNull(),
    accountId: uuid('account_id').references(() => accounts.id, { onDelete: 'cascade' }).notNull(),
    budgetAmount: integer('budget_amount').notNull().default(0),
    actualAmount: integer('actual_amount').notNull().default(0),
    varianceAmount: integer('variance_amount').notNull().default(0),
    variancePercentage: integer('variance_percentage').notNull().default(0),
    varianceType: varchar('variance_type', { length: 20 }).notNull().default('percentage'),
    isActive: boolean('is_active').default(true),
    description: text('description'),
    ...timestamps,
  }, (table) => ({
    businessBudgetIdx: index('budgets_business_idx').on(table.businessId),
    accountBudgetIdx: index('budgets_account_idx').on(table.accountId),
  }));

  // --- Fiscal Periods ---
export const fiscalPeriods = pgTable('fiscal_periods', {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
    year: integer('year').notNull(),
    period: varchar('period', { length: 20 }).notNull(),
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date').notNull(),
    isClosed: boolean('is_closed').default(false),
    isActive: boolean('is_active').default(true),
    ...timestamps,
  }, (table) => ({
    businessFiscalPeriodIdx: index('fiscal_periods_business_idx').on(table.businessId),
  }));

  export const fiscalPeriodsRelations = relations(fiscalPeriods, ({ one }) => ({
    business: one(businesses, {
      fields: [fiscalPeriods.businessId],
      references: [businesses.id],
    }),
  }));