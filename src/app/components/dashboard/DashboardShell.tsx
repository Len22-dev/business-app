// File: app/(protected)/dashboard/components/dashboard-shell.tsx
"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "./Sidebar"
import { TopNav } from "./TopNav"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Extract active tab from pathname
  const getActiveTab = useCallback(() => {
    const segments = pathname.split('/')
    const lastSegment = segments[segments.length - 1]
    
    // Map paths to tab IDs
    const pathToTab: Record<string, string> = {
      'dashboard': 'dashboard',
      'sales': 'sales',
      'expenses': 'expense',
      'inventory': 'inventory',
      'purchases': 'purchase',
      'finance': 'finance',
      'banking': 'banking',
      'report': 'reports',
      'settings': 'settings',
      'documents': 'documents',
      'profile': 'profile'
    }

    // Check if the path contains business management for team
    if (pathname.includes('/business/manage') && pathname.includes('users')) {
      return 'team'
    }

    return pathToTab[lastSegment] || 'dashboard'
  }, [pathname])

  const handleSidebarToggle = useCallback(() => {
    setIsSidebarOpen(prev => !prev)
  }, [])

  const handleMobileMenuToggle = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev)
  }, [])

  const handleTabChange = useCallback(() => {
    // On mobile, close the sidebar when a tab is selected
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsMobileMenuOpen(false)
    }
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Desktop */}
      <div className="hidden md:block">
        <Sidebar
          isOpen={isSidebarOpen}
          activeTab={getActiveTab()}
          onTabChange={handleTabChange}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Mobile Sidebar */}
          <div className="fixed left-0 top-0 h-full z-50 md:hidden">
            <Sidebar
              isOpen={true}
              activeTab={getActiveTab()}
              onTabChange={handleTabChange}
            />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav
          isSidebarOpen={isSidebarOpen}
          onSidebarToggle={handleSidebarToggle}
          onMobileMenuToggle={handleMobileMenuToggle}
        />
        <main className="flex-1 overflow-auto">
            <div className="p-6">
          {children}
            </div>
        </main>
      </div>
    </div>
  )
}