import { z } from "zod";

export const purchaseStatusEnum = z.enum([
  'DRAFT',
  'PENDING',
  'PARTIAL_PAID',
  'PAID',
  'OVERDUE',
  'CANCELLED',
]);

export const purchaseSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  createdBy: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  locationId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  vendorId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  purchaseNumber: z.number().int().positive().optional(),
  purchaseDate: z.date().optional(),
  expectedDate: z.date().optional(),
  lastPaymentDate: z.date().optional(),
  subtotal: z.number().int().min(0).default(0),
  taxAmount: z.number().int().min(0).default(0),
  totalAmount: z.number().int().min(0).default(0),
  paidAmount: z.number().int().min(0).default(0),
  balanceDue: z.number().int().min(0).default(0),
  discount: z.number().int().min(0).default(0),
  purchaseStatus: z.string().max(20).default('pending'),
  notes: z.string().optional(),
  paymentTerms: z.string().max(50, { message: "Payment terms too long" }).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const createPurchaseSchema = purchaseSchema.omit({
  id: true,
  purchaseNumber: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updatePurchaseSchema = createPurchaseSchema.partial();

export const purchaseItemSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  purchaseId: z.string().uuid({ message: "Invalid UUID format" }),
  productId: z.string().uuid({ message: "Invalid UUID format" }),
  quantity: z.number().int().min(1, { message: "Quantity must be at least 1" }),
  unitCost: z.number().int().min(0).default(0),
  totalCost: z.number().int().min(0).default(0),
  createdAt: z.date().optional(),
});

export const createPurchaseItemSchema = purchaseItemSchema.omit({
  id: true,
  createdAt: true,
});

export const updatePurchaseItemSchema = createPurchaseItemSchema.partial();

export const costCenterSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  name: z.string().min(1, { message: "Cost center name is required" }),
  code: z.string().max(50, { message: "Code too long" }).min(1, { message: "Code is required" }),
  description: z.string().optional(),
  managerId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const createCostCenterSchema = costCenterSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateCostCenterSchema = createCostCenterSchema.partial();