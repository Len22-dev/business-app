import { z } from "zod";

export const userRoleEnum = z.enum(['owner', 'admin', 'manager', 'employee', 'accountant']);

export const userSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  email: z.string().email({ message: "Invalid email format" }),
  fullName: z.string().min(1, { message: "Full name is required" }),
  phoneNumber: z.string().max(20, { message: "Phone number too long" }).optional(),
  avatar: z.string().url({ message: "Invalid URL format" }).optional(),
  isActive: z.boolean().default(true),
  emailVerified: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateUserSchema = createUserSchema.partial();