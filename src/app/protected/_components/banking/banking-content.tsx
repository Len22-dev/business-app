"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CreditCard,
  ArrowUpDown,
  CheckCircle,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Building2,
  Wallet,
} from "lucide-react"
import { BankAccountsTab } from "./bank-account-tab"
import { TransactionsTab } from "./transaction-tab"
import { ReconciliationTab } from "./reconciliation-tab"

export function BankingContent() {
  const [activeTab, setActiveTab] = useState("overview")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  // Sample banking metrics
  const bankingMetrics = {
    totalBalance: 45750000,
    totalAccounts: 5,
    activeAccounts: 4,
    monthlyInflow: 12500000,
    monthlyOutflow: 8750000,
    pendingTransactions: 12,
    reconciledTransactions: 245,
    unreconciledAmount: 350000,
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Banking Management</h1>
            <p className="text-muted-foreground">Manage your bank accounts, transactions, and reconciliation.</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="accounts">Bank Accounts</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Banking Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(bankingMetrics.totalBalance)}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 text-green-500" />
                    Across {bankingMetrics.totalAccounts} accounts
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Inflow</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(bankingMetrics.monthlyInflow)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 text-green-500" />
                    +15.2% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Outflow</CardTitle>
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{formatCurrency(bankingMetrics.monthlyOutflow)}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 text-red-500" />
                    +8.1% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reconciliation</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bankingMetrics.reconciledTransactions}</div>
                  <p className="text-xs text-muted-foreground">
                    <AlertTriangle className="inline h-3 w-3 text-orange-500" />
                    {bankingMetrics.pendingTransactions} pending review
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setActiveTab("accounts")}
              >
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <Building2 className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <CardTitle className="text-lg">Bank Accounts</CardTitle>
                    <CardDescription>Manage your bank accounts and balances</CardDescription>
                  </div>
                </CardHeader>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setActiveTab("transactions")}
              >
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <ArrowUpDown className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <CardTitle className="text-lg">Transactions</CardTitle>
                    <CardDescription>View and categorize transactions</CardDescription>
                  </div>
                </CardHeader>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setActiveTab("reconciliation")}
              >
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <CardTitle className="text-lg">Reconciliation</CardTitle>
                    <CardDescription>Match and reconcile transactions</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Account Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
                <CardDescription>Quick overview of your bank accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">First Bank Nigeria - Current</p>
                        <p className="text-sm text-muted-foreground">****1234</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(25750000)}</p>
                      <p className="text-sm text-green-600">Active</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Wallet className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">GTBank - Savings</p>
                        <p className="text-sm text-muted-foreground">****5678</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(12000000)}</p>
                      <p className="text-sm text-green-600">Active</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Access Bank - Current</p>
                        <p className="text-sm text-muted-foreground">****9012</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(8000000)}</p>
                      <p className="text-sm text-green-600">Active</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accounts">
            <BankAccountsTab />
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionsTab />
          </TabsContent>

          <TabsContent value="reconciliation">
            <ReconciliationTab />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
