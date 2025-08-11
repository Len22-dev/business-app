import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Expense } from '@/lib/drizzle/types';

const expenseApi = {
  getById: async (expenseId: string): Promise<Expense> => {
    const response = await fetch(`/api/expenses/${expenseId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch expense');
    }
    return response.json();
  },

  getByBusiness: async ({ 
    businessId, 
    status,
    categoryId,
    vendorId,
    search,
    startDate,
    endDate,
    page = 1,
    limit = 10
  }: { 
    businessId: string;
    status?: string;
    categoryId?: string;
    vendorId?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams({
      businessId,
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
      ...(categoryId && { categoryId }),
      ...(vendorId && { vendorId }),
      ...(search && { search }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });
    
    const response = await fetch(`/api/expenses?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch expenses');
    }
    return response.json();
  },

  create: async (data: { 
    expenseData: Partial<Expense>; 
    businessId: string;
  }) => {
    const response = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create expense');
    }
    return response.json();
  },

  update: async ({ id, data }: { id: string; data: Partial<Expense> }) => {
    const response = await fetch(`/api/expenses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update expense');
    }
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`/api/expenses/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete expense');
    }
    return response.json();
  },

  getExpenseSummary: async ({ 
    businessId, 
    startDate,
    endDate
  }: { 
    businessId: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const queryParams = new URLSearchParams({
      businessId,
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });
    
    const response = await fetch(`/api/expenses/summary?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch expense summary');
    }
    return response.json();
  },

  getExpensesByCategory: async ({ 
    businessId, 
    startDate,
    endDate
  }: { 
    businessId: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const queryParams = new URLSearchParams({
      businessId,
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });
    
    const response = await fetch(`/api/expenses/by-category?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch expenses by category');
    }
    return response.json();
  },
};

export const expenseKeys = {
  all: ['expenses'] as const,
  lists: () => [...expenseKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...expenseKeys.lists(), { ...filters }] as const,
  details: () => [...expenseKeys.all, 'detail'] as const,
  detail: (id: string) => [...expenseKeys.details(), id] as const,
  summary: (filters: Record<string, unknown>) => [...expenseKeys.all, 'summary', { ...filters }] as const,
  byCategory: (filters: Record<string, unknown>) => [...expenseKeys.all, 'by-category', { ...filters }] as const,
};

export const useExpense = (expenseId: string) => {
  return useQuery({
    queryKey: expenseKeys.detail(expenseId),
    queryFn: () => expenseApi.getById(expenseId),
    enabled: !!expenseId,
  });
};

export const useBusinessExpenses = (
  businessId: string,
  filters?: {
    status?: string;
    categoryId?: string;
    vendorId?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }
) => {
  return useQuery({
    queryKey: expenseKeys.list({ businessId, ...filters }),
    queryFn: () => expenseApi.getByBusiness({ businessId, ...filters }),
    enabled: !!businessId,
  });
};

export const useExpenseSummary = (
  businessId: string,
  filters?: {
    startDate?: string;
    endDate?: string;
  }
) => {
  return useQuery({
    queryKey: expenseKeys.summary({ businessId, ...filters }),
    queryFn: () => expenseApi.getExpenseSummary({ businessId, ...filters }),
    enabled: !!businessId,
  });
};

export const useExpensesByCategory = (
  businessId: string,
  filters?: {
    startDate?: string;
    endDate?: string;
  }
) => {
  return useQuery({
    queryKey: expenseKeys.byCategory({ businessId, ...filters }),
    queryFn: () => expenseApi.getExpensesByCategory({ businessId, ...filters }),
    enabled: !!businessId,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: expenseApi.create,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: expenseKeys.list({ businessId: variables.businessId }) 
      });
      queryClient.invalidateQueries({ 
        queryKey: expenseKeys.summary({ businessId: variables.businessId }) 
      });
      queryClient.invalidateQueries({ 
        queryKey: expenseKeys.byCategory({ businessId: variables.businessId }) 
      });
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: expenseApi.update,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: expenseKeys.detail(data.id)
      });
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: expenseApi.delete,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: expenseKeys.detail(variables)
      });
    },
  });
};
