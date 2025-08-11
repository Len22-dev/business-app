import { pgTable, text, uuid, varchar, timestamp, integer, index, uniqueIndex, pgEnum } from "drizzle-orm/pg-core";
import { businesses } from "./businesses-schema";
import { customers } from "./customer-schema";
import { sales } from "./sales-schema";
import { products } from "./products-schema";
import { payments } from "./payment-schema";  
import { relations } from "drizzle-orm";

export const invoiceStatusEnum = pgEnum('invoice_status', ['draft', 'sent', 'paid', 'overdue', 'cancelled']);

const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}

export const invoices = pgTable('invoices', {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
    customerId: uuid('customer_id').references(() => customers.id),
    saleId: uuid('sale_id').references(() => sales.id),
    invoiceNumber: varchar('invoice_number', { length: 50 }).notNull(),
    issueDate: timestamp('issue_date').defaultNow(),
    dueDate: timestamp('due_date').notNull(),
    subtotal: integer('subtotal').notNull().default(0),
    taxAmount: integer('tax_amount').default(0),
    discountAmount: integer('discount_amount').default(0),
    totalAmount: integer('total_amount').notNull().default(0),
    paidAmount: integer('paid_amount').default(0),
    invoiceStatus: invoiceStatusEnum('invoice_status').default('draft'),
    notes: text('notes'),
    terms: text('terms'),
    ...timestamps,
  }, (table) => ({
    businessInvoiceIdx: index('invoices_business_idx').on(table.businessId),
    invoiceNumberIdx: uniqueIndex('invoices_number_idx').on(table.businessId, table.invoiceNumber),
  }));
  
  export const invoiceItems = pgTable('invoice_items', {
    id: uuid('id').primaryKey().defaultRandom(),
    invoiceId: uuid('invoice_id').references(() => invoices.id, { onDelete: 'cascade' }).notNull(),
    productId: uuid('product_id').references(() => products.id),
    description: text('description').notNull(),
    quantity: integer('quantity').notNull(),
    unitPrice: integer('unit_price').notNull(),
    totalPrice: integer('total_price').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  }, (table) => ({
    invoiceItemIdx: index('invoice_items_invoice_idx').on(table.invoiceId),
  }));
  

  export const invoicesRelations = relations(invoices, ({ one, many }) => ({
    business: one(businesses, {
      fields: [invoices.businessId],
      references: [businesses.id],
    }),
    customer: one(customers, {
      fields: [invoices.customerId],
      references: [customers.id],
    }),
    sale: one(sales, {
      fields: [invoices.saleId],
      references: [sales.id],
    }),
    invoiceItems: many(invoiceItems),
    payments: many(payments),
  }));
  
  export const invoiceItemsRelations = relations(invoiceItems, ({ one }) => ({
    invoice: one(invoices, {
      fields: [invoiceItems.invoiceId],
      references: [invoices.id],
    }),
    product: one(products, {
      fields: [invoiceItems.productId],
      references: [products.id],
    }),
  }));
  