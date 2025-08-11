import { date, integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { businesses, locations} from "./businesses-schema";
import { employees } from "./employees-schema";
import { customers } from "./customer-schema";
import { vendors } from "./vendor-schema";
import { products } from "./products-schema";
import { relations } from "drizzle-orm";

// Return/refund management
export const returns = pgTable('returns', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessId: uuid('business_id').notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  locationId: uuid('location_id').references(() => locations.id, { onDelete: 'cascade' }),
  returnNumber: varchar('return_number', { length: 100 }).notNull(),
  returnDate: date('return_date').notNull(),
  returnType: varchar('return_type', { length: 20 }).notNull(), // sale_return, purchase_return
  originalTransactionId: uuid('original_transaction_id').notNull(), // sale_id or purchase_id
  customerId: uuid('customer_id').references(() => customers.id),
  vendorId: uuid('vendor_id').references(() => vendors.id),
  reason: text('reason'),
  status: varchar('status', { length: 20 }).default('pending'), // pending, approved, rejected
  totalAmount: integer('total_amount').notNull().default(0),
  refundAmount: integer('refund_amount').default(0),
  refundMethod: varchar('refund_method', { length: 50 }),
  processedBy: uuid('processed_by').references(() => employees.id),
  createdBy: uuid('created_by').references(() => employees.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const returnItems = pgTable('return_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessId: uuid('business_id').notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  returnId: uuid('return_id').notNull().references(() => returns.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull().default(0),
  unitPrice: integer('unit_price').notNull().default(0),
  totalPrice: integer('total_price').notNull().default(0),
  condition: varchar('condition', { length: 50 }).default('good'), // good, damaged, defective
  createdAt: timestamp('created_at').defaultNow(),
});

export const returnsRelations = relations(returns,({one, many}) => ({
    businesss: one(businesses,{
        fields: [returns.businessId],
        references: [businesses.id]
    }),
    employees: one(employees,{
        fields: [returns.processedBy],
        references: [employees.id]
    }),
    customers: one(customers,{
        fields: [returns.customerId],
        references: [customers.id]
    }),
    vendors: one(vendors,{
        fields: [returns.vendorId],
        references: [vendors.id]
    }),
    location: one(locations,{
        fields: [returns.locationId],
        references: [locations.id]
    }),
    returnItems: many(returnItems)
}));

export const returnItemsRelations = relations(returnItems,({one}) => ({
    businesss: one(businesses,{
        fields: [returnItems.businessId],
        references: [businesses.id]
    }),
    returns: one(returns,{
        fields: [returnItems.returnId],
        references: [returns.id]
    }),
    products: one(products,{
        fields: [returnItems.productId],
        references: [products.id]
    })
}))