import { boolean, date, integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { businesses } from "./businesses-schema";
import { customers } from "./customer-schema";
import { sales } from "./sales-schema";
import { employees } from "./employees-schema";
import { products } from "./products-schema";
import { relations } from "drizzle-orm";

// Quotations/estimates
export const quotations = pgTable('quotations', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessId: uuid('business_id').notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  customerId: uuid('customer_id').references(() => customers.id),
  quotationNumber: varchar('quotation_number', { length: 100 }).notNull(),
  quotationDate: date('quotation_date').notNull(),
  validUntil: date('valid_until').notNull(),
  status: varchar('status', { length: 20 }).default('draft'), // draft, sent, accepted, rejected, expired
  subtotal: integer('subtotal').notNull().default(0),
  taxAmount: integer('tax_amount').default(0),
  discountAmount: integer('discount_amount').default(0),
  totalAmount: integer('total_amount').notNull(),
  notes: text('notes'),
  terms: text('terms'),
  convertedToSale: boolean('converted_to_sale').default(false),
  saleId: uuid('sale_id').references(() => sales.id),
  createdBy: uuid('created_by').references(() => employees.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const quotationItems = pgTable('quotation_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessId: uuid('business_id').notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  quotationId: uuid('quotation_id').notNull().references(() => quotations.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').references(() => products.id, {onDelete: 'cascade' }),
  item: text('item').notNull(),
  description: text('description').notNull(),
  quantity: integer('quantity').notNull().default(0),
  unitPrice: integer('unit_price').notNull().default(0),
  discount: integer('discount').default(0),
  totalPrice: integer('total_price').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const quotationsRelations = relations(quotations, ({one, many}) => ({
    business: one(businesses,{
        fields: [quotations.businessId],
        references: [businesses.id]
    }),
    customer: one(customers,{
        fields: [quotations.customerId],
        references: [customers.id]
    }),
    createdBy: one(employees,{
        fields: [quotations.createdBy],
        references: [employees.id]
    }),
    sales: one(sales,{
        fields: [quotations.saleId],
        references: [sales.id]
    }),
    quotationItems: many(quotationItems)
}));

export const quotationItemsRelations = relations(quotationItems, ({one}) => ({
    business: one(businesses,{
        fields: [quotationItems.businessId],
        references: [businesses.id]
    }),
    quotation: one(quotations,{
        fields: [quotationItems.quotationId],
        references: [quotations.id]
    }),
    product: one(products,{
        fields: [quotationItems.productId],
        references: [products.id]
    }),
}))
