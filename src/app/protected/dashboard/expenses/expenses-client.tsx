"use client"

import { useState, useEffect } from "react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import type { Expense } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { AddExpenseModal } from "@/app/components/dashboard/modals/add-expense-modal"

interface ExpensesClientProps {
  userId: string
}

export function ExpensesClient({ userId }: ExpensesClientProps) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const fetchExpenses = async () => {
    try {
      const { data } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", userId)
        .order("expense_date", { ascending: false })

      if (data) {
        setExpenses(data)
      }
    } catch (error) {
      console.error("Error fetching expenses:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [userId, ])

  const handleAddSuccess = () => {
    fetchExpenses()
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Expenses</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Expenses</h2>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense History</CardTitle>
          <CardDescription>View and manage your expense records</CardDescription>
        </CardHeader>
        <CardContent>
          {expenses && expenses.length > 0 ? (
            <div className="rounded-md border">
              <div className="grid grid-cols-5 border-b px-4 py-3 font-medium">
                <div>Category</div>
                <div>Date</div>
                <div>Amount</div>
                <div>Status</div>
                <div>Description</div>
              </div>
              <div className="divide-y">
                {expenses.map((expense: Expense) => (
                  <div key={expense.id} className="grid grid-cols-5 px-4 py-3">
                    <div>{expense.category}</div>
                    <div>{formatDate(expense.expense_date)}</div>
                    <div>{formatCurrency(Number(expense.amount))}</div>
                    <div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          expense.status === "paid"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : expense.status === "partial"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {expense.status}
                      </span>
                    </div>
                    <div className="truncate">{expense.description || "-"}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-center text-muted-foreground">No expense records found</p>
              <Button onClick={() => setIsAddModalOpen(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Expense
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        userId={userId}
        onSuccess={handleAddSuccess}
      />
    </div>
  )
}