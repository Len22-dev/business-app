// Refactored Multipurpose ItemSelector
"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { X, Plus, AlertTriangle, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useInventory } from "@/hooks/useGeneral"

type ItemType = 'sale' | 'purchase' | 'transfer' | 'adjustment'

interface ItemSelectorProps {
  userId: string
  onItemsChange: (items: TransactionItem[]) => void
  type: ItemType
  businessId: string
  requireInventorySelection?: boolean // Optional prop to control inventory requirement
  showInventoryInfo?: boolean // Show inventory levels and pricing info
}

export interface TransactionItem {
  productId?: string | null
  name: string
  quantity: number
  price: number
  total: number
  availableQuantity?: number // For display purposes
}

// Define the expected inventory structure
interface InventoryWithProducts {
  id: string
  product_id: string
  available_quantity: number
  products: {
    name: string
    unit_price: number
  }
}

export function ItemSelector({ 
  onItemsChange, 
  type, 
  businessId,
  requireInventorySelection = false, // Default to false for flexibility
  showInventoryInfo = true // Default to true
}: ItemSelectorProps) {
  const [items, setItems] = useState<TransactionItem[]>([{ 
    name: "", 
    quantity: 1, 
    price: 0, 
    total: 0,
    productId: null 
  }])
  const [suggestions, setSuggestions] = useState<InventoryWithProducts[]>([])
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number | null>(null)
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null)
  const [errors, setErrors] = useState<{[key: number]: string}>({})
  const [showSuggestionsFor, setShowSuggestionsFor] = useState<number | null>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Use React Query for inventory data
  const { 
    data: inventoryItems = [], 
    isLoading, 
    error: inventoryError,
    refetch: refetchInventory
  } = useInventory(businessId)

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setSuggestions([])
        setActiveItemIndex(null)
        setShowSuggestionsFor(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Get type-specific configuration
  const getTypeConfig = (itemType: ItemType) => {
    switch (itemType) {
      case 'sale':
        return {
          label: 'Sale Items',
          requireInventory: true,
          showAvailableQuantity: true,
          useSuggestedPrice: true,
          validationMessage: 'Please select products from inventory for sales'
        }
      case 'purchase':
        return {
          label: 'Purchase Items',
          requireInventory: false,
          showAvailableQuantity: false,
          useSuggestedPrice: false,
          validationMessage: 'Items can be new or existing products'
        }
      case 'transfer':
        return {
          label: 'Transfer Items',
          requireInventory: true,
          showAvailableQuantity: true,
          useSuggestedPrice: false,
          validationMessage: 'Please select products from inventory for transfers'
        }
      case 'adjustment':
        return {
          label: 'Adjustment Items',
          requireInventory: true,
          showAvailableQuantity: true,
          useSuggestedPrice: false,
          validationMessage: 'Please select products from inventory for adjustments'
        }
      default:
        return {
          label: 'Items',
          requireInventory: requireInventorySelection,
          showAvailableQuantity: showInventoryInfo,
          useSuggestedPrice: false,
          validationMessage: 'Please select valid products'
        }
    }
  }

  const typeConfig = getTypeConfig(type)

  // Validate item based on type
  const validateItem = (index: number, item: TransactionItem) => {
    const newErrors = { ...errors }
    
    if (typeConfig.requireInventory && !item.productId && item.name) {
      newErrors[index] = typeConfig.validationMessage
    } else {
      delete newErrors[index]
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Show all suggestions when field is focused
  const showAllSuggestions = (index: number) => {
    setSuggestions(inventoryItems)
    setActiveItemIndex(index)
    setShowSuggestionsFor(index)
    setActiveSuggestionIndex(null)
  }

  // Filter suggestions based on input
  const filterSuggestions = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      return inventoryItems
    }
    
    return inventoryItems.filter((item: InventoryWithProducts) =>
      item.products?.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  // Handle item change
  const handleItemChange = (index: number, field: keyof TransactionItem, value: string | number) => {
    const newItems = [...items]

    if (field === "name") {
      newItems[index][field] = value as string
      
      // Clear productId when name changes manually (unless it matches exactly)
      const exactMatch = inventoryItems.find((item: InventoryWithProducts) => 
        item.products?.name.toLowerCase() === (value as string).toLowerCase()
      )
      
      if (!exactMatch) {
        newItems[index].productId = null
        newItems[index].availableQuantity = undefined
      }

      // Filter suggestions based on input
      const filtered = filterSuggestions(value as string)
      setSuggestions(filtered)
      setActiveItemIndex(index)
      setShowSuggestionsFor(index)
      setActiveSuggestionIndex(null)
    } else {
      newItems[index][field] = value as number
    }

    // Recalculate total
    if (field === "quantity" || field === "price") {
      newItems[index].total = newItems[index].quantity * newItems[index].price
    }

    // Validate the item
    validateItem(index, newItems[index])

    setItems(newItems)
    onItemsChange(newItems)
  }

  // Select suggestion
  const selectSuggestion = (suggestionIndex: number) => {
    if (activeItemIndex !== null && suggestions.length > 0) {
      const selectedItem = suggestions[suggestionIndex]
      const newItems = [...items]

      newItems[activeItemIndex] = {
        ...newItems[activeItemIndex],
        productId: selectedItem.product_id,
        name: selectedItem.products.name,
        availableQuantity: selectedItem.available_quantity,
        price: typeConfig.useSuggestedPrice ? 
          Number(selectedItem.products.unit_price) : 
          newItems[activeItemIndex].price,
        total: typeConfig.useSuggestedPrice ? 
          Number(selectedItem.products.unit_price) * newItems[activeItemIndex].quantity : 
          newItems[activeItemIndex].price * newItems[activeItemIndex].quantity,
      }

      // Clear error for this item
      const newErrors = { ...errors }
      delete newErrors[activeItemIndex]
      setErrors(newErrors)

      setItems(newItems)
      onItemsChange(newItems)
      setSuggestions([])
      setActiveItemIndex(null)
      setShowSuggestionsFor(null)
    }
  }

  // Add new item
  const addItem = () => {
    const newItem: TransactionItem = { 
      productId: null, 
      name: "", 
      quantity: 1, 
      price: 0, 
      total: 0 
    }
    setItems([...items, newItem])
  }

  // Remove item
  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index)
      const newErrors = { ...errors }
      delete newErrors[index]
      
      // Reindex errors
      const reindexedErrors: {[key: number]: string} = {}
      Object.keys(newErrors).forEach(key => {
        const numKey = parseInt(key)
        if (numKey > index) {
          reindexedErrors[numKey - 1] = newErrors[numKey]
        } else if (numKey < index) {
          reindexedErrors[numKey] = newErrors[numKey]
        }
      })
      
      setErrors(reindexedErrors)
      setItems(newItems)
      onItemsChange(newItems)
    }
  }

  // Handle keyboard navigation for suggestions
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" && showSuggestionsFor !== index) {
      e.preventDefault()
      showAllSuggestions(index)
      return
    }

    if (suggestions.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveSuggestionIndex((prev) => (prev === null ? 0 : Math.min(prev + 1, suggestions.length - 1)))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveSuggestionIndex((prev) => (prev === null ? suggestions.length - 1 : Math.max(prev - 1, 0)))
    } else if (e.key === "Enter" && activeSuggestionIndex !== null) {
      e.preventDefault()
      selectSuggestion(activeSuggestionIndex)
    } else if (e.key === "Escape") {
      setSuggestions([])
      setActiveItemIndex(null)
      setShowSuggestionsFor(null)
    }
  }

  // Count items that need inventory selection
  const itemsNeedingInventorySelection = typeConfig.requireInventory ? 
    items.filter((item) => !item.productId && item.name).length : 0

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>{typeConfig.label}</Label>
          <Button type="button" variant="outline" size="sm" disabled>
            <Plus className="mr-1 h-4 w-4" /> Add Item
          </Button>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading inventory...</span>
        </div>
      </div>
    )
  }

  // Show error state
  if (inventoryError) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>{typeConfig.label}</Label>
          <Button type="button" variant="outline" size="sm" disabled>
            <Plus className="mr-1 h-4 w-4" /> Add Item
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load inventory. 
            <Button 
              variant="link" 
              className="p-0 h-auto ml-1" 
              onClick={() => refetchInventory()}
            >
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>{typeConfig.label}</Label>
        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          <Plus className="mr-1 h-4 w-4" /> Add Item
        </Button>
      </div>

      {/* Show validation warning */}
      {itemsNeedingInventorySelection > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {itemsNeedingInventorySelection} item(s) need to be selected from inventory. {typeConfig.validationMessage}.
          </AlertDescription>
        </Alert>
      )}

      {/* Show empty inventory warning */}
      {inventoryItems.length === 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No inventory items found. Please add products to your inventory first.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="relative grid grid-cols-12 gap-2 items-center">
              <div className="col-span-5 relative">
                <Input
                  placeholder="Item name (Press Enter or click to see suggestions)"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, "name", e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={() => showAllSuggestions(index)}
                  onMouseEnter={() => {
                    if (!showSuggestionsFor) {
                      showAllSuggestions(index)
                    }
                  }}
                  className={errors[index] ? "border-red-500" : ""}
                />

                {/* Suggestions dropdown */}
                {suggestions.length > 0 && showSuggestionsFor === index && (
                  <div
                    ref={suggestionsRef}
                    className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg max-h-60 overflow-auto"
                  >
                    {suggestions.map((suggestion, i) => (
                      <div
                        key={suggestion.id}
                        className={`px-4 py-2 cursor-pointer hover:bg-muted ${
                          i === activeSuggestionIndex ? "bg-muted" : ""
                        }`}
                        onClick={() => selectSuggestion(i)}
                      >
                        <div className="font-medium">{suggestion.products.name}</div>
                        {showInventoryInfo && (
                          <div className="text-xs text-muted-foreground flex justify-between">
                            <span>In stock: {suggestion.available_quantity}</span>
                            <span>Price: ₦{Number(suggestion.products.unit_price).toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="col-span-2">
                <Input
                  type="number"
                  min="1"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, "quantity", Number.parseInt(e.target.value) || 1)}
                />
                {/* Show available quantity warning for sales/transfers */}
                {item.availableQuantity !== undefined && 
                 typeConfig.showAvailableQuantity && 
                 item.quantity > item.availableQuantity && (
                  <p className="text-xs text-orange-500 mt-1">
                    Only {item.availableQuantity} available
                  </p>
                )}
              </div>

              <div className="col-span-2">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, "price", Number.parseFloat(e.target.value) || 0)}
                  disabled={typeConfig.useSuggestedPrice && item.productId !== null}
                />
              </div>

              <div className="col-span-2">
                <Input readOnly value={`₦${item.total.toFixed(2)}`} className="bg-muted" />
              </div>

              <div className="col-span-1 flex justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            </div>
            
            {/* Show error for this item */}
            {errors[index] && (
              <p className="text-sm text-red-500 ml-1">{errors[index]}</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <div className="text-lg font-semibold">
          Total: ₦{items.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
        </div>
      </div>
    </div>
  )
}