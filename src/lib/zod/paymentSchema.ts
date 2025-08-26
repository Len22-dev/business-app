import { z } from "zod";

export const paymentMethodEnum = z.enum(['cash', 'bank_transfer', 'card', 'cheque', 'mobile_money']);

export const paymentStatusEnum = z.enum([
  'pending',
  'paid',
  'failed',
  'cancelled',
  'refunded',
  'part_payment'
]);

export const sourceTypeEnum = z.enum([
  'sales',
  'purchase',
  'expense',
  'others'
]);

export const payerTypeEnum = z.enum([
  'customer',
  'vendor',
  'employee',
  'company',
  'others'
]);

export const allocationTypeEnum = z.enum([
  'invoice',
  'advance',
  'refund',
  'adjustment',
]);

export const paymentSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  paymentNumber: z.number().int().positive().optional(),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  sourceType: sourceTypeEnum,
  sourceId: z.string().uuid({ message: "Invalid UUID format" }),
  payerType: payerTypeEnum,
  payerId: z.string().uuid({ message: "Invalid UUID format" }),
  bankAccountId: z.string().uuid({ message: "Invalid UUID format" }),
  currencyCode: z.string().length(3, { message: "Currency code must be 3 characters" }).default('NGN').nullable().optional(),
  amount: z.number().int().min(1, { message: "Amount must be positive" }),
  paymentDate: z.date().optional().nullable(),
  paymentMethod: paymentMethodEnum,
  reference: z.string().max(100, { message: "Reference too long" }).optional().nullable(),
  checkNumber: z.string().max(50, { message: "Check number too long" }).optional().nullable(),
  cardLastFour: z.string().length(4, { message: "Card last four must be 4 digits" }).optional().nullable(),
  transactionId: z.string().max(100, { message: "Transaction ID too long" }).optional().nullable(),
  paymentStatus: paymentStatusEnum.default('pending').optional().nullable(),
  approvedBy: z.string().uuid({ message: "Invalid UUID format" }).optional().nullable(),
  approvedAt: z.date().optional().nullable(),
  createdBy: z.string().uuid({ message: "Invalid UUID format" }).optional().nullable(),
  notes: z.string().optional().nullable(),
  reconciled: z.boolean().default(false).nullable(),
  reconciledAt: z.date().optional().nullable(),
  createdAt: z.date().optional().nullable(),
  updatedAt: z.date().optional().nullable(),
  deletedAt: z.date().optional().nullable(),
});

export const createPaymentSchema = paymentSchema.omit({
  id: true,
  paymentNumber: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updatePaymentSchema = createPaymentSchema.partial();

export const paymentAllocationSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  paymentId: z.string().uuid({ message: "Invalid UUID format" }),
  allocationType: allocationTypeEnum,
  sourceTransactionId: z.string().uuid({ message: "Invalid UUID format" }),
  allocatedAmount: z.number().int().min(1, { message: "Allocated amount must be positive" }),
  notes: z.string().optional(),
  createdAt: z.date().optional(),
});

export const createPaymentAllocationSchema = paymentAllocationSchema.omit({
  id: true,
  createdAt: true,
});

export const updatePaymentAllocationSchema = createPaymentAllocationSchema.partial();

export const cashRegisterSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  locationId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  registerBy: z.string().uuid({ message: "Invalid UUID format" }),
  sessionNumber: z.string().max(100, { message: "Session number too long" }),
  startTime: z.date(),
  endTime: z.date().optional(),
  openingBalance: z.number().int().min(0).default(0),
  closingBalance: z.number().int().min(0).default(0),
  expectedClosing: z.number().int().min(0).default(0),
  totalSales: z.number().int().min(0).default(0),
  totalCash: z.number().int().min(0).default(0),
  totalCard: z.number().int().min(0).default(0),
  status: z.enum(['open', 'closed']).default('open'),
  notes: z.string().optional(),
  createdAt: z.date().optional(),
});

export const createCashRegisterSchema = cashRegisterSchema.omit({
  id: true,
  createdAt: true,
});

export const updateCashRegisterSchema = createCashRegisterSchema.partial();