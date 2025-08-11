"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BarChart3,
  DollarSign,
  Home,
  Package,
  ShoppingCart,
  User,
  LogOut,
  CreditCard,
  Building,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { BusinessSelector } from "./business/business-selector"
import { useBusinessContext } from "@/context/business-context"

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const {toast} = useToast()
  const { userRole } = useBusinessContext()
  const supabase = createClient()

  const baseUrl = "/protected/dashboard"

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign out",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    })

    router.refresh()
    router.push("/")
  }

  const routes = [
    {
      href: baseUrl,
      label: "Dashboard",
      icon: Home,
    },
    {
      href: `${baseUrl}/sales`,
      label: "Sales",
      icon: DollarSign,
      requiredRole: ["admin", "manager", "member"],
    },
    {
      href: `${baseUrl}/expenses`,
      label: "Expenses",
      icon: ShoppingCart,
      requiredRole: ["admin", "manager", "member"],
    },
    {
      href: `${baseUrl}/inventory`,
      label: "Inventory",
      icon: Package,
      requiredRole: ["admin", "manager", "member"],
    },
    {
      href: `${baseUrl}/purchases`,
      label: "Purchases",
      icon: ShoppingCart,
      requiredRole: ["admin", "manager", "member"],
    },
    {
      href: `${baseUrl}/finance`,
      label: "Finance",
      icon: CreditCard,
      requiredRole: ["admin", "manager"],
    },
    {
      href: `${baseUrl}/report`,
      label: "Reports",
      icon: BarChart3,
    },
    {
      href: `${baseUrl}/business/manage`,
      label: "Business Settings",
      icon: Building,
      requiredRole: ["admin"],
    },
    {
      href: `${baseUrl}}/business/manage?tab=users`,
      label: "Team Members",
      icon: Users,
      requiredRole: ["admin"],
    },
    {
      href: `${baseUrl}/profile`,
      label: "Profile",
      icon: User,
    },
  ]

  // Filter routes based on user role
  const filteredRoutes = routes.filter((route) => {
    if (!route.requiredRole) return true
    if (!userRole) return false
    return route.requiredRole.includes(userRole)
  })

  return (
    <div className="flex h-screen flex-col border-r bg-muted/40">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <span className="text-lg">MyBiz</span>
        </Link>
      </div>
      <div className="p-4">
        <BusinessSelector />
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {filteredRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                pathname === route.href && "bg-muted text-primary",
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  )
}
