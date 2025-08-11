import { z } from "zod";

export const customerTypesEnum = z.enum(['INDIVIDUAL', 'BUSINESS']);

export const customerSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  name: z.string().min(1, { message: "Customer name is required" }),
  email: z.string().email({ message: "Invalid email format" }).optional(),
  phone: z.string().max(20, { message: "Phone number too long" }).optional(),
  customerType: customerTypesEnum.default('INDIVIDUAL'),
  address: z.string().optional(),
  company: z.string().optional(),
  taxId: z.string().max(50, { message: "Tax ID too long" }).optional(),
  billingAddress: z.record(z.string()).optional(),
  shippingAddress: z.record(z.string()).optional(),
  city: z.string().max(100, { message: "City name too long" }).optional(),
  state: z.string().max(100, { message: "State name too long" }).optional(),
  country: z.string().max(100, { message: "Country name too long" }).default('Nigeria'),
  paymentTerms: z.number().int().min(0).default(30),
  creditLimit: z.number().int().min(0).default(0),
  notes: z.string().optional(),
  outstandingBalance: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const createCustomerSchema = customerSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateCustomerSchema = createCustomerSchema.partial();

export const customerContactSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  customerId: z.string().uuid({ message: "Invalid UUID format" }),
  name: z.string().max(255, { message: "Name too long" }).min(1, { message: "Contact name is required" }),
  position: z.string().max(100, { message: "Position too long" }).optional(),
  phone: z.string().max(20, { message: "Phone number too long" }).optional(),
  email: z.string().max(255, { message: "Email too long" }).email({ message: "Invalid email format" }).optional(),
  isPrimary: z.boolean().default(false),
  createdAt: z.date().optional(),
});

export const createCustomerContactSchema = customerContactSchema.omit({
  id: true,
  createdAt: true,
});

export const updateCustomerContactSchema = createCustomerContactSchema.partial();