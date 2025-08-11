"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Edit,
  MoreHorizontal,
  Building2,
  Wallet,
  CreditCard,
  Download,
} from "lucide-react"
import { AddBankAccountModal } from "./modal/add-bank-form"
import { ViewBankAccountModal } from "./modal/view-bank-account-form"
import { EditBankAccountModal } from "./modal/edit-bank-account-form"

interface Account {
  id: string
  bankName: string
  accountName: string
  accountNumber: string
  accountType: string
  balance: number
  status: string
  currency: string
  openingDate: string
  lastTransaction: string
  branch: string
  sortCode: string
}
 



// Sample bank accounts data
const sampleBankAccounts = [
  {
    id: "ACC-001",
    bankName: "First Bank Nigeria",
    accountName: "EazieGrow Limited",
    accountNumber: "1234567890",
    accountType: "Current",
    balance: 25750000,
    status: "Active",
    currency: "NGN",
    openingDate: "2023-01-15",
    lastTransaction: "2024-01-15",
    branch: "Victoria Island",
    sortCode: "011-152-003",
  },
  {
    id: "ACC-002",
    bankName: "Guaranty Trust Bank",
    accountName: "EazieGrow Limited",
    accountNumber: "5678901234",
    accountType: "Savings",
    balance: 12000000,
    status: "Active",
    currency: "NGN",
    openingDate: "2023-03-20",
    lastTransaction: "2024-01-14",
    branch: "Ikeja",
    sortCode: "058-152-036",
  },
  {
    id: "ACC-003",
    bankName: "Access Bank",
    accountName: "EazieGrow Limited",
    accountNumber: "9012345678",
    accountType: "Current",
    balance: 8000000,
    status: "Active",
    currency: "NGN",
    openingDate: "2023-06-10",
    lastTransaction: "2024-01-13",
    branch: "Lekki",
    sortCode: "044-150-149",
  },
  {
    id: "ACC-004",
    bankName: "Zenith Bank",
    accountName: "EazieGrow Limited",
    accountNumber: "3456789012",
    accountType: "Fixed Deposit",
    balance: 15000000,
    status: "Active",
    currency: "NGN",
    openingDate: "2023-08-05",
    lastTransaction: "2024-01-10",
    branch: "Abuja",
    sortCode: "057-150-013",
  },
  {
    id: "ACC-005",
    bankName: "UBA",
    accountName: "EazieGrow Limited",
    accountNumber: "7890123456",
    accountType: "Current",
    balance: 500000,
    status: "Inactive",
    currency: "NGN",
    openingDate: "2022-12-01",
    lastTransaction: "2023-11-15",
    branch: "Port Harcourt",
    sortCode: "033-153-257",
  },
]

export function BankAccountsTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("balance")
  const [sortOrder, setSortOrder] = useState("desc")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)


  // Filter and sort accounts
  const filteredAndSortedAccounts = useMemo(() => {
    const filtered = sampleBankAccounts.filter((account) => {
      const matchesSearch =
        account.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.accountNumber.includes(searchTerm)
      const matchesStatus = filterStatus === "all" || account.status.toLowerCase() === filterStatus.toLowerCase()
      const matchesType = filterType === "all" || account.accountType.toLowerCase() === filterType.toLowerCase()
      return matchesSearch && matchesStatus && matchesType
    })

    return filtered.sort((a, b) => {
      let aValue, bValue
      switch (sortBy) {
        case "balance":
          aValue = a.balance
          bValue = b.balance
          break
        case "bankName":
          aValue = a.bankName.toLowerCase()
          bValue = b.bankName.toLowerCase()
          break
        case "accountType":
          aValue = a.accountType.toLowerCase()
          bValue = b.accountType.toLowerCase()
          break
        case "lastTransaction":
          aValue = new Date(a.lastTransaction)
          bValue = new Date(b.lastTransaction)
          break
        default:
          aValue = a.balance
          bValue = b.balance
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }, [searchTerm, filterStatus, filterType, sortBy, sortOrder])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "closed":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getAccountIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "current":
        return Building2
      case "savings":
        return Wallet
      case "fixed deposit":
        return CreditCard
      default:
        return Building2
    }
  }

  const handleViewAccount = (account: Account) => {
    setSelectedAccount(account)
    setIsViewModalOpen(true)
  }

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account)
    setIsEditModalOpen(true)
  }

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  const totalBalance = filteredAndSortedAccounts.reduce((sum, account) => sum + account.balance, 0)

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Bank Accounts</CardTitle>
              <CardDescription>Manage your business bank accounts and monitor balances</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button onClick={() => setIsAddModalOpen(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Account
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Total Balance</div>
              <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Active Accounts</div>
              <div className="text-2xl font-bold">
                {filteredAndSortedAccounts.filter((acc) => acc.status === "Active").length}
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Total Accounts</div>
              <div className="text-2xl font-bold">{filteredAndSortedAccounts.length}</div>
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

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="savings">Savings</SelectItem>
                <SelectItem value="fixed deposit">Fixed Deposit</SelectItem>
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
                    <Button variant="ghost" onClick={() => toggleSort("bankName")} className="h-auto p-0 font-semibold">
                      Bank & Account
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => toggleSort("accountType")}
                      className="h-auto p-0 font-semibold"
                    >
                      Type
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Account Number</TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => toggleSort("balance")} className="h-auto p-0 font-semibold">
                      Balance
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => toggleSort("lastTransaction")}
                      className="h-auto p-0 font-semibold"
                    >
                      Last Transaction
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedAccounts.map((account) => {
                  const IconComponent = getAccountIcon(account.accountType)
                  return (
                    <TableRow key={account.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <IconComponent className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">{account.bankName}</div>
                            <div className="text-sm text-muted-foreground">{account.accountName}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{account.accountType}</Badge>
                      </TableCell>
                      <TableCell className="font-mono">****{account.accountNumber.slice(-4)}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(account.balance)}</TableCell>
                      <TableCell>{new Date(account.lastTransaction).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(account.status)}>{account.status}</Badge>
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
                            <DropdownMenuItem onClick={() => handleViewAccount(account)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditAccount(account)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Account
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Export Statement
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <AddBankAccountModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />

      <ViewBankAccountModal open={isViewModalOpen} onOpenChange={setIsViewModalOpen} account={selectedAccount} />

      {selectedAccount &&
      (<EditBankAccountModal 
      open={isEditModalOpen} 
      onOpenChange={setIsEditModalOpen} 
      account={selectedAccount} 
      />
      )}
    </>
  )
}
