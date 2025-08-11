import { z } from "zod";

export const notificationTypeEnum = z.enum(['info', 'warning', 'error', 'success']);

export const notificationSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  userId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  title: z.string().min(1, { message: "Title is required" }),
  message: z.string().min(1, { message: "Message is required" }),
  type: notificationTypeEnum.default('info'),
  isRead: z.boolean().default(false),
  actionUrl: z.string().url({ message: "Invalid URL" }).optional(),
  metadata: z.record(z.any()).optional(),
  expiresAt: z.date().optional(),
  createdAt: z.date().optional(),
});

export const createNotificationSchema = notificationSchema.omit({
  id: true,
  createdAt: true,
});

export const updateNotificationSchema = createNotificationSchema.partial();