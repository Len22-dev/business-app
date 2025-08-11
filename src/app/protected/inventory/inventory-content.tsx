"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, TrendingDown, AlertTriangle, BarChart3 } from "lucide-react"
import { ProductsTab } from "../_components/products/products-tabs"
import { StockMovementsTab } from "./stockMovement-tab"
import { CategoriesTab } from "./categories-tab"
import { AdjustmentsTab } from "./adjustment-tab"
import { LocationsTab } from "./locations-tab"

interface InventoryContentProps {
  businessId: string
}

export function InventoryContent({businessId}: InventoryContentProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const inventoryStats = [
    {
      title: "Total Products",
      value: "1,247",
      change: "+12%",
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Total Stock Value",
      value: "₦2,450,000",
      change: "+8.2%",
      icon: BarChart3,
      color: "text-green-600",
    },
    {
      title: "Low Stock Items",
      value: "23",
      change: "-5",
      icon: TrendingDown,
      color: "text-orange-600",
    },
    {
      title: "Out of Stock",
      value: "8",
      change: "+2",
      icon: AlertTriangle,
      color: "text-red-600",
    },
  ]

  const lowStockItems = [
    { name: "iPhone 14 Pro", sku: "IPH14P-128", currentStock: 5, minStock: 10, category: "Electronics" },
    { name: "Samsung Galaxy S23", sku: "SGS23-256", currentStock: 3, minStock: 8, category: "Electronics" },
    { name: "MacBook Air M2", sku: "MBA-M2-256", currentStock: 2, minStock: 5, category: "Computers" },
    { name: "AirPods Pro", sku: "APP-2ND", currentStock: 8, minStock: 15, category: "Accessories" },
  ]

  const recentMovements = [
    { product: "iPhone 14 Pro", type: "Sale", quantity: -2, date: "2024-01-15", reference: "INV-001" },
    { product: "Samsung Galaxy S23", type: "Purchase", quantity: +10, date: "2024-01-15", reference: "PO-045" },
    { product: "MacBook Air M2", type: "Adjustment", quantity: -1, date: "2024-01-14", reference: "ADJ-012" },
    { product: "AirPods Pro", type: "Sale", quantity: -3, date: "2024-01-14", reference: "INV-002" },
  ]

  if (activeTab !== "overview") {
    return (
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="movements">Stock Movements</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductsTab businessId={businessId} />
          </TabsContent>
          <TabsContent value="movements">
            <StockMovementsTab />
          </TabsContent>
          <TabsContent value="locations">
            <LocationsTab businessId={businessId}/>
          </TabsContent>
          <TabsContent value="categories">
            <CategoriesTab businessId={businessId} />
          </TabsContent>
          <TabsContent value="adjustments">
            <AdjustmentsTab businessId={businessId} />
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  return (
    <div className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {inventoryStats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className={stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}>
                      {stat.change}
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Low Stock Alert */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Low Stock Alert
                </CardTitle>
                <CardDescription>Items that need restocking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lowStockItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-orange-600 border-orange-200">
                          {item.currentStock}/{item.minStock}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{item.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Stock Movements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Recent Stock Movements
                </CardTitle>
                <CardDescription>Latest inventory transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMovements.map((movement, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{movement.product}</p>
                        <p className="text-xs text-muted-foreground">{movement.reference}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              movement.type === "Sale"
                                ? "destructive"
                                : movement.type === "Purchase"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {movement.type}
                          </Badge>
                          <span
                            className={`text-sm font-medium ${
                              movement.quantity > 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {movement.quantity > 0 ? "+" : ""}
                            {movement.quantity}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{movement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common inventory management tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <button
                  onClick={() => setActiveTab("products")}
                  className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-muted transition-colors"
                >
                  <Package className="h-8 w-8 text-blue-600" />
                  <span className="text-sm font-medium">Manage Products</span>
                </button>
                <button
                  onClick={() => setActiveTab("movements")}
                  className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-muted transition-colors"
                >
                  <BarChart3 className="h-8 w-8 text-green-600" />
                  <span className="text-sm font-medium">Stock Movements</span>
                </button>
                <button
                  onClick={() => setActiveTab("locations")}
                  className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-muted transition-colors"
                >
                  <BarChart3 className="h-8 w-8 text-green-600" />
                  <span className="text-sm font-medium">Locations</span>
                </button>
                <button
                  onClick={() => setActiveTab("categories")}
                  className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-muted transition-colors"
                >
                  <TrendingDown className="h-8 w-8 text-purple-600" />
                  <span className="text-sm font-medium">Categories</span>
                </button>
                <button
                  onClick={() => setActiveTab("adjustments")}
                  className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-muted transition-colors"
                >
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                  <span className="text-sm font-medium">Adjustments</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
