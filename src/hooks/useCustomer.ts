import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Customer } from '@/lib/drizzle/types';

const customerApi = {
  getById: async (customerId: string): Promise<Customer> => {
    const id = customerId
    const response = await fetch(`/api/customers/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch customer');
    }
    return response.json();
  },

  getByBusiness: async ({ 
    businessId, 
    limit = 10, 
    offset = 0 
  }: { 
    businessId: string; 
    limit?: number; 
    offset?: number; 
  }) => {
    const response = await fetch(
      `/api/customers?businessId=${businessId}&limit=${limit}&offset=${offset}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch customers');
    }
    return response.json();
  },

  create: async (data: { customerData: Partial<Customer>; businessId: string }) => {
    const response = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create customer');
    }
    return response.json();
  },

  update: async ({ id, data }: { id: string; data: Partial<Customer> }) => {
    const response = await fetch(`/api/customers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update customer');
    }
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`/api/customers/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete customer');
    }
    return response.json();
  },
};

export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...customerKeys.lists(), { ...filters }] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
};

export const useCustomer = (customerId: string) => {
  return useQuery({
    queryKey: customerKeys.detail(customerId),
    queryFn: () => customerApi.getById(customerId),
    enabled: !!customerId,
  });
};

export const useBusinessCustomers = (businessId: string) => {
  return useQuery({
    queryKey: customerKeys.list({ businessId }),
    queryFn: () => customerApi.getByBusiness({ businessId }),
    enabled: !!businessId,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customerApi.create,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: customerKeys.list({ businessId: variables.businessId }) 
      });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customerApi.update,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: customerKeys.detail(data.id)
      });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customerApi.delete,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: customerKeys.detail(variables)
      });
    },
  });
};