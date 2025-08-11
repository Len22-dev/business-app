import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Notification } from '@/lib/drizzle/types';

const notificationApi = {
  getById: async (notificationId: string): Promise<Notification> => {
    const response = await fetch(`/api/notifications/${notificationId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch notification');
    }
    return response.json();
  },

  getByBusiness: async ({ 
    businessId, 
    type,
    status,
    search,
    page = 1,
    limit = 10
  }: { 
    businessId: string;
    type?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams({
      businessId,
      page: page.toString(),
      limit: limit.toString(),
      ...(type && { type }),
      ...(status && { status }),
      ...(search && { search }),
    });
    
    const response = await fetch(`/api/notifications?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }
    return response.json();
  },

  create: async (data: { 
    notificationData: Partial<Notification>; 
    businessId: string;
  }) => {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create notification');
    }
    return response.json();
  },

  update: async ({ id, data }: { id: string; data: Partial<Notification> }) => {
    const response = await fetch(`/api/notifications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update notification');
    }
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`/api/notifications/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete notification');
    }
    return response.json();
  },

  markAsRead: async (id: string) => {
    const response = await fetch(`/api/notifications/${id}/read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }
    return response.json();
  },

  markAllAsRead: async (businessId: string) => {
    const response = await fetch(`/api/notifications/mark-all-read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId }),
    });
    if (!response.ok) {
      throw new Error('Failed to mark all notifications as read');
    }
    return response.json();
  },

  getUnreadCount: async (businessId: string) => {
    const response = await fetch(`/api/notifications/unread-count?businessId=${businessId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch unread count');
    }
    return response.json();
  },
};

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...notificationKeys.lists(), { ...filters }] as const,
  details: () => [...notificationKeys.all, 'detail'] as const,
  detail: (id: string) => [...notificationKeys.details(), id] as const,
  unreadCount: (businessId: string) => [...notificationKeys.all, 'unread-count', businessId] as const,
};

export const useNotification = (notificationId: string) => {
  return useQuery({
    queryKey: notificationKeys.detail(notificationId),
    queryFn: () => notificationApi.getById(notificationId),
    enabled: !!notificationId,
  });
};

export const useBusinessNotifications = (
  businessId: string,
  filters?: {
    type?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }
) => {
  return useQuery({
    queryKey: notificationKeys.list({ businessId, ...filters }),
    queryFn: () => notificationApi.getByBusiness({ businessId, ...filters }),
    enabled: !!businessId,
  });
};

export const useUnreadNotificationCount = (businessId: string) => {
  return useQuery({
    queryKey: notificationKeys.unreadCount(businessId),
    queryFn: () => notificationApi.getUnreadCount(businessId),
    enabled: !!businessId,
  });
};

export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationApi.create,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: notificationKeys.list({ businessId: variables.businessId }) 
      });
      queryClient.invalidateQueries({ 
        queryKey: notificationKeys.unreadCount(variables.businessId) 
      });
    },
  });
};

export const useUpdateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationApi.update,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: notificationKeys.detail(data.id)
      });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationApi.delete,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: notificationKeys.detail(variables)
      });
    },
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: notificationKeys.detail(variables)
      });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: notificationKeys.list({ businessId: variables }) 
      });
      queryClient.invalidateQueries({ 
        queryKey: notificationKeys.unreadCount(variables) 
      });
    },
  });
};
