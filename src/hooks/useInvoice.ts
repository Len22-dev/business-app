import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Invoice } from '@/lib/drizzle/types';

const invoiceApi = {
  getById: async (invoiceId: string): Promise<Invoice> => {
    const id = invoiceId
    const response = await fetch(`/api/invoices/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch invoice');
    }
    return response.json();
  },

  getByBusiness: async ({ 
    businessId, 
    status,
    limit = 10, 
    offset = 0 
  }: { 
    businessId: string;
    status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    limit?: number; 
    offset?: number; 
  }) => {
    const queryParams = new URLSearchParams({
      businessId,
      ...(status && { status }),
      limit: limit.toString(),
      offset: offset.toString()
    });
    
    const response = await fetch(`/api/invoices?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch invoices');
    }
    return response.json();
  },

  create: async (data: { 
    invoiceData: Partial<Invoice>; 
    businessId: string 
  }) => {
    const response = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create invoice');
    }
    return response.json();
  },

  update: async ({ id, data }: { id: string; data: Partial<Invoice> }) => {
    const response = await fetch(`/api/invoices/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update invoice');
    }
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`/api/invoices/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete invoice');
    }
    return response.json();
  },
};

export const invoiceKeys = {
  all: ['invoices'] as const,
  lists: () => [...invoiceKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...invoiceKeys.lists(), { ...filters }] as const,
  details: () => [...invoiceKeys.all, 'detail'] as const,
  detail: (id: string) => [...invoiceKeys.details(), id] as const,
};

export const useInvoice = (invoiceId: string) => {
  return useQuery({
    queryKey: invoiceKeys.detail(invoiceId),
    queryFn: () => invoiceApi.getById(invoiceId),
    enabled: !!invoiceId,
  });
};

export const useBusinessInvoices = (
  businessId: string,
  status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
) => {
  return useQuery({
    queryKey: invoiceKeys.list({ businessId, status }),
    queryFn: () => invoiceApi.getByBusiness({ businessId, status }),
    enabled: !!businessId,
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: invoiceApi.create,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: invoiceKeys.list({ businessId: variables.businessId }) 
      });
    },
  });
};

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: invoiceApi.update,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: invoiceKeys.detail(data.id)
      });
    },
  });
};

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: invoiceApi.delete,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: invoiceKeys.detail(variables)
      });
    },
  });
};