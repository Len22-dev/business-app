import { z } from "zod";

export const reportSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  name: z.string().min(1, { message: "Report name is required" }),
  type: z.string().max(50, { message: "Report type too long" }),
  configuration: z.record(z.any()).optional(),
  isPublic: z.boolean().default(false),
  createdBy: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const createReportSchema = reportSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateReportSchema = createReportSchema.partial();