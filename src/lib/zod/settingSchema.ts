import { z } from "zod";

export const settingSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  key: z.string().max(100, { message: "Key too long" }).min(1, { message: "Key is required" }),
  value: z.record(z.any()).optional(),
  description: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const createSettingSchema = settingSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateSettingSchema = createSettingSchema.partial();