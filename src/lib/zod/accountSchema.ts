import { z } from "zod";

export const accountSchema = z.object({
    id: z
        .string()
        .uuid({message: 'Invalid UUID format'}),
    businessId: z
        .string()
        .uuid({message: 'Invalid UUID format'}),
    parentId: z
        .string()
        .uuid({message: 'Invalid UUID format'})
        .optional(),
    code: z
        .string()
        .optional(),
    name: z
        .string()
        .min(1, {message: 'Name is required'}),
    accountType: z
                .enum(["asset", "liability", "equity", "income", "expense", "accounts_receivable", "accounts_payable", "bank", "cash", "other"]),
    description: z
                .string()
                .optional(),
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

export const createAccountSchema = accountSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true
});

export const updateAccountSchema = createAccountSchema;

export const journalEntries = z.object({
    id: z
        .string()
        .uuid({message: 'Invalid UUID format'}),
    businessId: z
        .string()
        .uuid({message: 'Invalid UUID format'}),
    createdBy: z
        .string()
        .uuid({message: 'Invalid UUID format'}),
    date: z
        .date(),
    memo: z
        .string()
        .optional(),
    reference: z
            .string()
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

export const createJoournalEntries = journalEntries.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true
});

export const updateJournalEntries = createJoournalEntries;

export const ledgerEntriesSchema = z.object({
    id: z
        .string()
        .uuid({message: 'Invalid UUID format'}),
    businessId: z
        .string()
        .uuid({message: 'Invalid UUID format'}),
    acccountId: z
        .string()
        .uuid({message: 'Invalid UUID format'})
        .optional(),
    journalEntryId: z
        .string()
        .uuid({message: 'Invalid UUID format'})
        .optional(),
    relatedVendorId: z
        .string()
        .uuid({message: 'Invalid UUID format'})
        .optional(),
    relatedCustomerId: z
        .string()
        .uuid({message: 'Invalid UUID format'})
        .optional(),
    relatedInvoiceId: z
        .string()
        .uuid({message: 'Invalid UUID format'})
        .optional(),
    relatedExpenseId: z
        .string()
        .uuid({message: 'Invalid UUID format'})
        .optional(),
    description: z
                .string()
                .min(1, {message: 'description is required'}),
    creditAmount: z
                .number()
                .positive({message: 'Must be greater than zero(0)'})
                .optional(),
    debitAmount: z
                .number()
                .positive({message: 'Must be greater than zero(0)'})
                .optional(),
    referenceType: z
                .enum(['sale', 'purchase', 'expense', 'payroll', 'payment', 'bill', 'manual' ]),
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

export const createLedgerEntriesSchema = ledgerEntriesSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true 
});

export const updateLedgerEntriesSchema = createLedgerEntriesSchema;

export const receivableSchema = z.object({
    id: z
        .string()
        .uuid({message: 'Invalid UUID format'}),
    businessId: z
        .string()
        .uuid({message: 'Invalid UUID format'}),
    customerId: z
        .string()
        .uuid({message: 'Invalid UUID format'})
        .optional(),
    referenceId: z
        .string()
        .uuid({message: 'Invalid UUID format'})
        .optional(),
    invoiceNumber: z
                .string()
                .optional(),
    amount: z
                .number()
                .positive({message: 'Must be greater than zero(0)'}),
    paidAmount: z
                .number()
                .positive({message: 'Must be greater than zero(0)'}),
    balanceAmount: z
                .number()
                .positive({message: 'Must be greater than zero(0)'}),
    status: z
                .enum(['oustanding', 'paid', 'overdue', 'write_off', 'cancelled' ]),
    referenceType: z
                .enum(['sale', 'invoice']),
    dueDate: z
            .date()
            .optional(),
    invoiceDate: z
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

export const createReceivableSchema = receivableSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true  
});

export const updateReceivableSchema = createReceivableSchema;

export const payableSchema = z.object({
    id: z
        .string()
        .uuid({message: 'Invalid UUID format'}),
    businessId: z
        .string()
        .uuid({message: 'Invalid UUID format'}),
    vendorId: z
        .string()
        .uuid({message: 'Invalid UUID format'})
        .optional(),
    referenceId: z
        .string()
        .uuid({message: 'Invalid UUID format'})
        .optional(),
    billNumber: z
                .string()
                .optional(),
    amount: z
                .number()
                .positive({message: 'Must be greater than zero(0)'}),
    paidAmount: z
                .number()
                .positive({message: 'Must be greater than zero(0)'}),
    balanceAmount: z
                .number()
                .positive({message: 'Must be greater than zero(0)'}),
    status: z
                .enum(['oustanding', 'paid', 'overdue', 'written_off', 'cancelled' ]),
    referenceType: z
                .enum(['expense', 'purchase', 'payroll', 'refundable', 'loan']),
    dueDate: z
            .date()
            .optional(),
    billDate: z
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

export const createPayableSchema = payableSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true  
});

export const updatePayableSchema = createPayableSchema;