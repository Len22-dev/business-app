import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Location } from '@/lib/drizzle/types';

const locationApi = {
  getById: async (locationId: string): Promise<Location> => {
    const response = await fetch(`/api/location/${locationId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch location');
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
    
    const response = await fetch(`/api/locations?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }
    return response.json();
  },

  create: async (data: { 
    locationData: Partial<Location>; 
    businessId: string;
  }) => {
    const response = await fetch('/api/locations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create location');
    }
    return response.json();
  },

  update: async ({ id, data }: { id: string; data: Partial<Location> }) => {
    const response = await fetch(`/api/locations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update location');
    }
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`/api/locations/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete location');
    }
    return response.json();
  },

  getLocationStats: async ({ 
    businessId, 
    locationId,
    startDate,
    endDate
  }: { 
    businessId: string;
    locationId: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const queryParams = new URLSearchParams({
      businessId,
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });
    
    const response = await fetch(`/api/locations/${locationId}/stats?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch location stats');
    }
    return response.json();
  },
};

export const locationKeys = {
  all: ['locations'] as const,
  lists: () => [...locationKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...locationKeys.lists(), { ...filters }] as const,
  details: () => [...locationKeys.all, 'detail'] as const,
  detail: (id: string) => [...locationKeys.details(), id] as const,
  stats: (locationId: string, filters: Record<string, unknown>) => [...locationKeys.all, 'stats', locationId, { ...filters }] as const,
};

export const useLocation = (locationId: string) => {
  return useQuery({
    queryKey: locationKeys.detail(locationId),
    queryFn: () => locationApi.getById(locationId),
    enabled: !!locationId,
  });
};

export const useBusinessLocations = (
  businessId: string,
  filters?: {
    search?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }
) => {
  return useQuery({
    queryKey: locationKeys.list({ businessId, ...filters }),
    queryFn: () => locationApi.getByBusiness({ businessId, ...filters }),
    enabled: !!businessId,
  });
};

export const useLocationStats = (
  businessId: string,
  locationId: string,
  filters?: {
    startDate?: string;
    endDate?: string;
  }
) => {
  return useQuery({
    queryKey: locationKeys.stats(locationId, { businessId, ...filters }),
    queryFn: () => locationApi.getLocationStats({ businessId, locationId, ...filters }),
    enabled: !!businessId && !!locationId,
  });
};

export const useCreateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: locationApi.create,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: locationKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: locationKeys.list({ businessId: variables.businessId }) 
      });
    },
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: locationApi.update,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: locationKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: locationKeys.detail(data.id)
      });
    },
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: locationApi.delete,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: locationKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: locationKeys.detail(variables)
      });
    },
  });
};
