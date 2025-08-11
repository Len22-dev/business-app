import { pgTable, text, uuid, varchar, timestamp, integer, jsonb, index, pgEnum, serial, check } from "drizzle-orm/pg-core";
import { businesses, locations } from "./businesses-schema";
import { customers } from "./customer-schema";
import { products } from "./products-schema";
import { invoices } from "./invoice-schema";
import { relations, sql } from "drizzle-orm";
import { employees } from "./employees-schema";
import { payments } from "./payment-schema";
import { quotations } from "./quotations-schema";
import { inventoryLocations } from "./inventory-schema";

const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}

export const salesStatusEnum = pgEnum('sales_status', [
  'draft',
  'pending',
  'part_payment',
  'paid',
  'overdue',
  'cancelled',
]);
// Sales Management
export const sales = pgTable('sales', {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
    customerId: uuid('customer_id').references(() => customers.id).notNull(),
    locationId: uuid('location_id').references(() => locations.id, { onDelete: 'cascade' }).notNull(),
    quotationId: uuid('quotation_id'),
    saleNumber: serial('sale_number'),
    saleDate: timestamp('sale_date').defaultNow(),
    dueDate: timestamp('due_date'),
    subtotal: integer('subtotal').notNull().default(0),
    taxAmount: integer('tax_amount').default(0),
    discountAmount: integer('discount_amount').default(0),
    totalAmount: integer('total_amount').notNull().default(0),
    paidAmount: integer('paid_amount').default(0),
    balanceDue: integer('balance_due').default(0),
    lastPaymentDate: timestamp('last_payment_date'),
    salesStatus: salesStatusEnum('sales_status').default('draft'),
    paymentTerms: varchar('payment_terms', { length: 50 }),
    createdBy: uuid('created_by'),
    notes: text('notes'),
    metadata: jsonb('metadata'),
    ...timestamps,
  }, (table) => ({
    businessSaleIdx: index('sales_business_idx').on(table.businessId),
    saleNumberIdx: index('sales_number_idx').on(table.saleNumber),
    customerIdx: index('sales_customer_idx').on(table.customerId),
    saleDateIdx: index('sales_sale_date_idx').on(table.saleDate),
    salesStatusIdx: index('sales_status_idx').on(table.salesStatus),
     balanceCheck: check('balance_check', sql`${table.balanceDue} = ${table.totalAmount} - ${table.paidAmount}`),
    paidAmountCheck: check('paid_amount_check', sql`${table.paidAmount} >= 0 AND ${table.paidAmount} <= ${table.totalAmount}`),
  }));
  
  export const saleItems = pgTable('sale_items', {
    id: uuid('id').primaryKey().defaultRandom(),
    saleId: uuid('sale_id').references(() => sales.id, { onDelete: 'cascade' }).notNull(),
    productId: uuid('product_id').references(() => products.id).notNull(),
    inventoryLocationId: uuid('inventory_location_id').references(() => locations.id, { onDelete: 'cascade' }).notNull(),
    quantity: integer('quantity').notNull(),
    unitPrice: integer('unit_price').notNull().default(0),
    totalPrice: integer('total_price').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow(),
  }, (table) => ({
    saleItemIdx: index('sale_items_sale_idx').on(table.saleId),
    productIdx: index('sale_items_product_idx').on(table.productId),
  }));
  

  export const salesRelations = relations(sales, ({ one, many }) => ({
    business: one(businesses, {
      fields: [sales.businessId],
      references: [businesses.id],
    }),
    customer: one(customers, {
      fields: [sales.customerId],
      references: [customers.id],
    }),
    saleItems: many(saleItems),
    invoices: many(invoices),
    location: one(locations, {
      fields: [sales.locationId],
      references: [locations.id],
    }),
    quotation: one(quotations, {
      fields: [sales.quotationId],
      references: [quotations.id],
      relationName: 'sales_quotation',
    }),
     createdBy: one(employees, {
    fields: [sales.createdBy],
    references: [employees.id],
    relationName: 'sales_created_by',
  }),
  payments: many(payments, {
    relationName: 'sales_payments',
  }),
  }));
  
  export const saleItemsRelations = relations(saleItems, ({ one, }) => ({
    sale: one(sales, {
      fields: [saleItems.saleId],
      references: [sales.id],
    }),
    product: one(products, {
      fields: [saleItems.productId],
      references: [products.id],
    }),
    inventoryLocations: one(inventoryLocations, {
      fields: [saleItems.inventoryLocationId],
      references: [inventoryLocations.id],
    })
  }));    