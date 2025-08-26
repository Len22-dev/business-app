// Improved Multipurpose ProductSelector with proper total calculations
"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Plus, AlertTriangle, Loader2, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useProducts } from "@/hooks/useGeneral"
import { ProductItem, ItemSelectorProps } from "@/types/product-selector"

export function ProductSelector({ 
  onItemsChange, 
  businessId,
}: ItemSelectorProps) {
  const [items, setItems] = useState<ProductItem[]>([{ 
    id: null, 
    name: "", 
    quantity: 1, 
    cost: 0, 
    total: 0,
  }])
  const [suggestions, setSuggestions] = useState<ProductItem[]>([])
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number | null>(null)
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null)
  const [errors, setErrors] = useState<Record<number, string>>({})
  const [showSuggestionsFor, setShowSuggestionsFor] = useState<number | null>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Use React Query for product data
  const { 
    data: productItems = [], 
    isLoading, 
    error: productError,
    refetch: refetchProduct
  } = useProducts(businessId)

  // Calculate total for a single item
  const calculateItemTotal = useCallback((quantity: number, cost: number): number => {
    return Number((quantity * cost).toFixed(2))
  }, [])

  // Calculate grand total for all items
  const grandTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }, [items])

  // Update items and notify parent component
  const updateItems = useCallback((newItems: ProductItem[]) => {
    setItems(newItems)
    onItemsChange(newItems)
  }, [onItemsChange])

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

  // Validate item without causing re-renders
  const validateItem = useCallback((index: number, item: ProductItem): { hasError: boolean; errorMessage?: string } => {
    if (!item.id && item.name.trim()) {
      return { hasError: true, errorMessage: 'Please select a valid product from the suggestions' }
    } else if (item.quantity <= 0) {
      return { hasError: true, errorMessage: 'Quantity must be greater than 0' }
    } else if (item.cost < 0) {
      return { hasError: true, errorMessage: 'Cost cannot be negative' }
    }
    
    return { hasError: false }
  }, [])

  // Show all suggestions when field is focused
  const showAllSuggestions = useCallback((index: number) => {
    setSuggestions(productItems)
    setActiveItemIndex(index)
    setShowSuggestionsFor(index)
    setActiveSuggestionIndex(null)
  }, [productItems])

  // Filter suggestions based on input
  const filterSuggestions = useCallback((searchTerm: string): ProductItem[] => {
    if (!searchTerm.trim()) {
      return productItems
    }
    
    return productItems.filter((item: ProductItem) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [productItems])

  // Handle item change with proper total calculation
  const handleItemChange = useCallback((index: number, field: keyof ProductItem, value: string | number) => {
    const newItems = [...items]
    const currentItem = { ...newItems[index] }

    if (field === "name") {
      currentItem[field] = value as string
      
      // Clear productId when name changes manually (unless it matches exactly)
      const exactMatch = productItems.find((item: ProductItem) =>
        item.name.toLowerCase() === (value as string).toLowerCase()
      )
      
      if (!exactMatch) {
        currentItem.id = null
      }

      // Filter suggestions based on input
      const filtered = filterSuggestions(value as string)
      setSuggestions(filtered)
      setActiveItemIndex(index)
      setShowSuggestionsFor(index)
      setActiveSuggestionIndex(null)
    } else if (field === "quantity") {
      // Handle quantity with validation
      const quantity = Number.parseInt(value as string) || 0
      currentItem.quantity = Math.max(1, quantity)
    } else if (field === "cost") {
      // Handle cost - allow empty string for better UX
      const costValue = value as string
      if (costValue === "" || costValue === ".") {
        currentItem.cost = 0
      } else {
        const parsedCost = Number.parseFloat(costValue)
        currentItem.cost = isNaN(parsedCost) ? 0 : Math.max(0, parsedCost)
      }
    }

    // Recalculate total whenever quantity or cost changes
    currentItem.total = calculateItemTotal(currentItem.quantity || 0, currentItem.cost || 0)

    // Update the item in the array
    newItems[index] = currentItem

    // Validate the item and update errors separately
    const validation = validateItem(index, currentItem)
    if (validation.hasError && validation.errorMessage) {
      setErrors(prev => ({ ...prev, [index]: validation.errorMessage! }))
    } else {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[index]
        return newErrors
      })
    }

    updateItems(newItems)
  }, [items, productItems, filterSuggestions, calculateItemTotal, validateItem, updateItems])

  // Select suggestion with proper cost handling
  const selectSuggestion = useCallback((suggestionIndex: number) => {
    if (activeItemIndex !== null && suggestions.length > 0) {
      const selectedItem = suggestions[suggestionIndex]
      const newItems = [...items]
      const currentItem = { ...newItems[activeItemIndex] }

      // Update item with selected product details
      currentItem.id = selectedItem.id
      currentItem.name = selectedItem.name
      // Preserve existing cost if available, otherwise use 0
      currentItem.cost = currentItem.cost || 0
       currentItem.total = calculateItemTotal((currentItem.quantity || 0), (currentItem.cost || 0))

      newItems[activeItemIndex] = currentItem

      // Clear error for this item
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[activeItemIndex]
        return newErrors
      })

      updateItems(newItems)
      setSuggestions([])
      setActiveItemIndex(null)
      setShowSuggestionsFor(null)
    }
  }, [activeItemIndex, suggestions, items, calculateItemTotal,  updateItems])

  

  // Add new item
  const addItem = useCallback(() => {
    const newItem: ProductItem = { 
      id: null, 
      name: "", 
      quantity: 1, 
      cost: 0, 
      total: 0 
    }
    updateItems([...items, newItem])
  }, [items, updateItems])

  // Remove item with proper error reindexing
  const removeItem = useCallback((index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index)
      const newErrors = { ...errors }
      delete newErrors[index]
      
      // Reindex errors
      const reindexedErrors: Record<number, string> = {}
      Object.keys(newErrors).forEach(key => {
        const numKey = parseInt(key)
        if (numKey > index) {
          reindexedErrors[numKey - 1] = newErrors[numKey]
        } else if (numKey < index) {
          reindexedErrors[numKey] = newErrors[numKey]
        }
      })
      
      setErrors(reindexedErrors)
      updateItems(newItems)
    }
  }, [items, errors, updateItems])

  // Handle keyboard navigation for suggestions
  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
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
  }, [showSuggestionsFor, suggestions.length, activeSuggestionIndex, showAllSuggestions, selectSuggestion])

  // Format currency
  const formatCurrency = useCallback((amount: number): string => {
    return `₦ ${amount.toFixed(2)}`
  }, [])

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Products</Label>
          <Button type="button" variant="outline" size="sm" disabled>
            <Plus className="mr-1 h-4 w-4" /> Add Item
          </Button>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading products...</span>
        </div>
      </div>
    )
  }

  // Show error state
  if (productError) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Products</Label>
          <Button type="button" variant="outline" size="sm" disabled>
            <Plus className="mr-1 h-4 w-4" /> Add Item
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load products. Please check your connection or try again later.
            <Button
              variant="link"
              className="p-0 h-auto ml-1"
              onClick={() => refetchProduct()}
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
        <Label className="text-base font-medium">Products</Label>
        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          <Plus className="mr-1 h-4 w-4" /> Add Item
        </Button>
      </div>

      {/* Show empty inventory warning */}
      {productItems.length === 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No products found. Please add products to your inventory first.
          </AlertDescription>
        </Alert>
      )}

      {/* Column headers for better UX */}
      <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground">
        <div className="col-span-5">Product Name</div>
        <div className="col-span-2">Quantity</div>
        <div className="col-span-2">Unit Cost</div>
        <div className="col-span-2">Total</div>
        <div className="col-span-1 text-center">Action</div>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="relative grid grid-cols-12 gap-2 items-center">
              {/* Product Name Input */}
              <div className="col-span-5 relative">
                <Input
                  placeholder="Search and select product..."
                  value={item.name}
                  onChange={(e) => handleItemChange(index, "name", e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={() => showAllSuggestions(index)}
                  className={errors[index] ? "border-destructive" : ""}
                  aria-describedby={errors[index] ? `error-${index}` : undefined}
                />

                {/* Suggestions dropdown */}
                {suggestions.length > 0 && showSuggestionsFor === index && (
                  <div
                    ref={suggestionsRef}
                    className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg max-h-60 overflow-auto"
                  >
                    {suggestions.map((suggestion, i) => (
                      <div
                        key={suggestion.id || `suggestion-${i}`}
                        className={`px-4 py-2 cursor-pointer hover:bg-muted transition-colors ${
                          i === activeSuggestionIndex ? "bg-muted" : ""
                        }`}
                        onClick={() => selectSuggestion(i)}
                      >
                        <div className="font-medium">{suggestion.name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quantity Input */}
              <div className="col-span-2">
                <Input
                  type="number"
                  min="1"
                  placeholder="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                  className="text-center"
                />
              </div>

              {/* Unit Cost Input */}
              <div className="col-span-2">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={item.cost || ""}
                  onChange={(e) => handleItemChange(index, "cost", e.target.value)}
                  className="text-right"
                />
              </div>

              {/* Total Display */}
              <div className="col-span-2">
                <Input 
                  readOnly 
                  value={formatCurrency(item.total)} 
                  className="bg-muted text-right font-medium" 
                  tabIndex={-1}
                />
              </div>

              {/* Remove Button */}
              <div className="col-span-1 flex justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove item</span>
                </Button>
              </div>
            </div>
            
            {/* Show error for this item */}
            {errors[index] && (
              <p id={`error-${index}`} className="text-sm text-destructive ml-1" role="alert">
                {errors[index]}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Grand Total */}
      <div className="flex justify-end border-t pt-4">
        <div className="text-lg font-semibold">
          Grand Total: {formatCurrency(grandTotal)}
        </div>
      </div>
    </div>
  )
}