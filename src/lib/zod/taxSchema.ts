import { z } from "zod";

export const taxRateSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  name: z.string().min(1, { message: "Tax rate name is required" }),
  code: z.string().max(20, { message: "Tax code too long" }).min(1, { message: "Tax code is required" }),
  rate: z.number().min(0).max(100, { message: "Tax rate must be between 0 and 100" }),
  type: z.enum(['sales', 'purchase', 'income']),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const createTaxRateSchema = taxRateSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateTaxRateSchema = createTaxRateSchema.partial();