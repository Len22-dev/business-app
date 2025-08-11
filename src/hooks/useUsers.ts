// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from '@/lib/drizzle/types';

// API Functions
const userApi = {
  getById: async (userId: string): Promise<User> => {
    const response = await fetch(`/api/users?id=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    return response.json();
  },

  create: async (userData: User): Promise<User> => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error('Failed to create user');
    }
    return response.json();
  },

  update: async ({ userId, userData }: { userId: string; userData: User }): Promise<User> => {
    const response = await fetch(`/api/users?id=${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error('Failed to update user');
    }
    return response.json();
  },
};

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  byId: (id: string) => [...userKeys.all, id] as const,
};

// Hooks
export const useUser = (userId: string) => {
  return useQuery({
    queryKey: userKeys.byId(userId),
    queryFn: () => userApi.getById(userId),
    enabled: !!userId,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.create,
    onSuccess: (newUser) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      // Optionally set the new user data
      queryClient.setQueryData(userKeys.byId(newUser.id), newUser);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.update,
    onSuccess: (updatedUser) => {
      // Update the specific user query
      queryClient.setQueryData(userKeys.byId(updatedUser.id), updatedUser);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};