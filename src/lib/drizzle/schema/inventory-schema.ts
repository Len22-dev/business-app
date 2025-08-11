import { pgTable, text, uuid, varchar, timestamp, boolean, integer, jsonb, index, uniqueIndex, pgEnum } from "drizzle-orm/pg-core";
import { businesses, locations } from "./businesses-schema";
import { users } from "./users-schema";
import { products } from "./products-schema";
import { relations } from "drizzle-orm";
import { documents } from "./documents-schema";

const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}

export const stockMovementEnum = pgEnum('stock_movement', ['in', 'out', 'adjustment'])
export const statusEnum = pgEnum('status', ['Pending', 'Confirmed', 'Cancelled', 'Partially_Fulfilled']);


export const inventory = pgTable('inventory', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
  locationId: uuid('location_id').references(() => locations.id, { onDelete: 'cascade' }).notNull(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  inventoryLocationId: uuid('location_id').references(() => inventoryLocations.id, { onDelete: 'cascade' }).notNull(),
  onHandQuantity: integer('on_hand_quantity').default(0),
  onOrderQuantity: integer('on_order_quantity').default(0),
  availableQuantity: integer('available_quantity').default(0),
  reservedQuantity: integer('reserved_quantity').default(0),
  reorderLevel: integer('reorder_level').default(0),
  maxStockLevel: integer('max_stock_level'),
  lastRestocked: timestamp('last_restocked'),
  ...timestamps,
}, (table) => ({
  businessInventoryIdx: index('inventory_business_idx').on(table.businessId),
  productInventoryIdx: uniqueIndex('inventory_product_idx').on(table.productId),
}));

export const stockMovements = pgTable('stock_movements', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  locationId: uuid('location_id').references(() => locations.id, { onDelete: 'cascade' }).notNull(),
  inventoryLocationId: uuid('location_id').references(() => inventoryLocations.id, { onDelete: 'cascade' }),
  movementType: stockMovementEnum('movement_type').notNull(),
  status: statusEnum('status').default('Pending'), // 'pending', 'confirmed', 'cancelled'
  pendingQuantity: integer('pending_quantity').default(0),
  confirmedQuantity: integer('confirmed_quantity').notNull(),
  unitCost: integer('unit_cost').notNull().default(0),
  totalCost: integer('total_cost').notNull().default(0),
  referenceId: uuid('reference_id'), // Links to sales, purchases, or adjustments
  referenceDocumentId: uuid('reference_document_id').references(() => documents.id), // Optional document ID for reference
  referenceType: text('reference_type'), // 'sale', 'purchase', 'adjustment'
  notes: text('notes'),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  productIdx: index('stock_movements_product_idx').on(table.productId),
  dateIdx: index('stock_movements_date_idx').on(table.createdAt),
  movementTypeIdx: index('stock_movements_movement_type_idx').on(table.movementType),
  referenceTypeIdx: index('stock_movements_reference_type_idx').on(table.referenceType),
  referenceIdIdx: index('stock_movements_reference_id_idx').on(table.referenceId),
}));

// --- Multi-location Inventory ---
export const inventoryLocations = pgTable('inventory_locations', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  address: jsonb('address'),
  isActive: boolean('is_active').default(true),
  ...timestamps,
}, (table) => ({
  businessLocationIdx: index('locations_business_idx').on(table.businessId),
  nameIdx: index('locations_name_idx').on(table.name),
}));

// --- Lot Tracking ---
export const lotNumbers = pgTable('lot_numbers', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  lotNumber: varchar('lot_number', { length: 100 }).notNull(),
  expirationDate: timestamp('expiration_date'),
  quantity: integer('quantity').notNull().default(0),
  reservedQuantity: integer('reserved_quantity').default(0),
  reorderLevel: integer('reorder_level').default(0),
  maxStockLevel: integer('max_stock_level'),
  location: text('location'),
  lastRestocked: timestamp('last_restocked'),
  ...timestamps,
}, (table) => ({
  businessLotNumberIdx: index('lot_numbers_business_idx').on(table.businessId),
  productLotNumberIdx: index('lot_numbers_product_idx').on(table.productId),
}));

// --- serial numbers ---
export const serialNumbers = pgTable('serial_numbers', {
  id: uuid('id').primaryKey().defaultRandom(),
  businessId: uuid('business_id').references(() => businesses.id, { onDelete: 'cascade' }).notNull(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  serialNumber: varchar('serial_number', { length: 100 }).notNull(),
  lotNumberId: uuid('lot_number_id').references(() => lotNumbers.id),
  status: text('status').notNull().default('active'),
  isActive: boolean('is_active').default(true),
  ...timestamps,
}, (table) => ({
  businessSerialNumberIdx: index('serial_numbers_business_idx').on(table.businessId),
  productSerialNumberIdx: index('serial_numbers_product_idx').on(table.productId),
}));


export const inventoryRelations = relations(inventory, ({ one }) => ({
  business: one(businesses, {
    fields: [inventory.businessId],
    references: [businesses.id],
  }),
  product: one(products, {
    fields: [inventory.productId],
    references: [products.id],
  }),
  location: one(locations, {
    fields: [inventory.locationId],
    references: [locations.id],
  }),
  inventoryLocations: one(inventoryLocations, {
    fields: [inventory.inventoryLocationId],
    references: [inventoryLocations.id],
  }),
}));


export const stockMovementsRelations = relations(stockMovements, ({ one }) => ({
  product: one(products, {
    fields: [stockMovements.productId],
    references: [products.id],
  }),
  createdByUser: one(users, {
    fields: [stockMovements.createdBy],
    references: [users.id],
  }),
  location: one(locations, {
    fields: [stockMovements.locationId],
    references: [locations.id],
  }),
  inventoryLocations: one(inventoryLocations, {
    fields: [stockMovements.inventoryLocationId],
    references: [inventoryLocations.id],
  }),
}));

export const inventoryLocationsRelations = relations(inventoryLocations, ({ one }) => ({
  business: one(businesses, {
    fields: [inventoryLocations.businessId],
    references: [businesses.id],
  }),
  // Note: Link to inventory by location field
  inventory: one(inventory, {
    fields: [inventoryLocations.id],
    references: [inventory.inventoryLocationId],
  }),
}));

export const lotNumbersRelations = relations(lotNumbers, ({ one }) => ({
  business: one(businesses, {
    fields: [lotNumbers.businessId],
    references: [businesses.id],
  }),
  product: one(products, {
    fields: [lotNumbers.productId],
    references: [products.id],
  }),
  // Note: Link to stockMovements by referenceId/referenceType
}));