import { z } from "zod";

export const invoiceStatusEnum = z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']);

export const invoiceSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  customerId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  saleId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  invoiceNumber: z.string().max(50, { message: "Invoice number too long" }).min(1, { message: "Invoice number is required" }),
  issueDate: z.date().optional(),
  dueDate: z.date(),
  subtotal: z.number().int().min(0).default(0),
  taxAmount: z.number().int().min(0).default(0),
  discountAmount: z.number().int().min(0).default(0),
  totalAmount: z.number().int().min(0).default(0),
  paidAmount: z.number().int().min(0).default(0),
  invoiceStatus: invoiceStatusEnum.default('draft'),
  notes: z.string().optional(),
  terms: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const createInvoiceSchema = invoiceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateInvoiceSchema = createInvoiceSchema.partial();

export const invoiceItemSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  invoiceId: z.string().uuid({ message: "Invalid UUID format" }),
  productId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  description: z.string().min(1, { message: "Description is required" }),
  quantity: z.number().int().min(1, { message: "Quantity must be at least 1" }),
  unitPrice: z.number().int().min(0),
  totalPrice: z.number().int().min(0),
  createdAt: z.date().optional(),
});

export const createInvoiceItemSchema = invoiceItemSchema.omit({
  id: true,
  createdAt: true,
});

export const updateInvoiceItemSchema = createInvoiceItemSchema.partial();