import { z } from "zod";

export const returnSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  locationId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  returnNumber: z.string().max(100, { message: "Return number too long" }),
  returnDate: z.date(),
  returnType: z.enum(['sale_return', 'purchase_return']),
  originalTransactionId: z.string().uuid({ message: "Invalid UUID format" }),
  customerId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  vendorId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  reason: z.string().optional(),
  status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
  totalAmount: z.number().int().min(0).default(0),
  refundAmount: z.number().int().min(0).default(0),
  refundMethod: z.string().max(50, { message: "Refund method too long" }).optional(),
  processedBy: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  createdBy: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  createdAt: z.date().optional(),
});

export const createReturnSchema = returnSchema.omit({
  id: true,
  createdAt: true,
});

export const updateReturnSchema = createReturnSchema.partial();

export const returnItemSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  returnId: z.string().uuid({ message: "Invalid UUID format" }),
  productId: z.string().uuid({ message: "Invalid UUID format" }),
  quantity: z.number().int().min(1, { message: "Quantity must be at least 1" }),
  unitPrice: z.number().int().min(0).default(0),
  totalPrice: z.number().int().min(0).default(0),
  condition: z.enum(['good', 'damaged', 'defective']).default('good'),
  createdAt: z.date().optional(),
});

export const createReturnItemSchema = returnItemSchema.omit({
  id: true,
  createdAt: true,
});

export const updateReturnItemSchema = createReturnItemSchema.partial();