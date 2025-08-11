import { createClient } from "@/lib/supabase/client"
import type { InventoryItem } from "@/lib/types"

const supabase = createClient()

export const inventoryQueries = {
  // Query functions (pure functions that return promises)
  getInventory: async ({ businessId }: { businessId: string }): Promise<InventoryItem[]> => {
    const { data, error } = await supabase
      .from("inventory")
      .select(`*,
        products(
        name,
        unit_price
        )`)
      .eq("business_id", businessId)
      .gt("available_quantity", 0)
      .order("created_at")

    if (error) throw error
    return data || []
  },

  getCustomer: async ({ businessId }: {  businessId: string }) => {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("business_id", businessId)
      .eq("is_active", true)
      .order("name")

    if (error) throw error
    return data || []
  },
  getBanks: async ({ businessId }: {  businessId: string }) => {
    const { data, error } = await supabase
      .from("banks")
      .select("*")
     // .eq("user_id", userId)
      .eq("business_id", businessId)
      .eq("is_active", true)
      .order("name")

    if (error) throw error
    return data || []
  },

  getCards: async ({ bankId,  businessId }: { bankId: string;  businessId: string }) => {
    const { data, error } = await supabase
      .from("bank_cards")
      .select("*")
      .eq("bank_id", bankId)
      .eq("business_id", businessId)
     // .eq("user_id", userId)
      .eq("is_active", true)

    if (error) throw error
    return data || []
  }
}

// Query keys for consistent caching
export const inventoryKeys = {
  all: ['inventory'] as const,
  lists: () => [...inventoryKeys.all, 'list'] as const,
  list: (filters: {  businessId: string }) => 
    [...inventoryKeys.lists(), filters] as const,
  banks: (filters: {  businessId: string }) => 
    ['banks', filters] as const,
  cards: (filters: { bankId: string;  businessId: string }) => 
    ['cards', filters] as const,
}