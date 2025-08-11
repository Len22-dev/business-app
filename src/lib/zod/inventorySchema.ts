import { z } from "zod";

export const stockMovementEnum = z.enum(['in', 'out', 'adjustment']);
export const statusEnum = z.enum(['Pending', 'Confirmed', 'Cancelled', 'Partially_Fulfilled']);

export const inventorySchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  locationId: z.string().uuid({ message: "Invalid UUID format" }),
  productId: z.string().uuid({ message: "Invalid UUID format" }),
  inventoryLocationId: z.string().uuid({ message: "Invalid UUID format" }),
  onHandQuantity: z.number().int().min(0).default(0),
  onOrderQuantity: z.number().int().min(0).default(0),
  availableQuantity: z.number().int().min(0).default(0),
  reservedQuantity: z.number().int().min(0).default(0),
  reorderLevel: z.number().int().min(0).default(0),
  maxStockLevel: z.number().int().min(0).optional(),
  lastRestocked: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const createInventorySchema = inventorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateInventorySchema = createInventorySchema.partial();

export const stockMovementSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  productId: z.string().uuid({ message: "Invalid UUID format" }),
  locationId: z.string().uuid({ message: "Invalid UUID format" }),
  inventoryLocationId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  movementType: stockMovementEnum,
  status: statusEnum.default('Pending'),
  pendingQuantity: z.number().int().min(0).default(0),
  confirmedQuantity: z.number().int().min(0),
  unitCost: z.number().int().min(0).default(0),
  totalCost: z.number().int().min(0).default(0),
  referenceId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  referenceDocumentId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  referenceType: z.enum(['sale', 'purchase', 'adjustment']).optional(),
  notes: z.string().optional(),
  createdBy: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  createdAt: z.date().optional(),
});

export const createStockMovementSchema = stockMovementSchema.omit({
  id: true,
  createdAt: true,
});

export const updateStockMovementSchema = createStockMovementSchema.partial();

export const inventoryLocationSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  name: z.string().min(1, { message: "Location name is required" }),
  description: z.string().optional(),
  address: z.record(z.any()).optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const createInventoryLocationSchema = inventoryLocationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateInventoryLocationSchema = createInventoryLocationSchema.partial();

export const lotNumberSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  productId: z.string().uuid({ message: "Invalid UUID format" }),
  lotNumber: z.string().max(100, { message: "Lot number too long" }).min(1, { message: "Lot number is required" }),
  expirationDate: z.date().optional(),
  quantity: z.number().int().min(0).default(0),
  reservedQuantity: z.number().int().min(0).default(0),
  reorderLevel: z.number().int().min(0).default(0),
  maxStockLevel: z.number().int().min(0).optional(),
  location: z.string().optional(),
  lastRestocked: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const createLotNumberSchema = lotNumberSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateLotNumberSchema = createLotNumberSchema.partial();

export const serialNumberSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  productId: z.string().uuid({ message: "Invalid UUID format" }),
  serialNumber: z.string().max(100, { message: "Serial number too long" }).min(1, { message: "Serial number is required" }),
  lotNumberId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  status: z.string().default('active'),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const createSerialNumberSchema = serialNumberSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateSerialNumberSchema = createSerialNumberSchema.partial();