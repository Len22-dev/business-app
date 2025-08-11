"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FinancialReportsTab } from "./financial-report-tab"
import { SalesReportsTab } from "./sales-report-tab"
import { InventoryReportsTab } from "./inventory-report-tab"
import { CustomReportsTab } from "./custom-report-tab"

export function ReportsContent() {
  const [activeTab, setActiveTab] = useState("financial")

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">Generate and view comprehensive business reports</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="financial">Financial Reports</TabsTrigger>
            <TabsTrigger value="sales">Sales Reports</TabsTrigger>
            <TabsTrigger value="inventory">Inventory Reports</TabsTrigger>
            <TabsTrigger value="custom">Custom Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="financial" className="space-y-4">
            <FinancialReportsTab />
          </TabsContent>

          <TabsContent value="sales" className="space-y-4">
            <SalesReportsTab />
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <InventoryReportsTab />
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <CustomReportsTab />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
