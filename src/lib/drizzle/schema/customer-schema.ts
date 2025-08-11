import { pgTable, text, uuid, varchar, boolean, index, jsonb, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { businesses } from "./businesses-schema";
import { payments } from "./payment-schema";
import { invoices } from "./invoice-schema";
import { sales } from "./sales-schema";
import { relations } from "drizzle-orm";

const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}

export const customerTypes = pgEnum('customer_types', ['INDIVIDUAL', 'BUSINESS']);

export const customers = pgTable('customers', {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),
    email: text('email'),
    phone: varchar('phone', { length: 20 }),
    customerType: customerTypes('customer_type').default('INDIVIDUAL'),
    address: text('address'),
    company: text('company'),
    taxId: varchar('tax_id', { length: 50 }),
    billingAddress: jsonb('billing_address'),
    shippingAddress: jsonb('shipping_address'),
    city: varchar('city', { length: 100 }),
    state: varchar('state', { length: 100 }),
    country: varchar('country', { length: 100 }).default('Nigeria'),
    paymentTerms: integer('payment_terms').default(30), // Days
    creditLimit: integer('credit_limit').default(0),
    notes: text('notes'),
    outstandingBalance: integer('outstanding_balance').default(0),
    isActive: boolean('is_active').notNull().default(true),
    ...timestamps,
  }, (table) => ({
    businessCustomerIdx: index('customers_business_idx').on(table.businessId),
    nameIdx: index('customers_name_idx').on(table.name),
    emailIdx: index('customers_email_idx').on(table.email),
  }));

  // Customer and vendor contacts
export const customerContacts = pgTable('customer_contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessId: uuid('business_id').notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  customerId: uuid('customer_id').notNull().references(() => customers.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  position: varchar('position', { length: 100 }),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),
  isPrimary: boolean('is_primary').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

  export const customersRelations = relations(customers, ({ one, many }) => ({
    business: one(businesses, {
      fields: [customers.businessId],
      references: [businesses.id],
    }),
    customerContacts: many(customerContacts),
    sales: many(sales),
    invoices: many(invoices),
    payments: many(payments),
  }));

  export const customerContactRelations = relations(customerContacts, ({ one }) => ({
    businesses: one(businesses, {
      fields: [customerContacts.businessId],
      references: [businesses.id],
    }),
    customer: one(customers, {
      fields: [customerContacts.customerId],
      references: [customers.id],
    })
  }));