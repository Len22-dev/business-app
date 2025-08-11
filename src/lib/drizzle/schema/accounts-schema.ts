import { pgTable, text, uuid, varchar,  integer, index,  boolean, uniqueIndex, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { businesses } from "./businesses-schema";
import { users } from "./users-schema";
import { customers } from "./customer-schema";
import { vendors } from "./vendor-schema";
import { invoices } from "./invoice-schema";
import { expenses } from "./expenses-schema";
import { relations } from "drizzle-orm";

export const accountTypeEnum = pgEnum('account_type', [
  'asset', 'liability', 'equity', 'income', 'expense', 'accounts_receivable', 'accounts_payable', 'bank', 'cash', 'other'
]);

const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}

// Chart of Accounts (COA)
export const accounts = pgTable('accounts', {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
    parentId: uuid('parent_id').references(() => accounts.id, ),
    code: varchar('code', { length: 20 }).notNull(),
    name: text('name').notNull(),
    accountType: accountTypeEnum('type').notNull(),
    description: text('description'),
    isActive: boolean('is_active').default(true),
    ...timestamps,
  }, (table) => ({
    businessAccountIdx: index('accounts_business_idx').on(table.businessId),
    codeIdx: uniqueIndex('accounts_code_idx').on(table.businessId, table.code),
    accountTypeIdx: index('accounts_account_type_idx').on(table.accountType),
  }));
  
  // Journal Entries (double-entry bookkeeping)
  export const journalEntries = pgTable('journal_entries', {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
    date: timestamp('date').defaultNow().notNull(),
    memo: text('memo'),
    reference: varchar('reference', { length: 100 }),
    createdBy: uuid('created_by').references(() => users.id),
    ...timestamps,
  }, (table) => ({
    businessJournalIdx: index('journal_entries_business_idx').on(table.businessId),
  }));
  
  // Ledger Entries (each line in a journal entry)
  export const ledgerEntries = pgTable('ledger_entries', {
    id: uuid('id').primaryKey().defaultRandom(),
    journalEntryId: uuid('journal_entry_id').references(() => journalEntries.id, { onDelete: 'cascade' }).notNull(),
    accountId: uuid('account_id').references(() => accounts.id, { onDelete: 'cascade' }).notNull(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
    debitAmount: integer('debit_amount').default(0),
    creditAmount: integer('credit_amount').default(0),
    description: text('description'),
    referenceType: text('reference_type'), // 'sale', 'purchase', 'expense', 'manual'
    relatedCustomerId: uuid('related_customer_id').references(() => customers.id),
    relatedVendorId: uuid('related_vendor_id').references(() => vendors.id),
    relatedInvoiceId: uuid('related_invoice_id').references(() => invoices.id),
    relatedExpenseId: uuid('related_expense_id').references(() => expenses.id),
    ...timestamps,
  }, (table) => ({
    businessLedgerIdx: index('ledger_entries_business_idx').on(table.businessId),
    accountLedgerIdx: index('ledger_entries_account_idx').on(table.accountId),
    journalEntryLedgerIdx: index('ledger_entries_journal_entry_idx').on(table.journalEntryId),
    referenceTypeIdx: index('ledger_entries_reference_type_idx').on(table.referenceType),
  }));

  export const receivables = pgTable('receivables', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessId: uuid('business_id').notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  customerId: uuid('customer_id').notNull().references(() => customers.id),
  invoiceNumber: varchar('invoice_number', { length: 100 }).notNull(),
  invoiceDate: timestamp('invoice_date').notNull(),
  dueDate: timestamp('due_date').notNull(),
  amount: integer('amount').notNull(),
  paidAmount: integer('paid_amount').default(0),
  balanceAmount: integer('balance_amount').notNull(),
  status: varchar('status', { length: 20 }).default('outstanding'), // outstanding, paid, overdue, written_off
  referenceType: varchar('reference_type', { length: 50 }).default('sale'),
  referenceId: uuid('reference_id'),
  ...timestamps,
  });

  export const payables = pgTable('payables', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessId: uuid('business_id').notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  vendorId: uuid('vendor_id').notNull().references(() => vendors.id),
  billNumber: varchar('bill_number', { length: 100 }).notNull(),
  billDate: timestamp('bill_date').notNull(),
  dueDate: timestamp('due_date').notNull(),
  amount: integer('amount').notNull().default(0),
  paidAmount: integer('paid_amount').default(0),
  balanceAmount: integer('balance_amount').notNull().default(0),
  status: varchar('status', { length: 20 }).default('outstanding'), // outstanding, paid, overdue
  referenceType: varchar('reference_type', { length: 50 }).default('purchase'),
  referenceId: uuid('reference_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

  
  
  export const accountsRelations = relations(accounts, ({ one, many }) => ({
    business: one(businesses, {
      fields: [accounts.businessId],
      references: [businesses.id],
    }),
    parent: one(accounts, {
      fields: [accounts.parentId],
      references: [accounts.id],
      relationName: 'parent_child_accounts',
    }),
    children: many(accounts, {
      relationName: 'parent_child_accounts',
    }),
    ledgerEntries: many(ledgerEntries),
  }));
  
  export const journalEntriesRelations = relations(journalEntries, ({ one, many }) => ({
    business: one(businesses, {
      fields: [journalEntries.businessId],
      references: [businesses.id],
    }),
    createdByUser: one(users, {
      fields: [journalEntries.createdBy],
      references: [users.id],
    }),
    ledgerEntries: many(ledgerEntries),
  }));
  
  export const ledgerEntriesRelations = relations(ledgerEntries, ({ one }) => ({
    journalEntry: one(journalEntries, {
      fields: [ledgerEntries.journalEntryId],
      references: [journalEntries.id],
    }),
    account: one(accounts, {
      fields: [ledgerEntries.accountId],
      references: [accounts.id],
    }),
    business: one(businesses, {
      fields: [ledgerEntries.businessId],
      references: [businesses.id],
    }),
    customer: one(customers, {
      fields: [ledgerEntries.relatedCustomerId],
      references: [customers.id],
    }),
    vendor: one(vendors, {
      fields: [ledgerEntries.relatedVendorId],
      references: [vendors.id],
    }),
    invoice: one(invoices, {
      fields: [ledgerEntries.relatedInvoiceId],
      references: [invoices.id],
    }),
    expense: one(expenses, {
      fields: [ledgerEntries.relatedExpenseId],
      references: [expenses.id],
    }),
  }));

  export const receivablesRelations = relations(receivables, ({ one }) => ({
  businesse: one(businesses, {
    fields: [receivables.businessId],
    references: [businesses.id],
  }),
  customer: one(customers, {
    fields: [receivables.customerId],
    references: [customers.id],
  }),
}));

export const payablesRelations = relations(payables, ({ one }) => ({
  businesse: one(businesses, {
    fields: [payables.businessId],
    references: [businesses.id],
  }),
  vendor: one(vendors, {
    fields: [payables.vendorId],
    references: [vendors.id],
  }),
}));
  