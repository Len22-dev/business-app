import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Transaction } from '@/lib/drizzle/types';

const transactionApi = {
  getById: async (transactionId: string): Promise<Transaction> => {
    const id = transactionId
    const response = await fetch(`/api/transactions/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch transaction');
    }
    return response.json();
  },

  getByBusiness: async ({ 
    businessId, 
    type,
    status,
    limit = 10, 
    offset = 0 
  }: { 
    businessId: string;
    type?: 'income' | 'expense' | 'transfer';
    status?: 'pending' | 'completed' | 'cancelled' | 'failed';
    limit?: number; 
    offset?: number; 
  }) => {
    const queryParams = new URLSearchParams({
      businessId,
      ...(type && { type }),
      ...(status && { status }),
      limit: limit.toString(),
      offset: offset.toString()
    });
    
    const response = await fetch(`/api/transactions?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    return response.json();
  },

  create: async (data: { 
    transactionData: Partial<Transaction>; 
    businessId: string 
  }) => {
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create transaction');
    }
    return response.json();
  },

  update: async ({ id, data }: { id: string; data: Partial<Transaction> }) => {
    const response = await fetch(`/api/transactions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update transaction');
    }
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`/api/transactions/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete transaction');
    }
    return response.json();
  },
};

export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...transactionKeys.lists(), { ...filters }] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
};

export const useTransaction = (transactionId: string) => {
  return useQuery({
    queryKey: transactionKeys.detail(transactionId),
    queryFn: () => transactionApi.getById(transactionId),
    enabled: !!transactionId,
    staleTime: 300000, // 5 minutes
  });
};

export const useBusinessTransactions = (
  businessId: string,
  type?: 'income' | 'expense' | 'transfer',
  status?: 'pending' | 'completed' | 'cancelled' | 'failed'
) => {
  return useQuery({
    queryKey: transactionKeys.list({ businessId, type, status }),
    queryFn: () => transactionApi.getByBusiness({ businessId, type, status }),
    enabled: !!businessId,
    staleTime: 300000, // 5 minutes
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionApi.create,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: transactionKeys.list({ businessId: variables.businessId }) 
      });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionApi.update,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: transactionKeys.detail(data.id)
      });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionApi.delete,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: transactionKeys.detail(variables)
      });
    },
  });
};