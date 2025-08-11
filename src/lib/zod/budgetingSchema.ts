import { z } from 'zod';

export const budgetingSchema = z.object({
  id: z.string().uuid(),
  businessId: z.string().uuid(),
  fiscalPeriodId: z.string().uuid().optional(),
  accountId: z.string().uuid().optional(),
  name: z.string().min(1, 'Budget name is required'),
  description: z.string().optional(),
  budgetAmount: z.number().positive('Budget amount must be positive'),
  actualAmount: z.number().positive('Budget amount must be positive'),
  variantAmount: z.number().positive('Budget amount must be positive'),
  variancePercentage: z.string().optional(),
  varianceType: z.enum(['increase', 'decrease', 'equal']),
  isActive: z.boolean().optional(),
  deletedAt: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const createBudgetingSchema = budgetingSchema.omit({ 
    id: true, 
    createdAt: true, 
    updatedAt: true, 
    deletedAt: true 
});

export const updateBudgetingSchema = createBudgetingSchema;

export const fiscalPeriodSchema = z.object({
  id: z.string().uuid(),
  businessId: z.string().uuid(),
  year: z.string().min(1, 'Fiscal period name is required'),
  period: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  isClosed: z.boolean().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
})