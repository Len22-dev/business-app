"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { 
  Menu, 
  Search, 
  X, 
  MonitorDot,
  Sun,
  Moon,
  Palette,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
// import { CurrentUserAvatar } from './current-user-avatar'
// import Link from 'next/link'
import { ModeToggle } from '@/components/Theme-Selecor'
import { UserNav } from './User-Nav'







interface TopNavProps {
  isSidebarOpen: boolean
  onSidebarToggle: () => void
  onMobileMenuToggle: () => void
  userId: string
}

export function TopNav({ 
  isSidebarOpen, 
  onSidebarToggle, 
  onMobileMenuToggle,
  userId
  
}: TopNavProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  // const baseUrl = "/protected/dashboard/profile"

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchExpanded(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Mock search suggestions
  const handleSearchInput = (query: string) => {
    setSearchQuery(query)
    setSuggestions(
      query ? ['Dashboard', 'Sales Report', 'Inventory', 'Settings'].filter(
        item => item.toLowerCase().includes(query.toLowerCase())
      ) : []
    )
  }

  return (
    <div className="sticky top-0 z-30 w-full border-b bg-green-100 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex h-14 items-center justify-between px-4 gap-4">
        {/* Left Section - Mobile Menu & Sidebar Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden" // Only show on mobile
            onClick={onMobileMenuToggle}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle mobile menu</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex" // Only show on desktop
            onClick={onSidebarToggle}
          >
            {isSidebarOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </div>

        {/* Center Section - Search */}
        <div 
          ref={searchRef}
          className="flex-1 max-w-md relative hidden sm:block"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-10 pr-4 transition-all duration-300 focus:w-full"
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              onFocus={() => setIsSearchExpanded(true)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                onClick={() => {
                  setSearchQuery('')
                  setSuggestions([])
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            
            {/* Search Suggestions Dropdown */}
            {isSearchExpanded && suggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-1 py-2 bg-popover border rounded-md shadow-lg">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="w-full px-4 py-2 text-left hover:bg-muted text-sm"
                    onClick={() => {
                      setSearchQuery(suggestion)
                      setIsSearchExpanded(false)
                      setSuggestions([])
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Theme & Avatar */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ModeToggle/>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MonitorDot className="mr-2 h-4 w-4" />
                System
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Palette className="mr-2 h-4 w-4" />
                Custom
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <UserNav userId={userId}/>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
             
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </div>
  )
}