"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { ChevronDown, Loader2, AlertTriangle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useBusinessVendors } from "@/hooks/useVendor"

interface VendorSelectorProps {
  businessId: string
  onVendorChange: (vendorId: string | null) => void
  placeholder?: string
  label?: string
  required?: boolean
  defaultValue?: string
  disabled?: boolean
  className?: string
  error?: string
}

interface VendorItem {
  id: string
  name: string
  email?: string
  phone?: string
}

export function VendorSelector({ 
  businessId,
  onVendorChange,
  placeholder = "Select a vendor...",
  label = "Vendor",
  required = false,
  defaultValue = "",
  disabled = false,
  className = "",
  error
}: VendorSelectorProps) {
  const [inputValue, setInputValue] = useState(defaultValue)
  const [isOpen, setIsOpen] = useState(false)
  const [filteredVendors, setFilteredVendors] = useState<VendorItem[]>([])
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(-1)
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Fetch vendors using React Query
  const { 
    data: vendorsData, 
    isLoading, 
    error: vendorError,
    refetch: refetchVendors
  } = useBusinessVendors(businessId, {
    isActive: true,
    limit: 100
  })

  const vendors = vendorsData?.vendors || []

  // Filter vendors based on input
  const filterVendors = useCallback((searchValue: string) => {
    if (!searchValue.trim()) {
      return vendors
    }
    return vendors.filter((vendor: VendorItem) =>
      vendor.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      vendor.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
      vendor.phone?.includes(searchValue)
    )
  }, [vendors])

  // Update filtered vendors when input changes
  useEffect(() => {
    const filtered = filterVendors(inputValue)
    setFilteredVendors(filtered)
    setActiveSuggestionIndex(-1)
  }, [inputValue, filterVendors])

  // Handle input value changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    setSelectedVendorId(null)
    setIsOpen(true)
    
    // Notify parent that no vendor is selected when typing
    onVendorChange(null)
  }

  // Handle input focus
  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true)
      setFilteredVendors(filterVendors(inputValue))
    }
  }

  // Handle input blur with delay to allow for suggestion clicks
  const handleInputBlur = () => {
    setTimeout(() => {
      setIsOpen(false)
      setActiveSuggestionIndex(-1)
    }, 150)
  }

  // Select a vendor
  const selectVendor = (vendor: VendorItem) => {
    setInputValue(vendor.name)
    setSelectedVendorId(vendor.id)
    setIsOpen(false)
    setActiveSuggestionIndex(-1)
    onVendorChange(vendor.id)
    inputRef.current?.blur()
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredVendors.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setActiveSuggestionIndex(prev => 
          prev < filteredVendors.length - 1 ? prev + 1 : 0
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setActiveSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : filteredVendors.length - 1
        )
        break
      case "Enter":
        e.preventDefault()
        if (activeSuggestionIndex >= 0 && filteredVendors[activeSuggestionIndex]) {
          selectVendor(filteredVendors[activeSuggestionIndex])
        }
        break
      case "Escape":
        setIsOpen(false)
        setActiveSuggestionIndex(-1)
        inputRef.current?.blur()
        break
      case "Tab":
        setIsOpen(false)
        setActiveSuggestionIndex(-1)
        break
    }
  }

  // Handle dropdown toggle
  const toggleDropdown = () => {
    if (disabled) return
    
    if (isOpen) {
      setIsOpen(false)
      inputRef.current?.blur()
    } else {
      setIsOpen(true)
      setFilteredVendors(filterVendors(inputValue))
      inputRef.current?.focus()
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setActiveSuggestionIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Scroll active suggestion into view
  useEffect(() => {
    if (activeSuggestionIndex >= 0 && suggestionsRef.current) {
      const activeElement = suggestionsRef.current.children[activeSuggestionIndex] as HTMLElement
      if (activeElement) {
        activeElement.scrollIntoView({ block: "nearest" })
      }
    }
  }, [activeSuggestionIndex])

  // Loading state
  if (isLoading) {
    return (
      <div className={`space-y-2 ${className}`}>
        {label && <Label>{label}{required && " *"}</Label>}
        <div className="relative">
          <Input 
            disabled 
            placeholder="Loading vendors..." 
            className="pr-10"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (vendorError) {
    return (
      <div className={`space-y-2 ${className}`}>
        {label && <Label>{label}{required && " *"}</Label>}
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load vendors.{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto underline" 
              onClick={() => refetchVendors()}
            >
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`} ref={containerRef}>
      {label && (
        <Label htmlFor="vendor-input">
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <div className="relative">
        <Input
          id="vendor-input"
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={`pr-10 ${selectedVendorId ? 'border-green-500' : ''} ${error ? 'border-red-500 focus:border-red-500' : ''}`}
          autoComplete="off"
        />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={toggleDropdown}
          disabled={disabled}
          tabIndex={-1}
        >
          <ChevronDown 
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </Button>

        {/* Suggestions Dropdown */}
        {isOpen && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {filteredVendors.length > 0 ? (
              filteredVendors.map((vendor, index) => (
                <div
                  key={vendor.id}
                  className={`px-4 py-3 cursor-pointer transition-colors ${
                    index === activeSuggestionIndex 
                      ? 'bg-blue-50 text-blue-900' 
                      : 'hover:bg-gray-50'
                  } ${
                    selectedVendorId === vendor.id 
                      ? 'bg-green-50 text-green-900' 
                      : ''
                  }`}
                  onClick={() => selectVendor(vendor)}
                  onMouseEnter={() => setActiveSuggestionIndex(index)}
                >
                  <div className="font-medium">{vendor.name}</div>
                  {vendor.email && (
                    <div className="text-sm text-gray-500">{vendor.email}</div>
                  )}
                  {vendor.phone && (
                    <div className="text-sm text-gray-500">{vendor.phone}</div>
                  )}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500 text-center">
                {inputValue ? 'No matching vendors found' : 'No vendors available'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}

      {/* Empty vendors warning */}
      {vendors.length === 0 && !isLoading && !vendorError && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No vendors found. Please add vendors first.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}