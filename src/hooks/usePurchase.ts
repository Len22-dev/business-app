import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Purchase, PurchaseWithItems } from '@/lib/drizzle/types';

const purchaseApi = {
  getById: async (purchaseId: string): Promise<PurchaseWithItems> => {
    const response = await fetch(`/api/purchases/${purchaseId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch purchase');
    }
    return response.json();
  },

  getByBusiness: async ({ 
    businessId, 
    status,
    vendorId,
    search,
    startDate,
    endDate,
    page = 1,
    limit = 10
  }: { 
    businessId: string;
    status?: string;
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
      ...(vendorId && { vendorId }),
      ...(search && { search }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });
    
    const response = await fetch(`/api/purchases?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch purchases');
    }
    return response.json();
  },

  create: async (data: { purchaseData: Partial<Purchase>; items: Array<{ productId: string; quantity: number; unitPrice: number; totalPrice: number; }>; businessId: string }) => {
    const response = await fetch('/api/purchases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ purchaseData: data.purchaseData, items: data.items }),
    });
    if (!response.ok) {
      throw new Error('Failed to create purchase');
    }
    return response.json();
  },

  update: async ({ id, data }: { id: string; data: Partial<Purchase> }) => {
    const response = await fetch(`/api/purchases/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update purchase');
    }
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`/api/purchases/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete purchase');
    }
    return response.json();
  },

  cancel: async ({ id, reason }: { id: string; reason?: string }) => {
    const response = await fetch(`/api/purchases/${id}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    if (!response.ok) {
      throw new Error('Failed to cancel purchase');
    }
    return response.json();
  },

  getPurchaseSummary: async ({ 
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
    
    const response = await fetch(`/api/purchases/summary?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch purchase summary');
    }
    return response.json();
  },

  getByVendor: async ({ 
    businessId, 
    vendorId,
    page = 1,
    limit = 10
  }: { 
    businessId: string;
    vendorId: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams({
      businessId,
      vendorId,
      page: page.toString(),
      limit: limit.toString(),
    });
    
    const response = await fetch(`/api/purchases/by-vendor?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch purchases by vendor');
    }
    return response.json();
  },
};

export const purchaseKeys = {
  all: ['purchases'] as const,
  lists: () => [...purchaseKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...purchaseKeys.lists(), { ...filters }] as const,
  details: () => [...purchaseKeys.all, 'detail'] as const,
  detail: (id: string) => [...purchaseKeys.details(), id] as const,
  summary: (filters: Record<string, unknown>) => [...purchaseKeys.all, 'summary', { ...filters }] as const,
  byVendor: (filters: Record<string, unknown>) => [...purchaseKeys.all, 'by-vendor', { ...filters }] as const,
};

export const usePurchase = (purchaseId: string) => {
  return useQuery({
    queryKey: purchaseKeys.detail(purchaseId),
    queryFn: () => purchaseApi.getById(purchaseId),
    enabled: !!purchaseId,
  });
};

export const useBusinessPurchases = (
  businessId: string,
  filters?: {
    status?: string;
    vendorId?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }
) => {
  return useQuery({
    queryKey: purchaseKeys.list({ businessId, ...filters }),
    queryFn: () => purchaseApi.getByBusiness({ businessId, ...filters }),
    enabled: !!businessId,
  });
};

export const usePurchaseSummary = (
  businessId: string,
  filters?: {
    startDate?: string;
    endDate?: string;
  }
) => {
  return useQuery({
    queryKey: purchaseKeys.summary({ businessId, ...filters }),
    queryFn: () => purchaseApi.getPurchaseSummary({ businessId, ...filters }),
    enabled: !!businessId,
  });
};

export const usePurchasesByVendor = (
  businessId: string,
  vendorId: string,
  filters?: {
    page?: number;
    limit?: number;
  }
) => {
  return useQuery({
    queryKey: purchaseKeys.byVendor({ businessId, vendorId, ...filters }),
    queryFn: () => purchaseApi.getByVendor({ businessId, vendorId, ...filters }),
    enabled: !!businessId && !!vendorId,
  });
};

export const useCreatePurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: purchaseApi.create,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: purchaseKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: purchaseKeys.list({ businessId: variables.businessId }) 
      });
      queryClient.invalidateQueries({ 
        queryKey: purchaseKeys.summary({ businessId: variables.businessId }) 
      });
    },
  });
};

export const useUpdatePurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: purchaseApi.update,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: purchaseKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: purchaseKeys.detail(data.id)
      });
    },
  });
};

export const useDeletePurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: purchaseApi.delete,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: purchaseKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: purchaseKeys.detail(variables)
      });
    },
  });
};

export const useCancelPurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: purchaseApi.cancel,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: purchaseKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: purchaseKeys.detail(variables.id)
      });
    },
  });
};
