import { pgTable, text, uuid, varchar, timestamp, integer, index, boolean, serial } from "drizzle-orm/pg-core";
import { transactionTypeEnum } from "./transactions-schema";
import { businesses } from "./businesses-schema";
import { relations, } from "drizzle-orm";
import { accounts } from "./accounts-schema";
import { users } from "./users-schema";

const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}

// Banking
export const banks = pgTable('banks', {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
    accountId: uuid('account_id').references(() => accounts.id, { onDelete: 'cascade' }).notNull(),
    bankName: text('bank_name').notNull(),
    accountName: text('account_name').notNull(),
    accountNumber: varchar('account_number', { length: 50 }).notNull(),
    accountType: varchar('account_type', { length: 20 }),
    routingNumber: varchar('routing_number', { length: 20 }),
    openingBalance: integer('opening_balance').default(0),
    currentBalance: integer('current_balance').default(0),
    currency: varchar('currency', { length: 3 }).default('NGN'),
    isActive: boolean('is_active').default(true),
    ...timestamps,
  }, (table) => ({
    businessBankIdx: index('banks_business_idx').on(table.businessId),
  }));
  
  export const bankTransactions = pgTable('bank_transactions', {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
    bankId: uuid('bank_id').references(() => banks.id, { onDelete: 'cascade' }).notNull(),
    transactionNumber: serial('transaction_number'),
    transactionDate: timestamp('transaction_date').notNull(),
    description: text('description').notNull(),
    amount: integer('amount').notNull().default(0),
    type: transactionTypeEnum('type').notNull(),
    category: text('category'),
    reference: varchar('reference', { length: 100 }),
    balance: integer('balance').notNull().default(0),
    isReconciled: boolean('is_reconciled').default(false),
    reconciledAt: timestamp('reconciled_at'),
    createdBy: uuid('created_by').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    ...timestamps,
  }, (table) => ({
    businessBankTransactionIdx: index('bank_transactions_business_idx').on(table.businessId),
    bankTransactionIdx: index('bank_transactions_bank_idx').on(table.bankId),
  }));

  export const banksRelations = relations(banks, ({ one, many }) => ({
    business: one(businesses, {
      fields: [banks.businessId],
      references: [businesses.id],
    }),
    bankTransactions: many(bankTransactions),
  }));
  
  export const bankTransactionsRelations = relations(bankTransactions, ({ one }) => ({
    business: one(businesses, {
      fields: [bankTransactions.businessId],
      references: [businesses.id],
    }),
    bank: one(banks, {
      fields: [bankTransactions.bankId],
      references: [banks.id],
    }),
     createdByUser: one(users, {
    fields: [bankTransactions.createdBy],
    references: [users.id],
  }),
  }));