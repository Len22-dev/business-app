import { pgTable, text, uuid, timestamp, integer, index, jsonb, pgEnum, serial, varchar, date, boolean } from "drizzle-orm/pg-core";
import { businesses, locations } from "./businesses-schema";
import { categories, products } from "./products-schema";
import { relations } from "drizzle-orm";
import { users } from "./users-schema";
import { payments } from "./payment-schema";
import { employees } from "./employees-schema";

const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}

export const transactionTypeEnum = pgEnum('transaction_type', ['sales', 'payment','payroll','purchase', 'expense', 'journal', 'transfer']);
export const transactionStatusEnum = pgEnum('transaction_status', ['draft', 'pending', 'approved', 'rejected', 'completed', 'cancelled', 'failed']);

export const transactions = pgTable('transactions', {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }),
    locationId: uuid('location_id').references(() => locations.id, { onDelete: 'cascade' }),
    categoryId: uuid('category_id').references(() => categories.id),
    entityId: uuid('entity_id'), // vendor, customer, employee
    entityType: text('entity_type'), // 'vendor', 'customer', 'employee', 'business'
    transactionNumber: serial('transaction_number'),
    transactionType: transactionTypeEnum('transaction_type'),
    totalAmount: integer('total_amount').notNull().default(0),
    transactionDate: timestamp('transaction_date').defaultNow(),
    referenceNumber:text('reference_number').unique(), // the reference number for the transaction
    transactionStatus: transactionStatusEnum('transaction_status').default('draft'),
    createdBy: uuid('created_by').references(() => users.id, { onDelete: 'cascade' }),
    approvedBy: uuid('approved_by').references(() => users.id, { onDelete: 'cascade' }),
    attachments: jsonb('attachments'), // Array of file URLs
    metadata: jsonb('metadata'),
    ...timestamps,
  }, (table) => ({
    businessTransactionIdx: index('transactions_business_idx').on(table.businessId),
    transactionDateIdx: index('transactions_date_idx').on(table.transactionDate),
  }));

  export const transactionLineItems = pgTable('transaction_line_items', {
    id: uuid('id').primaryKey().defaultRandom(),
    transactionId: uuid('transaction_id').references(() => transactions.id, {onDelete: 'cascade'}),
    productId: uuid('product_id').references(() => products.id, {onDelete: 'cascade'}),
    subtotalAmount: integer('amount').notNull().default(0),
    item: text('item').notNull(),
    description: text('description').notNull(),
    quantity: integer('quantity').default(0),
    unitAmount: integer('unit_amount').default(0),
    taxAmount: integer('tax_amount').default(0),
    discountAmount: integer('discount_amunt').default(0),
    metadata: jsonb('metadata')
  });

  // Recurring transactions
export const recurringTransactions = pgTable('recurring_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessId: uuid('business_id').notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  locationId: uuid('location_id').references(() => locations.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  transactionType: varchar('transaction_type', { length: 50 }).notNull(), // expense, income, payroll
  frequency: varchar('frequency', { length: 20 }).notNull(), // daily, weekly, monthly, yearly
  amount: integer('amount').notNull().default(0),
  nextDate: date('next_date').notNull(),
  endDate: date('end_date'),
  categoryId: uuid('category_id'),
  entityId: uuid('entity_id'), // vendor, customer, employee
  description: text('description'),
  isActive: boolean('is_active').default(true),
  lastProcessed: date('last_processed'),
  createdBy: uuid('created_by').references(() => employees.id, { onDelete: 'cascade' }).notNull(),
  updatedBy: uuid('updated_by').references(() => employees.id, { onDelete: 'cascade' }).notNull(),
  ...timestamp,
});


  export const transactionsRelations = relations(transactions, ({ one, many }) => ({
    business: one(businesses, {
      fields: [transactions.businessId],
      references: [businesses.id],
    }),
    location: one(locations, {
      fields: [transactions.locationId],
      references: [locations.id],
    }),
    createdBy: one(users, {
      fields: [transactions.createdBy],
      references: [users.id],
    }),
    approvedBy: one(users, {
      fields: [transactions.approvedBy],
      references: [users.id],
    }),
    category: one(categories, {
      fields: [transactions.categoryId],
      references: [categories.id],
    }),
    transactionLineItems: many(transactionLineItems)
  }));

  export const transactionLineItemsRelations = relations(transactionLineItems, ({one, many}) => ({
    transactions: one(transactions, {
      fields: [transactionLineItems.transactionId],
      references: [transactions.id],
    }),
    products: one(products, {
      fields: [transactionLineItems.productId],
      references: [products.id],
    }),
     payments: many(payments, {
        relationName: 'transaction_payments',
      }),
  }));
  
 export const recurringTransactionsRelations = relations(recurringTransactions, ({ one }) => ({
    business: one(businesses, {
      fields: [recurringTransactions.businessId],
      references: [businesses.id],
    }),
    createdBy: one(employees, {
      fields: [recurringTransactions.createdBy],
      references: [employees.id],
    }),
    updatedBy: one(employees, {
      fields: [recurringTransactions.updatedBy],
      references: [employees.id],
    })
  }))