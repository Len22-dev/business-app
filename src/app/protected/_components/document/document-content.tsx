"use client"

import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AllDocumentsTab } from "./all-documents-tab"
import { InvoiceDocumentsTab } from "./invoice-documents-tab"
import { ReceiptDocumentsTab } from "./receipt-documents-tab"
import { ContractDocumentsTab } from "./contract-document"

export function DocumentsContent() {
  const [activeTab, setActiveTab] = useState("all")

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Documents</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
            <p className="text-muted-foreground">Manage and organize all your business documents</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Documents</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="receipts">Receipts</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <AllDocumentsTab />
          </TabsContent>

          <TabsContent value="invoices" className="space-y-4">
            <InvoiceDocumentsTab />
          </TabsContent>

          <TabsContent value="receipts" className="space-y-4">
            <ReceiptDocumentsTab />
          </TabsContent>

          <TabsContent value="contracts" className="space-y-4">
            <ContractDocumentsTab />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
