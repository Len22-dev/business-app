"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  FileText,
  BookOpen,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import { ProfitLossTab } from "./profit_loss-tab"
import { ReceivablesTab } from "./accountrecievable"
import { PayablesTab } from "./account-payable-tab"
import { GeneralLedgerTab } from "./account-ledger-tab"

export function AccountingContent() {
  const [activeTab, setActiveTab] = useState("overview")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  // Sample accounting metrics
  const accountingMetrics = {
    totalRevenue: 28750000,
    totalExpenses: 18500000,
    netProfit: 10250000,
    grossMargin: 0.64,
    totalReceivables: 8750000,
    overdueReceivables: 2100000,
    totalPayables: 4250000,
    overduePayables: 850000,
    cashFlow: 6500000,
    workingCapital: 12300000,
  }

  return (
    <>

      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Accounting Management</h1>
            <p className="text-muted-foreground">
              Monitor your financial performance, manage receivables and payables.
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profit-loss">Profit & Loss</TabsTrigger>
            <TabsTrigger value="receivables">Receivables</TabsTrigger>
            <TabsTrigger value="payables">Payables</TabsTrigger>
            <TabsTrigger value="ledger">General Ledger</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Financial Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(accountingMetrics.totalRevenue)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 text-green-500" />
                    +18.2% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(accountingMetrics.totalExpenses)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 text-red-500" />
                    +12.5% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(accountingMetrics.netProfit)}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 text-green-500" />
                    Margin: {(accountingMetrics.grossMargin * 100).toFixed(1)}%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cash Flow</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(accountingMetrics.cashFlow)}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 text-green-500" />
                    Working Capital: {formatCurrency(accountingMetrics.workingCapital)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Receivables & Payables Summary */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Accounts Receivable
                  </CardTitle>
                  <CardDescription>Outstanding customer payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Outstanding</span>
                      <span className="font-semibold text-lg">
                        {formatCurrency(accountingMetrics.totalReceivables)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Overdue Amount</span>
                      <span className="font-semibold text-red-600">
                        {formatCurrency(accountingMetrics.overdueReceivables)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Collection Rate</span>
                      <span className="font-semibold text-green-600">76%</span>
                    </div>
                    <div className="pt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${((accountingMetrics.totalReceivables - accountingMetrics.overdueReceivables) / accountingMetrics.totalReceivables) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {(
                          ((accountingMetrics.totalReceivables - accountingMetrics.overdueReceivables) /
                            accountingMetrics.totalReceivables) *
                          100
                        ).toFixed(1)}
                        % current,{" "}
                        {((accountingMetrics.overdueReceivables / accountingMetrics.totalReceivables) * 100).toFixed(1)}
                        % overdue
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-orange-600" />
                    Accounts Payable
                  </CardTitle>
                  <CardDescription>Outstanding vendor payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Outstanding</span>
                      <span className="font-semibold text-lg">{formatCurrency(accountingMetrics.totalPayables)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Overdue Amount</span>
                      <span className="font-semibold text-red-600">
                        {formatCurrency(accountingMetrics.overduePayables)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Payment Rate</span>
                      <span className="font-semibold text-green-600">80%</span>
                    </div>
                    <div className="pt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-600 h-2 rounded-full"
                          style={{
                            width: `${((accountingMetrics.totalPayables - accountingMetrics.overduePayables) / accountingMetrics.totalPayables) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {(
                          ((accountingMetrics.totalPayables - accountingMetrics.overduePayables) /
                            accountingMetrics.totalPayables) *
                          100
                        ).toFixed(1)}
                        % current,{" "}
                        {((accountingMetrics.overduePayables / accountingMetrics.totalPayables) * 100).toFixed(1)}%
                        overdue
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setActiveTab("profit-loss")}
              >
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <Calculator className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <CardTitle className="text-lg">Profit & Loss</CardTitle>
                    <CardDescription>View financial performance</CardDescription>
                  </div>
                </CardHeader>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setActiveTab("receivables")}
              >
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <Users className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <CardTitle className="text-lg">Receivables</CardTitle>
                    <CardDescription>Manage customer payments</CardDescription>
                  </div>
                </CardHeader>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setActiveTab("payables")}
              >
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <FileText className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <CardTitle className="text-lg">Payables</CardTitle>
                    <CardDescription>Manage vendor payments</CardDescription>
                  </div>
                </CardHeader>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab("ledger")}>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <BookOpen className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <CardTitle className="text-lg">General Ledger</CardTitle>
                    <CardDescription>Chart of accounts</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Financial Activity</CardTitle>
                <CardDescription>Latest accounting transactions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Payment Received</p>
                      <p className="text-sm text-muted-foreground">Dangote Group - Invoice INV-2024-001</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{formatCurrency(2500000)}</p>
                      <p className="text-sm text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Overdue Invoice</p>
                      <p className="text-sm text-muted-foreground">StartUp Inc - Invoice INV-2024-003</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">{formatCurrency(300000)}</p>
                      <p className="text-sm text-muted-foreground">5 days overdue</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Bill Payment Due</p>
                      <p className="text-sm text-muted-foreground">Office Rent - Lagos Property Ltd</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-orange-600">{formatCurrency(500000)}</p>
                      <p className="text-sm text-muted-foreground">Due tomorrow</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profit-loss">
            <ProfitLossTab />
          </TabsContent>

          <TabsContent value="receivables">
            <ReceivablesTab />
          </TabsContent>

          <TabsContent value="payables">
            <PayablesTab />
          </TabsContent>

          <TabsContent value="ledger">
            <GeneralLedgerTab />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
