import { z } from "zod";


export const auditLogSchema = z.object({
    id: z
        .string()
        .uuid(),
    businessId: z
            .string()
            .uuid(),
    recordId: z
        .string()
        .uuid(),
    userId: z
        .string()
        .uuid()
        .optional(),
    resourceId: z
        .string()
        .uuid()
        .optional(),
    transactionId: z
        .string()
        .uuid()
        .optional(),
    actionType: z
                .enum(['create', 'update', 'delete']),
    resourceType: z
                .enum(['invoice', 'customer', 'product', 'sales', 'expense', 'payroll', 'employee', 'vendor', 'inventory', 'payment', 'setting', 'subscription', 'user']),
    tableName: z
            .string()
            .min(1, {message: 'table name is required'}),
    oldValues: z
            .string()
            .array()
            .optional(),
    newValues: z
            .string()
            .array()
            .optional(),
    changedFields: z
            .string()
            .array()
            .optional(),
    ipAddress: z
                .string()
                .optional(),
    result: z
            .enum(['success', 'failure', 'partial', 'error']),
    userAgent: z
            .string()
            .optional(),
    errorCode: z
            .string()
            .optional(),
    geographicLocation: z
            .string()
            .optional(),
    createdAt: z
            .date()
            .optional(),   
});

export const createAuditLogSchema = auditLogSchema.omit({
    id: true, 
    createdAt: true
});

export const updateAuditLogSchema = auditLogSchema;