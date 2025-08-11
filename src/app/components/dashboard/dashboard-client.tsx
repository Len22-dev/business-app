"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useBusiness, useDashboardStats } from "@/hooks/useBusinesses"
import { Skeleton } from "@/components/ui/skeleton"
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface DashboardClientProps {
  userId: string
  businessId?: string
}

export function DashboardClient({  businessId }: DashboardClientProps) {
 
   const { 
    data: business, 
    isLoading: businessLoading, 
    error: businessError 
  } = useBusiness(businessId ?? "");

  console.log("Business Data:", business);
  
  const { 
    data: stats, 
    isLoading: statsLoading, 
    error: statsError 
  } = useDashboardStats(businessId ?? "");

  console.log("Stats Data:", stats);
  
  const isLoading = businessLoading || statsLoading;

  // Show error state if business hook fails
  if (businessError || statsError) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-destructive">Error loading business data: {businessError?.message  || statsError?.message}</p>
        </CardContent>
      </Card>
    )
  }

  if (!business) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Please select a business to view dashboard</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-[100px]" />
            ) : (
              <div className="text-2xl font-bold">{formatCurrency(stats?.totalSales || 0)}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-[100px]" />
            ) : (
              <div className="text-2xl font-bold">{formatCurrency(stats?.totalExpenses || 0)}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-[100px]" />
            ) : (
              <div className="text-2xl font-bold">{stats?.totalInventory || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-[100px]" />
            ) : (
              <div className="text-2xl font-bold">{stats?.teamMembers || 0}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Overview</CardTitle>
          <CardDescription>
            {business.name} - {business.description || "No description provided"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : (
              <>
                <div className="grid gap-2 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{business.email || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{business.phone || "Not provided"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">{business.address || "Not provided"}</p>
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium">Website</p>
                    <p className="text-sm text-muted-foreground">{business.website || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Tax ID</p>
                    <p className="text-sm text-muted-foreground">{business.tax_id || "Not provided"}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
