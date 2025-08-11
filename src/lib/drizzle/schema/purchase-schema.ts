import { pgTable, text, uuid, varchar, timestamp, integer, index, check, serial, pgEnum,  } from "drizzle-orm/pg-core";
import { businesses, locations } from "./businesses-schema";
import { vendors } from "./vendor-schema";
import { products } from "./products-schema";
import { employees } from "./employees-schema";
import { relations, sql } from "drizzle-orm";
import { users } from "./users-schema";
import { payments } from "./payment-schema";

const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}

export const purchaseStatusEnum = pgEnum('transaction_status', [
  'DRAFT',
  'PENDING',
  'PARTIAL_PAID',
  'PAID',
  'OVERDUE',
  'CANCELLED',
]);

export const purchases = pgTable('purchases', {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
    createdBy: uuid('created_by').references(() => users.id),
    locationId: uuid('location_id').references(() => locations.id),
    vendorId: uuid('vendor_id').references(() => vendors.id),
    purchaseNumber: serial('purchase_number').notNull(),
    purchaseDate: timestamp('purchase_date').defaultNow(),
    expectedDate: timestamp('expected_date'),
    lastPaymentDate: timestamp('last_payment_date'),
    subtotal: integer('subtotal').notNull().default(0),
    taxAmount: integer('tax_amount').notNull().default(0),
    totalAmount: integer('total_amount').notNull().default(0),
    paidAmount: integer('paid_amount').notNull().default(0),
    balanceDue: integer('balance_due').notNull().default(0),
    discount: integer('discount').notNull().default(0),
    purchaseStatus: varchar('purchase_status', { length: 20 }).default('pending'),
    notes: text('notes'),
    paymentTerms: varchar('payment_terms', { length: 50 }),
   ...timestamps,
  }, (table) => ({
    businessPurchaseIdx: index('purchases_business_idx').on(table.businessId),
     balanceCheck: check('balance_check', sql`${table.balanceDue} = ${table.totalAmount} - ${table.paidAmount}`),
    paidAmountCheck: check('paid_amount_check', sql`${table.paidAmount} >= 0 AND ${table.paidAmount} <= ${table.totalAmount}`),
  }));
  
  export const purchaseItems = pgTable('purchase_items', {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
    purchaseId: uuid('purchase_id').references(() => purchases.id, { onDelete: 'cascade' }).notNull(),
    productId: uuid('product_id').references(() => products.id).notNull(),
    quantity: integer('quantity').notNull(),
    unitCost: integer('unit_cost').notNull().default(0),
    totalCost: integer('total_cost').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow(),
  }, (table) => ({
    purchaseItemIdx: index('purchase_items_purchase_idx').on(table.purchaseId),
  }));
  
  // --- Cost Centers ---
  export const costCenters = pgTable('cost_centers', {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),
    code: varchar('code', { length: 50 }).notNull(),
    description: text('description'),
    managerId: uuid('manager_id').references(() => employees.id),
    ...timestamps,
  }, (table) => ({
    businessCostCenterIdx: index('cost_centers_business_idx').on(table.businessId),
    nameIdx: index('cost_centers_name_idx').on(table.name),
  }));
  

  export const purchasesRelations = relations(purchases, ({ one, many }) => ({
    business: one(businesses, {
      fields: [purchases.businessId],
      references: [businesses.id],
      relationName: 'purchase_vendor', // Optional: provide a custom name for the relation
    }),
    vendor: one(vendors, {
      fields: [purchases.vendorId],
      references: [vendors.id],
    }),
    purchaseItems: many(purchaseItems),
    location: one(locations, {
      fields: [purchases.locationId],
      references: [locations.id],
    }),
    createdBy: one(users, {
      fields: [purchases.createdBy],
      references: [users.id],
    }),
     payments: many(payments, {
    relationName: 'purchase_payments',
  }),
  }));
  
  export const purchaseItemsRelations = relations(purchaseItems, ({ one }) => ({
    businesses: one(businesses, {
      fields: [purchaseItems.businessId],
      references: [businesses.id],
    }),
    purchase: one(purchases, {
      fields: [purchaseItems.purchaseId],
      references: [purchases.id],
    }),
    product: one(products, {
      fields: [purchaseItems.productId],
      references: [products.id],
    }),
  }));        