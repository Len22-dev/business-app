import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Category } from '@/lib/drizzle/types';

const categoryApi = {
  getById: async (categoryId: string): Promise<Category> => {
    const response = await fetch(`/api/categories/${categoryId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch category');
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
    
    const response = await fetch(`/api/categories?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return response.json();
  },

  create: async (data: { 
    categoryData: Partial<Category>; 
    businessId: string;
  }) => {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create category');
    }
    return response.json();
  },

  update: async ({ id, data }: { id: string; data: Partial<Category> }) => {
    const response = await fetch(`/api/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update category');
    }
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete category');
    }
    return response.json();
  },

  getCategoryStats: async ({ 
    businessId, 
    categoryId,
    startDate,
    endDate
  }: { 
    businessId: string;
    categoryId: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const queryParams = new URLSearchParams({
      businessId,
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });
    
    const response = await fetch(`/api/categories/${categoryId}/stats?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch category stats');
    }
    return response.json();
  },
};

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...categoryKeys.lists(), { ...filters }] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
  stats: (categoryId: string, filters: Record<string, unknown>) => [...categoryKeys.all, 'stats', categoryId, { ...filters }] as const,
};

export const useCategory = (categoryId: string) => {
  return useQuery({
    queryKey: categoryKeys.detail(categoryId),
    queryFn: () => categoryApi.getById(categoryId),
    enabled: !!categoryId,
  });
};

export const useBusinessCategories = (
  businessId: string,
  filters?: {
    search?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }
) => {
  return useQuery({
    queryKey: categoryKeys.list({ businessId, ...filters }),
    queryFn: () => categoryApi.getByBusiness({ businessId, ...filters }),
    enabled: !!businessId,
  });
};

export const useCategoryStats = (
  businessId: string,
  categoryId: string,
  filters?: {
    startDate?: string;
    endDate?: string;
  }
) => {
  return useQuery({
    queryKey: categoryKeys.stats(categoryId, { businessId, ...filters }),
    queryFn: () => categoryApi.getCategoryStats({ businessId, categoryId, ...filters }),
    enabled: !!businessId && !!categoryId,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.create,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: categoryKeys.list({ businessId: variables.businessId }) 
      });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.update,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: categoryKeys.detail(data.id)
      });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.delete,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: categoryKeys.detail(variables)
      });
    },
  });
};
