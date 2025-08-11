import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Inventory, ProductWithInventory } from '@/lib/drizzle/types';

const inventoryApi = {
  getById: async (inventoryId: string): Promise<ProductWithInventory> => {
    const response = await fetch(`/api/inventory/${inventoryId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch inventory');
    }
    return response.json();
  },

  getByProductId: async (productId: string): Promise<ProductWithInventory> => {
    const response = await fetch(`/api/inventory/product/${productId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch inventory by product');
    }
    return response.json();
  },

  getByBusiness: async ({ 
    businessId, 
    lowStock,
    outOfStock,
    location,
    page = 1,
    limit = 10
  }: { 
    businessId: string;
    lowStock?: boolean;
    outOfStock?: boolean;
    location?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams({
      businessId,
      page: page.toString(),
      limit: limit.toString(),
      ...(lowStock && { lowStock: 'true' }),
      ...(outOfStock && { outOfStock: 'true' }),
      ...(location && { location }),
    });
    
    const response = await fetch(`/api/inventory?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch inventory');
    }
    return response.json();
  },

  getLowStock: async (businessId: string) => {
    const response = await fetch(`/api/inventory/low-stock?businessId=${businessId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch low stock items');
    }
    return response.json();
  },

  getOutOfStock: async (businessId: string) => {
    const response = await fetch(`/api/inventory/out-of-stock?businessId=${businessId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch out of stock items');
    }
    return response.json();
  },

  create: async (data: { 
    inventoryData: Partial<Inventory>; 
    businessId: string;
  }) => {
    const response = await fetch('/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create inventory');
    }
    return response.json();
  },

  update: async ({ id, data }: { id: string; data: Partial<Inventory> }) => {
    const response = await fetch(`/api/inventory/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update inventory');
    }
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`/api/inventory/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete inventory');
    }
    return response.json();
  },

  adjustQuantity: async ({ productId, adjustment }: { productId: string; adjustment: number }) => {
    const response = await fetch(`/api/inventory/${productId}/adjust`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adjustment }),
    });
    if (!response.ok) {
      throw new Error('Failed to adjust inventory quantity');
    }
    return response.json();
  },

  reserveQuantity: async ({ productId, quantity }: { productId: string; quantity: number }) => {
    const response = await fetch(`/api/inventory/${productId}/reserve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) {
      throw new Error('Failed to reserve inventory quantity');
    }
    return response.json();
  },

  releaseReservedQuantity: async ({ productId, quantity }: { productId: string; quantity: number }) => {
    const response = await fetch(`/api/inventory/${productId}/release`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) {
      throw new Error('Failed to release reserved inventory quantity');
    }
    return response.json();
  },

  bulkAdjustQuantities: async ({ 
    businessId, 
    adjustments 
  }: { 
    businessId: string;
    adjustments: Array<{
      productId: string;
      quantityChange: number;
      reason: string;
    }>;
  }) => {
    const response = await fetch(`/api/inventory/bulk-adjust`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId, adjustments }),
    });
    if (!response.ok) {
      throw new Error('Failed to bulk adjust inventory quantities');
    }
    return response.json();
  },

  getValuation: async (businessId: string) => {
    const response = await fetch(`/api/inventory/valuation?businessId=${businessId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch inventory valuation');
    }
    return response.json();
  },
};

export const inventoryKeys = {
  all: ['inventory'] as const,
  lists: () => [...inventoryKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...inventoryKeys.lists(), { ...filters }] as const,
  details: () => [...inventoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...inventoryKeys.details(), id] as const,
  byProduct: (productId: string) => [...inventoryKeys.all, 'product', productId] as const,
  lowStock: (businessId: string) => [...inventoryKeys.all, 'low-stock', businessId] as const,
  outOfStock: (businessId: string) => [...inventoryKeys.all, 'out-of-stock', businessId] as const,
  valuation: (businessId: string) => [...inventoryKeys.all, 'valuation', businessId] as const,
};

export const useInventory = (inventoryId: string) => {
  return useQuery({
    queryKey: inventoryKeys.detail(inventoryId),
    queryFn: () => inventoryApi.getById(inventoryId),
    enabled: !!inventoryId,
  });
};

export const useInventoryByProduct = (productId: string) => {
  return useQuery({
    queryKey: inventoryKeys.byProduct(productId),
    queryFn: () => inventoryApi.getByProductId(productId),
    enabled: !!productId,
  });
};

export const useBusinessInventory = (
  businessId: string,
  filters?: {
    lowStock?: boolean;
    outOfStock?: boolean;
    location?: string;
    page?: number;
    limit?: number;
  }
) => {
  return useQuery({
    queryKey: inventoryKeys.list({ businessId, ...filters }),
    queryFn: () => inventoryApi.getByBusiness({ businessId, ...filters }),
    enabled: !!businessId,
  });
};

export const useLowStockInventory = (businessId: string) => {
  return useQuery({
    queryKey: inventoryKeys.lowStock(businessId),
    queryFn: () => inventoryApi.getLowStock(businessId),
    enabled: !!businessId,
  });
};

export const useOutOfStockInventory = (businessId: string) => {
  return useQuery({
    queryKey: inventoryKeys.outOfStock(businessId),
    queryFn: () => inventoryApi.getOutOfStock(businessId),
    enabled: !!businessId,
  });
};

export const useInventoryValuation = (businessId: string) => {
  return useQuery({
    queryKey: inventoryKeys.valuation(businessId),
    queryFn: () => inventoryApi.getValuation(businessId),
    enabled: !!businessId,
  });
};

export const useCreateInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inventoryApi.create,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: inventoryKeys.list({ businessId: variables.businessId }) 
      });
      queryClient.invalidateQueries({ 
        queryKey: inventoryKeys.lowStock(variables.businessId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: inventoryKeys.outOfStock(variables.businessId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: inventoryKeys.valuation(variables.businessId) 
      });
    },
  });
};

export const useUpdateInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inventoryApi.update,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: inventoryKeys.detail(data.id)
      });
    },
  });
};

export const useDeleteInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inventoryApi.delete,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: inventoryKeys.detail(variables)
      });
    },
  });
};

export const useAdjustInventoryQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inventoryApi.adjustQuantity,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: inventoryKeys.byProduct(variables.productId)
      });
    },
  });
};

export const useReserveInventoryQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inventoryApi.reserveQuantity,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: inventoryKeys.byProduct(variables.productId)
      });
    },
  });
};

export const useReleaseReservedQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inventoryApi.releaseReservedQuantity,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: inventoryKeys.byProduct(variables.productId)
      });
    },
  });
};

export const useBulkAdjustInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inventoryApi.bulkAdjustQuantities,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: inventoryKeys.list({ businessId: variables.businessId }) 
      });
      queryClient.invalidateQueries({ 
        queryKey: inventoryKeys.lowStock(variables.businessId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: inventoryKeys.outOfStock(variables.businessId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: inventoryKeys.valuation(variables.businessId) 
      });
    },
  });
};
