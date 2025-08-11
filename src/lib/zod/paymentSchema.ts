import { z } from "zod";

export const paymentMethodEnum = z.enum(['cash', 'bank_transfer', 'card', 'cheque', 'mobile_money']);

export const paymentStatusEnum = z.enum([
  'PENDING',
  'COMPLETED',
  'FAILED',
  'CANCELLED',
  'REFUNDED',
]);

export const sourceTypeEnum = z.enum([
  'SALES',
  'PURCHASE',
  'EXPENSE',
]);

export const payerTypeEnum = z.enum([
  'CUSTOMER',
  'VENDOR',
  'EMPLOYEE',
  'COMPANY',
]);

export const allocationTypeEnum = z.enum([
  'INVOICE',
  'ADVANCE',
  'REFUND',
  'ADJUSTMENT',
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
  currencyCode: z.string().length(3, { message: "Currency code must be 3 characters" }).default('NGN'),
  amount: z.number().int().min(1, { message: "Amount must be positive" }),
  paymentDate: z.date().optional(),
  paymentMethod: paymentMethodEnum,
  reference: z.string().max(100, { message: "Reference too long" }).optional(),
  checkNumber: z.string().max(50, { message: "Check number too long" }).optional(),
  cardLastFour: z.string().length(4, { message: "Card last four must be 4 digits" }).optional(),
  transactionId: z.string().max(100, { message: "Transaction ID too long" }).optional(),
  paymentStatus: paymentStatusEnum.default('PENDING'),
  approvedBy: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  approvedAt: z.date().optional(),
  createdBy: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  notes: z.string().optional(),
  reconciled: z.boolean().default(false),
  reconciledAt: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
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