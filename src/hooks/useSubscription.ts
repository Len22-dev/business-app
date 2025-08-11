import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Subscription } from '@/lib/drizzle/types';

const subscriptionApi = {
  getById: async (subscriptionId: string): Promise<Subscription> => {
    const id = subscriptionId
    const response = await fetch(`/api/subscriptions/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch subscription');
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
    status?: 'active' | 'inactive' | 'cancelled' | 'past_due' | 'trialing';
    limit?: number; 
    offset?: number; 
  }) => {
    const queryParams = new URLSearchParams({
      businessId,
      ...(status && { status }),
      limit: limit.toString(),
      offset: offset.toString()
    });
    
    const response = await fetch(`/api/subscriptions?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch subscriptions');
    }
    return response.json();
  },

  create: async (data: { 
    subscriptionData: Partial<Subscription>; 
    businessId: string 
  }) => {
    const response = await fetch('/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create subscription');
    }
    return response.json();
  },

  update: async ({ id, data }: { id: string; data: Partial<Subscription> }) => {
    const response = await fetch(`/api/subscriptions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update subscription');
    }
    return response.json();
  },

  cancel: async (id: string) => {
    const response = await fetch(`/api/subscriptions/${id}/cancel`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to cancel subscription');
    }
    return response.json();
  },
};

export const subscriptionKeys = {
  all: ['subscriptions'] as const,
  lists: () => [...subscriptionKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...subscriptionKeys.lists(), { ...filters }] as const,
  details: () => [...subscriptionKeys.all, 'detail'] as const,
  detail: (id: string) => [...subscriptionKeys.details(), id] as const,
};

export const useSubscription = (subscriptionId: string) => {
  return useQuery({
    queryKey: subscriptionKeys.detail(subscriptionId),
    queryFn: () => subscriptionApi.getById(subscriptionId),
    enabled: !!subscriptionId,
  });
};

export const useBusinessSubscriptions = (
  businessId: string,
  status?: 'active' | 'inactive' | 'cancelled' | 'past_due' | 'trialing'
) => {
  return useQuery({
    queryKey: subscriptionKeys.list({ businessId, status }),
    queryFn: () => subscriptionApi.getByBusiness({ businessId, status }),
    enabled: !!businessId,
  });
};

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subscriptionApi.create,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: subscriptionKeys.list({ businessId: variables.businessId }) 
      });
    },
  });
};

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subscriptionApi.update,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: subscriptionKeys.detail(data.id)
      });
    },
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subscriptionApi.cancel,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: subscriptionKeys.detail(variables)
      });
    },
  });
};