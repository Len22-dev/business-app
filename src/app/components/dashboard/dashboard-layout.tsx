"use client"

import { useState, useEffect } from 'react'
import { TopNav } from './TopNav'
import { Sidebar } from './Sidebar'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isMobile, setIsMobile] = useState(false)

  // Handle responsive sidebar
  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768
      setIsMobile(isMobileView)
      if (!isMobileView && !isSidebarOpen) {
        setIsSidebarOpen(true)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [isSidebarOpen])

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div
          className={cn(
            "fixed inset-y-0 z-50 md:relative",
            "transition-transform duration-300 ease-in-out",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )}
        >
          <Sidebar
            isOpen={isSidebarOpen}
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab)
              if (isMobile) {
                setIsMobileMenuOpen(false)
              }
            }}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopNav
            isSidebarOpen={isSidebarOpen}
            onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
          <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
