import { integer, pgTable, uuid, text, varchar, boolean, index, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { businesses } from "./businesses-schema";
import { relations } from "drizzle-orm";


const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}
// --- Multi-Currency Support ---
export const currencies = pgTable('currencies', {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),
    code: varchar('code', { length: 3 }).notNull(),
    isBase: boolean('is_base').default(false),
    ...timestamps,
  }, (table) => ({
    businessCurrencyIdx: index('currencies_business_idx').on(table.businessId),
    codeIdx: uniqueIndex('currencies_code_idx').on(table.businessId, table.code),
  }));
  
  // --- Exchange Rates ---
  export const exchangeRates = pgTable('exchange_rates', {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
    fromCurrencyId: uuid('from_currency_id').references(() => currencies.id, { onDelete: 'cascade' }).notNull(),
    toCurrencyId: uuid('to_currency_id').references(() => currencies.id, { onDelete: 'cascade' }).notNull(),
    rate: integer('rate').notNull(),
    effectiveDate: timestamp('effective_date').defaultNow(),
    ...timestamps,
  }, (table) => ({
    businessExchangeRateIdx: index('exchange_rates_business_idx').on(table.businessId),
    fromCurrencyIdx: index('exchange_rates_from_currency_idx').on(table.fromCurrencyId),
    toCurrencyIdx: index('exchange_rates_to_currency_idx').on(table.toCurrencyId),
  }));
  

  export const currenciesRelations = relations(currencies, ({ one, many }) => ({
    business: one(businesses, {
      fields: [currencies.businessId],
      references: [businesses.id],
    }),
    fromExchangeRates: many(exchangeRates, { relationName: 'from_currency' }),
    toExchangeRates: many(exchangeRates, { relationName: 'to_currency' }),
  }));
  
  export const exchangeRatesRelations = relations(exchangeRates, ({ one }) => ({
    business: one(businesses, {
      fields: [exchangeRates.businessId],
      references: [businesses.id],
    }),
    fromCurrency: one(currencies, {
      fields: [exchangeRates.fromCurrencyId],
      references: [currencies.id],
      relationName: 'from_currency',
    }),
    toCurrency: one(currencies, {
      fields: [exchangeRates.toCurrencyId],
      references: [currencies.id],
      relationName: 'to_currency',
    }),
  }));