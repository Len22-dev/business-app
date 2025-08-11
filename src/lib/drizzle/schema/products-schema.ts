import { pgTable, text, uuid, varchar, boolean, index, jsonb, integer, timestamp } from "drizzle-orm/pg-core";
import { businesses } from "./businesses-schema";
import { invoiceItems } from "./invoice-schema";
import { relations } from "drizzle-orm";
import { inventory, lotNumbers, stockMovements } from "./inventory-schema";
import { saleItems } from "./sales-schema";
import { purchaseItems } from "./purchase-schema";
import { transactions } from "./transactions-schema";
import { expenses } from "./expenses-schema";

const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}

export const categories = pgTable('categories', {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),
    description: text('description'),
    parentId: uuid('parent_id').references(() => categories.id),
    type: varchar('type', { length: 20 }).notNull(), // 'product', 'expense', 'income'
    isActive: boolean('is_active').default(true),
    ...timestamps,
  }, (table) => ([
     index('categories_business_idx').on(table.businessId),
  ]));
  
  
  
  export const products = pgTable('products', {
    id: uuid('id').primaryKey().defaultRandom(),
    businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
    categoryId: uuid('category_id').references(() => categories.id),
    name: text('name').notNull(),
    description: text('description'),
    sku: varchar('sku', { length: 100 }),
    barcode: varchar('barcode', { length: 100 }),
    unitPrice: integer('unit_price').notNull().default(0),
    costPrice: integer('cost_price').default(0).notNull(),
    images: jsonb('images'), // Array of image URLs
    specifications: jsonb('specifications'),
    isActive: boolean('is_active').default(true),
    trackInventory: boolean('track_inventory').default(true),
    ...timestamps,
  }, (table) => ({
    businessProductIdx: index('products_business_idx').on(table.businessId),
    skuIdx: index('products_sku_idx').on(table.sku),
  }));

  // Product variants
export const productVariants = pgTable('product_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessId: uuid('business_id').notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  variantName: varchar('variant_name', { length: 255 }).notNull(),
  sku: varchar('sku', { length: 100 }).notNull(),
  attributes: jsonb('attributes'), // {color: 'red', size: 'large'}
  costPrice: integer('cost_price').default(0),
  sellingPrice: integer('selling_price').notNull().default(0),
  currentStock: integer('current_stock').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

  export const categoriesRelations = relations(categories, ({ one, many }) => ({
    business: one(businesses, {
      fields: [categories.businessId],
      references: [businesses.id],
    }),
    parent: one(categories, {
      fields: [categories.parentId],
      references: [categories.id],
      relationName: 'parent_child_categories',
    }),
    children: many(categories, {
      relationName: 'parent_child_categories',
    }),
    products: many(products),
    transactions: many(transactions),
    expenses: many(expenses),
  }));
  
  export const productsRelations = relations(products, ({ one, many }) => ({
    business: one(businesses, {
      fields: [products.businessId],
      references: [businesses.id],
    }),
    category: one(categories, {
      fields: [products.categoryId],
      references: [categories.id],
    }),
    inventory: many(inventory),
    stockMovements: many(stockMovements),
    lotNumbers: many(lotNumbers),
    transactions: many(transactions),
    saleItems: many(saleItems),
    purchaseItems: many(purchaseItems),
    invoiceItems: many(invoiceItems),
  }));

  export const productVariantsRelations = relations(productVariants, ({ one }) => ({
    business: one(businesses, {
      fields: [productVariants.businessId],
      references: [businesses.id],
    }),
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
  }))
  