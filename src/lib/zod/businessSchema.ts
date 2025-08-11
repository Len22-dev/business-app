import { z } from "zod";


// Zod Validation Schemas
export const uuidSchema = z.string().uuid('Invalid UUID format');
export const emailSchema = z.string().email('Invalid email format');
export const paginationSchema = z.object({
  limit: z.number().int().min(1).max(100).default(10),
  offset: z.number().int().min(0).default(0),
  page: z.number().int().min(0).default(0),
});

// Business Permissions Schema
export const businessPermissionsSchema = z.object({
  canManageUsers: z.boolean().optional(),
  canManageSettings: z.boolean().optional(),
  canViewReports: z.boolean().optional(),
  canManageFinances: z.boolean().optional(),
  canManageProducts: z.boolean().optional(),
}).optional();

export const businessSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  name: z.string().min(1, { message: "Name is required" }),
  slug: z.string().min(1, { message: "Slug is required" }),
  shortName: z.string().min(1, { message: "Short name is required" }),
  businessType: z.string().min(1, { message: "Business type is required" }),
  industry: z.string().min(1, { message: "Industry is required" }),
  description: z.string().optional(),
  email: z.string().email({ message: "Invalid email" }).optional(),
  phone: z.string().max(20, { message: "Phone number too long" }).optional(),
  website: z.string().url({ message: "Invalid URL" }).optional(),
  logo: z.string().url({ message: "Invalid URL" }).optional(),
  address: z.string().optional(),
  city: z.string().max(100, { message: "City name too long" }).optional(),
  state: z.string().max(100, { message: "State name too long" }).optional(),
  country: z.string().max(100, { message: "Country name too long" }).default('Nigeria'),
  taxId: z.string().max(50, { message: "Tax ID too long" }).optional(),
  registrationNumber: z.string().max(50, { message: "Registration number too long" }).optional(),
  currency: z.string().length(3, { message: "Currency code must be 3 characters" }).default('USD'),
  timezone: z.string().max(50, { message: "Timezone too long" }).default('UTC'),
  settings: z.record(z.any()).optional(),
  fiscalYearStart: z.number().int().min(1).max(12).default(1),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const createBusinessSchema = businessSchema.omit({ 
    id: true, 
    createdAt: true, 
    updatedAt: true, 
    deletedAt: true 
});

export const updateBusinessSchema = createBusinessSchema;

export const userRoleEnum = z.enum(['owner', 'admin', 'manager', 'employee', 'accountant']);

export const businessUserSchema = z.object({
    id: z.string().uuid({ message: "Invalid UUID format" }),
    businessId: z.string().uuid({ message: "Invalid UUID format" }),
    userId: z.string().uuid({ message: "Invalid UUID format" }),
    role: userRoleEnum,
    permissions: z.record(z.any()).optional(),
    isActive: z.boolean().default(true),
    invitedAt: z.date().optional(),
    joinedAt: z.date().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    deletedAt: z.date().optional(),
});

export const createBusinessUserSchema = businessUserSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
});

export const updateBusinessUserSchema = createBusinessUserSchema;

export const locationSchema = z.object({
    id: z.string().uuid({ message: "Invalid UUID format" }),
    businessId: z.string().uuid({ message: "Invalid UUID format" }),
    name: z.string().max(255, { message: "Name too long" }).min(1, { message: "Name is required" }),
    code: z.string().max(50, { message: "Code too long" }).min(1, { message: "Code is required" }),
    address: z.string().optional(),
    city: z.string().max(100, { message: "City name too long" }).optional(),
    state: z.string().max(100, { message: "State name too long" }).optional(),
    phone: z.string().max(20, { message: "Phone number too long" }).optional(),
    email: z.string().max(255, { message: "Email too long" }).email({ message: "Invalid email" }).optional(),
    managerId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
    isActive: z.boolean().default(true),
    createdAt: z.date().optional(),
});

export const createLocationSchema = locationSchema.omit({
    id: true,
    createdAt: true,
});

export const updateLocationSchema = createLocationSchema;