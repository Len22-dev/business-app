// hooks/useInventory.ts - React Query hooks that call API routes
import { useQuery } from '@tanstack/react-query'
import { inventoryKeys } from '@/lib/drizzle/queries/general-queries';

// Client-side API functions (called by React Query hooks)
export const inventoryApi = {
  getInventory: async ({  businessId }: {  businessId: string }) => {
    const response = await fetch(`/api/general/inventory?businessId=${businessId}`)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch inventory')
    }

    return response.json()
  },
  getCustomer: async ({  businessId }: {  businessId: string }) => {
    const response = await fetch(`/api/general/customer?businessId=${businessId}`)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch inventory')
    }

    return response.json()
  },

  getBanks: async ({  businessId }: {  businessId: string }) => {
    const response = await fetch(`/api/general/banks?businessId=${businessId}`)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch banks')
    }

    return response.json()
  },

  getCards: async ({ bankId,  businessId }: { bankId: string;  businessId: string }) => {
    const response = await fetch(`/api/general/cards?businessId=${businessId}&bankId=${bankId}`)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch cards')
    }

    return response.json()
  }
}

// React Query hooks
export const useInventory = ( businessId: string) => {
  return useQuery({
    queryKey: inventoryKeys.list({ businessId }),
    queryFn: () => inventoryApi.getInventory({  businessId }),
    enabled: !!businessId, // Only run if we have required params
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
     refetchOnWindowFocus: false,  // Don't refetch on window focus
  })
}
export const useCustomer = ( businessId: string) => {
  return useQuery({
    queryKey: inventoryKeys.list({ businessId }),
    queryFn: () => inventoryApi.getCustomer({  businessId }),
    enabled: !!businessId, // Only run if we have required params
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useBanks = ( businessId: string, enabled = true) => {
  return useQuery({
    queryKey: inventoryKeys.banks({ businessId }),
    queryFn: () => inventoryApi.getBanks({  businessId }),
    enabled:  !!businessId && enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes - banks don't change often
  })
}

export const useCards = (bankId: string, businessId: string, enabled = true) => {
  return useQuery({
    queryKey: inventoryKeys.cards({ bankId,  businessId }),
    queryFn: () => inventoryApi.getCards({ bankId,  businessId }),
    enabled: !!bankId  && !!businessId && enabled,
    staleTime: 10 * 60 * 1000,
  })
}