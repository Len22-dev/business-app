// 11. REACT QUERY HOOKS (hooks/use-businesses.ts)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
//import { type Business, } from '@/lib/types';
import {type NewBusiness } from '@/lib/drizzle/types';

// Query keys
export const businessKeys = {
  all: ['businesses'] as const,
  lists: () => [...businessKeys.all, 'list'] as const,
  list: (filters: string) => [...businessKeys.lists(), { filters }] as const,
  details: () => [...businessKeys.all, 'detail'] as const,
  detail: (id: string) => [...businessKeys.details(), id] as const,
  stats: (id: string) => [...businessKeys.detail(id), 'stats'] as const,
};

// Hooks
export function useBusinesses() {
  return useQuery({
    queryKey: businessKeys.lists(),
    queryFn: () => apiClient.getBusinesses(),
  });
}

export function useBusiness(businessId: string) {
  const id = businessId;
  const numericId = typeof id === 'string' ? parseInt(id) : id;
  
  return useQuery({
    queryKey: businessKeys.detail(String(numericId)),
    queryFn: () => apiClient.getBusiness(String(numericId)),
    enabled: !!numericId && numericId > 0,
  });
}

export function useDashboardStats(businessId: string) {
  const numericId = typeof businessId === 'string' ? parseInt(businessId) : businessId;
  
  return useQuery({
    queryKey: businessKeys.stats(String(numericId)),
    queryFn: () => apiClient.getDashboardStats(String(numericId)),
    enabled: !!numericId && numericId > 0,
  });
}

export function useCreateBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NewBusiness) => apiClient.createBusiness(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.lists() });
    },
  });
}

export function useUpdateBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NewBusiness> }) =>
      apiClient.updateBusiness(id, data),
    onSuccess: (updatedBusiness) => {
      queryClient.invalidateQueries({ queryKey: businessKeys.lists() });
      queryClient.setQueryData(
        businessKeys.detail(updatedBusiness.id),
        updatedBusiness
      );
    },
  });
}

export function useDeleteBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteBusiness(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: businessKeys.lists() });
      queryClient.removeQueries({ queryKey: businessKeys.detail(deletedId) });
    },
  });
}