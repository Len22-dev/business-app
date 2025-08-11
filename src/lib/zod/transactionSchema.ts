import { z } from "zod";

export const transactionTypeEnum = z.enum(['sales', 'payment', 'payroll', 'purchase', 'expense', 'journal', 'transfer']);
export const transactionStatusEnum = z.enum(['draft', 'pending', 'approved', 'rejected', 'completed', 'cancelled', 'failed']);

export const transactionSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  categoryId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  transactionNumber: z.number().int().positive().optional(),
  transactionType: transactionTypeEnum,
  totalAmount: z.number().int().min(0).default(0),
  transactionDate: z.date().optional(),
  referenceId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
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