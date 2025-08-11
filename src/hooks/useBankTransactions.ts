import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { BankTransaction } from '@/lib/drizzle/types';

const bankTransactionApi = {
  getById: async (transactionId: string): Promise<BankTransaction> => {
    const response = await fetch(`/api/bankTransactions/${transactionId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch bank transaction');
    }
    return response.json();
  },

  getByBusiness: async ({ 
    businessId, 
    bankId,
    type,
    status,
    search,
    startDate,
    endDate,
    page = 1,
    limit = 10
  }: { 
    businessId: string;
    bankId?: string;
    type?: string;
    status?: string;
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
      ...(bankId && { bankId }),
      ...(type && { type }),
      ...(status && { status }),
      ...(search && { search }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });
    
    const response = await fetch(`/api/bankTransactions?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch bank transactions');
    }
    return response.json();
  },

  create: async (data: { 
    transactionData: Partial<BankTransaction>; 
    businessId: string;
  }) => {
    const response = await fetch('/api/bankTransactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create bank transaction');
    }
    return response.json();
  },

  update: async ({ id, data }: { id: string; data: Partial<BankTransaction> }) => {
    const response = await fetch(`/api/bankTransactions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update bank transaction');
    }
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`/api/bankTransactions/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete bank transaction');
    }
    return response.json();
  },

  getTransactionSummary: async ({ 
    businessId, 
    bankId,
    startDate,
    endDate
  }: { 
    businessId: string;
    bankId?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const queryParams = new URLSearchParams({
      businessId,
      ...(bankId && { bankId }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });
    
    const response = await fetch(`/api/bankTransactions/summary?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch bank transaction summary');
    }
    return response.json();
  },

  getByBank: async ({ 
    businessId, 
    bankId,
    page = 1,
    limit = 10
  }: { 
    businessId: string;
    bankId: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams({
      businessId,
      bankId,
      page: page.toString(),
      limit: limit.toString(),
    });
    
    const response = await fetch(`/api/bankTransactions/by-bank?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch bank transactions by bank');
    }
    return response.json();
  },
};

export const bankTransactionKeys = {
  all: ['bankTransactions'] as const,
  lists: () => [...bankTransactionKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...bankTransactionKeys.lists(), { ...filters }] as const,
  details: () => [...bankTransactionKeys.all, 'detail'] as const,
  detail: (id: string) => [...bankTransactionKeys.details(), id] as const,
  summary: (filters: Record<string, unknown>) => [...bankTransactionKeys.all, 'summary', { ...filters }] as const,
  byBank: (filters: Record<string, unknown>) => [...bankTransactionKeys.all, 'by-bank', { ...filters }] as const,
};

export const useBankTransaction = (transactionId: string) => {
  return useQuery({
    queryKey: bankTransactionKeys.detail(transactionId),
    queryFn: () => bankTransactionApi.getById(transactionId),
    enabled: !!transactionId,
  });
};

export const useBusinessBankTransactions = (
  businessId: string,
  filters?: {
    bankId?: string;
    type?: string;
    status?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }
) => {
  return useQuery({
    queryKey: bankTransactionKeys.list({ businessId, ...filters }),
    queryFn: () => bankTransactionApi.getByBusiness({ businessId, ...filters }),
    enabled: !!businessId,
  });
};

export const useBankTransactionSummary = (
  businessId: string,
  filters?: {
    bankId?: string;
    startDate?: string;
    endDate?: string;
  }
) => {
  return useQuery({
    queryKey: bankTransactionKeys.summary({ businessId, ...filters }),
    queryFn: () => bankTransactionApi.getTransactionSummary({ businessId, ...filters }),
    enabled: !!businessId,
  });
};

export const useBankTransactionsByBank = (
  businessId: string,
  bankId: string,
  filters?: {
    page?: number;
    limit?: number;
  }
) => {
  return useQuery({
    queryKey: bankTransactionKeys.byBank({ businessId, bankId, ...filters }),
    queryFn: () => bankTransactionApi.getByBank({ businessId, bankId, ...filters }),
    enabled: !!businessId && !!bankId,
  });
};

export const useCreateBankTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bankTransactionApi.create,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: bankTransactionKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: bankTransactionKeys.list({ businessId: variables.businessId }) 
      });
      queryClient.invalidateQueries({ 
        queryKey: bankTransactionKeys.summary({ businessId: variables.businessId }) 
      });
    },
  });
};

export const useUpdateBankTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bankTransactionApi.update,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: bankTransactionKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: bankTransactionKeys.detail(data.id)
      });
    },
  });
};

export const useDeleteBankTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bankTransactionApi.delete,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: bankTransactionKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: bankTransactionKeys.detail(variables)
      });
    },
  });
};
