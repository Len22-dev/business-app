import { z } from "zod";

export const vendorSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  name: z.string().min(1, { message: "Vendor name is required" }),
  email: z.string().email({ message: "Invalid email format" }).optional(),
  phone: z.string().max(15, { message: "Phone number too long" }).optional(),
  company: z.string().optional(),
  taxId: z.string().max(50, { message: "Tax ID too long" }).optional(),
  address: z.string().optional(),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const createVendorSchema = vendorSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateVendorSchema = createVendorSchema.partial();

export const vendorContactSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  vendorId: z.string().uuid({ message: "Invalid UUID format" }),
  name: z.string().max(255, { message: "Name too long" }).min(1, { message: "Contact name is required" }),
  position: z.string().max(100, { message: "Position too long" }).optional(),
  phone: z.string().max(20, { message: "Phone number too long" }).optional(),
  email: z.string().max(255, { message: "Email too long" }).email({ message: "Invalid email format" }).optional(),
  isPrimary: z.boolean().default(false),
  createdAt: z.date().optional(),
});

export const createVendorContactSchema = vendorContactSchema.omit({
  id: true,
  createdAt: true,
});

export const updateVendorContactSchema = createVendorContactSchema.partial();

export const vendorWithContactSchema = z.object({
 businessId: z.string().uuid({ message: "Invalid UUID format" }),
  name: z.string().min(1, { message: "Vendor name is required" }),
  email: z.string().email({ message: "Invalid email format" }).optional(),
  phone: z.string().max(15, { message: "Phone number too long" }).optional(),
  company: z.string().optional(),
  taxId: z.string().max(50, { message: "Tax ID too long" }).optional(),
  address: z.string().optional(),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
  contactPersonName: z.string().max(255, { message: "Name too long" }).min(1, { message: "Contact name is required" }),
  position: z.string().max(100, { message: "Position too long" }).optional(),
  contactPersonPhone: z.string().max(20, { message: "Phone number too long" }).optional(),
  contactPersonEmail: z.string().max(255, { message: "Email too long" }).email({ message: "Invalid email format" }).optional(),
  isPrimary: z.boolean().default(false),  
})