import { z } from "zod";

export const expenseStatusEnum = z.enum([
  'DRAFT',
  'SUBMITTED',
  'APPROVED',
  'REJECTED',
  'PAID',
]);

export const expenseSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  categoryId: z.string().uuid({ message: "Invalid UUID format" }),
  reference: z.string().max(100, { message: "Reference too long" }).optional(),
  totalAmount: z.number().int().min(0).default(0),
  paidAmount: z.number().int().min(0).default(0),
  balanceDue: z.number().int().min(0).default(0),
  lastPaymentDate: z.date().optional(),
  receipt: z.string().url({ message: "Invalid receipt URL" }).optional(),
  isReimbursed: z.boolean().default(false),
  isReimbursable: z.boolean().default(false),
  isRecurring: z.boolean().default(false),
  recurringFrequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']).optional(),
  createdBy: z.string().uuid({ message: "Invalid UUID format" }),
  approvedBy: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  approvedAt: z.date().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const createExpenseSchema = expenseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateExpenseSchema = createExpenseSchema.partial();

export const expenseItemSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  expenseId: z.string().uuid({ message: "Invalid UUID format" }),
  expenseStatus: expenseStatusEnum.default('DRAFT'),
  expenseDate: z.date(),
  description: z.string().min(1, { message: "Description is required" }),
  amount: z.number().int().min(1, { message: "Amount must be positive" }),
  categoryId: z.string().uuid({ message: "Invalid UUID format" }),
  receiptUrl: z.string().max(500, { message: "Receipt URL too long" }).url({ message: "Invalid receipt URL" }).optional(),
  createdAt: z.date().optional(),
});

export const createExpenseItemSchema = expenseItemSchema.omit({
  id: true,
  createdAt: true,
});

export const updateExpenseItemSchema = createExpenseItemSchema.partial();