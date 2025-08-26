import { z } from "zod";
export const transactionTypeEnum = z.enum(['sales', 'payment', 'payroll', 'purchase', 'expense', 'journal', 'transfer']);
export const entityTypeEnum = z.enum(['customer', 'vendor', 'bank', 'product', 'employee', 'location', 'other']);
export const transactionStatusEnum = z.enum(['draft', 'pending', 'approved', 'rejected', 'completed', 'cancelled', 'failed']);

export const transactionSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  categoryId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  transactionNumber: z.number().int().positive().optional(),
  transactionType: transactionTypeEnum,
  totalAmount: z.number().int().min(0).default(0),
  transactionDate: z.date().optional(),
  entityId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  entityType: entityTypeEnum.default('customer'),
  referenceNumber: z.string().max(255, { message: "Reference number too long" }).optional(),
  transactionStatus: transactionStatusEnum.default('draft'),
  createdBy: z.string().uuid({ message: "Invalid UUID format" }),
  approvedBy: z.string().uuid({ message: "Invalid UUID format" }),
  attachments: z.array(z.string().url()).optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const createTransactionSchema = transactionSchema.omit({
  id: true,
  transactionNumber: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const transactionLineItemSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  transactionId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  productId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  subtotalAmount: z.number().int().min(0).default(0),
  item: z.string().min(1, { message: "Item name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  quantity: z.number().int().min(0).default(0),
  unitAmount: z.number().int().min(0).default(0),
  taxAmount: z.number().int().min(0).default(0),
  discountAmount: z.number().int().min(0).default(0),
  metadata: z.record(z.any()).optional(),
});

export const createTransactionLineItemSchema = transactionLineItemSchema.omit({
  id: true,
});

export const updateTransactionLineItemSchema = createTransactionLineItemSchema.partial();

export const recurringTransactionSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  locationId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  name: z.string().max(255, { message: "Name too long" }).min(1, { message: "Name is required" }),
  transactionType: z.string().max(50, { message: "Transaction type too long" }),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  amount: z.number().int().min(0).default(0),
  nextDate: z.date(),
  endDate: z.date().optional(),
  categoryId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  entityId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  lastProcessed: z.date().optional(),
  createdBy: z.string().uuid({ message: "Invalid UUID format" }),
  updatedBy: z.string().uuid({ message: "Invalid UUID format" }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const createRecurringTransactionSchema = recurringTransactionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateRecurringTransactionSchema = createRecurringTransactionSchema.partial();


export const createTransactionLineItemSchemas = transactionLineItemSchema.omit({
  id: true,
});

export const updateTransactionLineItemSchemas = createTransactionLineItemSchemas.partial();

// Combined schema for transaction with line items (for forms)
export const transactionWithItemsSchema = createTransactionSchema.merge(
  createTransactionLineItemSchemas.pick({
    item: true,
    description: true,
    quantity: true,
    unitAmount: true,
    taxAmount: true,
    discountAmount: true,
    subtotalAmount: true,
  })
);
export const fullTransactionWithItemsSchema = transactionSchema.merge(
  transactionLineItemSchema.pick({
    item: true,
    description: true,
    quantity: true,
    unitAmount: true,
    taxAmount: true,
    discountAmount: true,
    subtotalAmount: true,
  })
)

// Form-specific schema with additional validation
export const transactionFormSchemas = transactionWithItemsSchema.extend({
  receiptUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
}).refine((data) => {
  // Ensure total amount matches calculated amount
  const subtotal = (data.unitAmount || 0) * (data.quantity || 1);
  const calculatedTotal = subtotal + (data.taxAmount || 0) - (data.discountAmount || 0);
  return Math.abs((data.totalAmount || 0) - calculatedTotal) < 0.01;
}, {
  message: "Total amount doesn't match calculated amount",
  path: ["totalAmount"],
});

export const updateTransactionFormSchema = fullTransactionWithItemsSchema.partial()


export const createRecurringTransactionSchemas = recurringTransactionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateRecurringTransactionSchemas = createRecurringTransactionSchemas.partial();

// Export types
export type Transaction = z.infer<typeof transactionSchema>;
export type CreateTransactionData = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionData = z.infer<typeof updateTransactionSchema>;
export type TransactionLineItem = z.infer<typeof transactionLineItemSchema>;
export type CreateTransactionLineItemData = z.infer<typeof createTransactionLineItemSchemas>;
export type TransactionWithItems = z.infer<typeof transactionWithItemsSchema>;
export type FullTransactionWithItems = z.infer<typeof fullTransactionWithItemsSchema>;
export type TransactionFormData = z.infer<typeof transactionFormSchemas>;
export type updateTransactionFormSchemas = z.infer<typeof updateTransactionFormSchema>