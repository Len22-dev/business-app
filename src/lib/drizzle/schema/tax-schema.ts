import { pgTable, uuid, text, integer, varchar, boolean, index, timestamp } from "drizzle-orm/pg-core";
import { businesses } from "./businesses-schema";
import { relations } from "drizzle-orm";

const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}

// Tax Management
export const taxRates = pgTable('tax_rates', {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),// VAT, WHT, Import Duty
    code: varchar('code', { length: 20 }).notNull(),
    rate: integer('rate', ).notNull(), // e.g., 0.0825 for 8.25%
    type: varchar('type', { length: 20 }).notNull(), // 'sales', 'purchase', 'income'
    isDefault: boolean('is_default').default(false),
    isActive: boolean('is_active').default(true),
    ...timestamps,
  }, (table) => ({
    businessTaxRateIdx: index('tax_rates_business_idx').on(table.businessId),
  }));

  export const taxRatesRelations = relations(taxRates, ({ one }) => ({
    business: one(businesses, {
      fields: [taxRates.businessId],
      references: [businesses.id],
    }),
  }));