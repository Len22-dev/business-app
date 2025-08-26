import { pgTable, text, uuid, varchar, boolean, index, jsonb, timestamp } from "drizzle-orm/pg-core";
import { businesses } from "./businesses-schema";
import { payments } from "./payment-schema";
import { relations } from "drizzle-orm";
import { purchases } from "./purchase-schema";
import { expenses } from "./expenses-schema";

const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}

export const vendors = pgTable('vendors', {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),
    email: text('email'),
    phone: varchar('phone', { length: 20 }),
    company: text('company'),
    taxId: varchar('tax_id', { length: 50 }),
    address: jsonb('address'),
    paymentTerms: jsonb('payment_terms'),
    notes: text('notes'),
    isActive: boolean('is_active').default(true),
    ...timestamps,
  }, (table) => ({
    businessVendorIdx: index('vendors_business_idx').on(table.businessId),
    nameIdx: index('vendors_name_idx').on(table.name),
    emailIdx: index('vendors_email_idx').on(table.email),
  }));

  // Vendor and vendor contacts
export const vendorContacts = pgTable('vendor_contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessId: uuid('tenant_id').notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  vendorId: uuid('vendor_id').notNull().references(() => vendors.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  position: varchar('position', { length: 100 }),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),
  isPrimary: boolean('is_primary').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

  export const vendorsRelations = relations(vendors, ({ one, many }) => ({
    business: one(businesses, {
      fields: [vendors.businessId],
      references: [businesses.id],
    }),
    contacts: many(vendorContacts),
    purchases: many(purchases),
    expenses: many(expenses),
    payments: many(payments),
  }));  

  export const vendorContactRelations = relations(vendorContacts, ({ one}) => ({
    business: one(businesses, {
      fields: [vendorContacts.businessId],
      references: [businesses.id],
    }),
    vendor: one(vendors, {
      fields: [vendorContacts.vendorId],
      references: [vendors.id],
    })
  }))