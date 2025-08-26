import { pgTable, text, uuid, varchar, timestamp, integer, index, pgEnum, serial, boolean } from "drizzle-orm/pg-core";
import { businesses, locations } from "./businesses-schema";
import { relations } from "drizzle-orm";
import { banks } from "./banking-schema";
import { employees } from "./employees-schema";
import { sales } from "./sales-schema";
import { purchases } from "./purchase-schema";
import { expenses } from "./expenses-schema";

 const paymentMethodEnum = pgEnum('payment_method', ['cash', 'bank_transfer', 'card', 'cheque', 'mobile_money'])

 export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'paid',
  'failed',
  'cancelled',
  'refunded',
  'part_payment'
]);

export const sourceTypeEnum = pgEnum('source_type', [
  'sales',
  'purchase',
  'expense',
  'others'
]);

export const payerTypeEnum = pgEnum('payer_type', [
  'customer',
  'vendor',
  'employee',
  'company',
  'others'
]);

export const allocationTypeEnum = pgEnum('allocation_type', [
  'invoice',
  'advance',
  'refund',
  'adjustment',
]);

const timestamps = {
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp(),
}


// Payment Management
export const payments = pgTable('payments', {
    id: uuid('id').primaryKey().defaultRandom(),
    paymentNumber: serial('payment_number').notNull(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
    sourceType: sourceTypeEnum('source_type').notNull(),
    sourceId: uuid('source_id').notNull(),
    payerType: payerTypeEnum('payer_type').notNull(),
    payerId: uuid('payer_id').notNull(),
    bankAccountId: uuid('bank_account_id').references(() => banks.id, { onDelete: 'cascade' }).notNull(), // bank account where the payment was made
    currencyCode: varchar('currency_code', { length: 3 }).default('NGN'),
    amount: integer('amount').notNull(),
    paymentDate: timestamp('payment_date').defaultNow(),
    paymentMethod: paymentMethodEnum('payment_method').notNull(),
    reference: varchar('reference', { length: 100 }),
    checkNumber: varchar('check_number', { length: 50 }),
    cardLastFour: varchar('card_last_four', { length: 4 }),
    transactionId: varchar('transaction_id', { length: 100 }),
    paymentStatus: paymentStatusEnum('payment_status').default('pending'),
    approvedBy: uuid('approved_by'),
    approvedAt: timestamp('approved_at'),
    createdBy: uuid('created_by'),
    notes: text('notes'),
    reconciled: boolean('reconciled').default(false),
    reconciledAt: timestamp('reconciled_at'),
    ...timestamps,
  }, (table) => ({
    businessPaymentIdx: index('payments_business_idx').on(table.businessId),
  }));

  export const paymentAllocations = pgTable('payment_allocations', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
  paymentId: uuid('payment_id').notNull(),
  
  // What the payment is being applied to
  allocationType: allocationTypeEnum('allocation_type').notNull(),
  sourceTransactionId: uuid('source_transaction_id').notNull(),
  
  allocatedAmount: integer('allocated_amount').notNull(),
  notes: text('notes'),
  
  createdAt: timestamp('created_at').defaultNow(),
});

  // Cash register/POS sessions
export const cashRegister = pgTable('cash_register', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessId: uuid('business_id').notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  locationId: uuid('location_id').references(() => locations.id),
  registerBy: uuid('register_by').notNull().references(() => employees.id),
  sessionNumber: varchar('session_number', { length: 100 }).notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  openingBalance: integer('opening_balance').notNull().default(0),
  closingBalance: integer('closing_balance').default(0),
  expectedClosing: integer('expected_closing').default(0),
  totalSales: integer('total_sales').default(0),
  totalCash: integer('total_cash').default(0),
  totalCard: integer('total_card').default(0),
  status: varchar('status', { length: 20 }).default('open'), // open, closed
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});
  

  export const paymentsRelations = relations(payments, ({ one, many }) => ({
    business: one(businesses, {
      fields: [payments.businessId],
      references: [businesses.id],
    }),
     bankAccount: one(banks, {
    fields: [payments.bankAccountId],
    references: [banks.id],
  }),
     createdBy: one(employees, {
    fields: [payments.createdBy],
    references: [employees.id],
    relationName: 'payment_created_by',
  }),
  approvedBy: one(employees, {
    fields: [payments.approvedBy],
    references: [employees.id],
    relationName: 'payment_approved_by',
  }),
  sales: one(sales, {
    fields: [payments.sourceId],
    references: [sales.id],
    relationName: 'sales_payments',
  }),
  purchases: one(purchases, {
    fields: [payments.sourceId],
    references: [purchases.id],
    relationName: 'purchase_payments',
  }),
  expenses: one(expenses, {
    fields: [payments.sourceId],
    references: [expenses.id],
    relationName: 'expense_payments',
  }),
  
  // Payer polymorphic relations
  payerCompany: one(businesses, {
    fields: [payments.payerId],
    references: [businesses.id],
    relationName: 'company_payments',
  }),
  payerEmployee: one(employees, {
    fields: [payments.payerId],
    references: [employees.id],
    relationName: 'employee_payments',
  }),
  
  allocations: many(paymentAllocations),
  }));

  // Payment Allocation Relations
export const paymentAllocationsRelations = relations(paymentAllocations, ({ one }) => ({
  payment: one(payments, {
    fields: [paymentAllocations.paymentId],
    references: [payments.id],
  }),
  business: one(businesses, {
    fields: [paymentAllocations.businessId],
    references: [businesses.id],
  })
}));

export const cashRegisterRelations = relations(cashRegister, ({ one, }) => ({
  business: one(businesses, {
    fields: [cashRegister.businessId],
    references: [businesses.id],
  }),
  location: one(locations, {
    fields: [cashRegister.locationId],
    references: [locations.id],
  }),
  createdBy: one(employees, {
    fields: [cashRegister.registerBy],
    references: [employees.id],
  })
}))