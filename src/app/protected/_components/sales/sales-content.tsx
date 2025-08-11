"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Users, Calculator, ShoppingCart, TrendingUp, DollarSign, CheckCircle } from "lucide-react"
import { InvoicesTab } from "./invoice-tab"
import { CustomersTab } from "./customer-tab"
import { EstimatesTab } from "./estimate-bat"
import { SalesOrdersTab } from "./sales-order-tab"

interface SalesContentProps {
  userId: string
  businessId: string
}
export function SalesContent({userId, businessId}: SalesContentProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  // Sample sales metrics
  const salesMetrics = {
    totalRevenue: 15750000,
    totalInvoices: 156,
    pendingInvoices: 23,
    paidInvoices: 133,
    totalCustomers: 89,
    activeCustomers: 67,
    totalEstimates: 45,
    convertedEstimates: 32,
  }

  return (
    <>
    
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Sales Management</h1>
            <p className="text-muted-foreground">Manage your sales operations, customers, and revenue streams.</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="estimates">Estimates</TabsTrigger>
            <TabsTrigger value="orders">Sales Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Sales Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(salesMetrics.totalRevenue)}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 text-green-500" />
                    +12.5% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{salesMetrics.totalInvoices}</div>
                  <p className="text-xs text-muted-foreground">
                    <CheckCircle className="inline h-3 w-3 text-green-500" />
                    {salesMetrics.paidInvoices} paid, {salesMetrics.pendingInvoices} pending
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{salesMetrics.activeCustomers}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 text-green-500" />
                    {salesMetrics.totalCustomers} total customers
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Estimates</CardTitle>
                  <Calculator className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{salesMetrics.totalEstimates}</div>
                  <p className="text-xs text-muted-foreground">
                    <CheckCircle className="inline h-3 w-3 text-green-500" />
                    {salesMetrics.convertedEstimates} converted to sales
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setActiveTab("invoices")}
              >
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <CardTitle className="text-lg">Invoices</CardTitle>
                    <CardDescription>Create and manage invoices</CardDescription>
                  </div>
                </CardHeader>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setActiveTab("customers")}
              >
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <Users className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <CardTitle className="text-lg">Customers</CardTitle>
                    <CardDescription>Manage customer relationships</CardDescription>
                  </div>
                </CardHeader>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setActiveTab("estimates")}
              >
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <Calculator className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <CardTitle className="text-lg">Estimates</CardTitle>
                    <CardDescription>Create quotes and estimates</CardDescription>
                  </div>
                </CardHeader>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("orders")}>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <ShoppingCart className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <CardTitle className="text-lg">Sales Orders</CardTitle>
                    <CardDescription>Track sales orders</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="invoices">
            <InvoicesTab />
          </TabsContent>

          <TabsContent value="customers">
            <CustomersTab businessId={businessId} />
          </TabsContent>

          <TabsContent value="estimates">
            <EstimatesTab />
          </TabsContent>

          <TabsContent value="orders">
            <SalesOrdersTab 
            userId={userId}
            businessId={businessId}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
