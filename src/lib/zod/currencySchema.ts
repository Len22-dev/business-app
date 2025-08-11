import { z } from "zod";

export const currencySchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  name: z.string().min(1, { message: "Currency name is required" }),
  code: z.string().length(3, { message: "Currency code must be 3 characters" }),
  isBase: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const createCurrencySchema = currencySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateCurrencySchema = createCurrencySchema.partial();

export const exchangeRateSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID format" }),
  businessId: z.string().uuid({ message: "Invalid UUID format" }),
  fromCurrencyId: z.string().uuid({ message: "Invalid UUID format" }),
  toCurrencyId: z.string().uuid({ message: "Invalid UUID format" }),
  rate: z.number().positive({ message: "Exchange rate must be positive" }),
  effectiveDate: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export const createExchangeRateSchema = exchangeRateSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const updateExchangeRateSchema = createExchangeRateSchema.partial();