"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, ArrowUpDown, Eye, Edit, MoreHorizontal, Upload, Download, Tag } from "lucide-react"
import { ImportTransactionsModal } from "./modal/import-transaction-form"
import { CategorizeTransactionModal } from "./modal/bank-category-form"

interface Transaction {
  id: string
  date: string
  description: string
  reference: string
  type: string
  amount: number
  balance: number
  category: string
  status: string
  account: string
  reconciled: boolean
}

// Sample transactions data
const sampleTransactions = [
  {
    id: "TXN-001",
    date: "2024-01-15",
    description: "Payment from Dangote Group",
    reference: "TRF/240115/001",
    type: "Credit",
    amount: 2500000,
    balance: 25750000,
    category: "Sales Revenue",
    status: "Cleared",
    account: "First Bank - ****1234",
    reconciled: true,
  },
  {
    id: "TXN-002",
    date: "2024-01-14",
    description: "Office Rent Payment",
    reference: "CHQ/240114/002",
    type: "Debit",
    amount: 500000,
    balance: 23250000,
    category: "Office Expenses",
    status: "Cleared",
    account: "First Bank - ****1234",
    reconciled: true,
  },
  {
    id: "TXN-003",
    date: "2024-01-13",
    description: "Salary Payment - January",
    reference: "SAL/240113/003",
    type: "Debit",
    amount: 1200000,
    balance: 23750000,
    category: "Payroll",
    status: "Cleared",
    account: "GTBank - ****5678",
    reconciled: false,
  },
  {
    id: "TXN-004",
    date: "2024-01-12",
    description: "Equipment Purchase",
    reference: "PUR/240112/004",
    type: "Debit",
    amount: 750000,
    balance: 24950000,
    category: "Equipment",
    status: "Pending",
    account: "Access Bank - ****9012",
    reconciled: false,
  },
  {
    id: "TXN-005",
    date: "2024-01-11",
    description: "Service Revenue - TechHub",
    reference: "TRF/240111/005",
    type: "Credit",
    amount: 850000,
    balance: 25700000,
    category: "Service Revenue",
    status: "Cleared",
    account: "First Bank - ****1234",
    reconciled: true,
  },
]

export function TransactionsTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterAccount, setFilterAccount] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isCategorizeModalOpen, setIsCategorizeModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    const filtered = sampleTransactions.filter((transaction) => {
      const matchesSearch =
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === "all" || transaction.type.toLowerCase() === filterType.toLowerCase()
      const matchesStatus = filterStatus === "all" || transaction.status.toLowerCase() === filterStatus.toLowerCase()
      const matchesAccount = filterAccount === "all" || transaction.account.includes(filterAccount)
      return matchesSearch && matchesType && matchesStatus && matchesAccount
    })

    return filtered.sort((a, b) => {
      let aValue, bValue
      switch (sortBy) {
        case "amount":
          aValue = a.amount
          bValue = b.amount
          break
        case "date":
          aValue = new Date(a.date)
          bValue = new Date(b.date)
          break
        case "description":
          aValue = a.description.toLowerCase()
          bValue = b.description.toLowerCase()
          break
        case "balance":
          aValue = a.balance
          bValue = b.balance
          break
        default:
          aValue = new Date(a.date)
          bValue = new Date(b.date)
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }, [searchTerm, filterType, filterStatus, filterAccount, sortBy, sortOrder])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "cleared":
        return "default"
      case "pending":
        return "secondary"
      case "failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getTypeColor = (type: string) => {
    return type === "Credit" ? "text-green-600" : "text-red-600"
  }

  const handleCategorizeTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsCategorizeModalOpen(true)
  }

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  const totalCredits = filteredAndSortedTransactions
    .filter((t) => t.type === "Credit")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalDebits = filteredAndSortedTransactions
    .filter((t) => t.type === "Debit")
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Bank Transactions</CardTitle>
              <CardDescription>View, categorize, and manage your bank transactions</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsImportModalOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Total Credits</div>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalCredits)}</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Total Debits</div>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(totalDebits)}</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Net Flow</div>
              <div
                className={`text-2xl font-bold ${totalCredits - totalDebits >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {formatCurrency(totalCredits - totalDebits)}
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Transactions</div>
              <div className="text-2xl font-bold">{filteredAndSortedTransactions.length}</div>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="debit">Debit</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="cleared">Cleared</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterAccount} onValueChange={setFilterAccount}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                <SelectItem value="First Bank">First Bank</SelectItem>
                <SelectItem value="GTBank">GTBank</SelectItem>
                <SelectItem value="Access Bank">Access Bank</SelectItem>
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
                    <Button variant="ghost" onClick={() => toggleSort("date")} className="h-auto p-0 font-semibold">
                      Date
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => toggleSort("description")}
                      className="h-auto p-0 font-semibold"
                    >
                      Description
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => toggleSort("amount")} className="h-auto p-0 font-semibold">
                      Amount
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => toggleSort("balance")} className="h-auto p-0 font-semibold">
                      Balance
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-sm text-muted-foreground">{transaction.account}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{transaction.reference}</TableCell>
                    <TableCell>
                      <Badge variant={transaction.type === "Credit" ? "default" : "secondary"}>
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell className={`font-semibold ${getTypeColor(transaction.type)}`}>
                      {transaction.type === "Credit" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(transaction.balance)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{transaction.category}</Badge>
                        {transaction.reconciled && (
                          <div className="w-2 h-2 bg-green-500 rounded-full" title="Reconciled" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(transaction.status)}>{transaction.status}</Badge>
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
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCategorizeTransaction(transaction)}>
                            <Tag className="mr-2 h-4 w-4" />
                            Categorize
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
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

      {/* Modals */}
      <ImportTransactionsModal open={isImportModalOpen} onOpenChange={setIsImportModalOpen} />

      <CategorizeTransactionModal
        open={isCategorizeModalOpen}
        onOpenChange={setIsCategorizeModalOpen}
        transaction={selectedTransaction}
      />
    </>
  )
}
