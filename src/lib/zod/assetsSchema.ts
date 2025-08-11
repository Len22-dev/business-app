import { z } from "zod";


export const assetSchema = z.object({
    id: z
        .string()
        .uuid({message: 'Invalid UUID format'}),
    businessId: z
        .string()
        .uuid({message: 'Invalid UUID format'}),
    categoryId: z
        .string()
        .uuid({message: 'Invalid UUID format'})
        .optional(),
    locationId: z
        .string()
        .uuid({message: 'Invalid UUID format'})
        .optional(),
    assignedTo: z
        .string()
        .uuid({message: 'Invalid UUID format'})
        .optional(),
    assetTag: z
            .string()
            .optional(),
    description: z
            .string()
            .optional(),
    serialNumber: z
            .string()
            .optional(),
    model: z
            .string()
            .optional(),
    manufacturer: z
            .string()
            .optional(),
    name: z
        .string()
        .min(1, {message: 'Asset name is required'}),
    status: z
            .enum(['active', 'disposed', 'sold', 'stolen', 'damaged']),
    condition: z
            .enum(['excellent', 'good', 'fair', 'poor']),
    purchasePrice: z
                .number()
                .positive({message: 'purchase price must be greater than zero'})
                .optional(),
    currentValue: z
                .number()
                .positive({message: 'purchase price must be greater than zero'})
                .optional(),
    purchaseDate: z
                .date()
                .optional(),
    warrantyExpiry: z
                .date()
                .optional(),
    lastMaintenanceDate: z
                .date()
                .optional(),
    nextMaintenanceDate: z
                .date()
                .optional(),
    isActive: z
            .boolean()
            .optional(),
    createdAt: z
                .date()
                .optional(),
    updatedAt: z
                .date()
                .optional(),
    deletedAt: z
                .date()
                .optional(),
});

export const createAssetSchema = assetSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true
});

export const updateAssetSchema = createAssetSchema;

export const assetCategoriesSchema = z.object({
   id: z
        .string()
        .uuid({message: 'Invalid UUID format'}),
    businessId: z
        .string()
        .uuid({message: 'Invalid UUID format'}),
    name: z
            .string()
            .min(1, {message: 'Category name is required'}),
    description: z
                .string()
                .optional(),
    depreciationRate: z
                    .number()
                    .int()
                    .min(0)
                    .max(100)
                    .default(0), 
    depreciationMethod: z
                    .enum(['straight_line', 'declining_balance', 'sum_of_years'])
                    .default('straight_line'),
    isActive: z
            .boolean()
            .default(true), 
    createdAt: z
                .date()
                .optional(),
});

export const createAssetCategoriesSchema = assetCategoriesSchema.omit({
    id: true,
    createdAt: true,
});

export const updateAssetCategoriesSchema = createAssetCategoriesSchema.partial();