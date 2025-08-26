"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Users, FileText, Package } from "lucide-react"
import { PurchaseOrdersTab } from "./purchase-order-tab"
import { SuppliersTab } from "./supplier-tab"
import { ReceiptsTab } from "./reciept-tab"

interface PurchaseContentProps {
  userId: string
  businessId: string
}

export function PurchaseContent({userId, businessId}: PurchaseContentProps) {
  const [activeTab, setActiveTab] = useState("orders")

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Purchase</h1>
          <p className="text-muted-foreground">Manage purchase orders, suppliers, and procurement processes</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+8 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">5 new this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">₦1,250,000 value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Received Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="receipts">Receipts</TabsTrigger>
        </TabsList>
        <TabsContent value="orders" className="space-y-4">
          <PurchaseOrdersTab  userId={userId} businessId={businessId}/>
        </TabsContent>
        <TabsContent value="suppliers" className="space-y-4">
          <SuppliersTab businessId={businessId} />
        </TabsContent>
        <TabsContent value="receipts" className="space-y-4">
          <ReceiptsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
