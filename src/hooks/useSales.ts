import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Sale, SaleWithItems } from '@/lib/drizzle/types';

const salesApi = {
  getById: async (saleId: string): Promise<SaleWithItems> => {
    const response = await fetch(`/api/sales/${saleId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch sale');
    }
    return response.json();
  },

  getByBusiness: async ({ 
    businessId, 
    status,
    customerId,
    search,
    startDate,
    endDate,
    page = 1,
    limit = 10
  }: { 
    businessId: string;
    status?: string;
    customerId?: string;
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
      ...(search && { search }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });
    
    const response = await fetch(`/api/sales?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch sales');
    }
    return response.json();
  },

  create: async (data: { saleData: Partial<Sale>; items: Array<{ 
    productId: string; 
    quantity: number; 
    unitPrice: number; 
    totalPrice: number; }>; businessId: string }) => {
    const response = await fetch('/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ saleData: data.saleData, items: data.items }),
    });
    if (!response.ok) {
      throw new Error('Failed to create sale');
    }
    return response.json();
  },

  update: async ({ id, data }: { id: string; data: Partial<Sale> }) => {
    const response = await fetch(`/api/sales/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update sale');
    }
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`/api/sales/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete sale');
    }
    return response.json();
  },

  cancel: async ({ id, reason }: { id: string; reason?: string }) => {
    const response = await fetch(`/api/sales/${id}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    if (!response.ok) {
      throw new Error('Failed to cancel sale');
    }
    return response.json();
  },

  getSummary: async ({ 
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
    
    const response = await fetch(`/api/sales/summary?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch sales summary');
    }
    return response.json();
  },

  getTopSellingProducts: async ({ 
    businessId, 
    limit = 10,
    startDate,
    endDate
  }: { 
    businessId: string;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }) => {
    const queryParams = new URLSearchParams({
      businessId,
      limit: limit.toString(),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });
    
    const response = await fetch(`/api/sales/top-products?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch top selling products');
    }
    return response.json();
  },
};

export const salesKeys = {
  all: ['sales'] as const,
  lists: () => [...salesKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...salesKeys.lists(), { ...filters }] as const,
  details: () => [...salesKeys.all, 'detail'] as const,
  detail: (id: string) => [...salesKeys.details(), id] as const,
  summary: (filters: Record<string, unknown>) => [...salesKeys.all, 'summary', { ...filters }] as const,
  topProducts: (filters: Record<string, unknown>) => [...salesKeys.all, 'top-products', { ...filters }] as const,
};

export const useSale = (saleId: string) => {
  return useQuery({
    queryKey: salesKeys.detail(saleId),
    queryFn: () => salesApi.getById(saleId),
    enabled: !!saleId,
  });
};

export const useBusinessSales = (
  businessId: string,
  filters?: {
    status?: string;
    customerId?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }
) => {
  return useQuery({
    queryKey: salesKeys.list({ businessId, ...filters }),
    queryFn: () => salesApi.getByBusiness({ businessId, ...filters }),
    enabled: !!businessId,
  });
};

export const useSalesSummary = (
  businessId: string,
  filters?: {
    startDate?: string;
    endDate?: string;
  }
) => {
  return useQuery({
    queryKey: salesKeys.summary({ businessId, ...filters }),
    queryFn: () => salesApi.getSummary({ businessId, ...filters }),
    enabled: !!businessId,
  });
};

export const useTopSellingProducts = (
  businessId: string,
  filters?: {
    limit?: number;
    startDate?: string;
    endDate?: string;
  }
) => {
  return useQuery({
    queryKey: salesKeys.topProducts({ businessId, ...filters }),
    queryFn: () => salesApi.getTopSellingProducts({ businessId, ...filters }),
    enabled: !!businessId,
  });
};

export const useCreateSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: salesApi.create,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: salesKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: salesKeys.list({ businessId: variables.businessId }) 
      });
      queryClient.invalidateQueries({ 
        queryKey: salesKeys.summary({ businessId: variables.businessId }) 
      });
      queryClient.invalidateQueries({ 
        queryKey: salesKeys.topProducts({ businessId: variables.businessId }) 
      });
    },
  });
};

export const useUpdateSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: salesApi.update,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: salesKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: salesKeys.detail(data.id)
      });
    },
  });
};

export const useDeleteSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: salesApi.delete,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: salesKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: salesKeys.detail(variables)
      });
    },
  });
};

export const useCancelSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: salesApi.cancel,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: salesKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: salesKeys.detail(variables.id)
      });
    },
  });
};
