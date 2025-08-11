"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { ChevronDown, Loader2, AlertTriangle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useBusinessLocations } from "@/hooks/useLocation"

interface LocationSelectorProps {
  businessId: string
  onLocationChange: (locationId: string | null) => void
  placeholder?: string
  label?: string
  required?: boolean
  defaultValue?: string
  disabled?: boolean
  className?: string
  error?: string
}

interface LocationItem {
  id: string
  name: string
}

export function LocationSelector({ 
  businessId,
  onLocationChange,
  placeholder = "Select a location...",
  label = "Location",
  required = false,
  defaultValue = "",
  disabled = false,
  className = "",
  error
}: LocationSelectorProps) {
  const [inputValue, setInputValue] = useState(defaultValue)
  const [isOpen, setIsOpen] = useState(false)
  const [filteredLocations, setFilteredLocations] = useState<LocationItem[]>([])
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(-1)
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Fetch locations using React Query
  const { 
    data: locations = [], 
    isLoading, 
    error: locationError,
    refetch: refetchLocations
  } = useBusinessLocations(businessId)

  // Filter locations based on input
  const filterLocations = useCallback((searchValue: string) => {
    if (!searchValue.trim()) {
      return locations
    }
    return locations.filter((location: LocationItem) =>
      location.name.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [locations])

  // Update filtered locations when input changes
  useEffect(() => {
    const filtered = filterLocations(inputValue)
    setFilteredLocations(filtered)
    setActiveSuggestionIndex(-1)
  }, [inputValue, filterLocations])

  // Handle input value changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    setSelectedLocationId(null)
    setIsOpen(true)
    
    // Notify parent that no location is selected when typing
    onLocationChange(null)
  }

  // Handle input focus
  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true)
      setFilteredLocations(filterLocations(inputValue))
    }
  }

  // Handle input blur with delay to allow for suggestion clicks
  const handleInputBlur = () => {
    setTimeout(() => {
      setIsOpen(false)
      setActiveSuggestionIndex(-1)
    }, 150)
  }

  // Select a location
  const selectLocation = (location: LocationItem) => {
    setInputValue(location.name)
    setSelectedLocationId(location.id)
    setIsOpen(false)
    setActiveSuggestionIndex(-1)
    onLocationChange(location.id)
    inputRef.current?.blur()
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredLocations.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setActiveSuggestionIndex(prev => 
          prev < filteredLocations.length - 1 ? prev + 1 : 0
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setActiveSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : filteredLocations.length - 1
        )
        break
      case "Enter":
        e.preventDefault()
        if (activeSuggestionIndex >= 0 && filteredLocations[activeSuggestionIndex]) {
          selectLocation(filteredLocations[activeSuggestionIndex])
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
      setFilteredLocations(filterLocations(inputValue))
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
            placeholder="Loading locations..." 
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
  if (locationError) {
    return (
      <div className={`space-y-2 ${className}`}>
        {label && <Label>{label}{required && " *"}</Label>}
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load locations.{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto underline" 
              onClick={() => refetchLocations()}
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
        <Label htmlFor="location-input">
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <div className="relative">
        <Input
          id="location-input"
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={`pr-10 ${selectedLocationId ? 'border-green-500' : ''} ${error ? 'border-red-500 focus:border-red-500' : ''}`}
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
            {filteredLocations.length > 0 ? (
              filteredLocations.map((location, index) => (
                <div
                  key={location.id}
                  className={`bg-black text-accent-foreground px-4 py-3 cursor-pointer transition-colors ${
                    index === activeSuggestionIndex 
                      ? 'bg-blue-50 text-blue-900' 
                      : 'hover:bg-gray-50'
                  } ${
                    selectedLocationId === location.id 
                      ? 'bg-green-50 text-green-900' 
                      : ''
                  }`}
                  onClick={() => selectLocation(location)}
                  onMouseEnter={() => setActiveSuggestionIndex(index)}
                >
                  <div className="font-medium">{location.name}</div>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500 text-center">
                {inputValue ? 'No matching locations found' : 'No locations available'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}

      {/* Empty locations warning */}
      {locations.length === 0 && !isLoading && !locationError && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No locations found. Please add locations first.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}