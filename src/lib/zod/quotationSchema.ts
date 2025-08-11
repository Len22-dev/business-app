import { z } from "zod";

export const quotationSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  customerId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  quotationNumber: z.string().max(100, { message: "Quotation number too long" }),
  quotationDate: z.date(),
  validUntil: z.date(),
  status: z.enum(['draft', 'sent', 'accepted', 'rejected', 'expired']).default('draft'),
  subtotal: z.number().int().min(0).default(0),
  taxAmount: z.number().int().min(0).default(0),
  discountAmount: z.number().int().min(0).default(0),
  totalAmount: z.number().int().min(0),
  notes: z.string().optional(),
  terms: z.string().optional(),
  convertedToSale: z.boolean().default(false),
  saleId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  createdBy: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const createQuotationSchema = quotationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateQuotationSchema = createQuotationSchema.partial();

export const quotationItemSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  quotationId: z.string().uuid({ message: "Invalid UUID format" }),
  productId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  item: z.string().min(1, { message: "Item name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  quantity: z.number().int().min(1, { message: "Quantity must be at least 1" }),
  unitPrice: z.number().int().min(0).default(0),
  discount: z.number().int().min(0).default(0),
  totalPrice: z.number().int().min(0).default(0),
  createdAt: z.date().optional(),
});

export const createQuotationItemSchema = quotationItemSchema.omit({
  id: true,
  createdAt: true,
});

export const updateQuotationItemSchema = createQuotationItemSchema.partial();