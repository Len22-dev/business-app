// hooks/useBusinesses.ts
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { Business } from '@/lib/types';



// API Functions
const businessApi = {
  getById: async (businessId: string): Promise<Business> => {
    const response = await fetch(`/api/businesses/${businessId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch business');
    }
    const data = await response.json();
    return data.business;
  },

  getDashboardStats: async (businessId: string) => {
    const response = await fetch(`/api/businesses/${businessId}/stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }
    return response.json();
  },

  getByUserId: async ({ 
    userId, 
    limit = 10, 
    offset = 0 
  }: { 
    userId: string; 
    limit?: number; 
    offset?: number; 
  }) => {
    const response = await fetch(
      `/api/businesses?userId=${userId}&limit=${limit}&offset=${offset}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch businesses');
    }
    return response.json();
  },

  create: async (data: { businessData: Partial<Business>; userId?: string }) => {
    const response = await fetch('/api/businesses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create business');
    }
    return response.json();
  },

  update: async (businessId: string, businessData: Partial<Business>) => {
    const response = await fetch(`/api/businesses/${businessId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(businessData),
    });
    if (!response.ok) {
      throw new Error('Failed to update business');
    }
    return response.json();
  },

  delete: async (businessId: string) => {
    const response = await fetch(`/api/businesses/${businessId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete business');
    }
    return response.json();
  },

  getUserRole: async (businessId: string, userId: string) => {
    const response = await fetch(`/api/businesses/${businessId}/users/${userId}/role`);
    if (!response.ok) {
      throw new Error('Failed to fetch user role');
    }
    return response.json();
  },

  inviteUser: async (businessId: string, email: string, role: string) => {
    const response = await fetch(`/api/businesses/${businessId}/users/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role }),
    });
    if (!response.ok) {
      throw new Error('Failed to invite user');
    }
    return response.json();
  },

  updateUserRole: async (businessId: string, userId: string, role: string) => {
    const response = await fetch(`/api/businesses/${businessId}/users/${userId}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    if (!response.ok) {
      throw new Error('Failed to update user role');
    }
    return response.json();
  },

  removeUser: async (businessId: string, userId: string) => {
    const response = await fetch(`/api/businesses/${businessId}/users/${userId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to remove user');
    }
    return response.json();
  },
};

// Query Keys
export const businessKeys = {
  all: ['businesses'] as const,
  byId: (id: string) => [...businessKeys.all, id] as const,
  byUserId: (userId: string) => [...businessKeys.all, 'user', userId] as const,
  userRole: (businessId: string, userId: string) => [...businessKeys.all, businessId, 'role', userId] as const,
  stats: (businessId: string) => [...businessKeys.all, businessId, 'stats'] as const,
};

// Hooks for fetching data
export const useBusiness = (businessId: string) => {
  return useQuery({
    queryKey: businessKeys.byId(businessId),
    queryFn: () => businessApi.getById(businessId),
    enabled: !!businessId,
  });
};

export const useUserBusinesses = (userId: string) => {
  return useQuery({
    queryKey: businessKeys.byUserId(userId),
    queryFn: () => businessApi.getByUserId({ userId }),
    enabled: !!userId,
  });
};

export const useUserRole = (businessId: string, userId: string) => {
  return useQuery({
    queryKey: businessKeys.userRole(businessId, userId),
    queryFn: () => businessApi.getUserRole(businessId, userId),
    enabled: !!businessId && !!userId,
  });
};

export const useDashboardStats = (businessId: string) => {
  return useQuery({
    queryKey: businessKeys.stats(businessId),
    queryFn: () => businessApi.getDashboardStats(businessId),
    enabled: !!businessId,
  });
};

// Infinite Query for Pagination
export const useUserBusinessesInfinite = (userId: string) => {
  return useInfiniteQuery({
    queryKey: [...businessKeys.byUserId(userId), 'infinite'],
    queryFn: ({ pageParam = 0 }) => 
      businessApi.getByUserId({ userId, offset: pageParam, limit: 10 }),
    enabled: !!userId,
    getNextPageParam: (lastPage, pages) => {
      const totalLoaded = pages.length * 10;
      return totalLoaded < lastPage.total ? totalLoaded : undefined;
    },
    initialPageParam: 0,
  });
};

// Mutation hooks
export const useCreateBusiness = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: businessApi.create,
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: businessKeys.all });
      
      if (variables.userId) {
        queryClient.invalidateQueries({ 
          queryKey: businessKeys.byUserId(variables.userId) 
        });
      }

      // Set the new business data if it was returned
      if (data.business) {
        queryClient.setQueryData(businessKeys.byId(data.business.id), data.business);
      }
    },
  });
};

export const useUpdateBusiness = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ businessId, businessData }: { businessId: string; businessData: Partial<Business> }) =>
      businessApi.update(businessId, businessData),
    onSuccess: (data, variables) => {
      // Update the specific business in cache
      queryClient.setQueryData(businessKeys.byId(variables.businessId), data);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: businessKeys.all });
    },
  });
};

export const useDeleteBusiness = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: businessApi.delete,
    onSuccess: (_, businessId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: businessKeys.byId(businessId) });
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: businessKeys.all });
    },
  });
};

export const useInviteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ businessId, email, role }: { businessId: string; email: string; role: string }) =>
      businessApi.inviteUser(businessId, email, role),
    onSuccess: (_, variables) => {
      // Invalidate business data to refresh user list
      queryClient.invalidateQueries({ queryKey: businessKeys.byId(variables.businessId) });
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ businessId, userId, role }: { businessId: string; userId: string; role: string }) =>
      businessApi.updateUserRole(businessId, userId, role),
    onSuccess: (_, variables) => {
      // Invalidate user role cache
      queryClient.invalidateQueries({ 
        queryKey: businessKeys.userRole(variables.businessId, variables.userId) 
      });
      
      // Invalidate business data to refresh user list
      queryClient.invalidateQueries({ queryKey: businessKeys.byId(variables.businessId) });
    },
  });
};

export const useRemoveUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ businessId, userId }: { businessId: string; userId: string }) =>
      businessApi.removeUser(businessId, userId),
    onSuccess: (_, variables) => {
      // Invalidate user role cache
      queryClient.removeQueries({ 
        queryKey: businessKeys.userRole(variables.businessId, variables.userId) 
      });
      
      // Invalidate business data to refresh user list
      queryClient.invalidateQueries({ queryKey: businessKeys.byId(variables.businessId) });
    },
  });
};