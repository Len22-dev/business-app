"use client"

import type React from "react"

import { ArrowDown, ArrowUp, MoreHorizontal, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const transactions = [
  {
    id: "1",
    description: "Office Supplies",
    amount: -125.99,
    date: "2023-06-01",
    category: "Expenses",
  },
  {
    id: "2",
    description: "Client Payment - ABC Corp",
    amount: 1500.0,
    date: "2023-06-02",
    category: "Income",
  },
  {
    id: "3",
    description: "Software Subscription",
    amount: -49.99,
    date: "2023-06-03",
    category: "Expenses",
  },
  {
    id: "4",
    description: "Client Payment - XYZ Ltd",
    amount: 2750.0,
    date: "2023-06-05",
    category: "Income",
  },
  {
    id: "5",
    description: "Utility Bill",
    amount: -210.5,
    date: "2023-06-07",
    category: "Expenses",
  },
]

interface RecentTransactionsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RecentTransactions({ className, ...props }: RecentTransactionsProps) {
  return (
    <Card className={cn("col-span-4", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your recent financial activity</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search transactions..." className="w-[200px] pl-8" />
          </div>
          <Button variant="outline" size="sm">
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full",
                    transaction.amount > 0 ? "bg-emerald-100" : "bg-red-100",
                  )}
                >
                  {transaction.amount > 0 ? (
                    <ArrowUp className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <ArrowDown className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">{transaction.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p
                  className={cn(
                    "font-medium tabular-nums",
                    transaction.amount > 0 ? "text-emerald-600" : "text-red-600",
                  )}
                >
                  {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                </p>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

