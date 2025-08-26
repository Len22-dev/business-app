"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Edit,
  MoreHorizontal,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
//import { AddTransactionModal } from "./transaction-modal/addtransaction-modal"
import { ViewTransactionModal } from "./transaction-modal/viewTransaction-modal"
import { EditTransactionModal } from "./transaction-modal/editTransaction-modal"
import { useDashboardStats } from "@/hooks/useBusinesses"
import { useBusinessTransactions } from "@/hooks/useTransaction"
import { Skeleton } from "@/components/ui/skeleton"
import { FullTransactionWithItems} from "@/lib/zod/transactionSchema"
import { SalesExpensesForm } from "./transaction-modal/transaction-modal"


interface DashboardClientProps {
  userId: string
  businessId?: string
}



export function DashboardContent({  businessId, userId  }: DashboardClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<FullTransactionWithItems | null>(null)

  // Fetch transactions from database
  const { 
    data: transactionsData, 
    isLoading: transactionsLoading, 
    error: transactionsError 
  } = useBusinessTransactions(
    businessId!, 
    filterType === "all" ? undefined : filterType as "income" | "expense" | "transfer"
  );

  // Fetch dashboard stats
  const { 
    data: stats, 
    isLoading: statsLoading, 
    error: statsError 
  } = useDashboardStats(businessId! ?? "");

  // Get transactions array from the response
  const transactions = useMemo(() => transactionsData?.transactions || [], [transactionsData]);

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    const filtered = transactions.filter((transaction:  FullTransactionWithItems) => {
      const matchesSearch =
        transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.transactionType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.item?.toLowerCase().includes(searchTerm.toLowerCase())
      
      // If filterType is "all", show all transactions, otherwise the API already filters by type
      return matchesSearch
    })

    return filtered.sort((a: FullTransactionWithItems, b: FullTransactionWithItems) => {
      let aValue, bValue
      switch (sortBy) {
        case "amount":
          aValue = a.totalAmount
          bValue = b.totalAmount
          break
        case "date":
          aValue = new Date(a.transactionDate || (a.createdAt ?? ''))
          bValue = new Date(b.transactionDate || (b.createdAt ?? ''))
          break
        case "description":
          aValue = a.description?.toLowerCase() || ""
          bValue = b.description?.toLowerCase() || ""
          break
        case "item":
          aValue = a.item?.toLowerCase() || ""
          bValue = b.item?.toLowerCase() || ""
          break
        default:
          aValue = a.transactionDate || a.createdAt
          bValue = b.transactionDate || b.createdAt
      }

      if (sortOrder === "asc") {
        return aValue ?? '' > bValue  ?  1 : -1
      } else {
        return aValue ?? '' < bValue ? 1 : -1 
      }
    })
  }, [transactions, searchTerm, sortBy, sortOrder])

  console.log("Stats Data:", stats);
  console.log("Transactions Data:", transactionsData);
  
  const isLoading = statsLoading || transactionsLoading;

  if (statsError) console.error("Stats Error:", statsError);
  if (transactionsError) console.error("Transactions Error:", transactionsError);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  const handleViewTransaction = (transaction: FullTransactionWithItems) => {
    setSelectedTransaction(transaction)
    setIsViewModalOpen(true)
  }

  const handleEditTransaction = (transaction: FullTransactionWithItems) => {
    setSelectedTransaction(transaction)
    setIsEditModalOpen(true)
  }

  const toggleSort = (field : string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  // Calculate metrics from real data
  const totalIncome = transactions
    .filter((t: FullTransactionWithItems) => t.transactionType === "sales")
    .reduce((sum: number, t: FullTransactionWithItems) => sum + Number(t.totalAmount), 0)

  const totalExpenses = transactions
    .filter((t: FullTransactionWithItems) => t.transactionType === "expense")
    .reduce((sum: number, t: FullTransactionWithItems) => sum + Number(t.totalAmount), 0)

  //const netProfit = totalIncome - totalExpenses

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening with your business today.</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>

        {/* Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {isLoading ? (
                  <Skeleton className="h-7 w-[100px]" />
                ) : (
                  <div className="text-2xl font-bold">{formatCurrency(stats?.totalSales || totalIncome)}</div>
                )}
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 text-green-500" />
                +20.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <Skeleton className="h-7 w-[100px]" />
                ) : (
                  <div className="text-2xl font-bold">{formatCurrency(stats?.totalExpenses || totalExpenses)}</div>
                )}
              <p className="text-xs text-muted-foreground">
                <TrendingDown className="inline h-3 w-3 text-red-500" />
                +5.2% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <Skeleton className="h-7 w-[100px]" />
                ) : (
                  <div className="text-2xl font-bold">{formatCurrency((stats?.totalSales || totalIncome) - (stats?.totalExpenses || totalExpenses))}</div>
                )}
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 text-green-500" />
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <Skeleton className="h-7 w-[100px]" />
                ) : (
                    <div className="text-2xl font-bold">{stats?.teamMembers || 0}</div>
                )}
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 text-green-500" />
                +201 since last month
              </p>
            </CardContent>
          </Card>
        </div>
            <SalesExpensesForm/>
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest business transactions and activities</CardDescription>
              </div>

              {/* Search and Filter Controls */}
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 md:w-[300px]"
                  />
                </div>

                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {transactionsLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-[80px]" />
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-4 w-[60px]" />
                    <Skeleton className="h-4 w-[80px]" />
                  </div>
                ))}
              </div>
            ) : transactionsError ? (
              <div className="text-center py-8">
                <p className="text-destructive">Error loading transactions: {transactionsError.message}</p>
              </div>
            ) : filteredAndSortedTransactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No transactions found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Button variant="ghost" onClick={() => toggleSort("id")} className="h-auto p-0 font-semibold">
                          Transaction ID
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => toggleSort("date")} className="h-auto p-0 font-semibold">
                          Date
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => toggleSort("item")}
                           className="h-auto p-0 font-semibold"
                        >
                          Item
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => toggleSort("amount")} className="h-auto p-0 font-semibold">
                          Amount
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedTransactions.map((transaction: FullTransactionWithItems) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>
                          {transaction.transactionDate
                            ? new Date(transaction.transactionDate).toLocaleDateString()
                            : new Date(transaction.deletedAt ?? '').toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{transaction.item || "N/A"}</div>
                            <div className="text-sm text-muted-foreground">{transaction.referenceNumber || ""}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={transaction.transactionType === "sales" ? "default" : transaction.transactionType === "expense" ? "destructive" : "secondary"}>
                            {transaction.transactionType}
                          </Badge>
                        </TableCell>
                        <TableCell className={transaction.transactionType === "sales" ? "text-green-600" : "text-red-600"}>
                          {transaction.transactionType === "sales" ? "+" : "-"}
                          {formatCurrency(Number(transaction.totalAmount))}
                        </TableCell>
                        <TableCell>
                          <Badge variant={transaction.transactionStatus === "completed" ? "default" : "outline"}>
                            {transaction.transactionStatus}
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
                              <DropdownMenuItem onClick={() => handleViewTransaction(transaction)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditTransaction(transaction)}>
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
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {/* <AddTransactionModal  open={isAddModalOpen} onOpenChange={setIsAddModalOpen}  businessId={businessId!} userId={userId} /> */}
      
      

     {selectedTransaction && (
  <>
    <ViewTransactionModal
      open={isViewModalOpen}
      onOpenChange={setIsViewModalOpen}
      transaction={selectedTransaction}
    />

    <EditTransactionModal
      open={isEditModalOpen}
      onOpenChange={setIsEditModalOpen}
      transaction={selectedTransaction}
      businessId={businessId!}
      id={selectedTransaction.id}
    />
  </>
)}
    </>
  )
}