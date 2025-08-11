import { z } from "zod";

export const bankSchema = z.object({
    id: z
        .string()
        .uuid(),
    businessId: z
        .string()
        .uuid(),
    accountId: z
                .string()
                .uuid(),
    bankName: z
                .string()
                .min(1, {message: 'Bank name is required'}),
    accountName: z
                .string()
                .min(1, {message: 'Bank name is required'}),
  accountNumber: z
                .string()
                .min(1, {message: 'Account number is required'}),
  accountType: z
                .string()
                .min(1, {message: 'Account type is required'}),
  openingBalance: z
                .number()
                .min(1, {message: 'Account balance is required'}),
  currentBalance: z
                .number()
                .min(1, {message: 'Account balance is required'}),
  currency: z
                .string()
                .min(1, {message: 'Account currency is required'}),
  isActive: z
                .boolean()
                .optional(),
  createdAt: z
            .date()
            .optional(),
  updatedAt: z
            .date()
            .optional(),
  deletedAt: z
            .date()
            .optional(),
});

export const createBankSchema = bankSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});

export const updateBankSchema = createBankSchema.omit({accountId: true});

export const bankTransactionSchema = z.object({
    id: z
        .string()
        .uuid(),
    businessId: z
        .string()
        .uuid(),
    bankId: z
        .string()
        .uuid(),
    createdBy: z
        .string()
        .uuid(),
    type: z
        .enum(["sales", "payment", "payroll", "purchase", "expense", "journal", "transfer"]),
    category: z
        .enum(["credit", "debit"]),
    amount: z
                .number()
                .min(1, {message: 'Amount is required'})
                .positive({message: 'Amount must be greater than zero(0)'}),
    balance: z
                .number()
                .min(1, {message: 'Account balance is required'}),
    transactionDate: z
        .date(),
    transactionNumber: z
        .number()
        .min(1, {message: 'Transaction number is required'}),
    description: z
        .string(),
    reference: z
        .string()
        .optional(),
    isReconciled: z
        .boolean()
        .optional(),
    reconciledAt: z
        .date()
        .optional(),
    createdAt: z
            .date()
            .optional(),
  updatedAt: z
            .date()
            .optional(),
  deletedAt: z
            .date()
            .optional(),
});

export const createBankTransactionSchema = bankTransactionSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});

export const updateBankTransactionSchema = createBankTransactionSchema;