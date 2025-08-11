import { z } from "zod";

export const categorySchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  name: z.string().min(1, { message: "Category name is required" }),
  description: z.string().optional(),
  parentId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  type: z.enum(['product', 'expense', 'income']),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const createCategorySchema = categorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateCategorySchema = createCategorySchema.partial();

export const productSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  categoryId: z.string().uuid({ message: "Invalid UUID format" }).optional(),
  name: z.string().min(1, { message: "Product name is required" }),
  description: z.string().optional(),
  sku: z.string().max(100, { message: "SKU too long" }).optional(),
  barcode: z.string().max(100, { message: "Barcode too long" }).optional(),
  unitPrice: z.number().int().min(0).default(0),
  costPrice: z.number().int().min(0).default(0),
  images: z.array(z.string().url()).optional(),
  specifications: z.record(z.any()).optional(),
  isActive: z.boolean().default(true),
  trackInventory: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const createProductSchema = productSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateProductSchema = createProductSchema.partial();

export const productVariantSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  productId: z.string().uuid({ message: "Invalid UUID format" }),
  variantName: z.string().max(255, { message: "Variant name too long" }).min(1, { message: "Variant name is required" }),
  sku: z.string().max(100, { message: "SKU too long" }).min(1, { message: "SKU is required" }),
  attributes: z.record(z.any()).optional(),
  costPrice: z.number().int().min(0).default(0),
  sellingPrice: z.number().int().min(0).default(0),
  currentStock: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
});

export const createProductVariantSchema = productVariantSchema.omit({
  id: true,
  createdAt: true,
});

export const updateProductVariantSchema = createProductVariantSchema.partial();