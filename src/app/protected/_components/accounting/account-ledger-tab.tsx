"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, ArrowUpDown, Eye, Edit, MoreHorizontal, Download, Plus, BookOpen } from "lucide-react"

// Sample chart of accounts data
const chartOfAccounts = [
  {
    id: "1000",
    accountCode: "1000",
    accountName: "Cash and Cash Equivalents",
    accountType: "Asset",
    category: "Current Assets",
    balance: 45750000,
    parentAccount: null,
    isActive: true,
  },
  {
    id: "1100",
    accountCode: "1100",
    accountName: "Accounts Receivable",
    accountType: "Asset",
    category: "Current Assets",
    balance: 8750000,
    parentAccount: null,
    isActive: true,
  },
  {
    id: "1200",
    accountCode: "1200",
    accountName: "Inventory",
    accountType: "Asset",
    category: "Current Assets",
    balance: 12500000,
    parentAccount: null,
    isActive: true,
  },
  {
    id: "1500",
    accountCode: "1500",
    accountName: "Property, Plant & Equipment",
    accountType: "Asset",
    category: "Fixed Assets",
    balance: 25000000,
    parentAccount: null,
    isActive: true,
  },
  {
    id: "2000",
    accountCode: "2000",
    accountName: "Accounts Payable",
    accountType: "Liability",
    category: "Current Liabilities",
    balance: 4250000,
    parentAccount: null,
    isActive: true,
  },
  {
    id: "2100",
    accountCode: "2100",
    accountName: "Accrued Expenses",
    accountType: "Liability",
    category: "Current Liabilities",
    balance: 1850000,
    parentAccount: null,
    isActive: true,
  },
  {
    id: "3000",
    accountCode: "3000",
    accountName: "Share Capital",
    accountType: "Equity",
    category: "Equity",
    balance: 50000000,
    parentAccount: null,
    isActive: true,
  },
  {
    id: "3100",
    accountCode: "3100",
    accountName: "Retained Earnings",
    accountType: "Equity",
    category: "Equity",
    balance: 36900000,
    parentAccount: null,
    isActive: true,
  },
  {
    id: "4000",
    accountCode: "4000",
    accountName: "Sales Revenue",
    accountType: "Revenue",
    category: "Operating Revenue",
    balance: 28750000,
    parentAccount: null,
    isActive: true,
  },
  {
    id: "4100",
    accountCode: "4100",
    accountName: "Service Revenue",
    accountType: "Revenue",
    category: "Operating Revenue",
    balance: 3750000,
    parentAccount: null,
    isActive: true,
  },
  {
    id: "5000",
    accountCode: "5000",
    accountName: "Cost of Goods Sold",
    accountType: "Expense",
    category: "Cost of Sales",
    balance: 10750000,
    parentAccount: null,
    isActive: true,
  },
  {
    id: "6000",
    accountCode: "6000",
    accountName: "Salaries and Wages",
    accountType: "Expense",
    category: "Operating Expenses",
    balance: 4200000,
    parentAccount: null,
    isActive: true,
  },
  {
    id: "6100",
    accountCode: "6100",
    accountName: "Rent Expense",
    accountType: "Expense",
    category: "Operating Expenses",
    balance: 1500000,
    parentAccount: null,
    isActive: true,
  },
  {
    id: "6200",
    accountCode: "6200",
    accountName: "Marketing Expenses",
    accountType: "Expense",
    category: "Operating Expenses",
    balance: 800000,
    parentAccount: null,
    isActive: true,
  },
]

// Sample journal entries data
const journalEntries = [
  {
    id: "JE-001",
    entryNumber: "JE-2024-001",
    date: "2024-01-15",
    description: "Payment received from Dangote Group",
    reference: "INV-2024-001",
    totalDebit: 2500000,
    totalCredit: 2500000,
    status: "Posted",
    createdBy: "John Doe",
    entries: [
      { account: "1000 - Cash and Cash Equivalents", debit: 2500000, credit: 0 },
      { account: "1100 - Accounts Receivable", debit: 0, credit: 2500000 },
    ],
  },
  {
    id: "JE-002",
    entryNumber: "JE-2024-002",
    date: "2024-01-14",
    description: "Office rent payment",
    reference: "RENT-JAN-2024",
    totalDebit: 500000,
    totalCredit: 500000,
    status: "Posted",
    createdBy: "Jane Smith",
    entries: [
      { account: "6100 - Rent Expense", debit: 500000, credit: 0 },
      { account: "1000 - Cash and Cash Equivalents", debit: 0, credit: 500000 },
    ],
  },
  {
    id: "JE-003",
    entryNumber: "JE-2024-003",
    date: "2024-01-13",
    description: "Salary payment for January",
    reference: "SAL-JAN-2024",
    totalDebit: 1200000,
    totalCredit: 1200000,
    status: "Posted",
    createdBy: "HR Department",
    entries: [
      { account: "6000 - Salaries and Wages", debit: 1200000, credit: 0 },
      { account: "1000 - Cash and Cash Equivalents", debit: 0, credit: 1200000 },
    ],
  },
  {
    id: "JE-004",
    entryNumber: "JE-2024-004",
    date: "2024-01-12",
    description: "Equipment purchase",
    reference: "PUR-2024-001",
    totalDebit: 750000,
    totalCredit: 750000,
    status: "Draft",
    createdBy: "John Doe",
    entries: [
      { account: "1500 - Property, Plant & Equipment", debit: 750000, credit: 0 },
      { account: "2000 - Accounts Payable", debit: 0, credit: 750000 },
    ],
  },
]

export function GeneralLedgerTab() {
  const [activeSubTab, setActiveSubTab] = useState("chart-of-accounts")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("accountCode")
  const [sortOrder, setSortOrder] = useState("asc")

  // Filter and sort chart of accounts
  const filteredAndSortedAccounts = useMemo(() => {
    const filtered = chartOfAccounts.filter((account) => {
      const matchesSearch =
        account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.accountCode.includes(searchTerm) ||
        account.category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === "all" || account.accountType.toLowerCase() === filterType.toLowerCase()
      return matchesSearch && matchesType
    })

    return filtered.sort((a, b) => {
      let aValue, bValue
      switch (sortBy) {
        case "balance":
          aValue = a.balance
          bValue = b.balance
          break
        case "accountCode":
          aValue = a.accountCode
          bValue = b.accountCode
          break
        case "accountName":
          aValue = a.accountName.toLowerCase()
          bValue = b.accountName.toLowerCase()
          break
        default:
          aValue = a.accountCode
          bValue = b.accountCode
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }, [searchTerm, filterType, sortBy, sortOrder])

  // Filter journal entries
  const filteredJournalEntries = useMemo(() => {
    return journalEntries.filter((entry) => {
      return (
        entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.entryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.reference.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
  }, [searchTerm])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  const getAccountTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "asset":
        return "default"
      case "liability":
        return "destructive"
      case "equity":
        return "secondary"
      case "revenue":
        return "default"
      case "expense":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "posted":
        return "default"
      case "draft":
        return "secondary"
      case "pending":
        return "outline"
      default:
        return "outline"
    }
  }

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  // Calculate account type totals
  const accountTypeTotals = {
    assets: filteredAndSortedAccounts
      .filter((acc) => acc.accountType === "Asset")
      .reduce((sum, acc) => sum + acc.balance, 0),
    liabilities: filteredAndSortedAccounts
      .filter((acc) => acc.accountType === "Liability")
      .reduce((sum, acc) => sum + acc.balance, 0),
    equity: filteredAndSortedAccounts
      .filter((acc) => acc.accountType === "Equity")
      .reduce((sum, acc) => sum + acc.balance, 0),
    revenue: filteredAndSortedAccounts
      .filter((acc) => acc.accountType === "Revenue")
      .reduce((sum, acc) => sum + acc.balance, 0),
    expenses: filteredAndSortedAccounts
      .filter((acc) => acc.accountType === "Expense")
      .reduce((sum, acc) => sum + acc.balance, 0),
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chart-of-accounts">Chart of Accounts</TabsTrigger>
          <TabsTrigger value="journal-entries">Journal Entries</TabsTrigger>
        </TabsList>

        <TabsContent value="chart-of-accounts" className="space-y-4">
          {/* Account Type Summary */}
          <div className="grid gap-4 md:grid-cols-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-blue-600">{formatCurrency(accountTypeTotals.assets)}</div>
                <p className="text-xs text-muted-foreground">
                  {filteredAndSortedAccounts.filter((acc) => acc.accountType === "Asset").length} accounts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Liabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-red-600">{formatCurrency(accountTypeTotals.liabilities)}</div>
                <p className="text-xs text-muted-foreground">
                  {filteredAndSortedAccounts.filter((acc) => acc.accountType === "Liability").length} accounts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Equity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-purple-600">{formatCurrency(accountTypeTotals.equity)}</div>
                <p className="text-xs text-muted-foreground">
                  {filteredAndSortedAccounts.filter((acc) => acc.accountType === "Equity").length} accounts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-green-600">{formatCurrency(accountTypeTotals.revenue)}</div>
                <p className="text-xs text-muted-foreground">
                  {filteredAndSortedAccounts.filter((acc) => acc.accountType === "Revenue").length} accounts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-orange-600">{formatCurrency(accountTypeTotals.expenses)}</div>
                <p className="text-xs text-muted-foreground">
                  {filteredAndSortedAccounts.filter((acc) => acc.accountType === "Expense").length} accounts
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>Chart of Accounts</CardTitle>
                  <CardDescription>Manage your company&apos;s chart of accounts and account balances</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Account
                  </Button>
                </div>
              </div>

              {/* Search and Filter Controls */}
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search accounts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>

                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="asset">Assets</SelectItem>
                    <SelectItem value="liability">Liabilities</SelectItem>
                    <SelectItem value="equity">Equity</SelectItem>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="expense">Expenses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => toggleSort("accountCode")}
                          className="h-auto p-0 font-semibold"
                        >
                          Account Code
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => toggleSort("accountName")}
                          className="h-auto p-0 font-semibold"
                        >
                          Account Name
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => toggleSort("balance")}
                          className="h-auto p-0 font-semibold"
                        >
                          Balance
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-mono font-medium">{account.accountCode}</TableCell>
                        <TableCell className="font-medium">{account.accountName}</TableCell>
                        <TableCell>
                          <Badge variant={getAccountTypeColor(account.accountType)}>{account.accountType}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{account.category}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(account.balance)}</TableCell>
                        <TableCell>
                          <Badge variant={account.isActive ? "default" : "secondary"}>
                            {account.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Transactions
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Account
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <BookOpen className="mr-2 h-4 w-4" />
                                Account Ledger
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="journal-entries" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>Journal Entries</CardTitle>
                  <CardDescription>View and manage all journal entries and transactions</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="mr-2 h-4 w-4" />
                    New Entry
                  </Button>
                </div>
              </div>

              {/* Search Control */}
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search journal entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Entry Number</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead className="text-right">Debit</TableHead>
                      <TableHead className="text-right">Credit</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJournalEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-mono font-medium">{entry.entryNumber}</TableCell>
                        <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{entry.description}</TableCell>
                        <TableCell className="font-mono text-sm">{entry.reference}</TableCell>
                        <TableCell className="text-right font-semibold text-green-600">
                          {formatCurrency(entry.totalDebit)}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-red-600">
                          {formatCurrency(entry.totalCredit)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(entry.status)}>{entry.status}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{entry.createdBy}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Entry
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Print Entry
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
