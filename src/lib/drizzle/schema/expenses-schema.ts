import { pgTable, text, uuid, varchar, timestamp, integer, index, jsonb, boolean, pgEnum, } from "drizzle-orm/pg-core";
import { businesses } from "./businesses-schema";
import { categories } from "./products-schema";
import { relations } from "drizzle-orm";
import { employees } from "./employees-schema";
import { payments } from "./payment-schema";

export const expenseStatusEnum = pgEnum('expense_status', [
  'DRAFT',
  'SUBMITTED',
  'APPROVED',
  'REJECTED',
  'PAID',]);

const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}

export const expenses = pgTable('expenses', {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
    categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'cascade' }).notNull(),
    reference: varchar('reference', { length: 100 }),
    totalAmount: integer('total_amount').notNull().default(0),
    
    // Payment tracking (stored for performance)
    paidAmount: integer('paid_amount').default(0),
    balanceDue: integer('balance_due').default(0),
    lastPaymentDate: timestamp('last_payment_date'),
    receipt: text('receipt'), // File URL
    isReimbursed: boolean('is_reimbursed').default(false),
    isReimbursable: boolean('is_reimbursable').default(false),
    isRecurring: boolean('is_recurring').default(false),
    recurringFrequency: varchar('recurring_frequency', { length: 20 }), // 'monthly', 'yearly', etc.
    createdBy: uuid('created_by').references(() => employees.id, { onDelete: 'cascade' }).notNull(),
    approvedBy: uuid('approved_by'),
    approvedAt: timestamp('approved_at'),
    notes: text('notes'),
    tags: jsonb('tags'), // Array of tags
    ...timestamps,
  }, (table) => ({
    businessExpenseIdx: index('expenses_business_idx').on(table.businessId),
    }));

  export const expenseItems = pgTable('expense_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  expenseId: uuid('expense_id').references(() => expenses.id, { onDelete: 'cascade' }).notNull(),
  expenseStatus: expenseStatusEnum('expense_status').default('DRAFT'),
  expenseDate: timestamp('expense_date').notNull(),
  description: text('description').notNull(),
  amount: integer('amount').notNull(),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'cascade' }).notNull(),
  receiptUrl: varchar('receipt_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow(),
},(table) => ({
   expenseStatusIdx: index('expense_items_expense_status_idx').on(table.expenseStatus),
   expenseDateIdx: index('expense_items_expense_date_idx').on(table.expenseDate),
   categoryIdIdx: index('expense_items_category_id_idx').on(table.categoryId),
   receiptUrlIdx: index('expense_items_receipt_url_idx').on(table.receiptUrl),
}));

  export const expensesRelations = relations(expenses, ({ one, many }) => ({
    business: one(businesses, {
      fields: [expenses.businessId],
      references: [businesses.id],
    }),
    vendor: one(employees, {
      fields: [expenses.createdBy],
      references: [employees.id],
    }),
    category: one(categories, {
      fields: [expenses.categoryId],
      references: [categories.id],
    }),
    approvedBy: one(employees, {
    fields: [expenses.approvedBy],
    references: [employees.id],
    relationName: 'expense_approved_by',
  }),
  expenseItems: many(expenseItems),
  payments: many(payments, {
    relationName: 'expense_payments',
  }),
  }));
  

  // Expense Items Relations
export const expenseItemsRelations = relations(expenseItems, ({ one }) => ({
  expenses: one(expenses, {
    fields: [expenseItems.expenseId],
    references: [expenses.id],
  }),
  categories: one(categories, {
    fields: [expenseItems.categoryId],
    references: [categories.id],
  })
}));