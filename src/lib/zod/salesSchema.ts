import { z } from "zod";

export const salesStatusEnum = z.enum([
  'draft',
  'pending',
  'part_payment',
  'paid',
  'overdue',
  'cancelled',
]);

export const salesSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  customerId: z.string().uuid({ message: "Invalid UUID format" }),
  locationId: z.string().uuid({ message: "Invalid UUID format" }),
  quotationId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  saleNumber: z.number().optional(),
  saleDate: z.date().optional(),
  dueDate: z.date().optional(),
  subtotal: z.number().int().min(0).default(0),
  taxAmount: z.number().int().min(0).default(0),
  discountAmount: z.number().int().min(0).default(0),
  totalAmount: z.number().int().min(0).default(0),
  paidAmount: z.number().int().min(0).default(0),
  balanceDue: z.number().int().min(0).default(0),
  lastPaymentDate: z.date().optional(),
  salesStatus: salesStatusEnum.default('draft'),
  paymentTerms: z.string().max(50, { message: "Payment terms too long" }).optional(),
  createdBy: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  notes: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const createSalesSchema = salesSchema.omit({
  id: true,
  saleNumber: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateSalesSchema = createSalesSchema.partial();

export const saleItemSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  saleId: z.string().uuid({ message: "Invalid UUID format" }),
  productId: z.string().uuid({ message: "Invalid UUID format" }),
  inventoryLocationId: z.string().uuid({ message: "Invalid UUID format" }),
  quantity: z.number().int().min(1, { message: "Quantity must be at least 1" }),
  unitPrice: z.number().int().min(0).default(0),
  totalPrice: z.number().int().min(0).default(0),
  createdAt: z.date().optional(),
});

export const createSaleItemSchema = saleItemSchema.omit({
  id: true,
  createdAt: true,
});

export const updateSaleItemSchema = createSaleItemSchema.partial();

export const saleFormSchema = z.object({
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  customerName: z.string().min(1, { message: "Customer name is required" }),
  description: z.string().min(1, { message: "Description is required" }).optional(),
  status: z.enum(['pending', 'part_payment', 'paid', 'failed', 'refunded']).default('pending'),
  paymentMethod: z.enum(['cash', 'bank_transfer', 'card', 'mobile_money', 'cheque']).default('cash'),
  bankId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  cardId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  totalAmount: z.number().int().min(0).default(0),
  paidAmount: z.number().int().min(0).default(0),
  balanceDue: z.number().int().min(0).default(0),
  saleDate: z.date().optional(),
  dueDate: z.date().optional(),
  saleNumber: z.number().optional(),
  taxAmount: z.number().int().min(0).default(0),
  discountAmount: z.number().int().min(0).default(0),
});