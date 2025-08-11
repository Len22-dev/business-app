import { boolean, date, integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { employees } from "./employees-schema";
import { businesses, locations } from "./businesses-schema";
import { relations } from "drizzle-orm";


// Asset management
export const assetCategories = pgTable('asset_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessId: uuid('business_id').notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  depreciationRate: integer('depreciation_rate').default(0),
  depreciationMethod: varchar('depreciation_method', { length: 20 }).default('straight_line'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const assets = pgTable('assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessId: uuid('business_id').notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id').references(() => assetCategories.id, {onDelete: 'cascade'}),
  locationId: uuid('location_id').references(() => locations.id, {onDelete: 'cascade'}),
  assetTag: varchar('asset_tag', { length: 100 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  serialNumber: varchar('serial_number', { length: 100 }),
  model: varchar('model', { length: 100 }),
  manufacturer: varchar('manufacturer', { length: 100 }),
  purchaseDate: date('purchase_date'),
  purchasePrice: integer('purchase_price').default(0),
  currentValue: integer('current_value').default(0),
  condition: varchar('condition', { length: 50 }).default('good'), // excellent, good, fair, poor
  status: varchar('status', { length: 20 }).default('active'), // active, disposed, sold, stolen
  assignedTo: uuid('assigned_to').references(() => employees.id),
  warrantyExpiry: date('warranty_expiry'),
  lastMaintenanceDate: date('last_maintenance_date'),
  nextMaintenanceDate: date('next_maintenance_date'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const assetRelations = relations(assets, ({one}) => ({
    business: one(businesses, {
        fields: [assets.businessId],
    references: [businesses.id]
    }),
  category: one(assetCategories, {
    fields: [assets.categoryId],
    references: [assetCategories.id],
  }),
  location: one(locations, {
    fields: [assets.locationId],
    references: [locations.id],
  }),
  assignedTo: one(employees, {
    fields: [assets.assignedTo],
    references: [employees.id],
  }),
}))

export const assetCategoriesRelations = relations(assetCategories, ({one, many}) => ({
    business: one(businesses, {
        fields: [assetCategories.businessId],
        references: [businesses.id]
    }),
    assets: many(assets)
}));