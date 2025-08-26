// types/product-selector.ts
export interface ProductItem {
  id: string | null
  name: string
  quantity: number
  cost: number
  total: number
}

export interface ItemSelectorProps {
  userId?: string
  onItemsChange: (items: ProductItem[]) => void
  businessId: string
}

export interface ProductSelectorErrors {
  [key: number]: string
}

export interface SuggestionItem extends ProductItem {
  available_quantity?: number
  unit_price?: number
}