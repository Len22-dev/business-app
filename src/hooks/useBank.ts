import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Bank } from '@/lib/drizzle/types';

const bankApi = {
  getById: async (bankId: string): Promise<Bank> => {
    const response = await fetch(`/api/bank/${bankId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch bank');
    }
    return response.json();
  },

  getByBusiness: async ({ 
    businessId, 
    search,
    isActive,
    page = 1,
    limit = 10
  }: { 
    businessId: string;
    search?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams({
      businessId,
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(typeof isActive === 'boolean' && { isActive: isActive.toString() }),
    });
    
    const response = await fetch(`/api/bank?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch banks');
    }
    return response.json();
  },

  create: async (data: { 
    bankData: Partial<Bank>; 
    businessId: string;
  }) => {
    const response = await fetch('/api/bank', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create bank');
    }
    return response.json();
  },

  update: async ({ id, data }: { id: string; data: Partial<Bank> }) => {
    const response = await fetch(`/api/bank/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update bank');
    }
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`/api/bank/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete bank');
    }
    return response.json();
  },

  getBankBalance: async ({ 
    businessId, 
    bankId,
    startDate,
    endDate
  }: { 
    businessId: string;
    bankId: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const queryParams = new URLSearchParams({
      businessId,
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });
    
    const response = await fetch(`/api/bank/${bankId}/balance?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch bank balance');
    }
    return response.json();
  },
};

export const bankKeys = {
  all: ['banks'] as const,
  lists: () => [...bankKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...bankKeys.lists(), { ...filters }] as const,
  details: () => [...bankKeys.all, 'detail'] as const,
  detail: (id: string) => [...bankKeys.details(), id] as const,
  balance: (bankId: string, filters: Record<string, unknown>) => [...bankKeys.all, 'balance', bankId, { ...filters }] as const,
};

export const useBank = (bankId: string) => {
  return useQuery({
    queryKey: bankKeys.detail(bankId),
    queryFn: () => bankApi.getById(bankId),
    enabled: !!bankId,
  });
};

export const useBusinessBanks = (
  businessId: string,
  filters?: {
    search?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }
) => {
  return useQuery({
    queryKey: bankKeys.list({ businessId, ...filters }),
    queryFn: () => bankApi.getByBusiness({ businessId, ...filters }),
    enabled: !!businessId,
  });
};

export const useBankBalance = (
  businessId: string,
  bankId: string,
  filters?: {
    startDate?: string;
    endDate?: string;
  }
) => {
  return useQuery({
    queryKey: bankKeys.balance(bankId, { businessId, ...filters }),
    queryFn: () => bankApi.getBankBalance({ businessId, bankId, ...filters }),
    enabled: !!businessId && !!bankId,
  });
};

export const useCreateBank = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bankApi.create,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: bankKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: bankKeys.list({ businessId: variables.businessId }) 
      });
    },
  });
};

export const useUpdateBank = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bankApi.update,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: bankKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: bankKeys.detail(data.id)
      });
    },
  });
};

export const useDeleteBank = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bankApi.delete,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: bankKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: bankKeys.detail(variables)
      });
    },
  });
};
