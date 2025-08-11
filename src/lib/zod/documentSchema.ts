import { z } from "zod";

export const documentTypeEnum = z.enum([
  'invoice', 'receipt', 'contract', 'general', 'avatar'
]);

export const documentSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  uploadedBy: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  fileName: z.string().max(255, { message: "File name too long" }),
  originalName: z.string().max(255, { message: "Original name too long" }),
  documentType: documentTypeEnum,
  documentNumber: z.string().min(1, { message: "Document number is required" }),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  fileUrl: z.string().url({ message: "Invalid file URL" }),
  referenceId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  referenceType: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const createDocumentSchema = documentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateDocumentSchema = createDocumentSchema.partial();