import { asc, desc, sql } from "drizzle-orm";
import { PaymentMethod } from "./lib/types";

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface Step {
  title: string;
  description: string;
}

export interface Value {
  icon: string;
  title: string;
  description: string;
}

export interface DashboardStats {
  totalSales: number;
  totalExpenses: number;
  totalInventory: number;
  teamMembers: number;
}

// Types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams {
  search?: string;
}

export interface FilterParams {
  [key: string]: any; // Generic filter parameters
}

export interface QueryParams extends PaginationParams, SortParams, SearchParams, FilterParams {}

// Helper function for pagination
export function getPaginationOffset(page: number = 1, limit: number = 10) {
  return (page - 1) * limit;
}

// Helper function for sorting
export function getSortOrder(sortBy: string, sortOrder: 'asc' | 'desc' = 'desc') {
  return sortOrder === 'asc' ? asc(sql.identifier(sortBy)) : desc(sql.identifier(sortBy));
}


export interface Item {
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

 export interface SaleFormData {
  businessId: string;
  customerName: string;
  description?: string;
  status: 'paid' | 'part_payment' | 'unpaid' | 'pending' | 'failed' | 'refunded';
  paymentMethod?: 'cash' | 'bank_transfer' | 'card' | 'mobile_money' | 'cheque';
  bankId?: string;
  cardId?: string;
  totalAmount: number;
  saleDate: string;
  dueDate: string;
  userId: string;
}

export interface TransformedSaleData {
  businessId: string;
  customerId?: string;
  saleNumber: string;
  saleDate: Date;
  dueDate?: Date;
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  salesStatus: 'sold' | 'pending';
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending' | 'failed';
  locationId?: string;
  createdBy?: string;
  // Add these fields that might be expected by your schema
  customerName?: string;
  description?: string;
  bankId?: string;
  cardId?: string;
}
