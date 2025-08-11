import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Payment } from '@/lib/drizzle/types';

const paymentApi = {
  getById: async (paymentId: string): Promise<Payment> => {
    const id = paymentId
    const response = await fetch(`/api/payment/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch payment');
    }
    return response.json();
  },

  getByBusiness: async ({ 
    businessId, 
    status,
    customerId,
    vendorId,
    search,
    startDate,
    endDate,
    page = 1,
    limit = 10
  }: { 
    businessId: string;
    status?: string;
    customerId?: string;
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
      ...(customerId && { customerId }),
      ...(vendorId && { vendorId }),
      ...(search && { search }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });
    
    const response = await fetch(`/api/payment?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch payments');
    }
    return response.json();
  },

  create: async (data: { 
    paymentData: Partial<Payment>; 
    businessId: string;
    invoiceId?: string;
  }) => {
    const response = await fetch('/api/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create payment');
    }
    return response.json();
  },

  update: async ({ id, data }: { id: string; data: Partial<Payment> }) => {
    const response = await fetch(`/api/payment/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update payment');
    }
    return response.json();
  },

  refund: async ({ id, data }: { id: string; data: { amount?: number; reason?: string } }) => {
    const response = await fetch(`/api/payment/${id}/refund`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to refund payment');
    }
    return response.json();
  },
};

export const paymentKeys = {
  all: ['payments'] as const,
  lists: () => [...paymentKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...paymentKeys.lists(), { ...filters }] as const,
  details: () => [...paymentKeys.all, 'detail'] as const,
  detail: (id: string) => [...paymentKeys.details(), id] as const,
};

export const usePayment = (paymentId: string) => {
  return useQuery({
    queryKey: paymentKeys.detail(paymentId),
    queryFn: () => paymentApi.getById(paymentId),
    enabled: !!paymentId,
  });
};

export const useBusinessPayments = (
  businessId: string,
  filters?: {
    status?: string;
    customerId?: string;
    vendorId?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }
) => {
  return useQuery({
    queryKey: paymentKeys.list({ businessId, ...filters }),
    queryFn: () => paymentApi.getByBusiness({ businessId, ...filters }),
    enabled: !!businessId,
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paymentApi.create,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: paymentKeys.list({ businessId: variables.businessId }) 
      });
      // Invalidate related invoice if payment is linked to an invoice
      if (variables.invoiceId) {
        queryClient.invalidateQueries({ 
          queryKey: ['invoices', 'detail', variables.invoiceId] 
        });
      }
    },
  });
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paymentApi.update,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: paymentKeys.detail(data.id)
      });
    },
  });
};

export const useRefundPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paymentApi.refund,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: paymentKeys.detail(variables.id)
      });
    },
  });
};