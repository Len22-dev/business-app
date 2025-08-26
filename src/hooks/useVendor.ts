import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Vendor } from '@/lib/drizzle/types';
import { z } from 'zod';
import { vendorWithContactSchema } from '@/lib/zod/vendorSchema';

const vendorApi = {
  getById: async (vendorId: string): Promise<Vendor> => {
    const response = await fetch(`/api/vendors/${vendorId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch vendor');
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
    
    const response = await fetch(`/api/vendors?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch vendors');
    }
    return response.json();
  },

  create: async (data: { 
    vendorData: Partial<z.infer<typeof vendorWithContactSchema>>; 
    businessId: string;
  }) => {
    const response = await fetch('/api/vendors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create vendor');
    }
    return response.json();
  },

  update: async ({ id, data }: { id: string; data: Partial<Vendor> }) => {
    const response = await fetch(`/api/vendors/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update vendor');
    }
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`/api/vendors/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete vendor');
    }
    return response.json();
  },

  getVendorStats: async ({ 
    businessId, 
    vendorId,
    startDate,
    endDate
  }: { 
    businessId: string;
    vendorId: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const queryParams = new URLSearchParams({
      businessId,
      vendorId,
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });
    
    const response = await fetch(`/api/vendors/${vendorId}/stats?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch vendor stats');
    }
    return response.json();
  },
};

export const vendorKeys = {
  all: ['vendors'] as const,
  lists: () => [...vendorKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...vendorKeys.lists(), { ...filters }] as const,
  details: () => [...vendorKeys.all, 'detail'] as const,
  detail: (id: string) => [...vendorKeys.details(), id] as const,
  stats: (vendorId: string, filters: Record<string, unknown>) => [...vendorKeys.all, 'stats', vendorId, { ...filters }] as const,
};

export const useVendor = (vendorId: string) => {
  return useQuery({
    queryKey: vendorKeys.detail(vendorId),
    queryFn: () => vendorApi.getById(vendorId),
    enabled: !!vendorId,
  });
};

export const useBusinessVendors = (
  businessId: string,
  filters?: {
    search?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }
) => {
  return useQuery({
    queryKey: vendorKeys.list({ businessId, ...filters }),
    queryFn: () => vendorApi.getByBusiness({ businessId, ...filters }),
    enabled: !!businessId,
  });
};

export const useVendorStats = (
  businessId: string,
  vendorId: string,
  filters?: {
    startDate?: string;
    endDate?: string;
  }
) => {
  return useQuery({
    queryKey: vendorKeys.stats(vendorId, { businessId, ...filters }),
    queryFn: () => vendorApi.getVendorStats({ businessId, vendorId, ...filters }),
    enabled: !!businessId && !!vendorId,
  });
};

export const useCreateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: vendorApi.create,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: vendorKeys.list({ businessId: variables.businessId }) 
      });
    },
  });
};

export const useUpdateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: vendorApi.update,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: vendorKeys.detail(data.id)
      });
    },
  });
};

export const useDeleteVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: vendorApi.delete,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: vendorKeys.detail(variables)
      });
    },
  });
};
