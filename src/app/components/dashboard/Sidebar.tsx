"use client"

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Card } from '@/components/ui/card'
import {
  LayoutDashboard,
  TrendingUp,
  Receipt,
  Package,
  ShoppingCart,
  Wallet,
  BarChart,
  Settings,
  ChevronRight,
  Star,
  Users,
  LucideTableCellsMerge,
  ReceiptText
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface SidebarProps {
  isOpen: boolean
  activeTab: string
  onTabChange: (tab: string) => void
}

const baseUrl = "/protected/dashboard"

const navigationItems = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    icon: LayoutDashboard, 
    href: baseUrl
  },
  { 
    id: 'sales', 
    label: 'Sales', 
    icon: TrendingUp,
    href:`${baseUrl}/sales`
  },
  { 
    id: 'expense', 
    label: 'Expense', 
    icon: Receipt,
    href:`${baseUrl}/expenses`
  },
  { 
    id: 'inventory', 
    label: 'Inventory', 
    icon: Package,
    href:`${baseUrl}/inventory`
  },
  { 
    id: 'purchase', 
    label: 'Purchase', 
    icon: ShoppingCart,
    href:`${baseUrl}/purchases`
  },
  { 
    id: 'finance', 
    label: 'Finance', 
    icon: Wallet,
    href:`${baseUrl}/finance`
  },
  {
    id: 'banking',
    label: 'Banking',
    icon: LucideTableCellsMerge,
    href: `${baseUrl}/banking`
  },
  { 
    id: 'reports', 
    label: 'Reports', 
    icon: BarChart,
    href:`${baseUrl}/report`
  },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: Settings,
    href:`${baseUrl}/settings`,
  },
  {
        id: "team",
        href: `${baseUrl}}/business/manage?tab=users`,
        label: "Team Members",
        icon: Users,
        requiredRole: ["admin"],
      },
      {
        id: "documents",
        href: `${baseUrl}/documents`,
        label: "Documents",
        icon: ReceiptText,
      },
]

export function Sidebar({ isOpen, activeTab, onTabChange }: SidebarProps) {
  return (
    <div
      className={cn(
        "flex flex-col h-full bg-background border-r transition-all duration-300",
        isOpen ? "w-64" : "w-16"
      )}
    >
      {/* Logo Section */}
      <div className="h-14 border-b flex items-center px-4 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center  overflow-hidden">
          <div className="flex-shrink-0">
            <Image
              src="/Group 17.svg"
              alt="Logo"
              width={100}
              height={100}
              priority
              className="h-8 w-8 rounded-md"
            />
          </div>
          <span
            className={cn(
              "font-semibold text-lg text-primary transition-opacity duration-300",
              isOpen ? "opacity-100" : "opacity-0 w-0"
            )}
          >
            GrowEazie
          </span>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 overflow-y-auto pt-4">
        <TooltipProvider delayDuration={0}>
          <div className="px-2 space-y-0.5">
            {navigationItems.map(({ id, label, icon: Icon, href: href }) => (
              <Tooltip key={id}>
                <TooltipTrigger asChild>
                  
                  <Link href={href}>
                    <Button
                      variant={activeTab === id ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start h-10 my-2",
                        !isOpen && "justify-center px-2",
                        activeTab === id && "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                      onClick={() => onTabChange(id)}
                      key={id}
                    >
                    <Icon className={cn("h-5 w-5 shrink-0", isOpen && "mr-3")} />
                    {isOpen && <span>{label}</span>}
                    </Button>
                  </Link>
                  
                </TooltipTrigger>
                {!isOpen && (
                  <TooltipContent side="right" className="font-medium">
                    {label}
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </nav>

      {/* Upgrade Card */}
      <div className="p-4 sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Card className={cn(
          "bg-gradient-to-br from-primary/80 to-primary text-primary-foreground",
          "overflow-hidden transition-all duration-300",
          isOpen ? "p-4" : "p-2"
        )}>
          <div className="flex flex-col items-center">
            <Star className="h-6 w-6 mb-2" />
            {isOpen && (
              <>
                <h4 className="font-semibold text-sm text-center mb-1">
                  Upgrade to Pro
                </h4>
                <p className="text-xs text-center opacity-90 mb-3">
                  Get exclusive features
                </p>
                <Button
                  variant="secondary"
                  className="w-full"
                  size="sm"
                >
                  Upgrade Now
                </Button>
              </>
            )}
            {!isOpen && (
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}