"use client"

import { useState } from "react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ArrowUpRight, ArrowDownLeft, ArrowLeftRight, CreditCard, CheckCircle2, XCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { BankTransaction } from "@/lib/types"

interface TransactionListProps {
  transactions: BankTransaction[]
  onTransactionClick?: (transaction: BankTransaction) => void
}

export function TransactionList({ transactions, onTransactionClick }: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterReconciled, setFilterReconciled] = useState<string>("all")

  // Filter transactions based on search term and filters
  const filteredTransactions = transactions.filter((transaction) => {
    // Search filter
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference_number?.toLowerCase().includes(searchTerm.toLowerCase())

    // Type filter
    const matchesType = filterType === "all" || transaction.transaction_type === filterType

    // Reconciled filter
    const matchesReconciled =
      filterReconciled === "all" ||
      (filterReconciled === "reconciled" && transaction.is_reconciled) ||
      (filterReconciled === "unreconciled" && !transaction.is_reconciled)

    return matchesSearch && matchesType && matchesReconciled
  })

  // Get transaction icon based on type
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />
      case "withdrawal":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />
      case "transfer":
        return <ArrowLeftRight className="h-4 w-4 text-blue-500" />
      case "payment":
        return <CreditCard className="h-4 w-4 text-purple-500" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
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
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Transaction Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="deposit">Deposits</SelectItem>
            <SelectItem value="withdrawal">Withdrawals</SelectItem>
            <SelectItem value="transfer">Transfers</SelectItem>
            <SelectItem value="payment">Payments</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterReconciled} onValueChange={setFilterReconciled}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Reconciliation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Transactions</SelectItem>
            <SelectItem value="reconciled">Reconciled</SelectItem>
            <SelectItem value="unreconciled">Unreconciled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        {filteredTransactions.length > 0 ? (
          <div className="divide-y">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className={`flex items-center justify-between p-4 hover:bg-muted/50 ${
                  onTransactionClick ? "cursor-pointer" : ""
                }`}
                onClick={() => onTransactionClick && onTransactionClick(transaction)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                    {getTransactionIcon(transaction.transaction_type)}
                  </div>
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{formatDate(transaction.transaction_date)}</span>
                      {transaction.category && (
                        <>
                          <span>•</span>
                          <span>{transaction.category}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`text-right ${
                      transaction.transaction_type === "deposit"
                        ? "text-green-600"
                        : transaction.transaction_type === "withdrawal"
                          ? "text-red-600"
                          : ""
                    }`}
                  >
                    <div className="font-medium">
                      {transaction.transaction_type === "deposit"
                        ? "+"
                        : transaction.transaction_type === "withdrawal"
                          ? "-"
                          : ""}
                      {formatCurrency(Number(transaction.amount))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.bank.name}
                      {transaction.card && ` • Card ${transaction.card.card_number?.slice(-4) || ""}`}
                    </div>
                  </div>
                  {transaction.is_reconciled ? (
                    <Badge variant="outline" className="gap-1 border-green-200 bg-green-50 text-green-700">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Reconciled</span>
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1 border-amber-200 bg-amber-50 text-amber-700">
                      <XCircle className="h-3 w-3" />
                      <span>Pending</span>
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-center text-muted-foreground">No transactions found</p>
            <Button variant="outline" className="mt-4">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
