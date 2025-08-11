import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '@/lib/drizzle/types';

const productApi = {
  getById: async (productId: string): Promise<Product> => {
    const id = productId
    const response = await fetch(`/api/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
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
      `/api/products?businessId=${businessId}&limit=${limit}&offset=${offset}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  },

  create: async (data: { productData: Partial<Product>; businessId: string }) => {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create product');
    }
    return response.json();
  },

  update: async ({ id, data }: { id: string; data: Partial<Product> }) => {
    const response = await fetch(`/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update product');
    }
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
    return response.json();
  },
};

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...productKeys.lists(), { ...filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

export const useProduct = (productId: string) => {
  return useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: () => productApi.getById(productId),
    enabled: !!productId,
  });
};

export const useBusinessProducts = (businessId: string) => {
  return useQuery({
    queryKey: productKeys.list({ businessId }),
    queryFn: () => productApi.getByBusiness({ businessId }),
    enabled: !!businessId,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.create,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: productKeys.list({ businessId: variables.businessId }) 
      });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.update,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: productKeys.detail(data.id)
      });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.delete,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: productKeys.detail(variables)
      });
    },
  });
};