"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency } from "@/lib/utils"
import type { Bank, BankTransaction } from "@/lib/types"

interface ReconcileModalProps {
  isOpen: boolean
  onClose: () => void
  bank: Bank
  transactions: BankTransaction[]
  onSuccess: () => void
}

export function ReconcileModal({ isOpen, onClose, bank, transactions, onSuccess }: ReconcileModalProps) {
  const [statementBalance, setStatementBalance] = useState("")
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  // Calculate the current reconciled balance
  const currentBalance = Number(bank.balance)
  const selectedTotal = transactions
    .filter((t) => selectedTransactions.includes(t.id))
    .reduce((sum, t) => {
      if (t.transaction_type === "deposit") {
        return sum + Number(t.amount)
      } else if (t.transaction_type === "withdrawal" || t.transaction_type === "payment") {
        return sum - Number(t.amount)
      }
      return sum
    }, 0)

  const difference = Number(statementBalance) - (currentBalance + selectedTotal)

  const handleToggleTransaction = (transactionId: string) => {
    setSelectedTransactions((prev) =>
      prev.includes(transactionId) ? prev.filter((id) => id !== transactionId) : [...prev, transactionId],
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Mark selected transactions as reconciled
      for (const transactionId of selectedTransactions) {
        await supabase.from("bank_transactions").update({ is_reconciled: true }).eq("id", transactionId)
      }

      // Update bank balance if needed
      if (difference !== 0) {
        // Create an adjustment transaction
        await supabase.from("bank_transactions").insert({
          bank_id: bank.id,
          user_id: bank.user_id,
          transaction_date: new Date().toISOString(),
          description: "Reconciliation adjustment",
          amount: Math.abs(difference),
          transaction_type: difference > 0 ? "deposit" : "withdrawal",
          category: "Adjustment",
          is_reconciled: true,
        })

        // Update bank balance
        await supabase
          .from("banks")
          .update({ balance: Number(statementBalance) })
          .eq("id", bank.id)
      }

      toast({
        title: "Success",
        description: "Account has been reconciled successfully",
      })

      onSuccess()
      onClose()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reconcile account",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Filter for unreconciled transactions only
  const unreconciledTransactions = transactions.filter((t) => !t.is_reconciled)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Reconcile Account: {bank.name}</DialogTitle>
            <DialogDescription>Match your bank statement with your recorded transactions.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="statement-balance">Statement Balance</Label>
              <Input
                id="statement-balance"
                type="number"
                step="0.01"
                value={statementBalance}
                onChange={(e) => setStatementBalance(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label>Current Balance: {formatCurrency(currentBalance)}</Label>
              {statementBalance && (
                <>
                  <Label>
                    Difference:{" "}
                    <span className={difference === 0 ? "text-green-600" : "text-red-600"}>
                      {formatCurrency(difference)}
                    </span>
                  </Label>
                </>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Unreconciled Transactions</Label>
              <div className="max-h-60 overflow-y-auto rounded-md border">
                {unreconciledTransactions.length > 0 ? (
                  <div className="divide-y">
                    {unreconciledTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id={`transaction-${transaction.id}`}
                            checked={selectedTransactions.includes(transaction.id)}
                            onCheckedChange={() => handleToggleTransaction(transaction.id)}
                            disabled={isLoading}
                          />
                          <div>
                            <Label htmlFor={`transaction-${transaction.id}`} className="font-medium">
                              {transaction.description}
                            </Label>
                            <div className="text-sm text-muted-foreground">
                              {new Date(transaction.transaction_date).toLocaleDateString()}
                              {transaction.category && ` • ${transaction.category}`}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`font-medium ${
                            transaction.transaction_type === "deposit"
                              ? "text-green-600"
                              : transaction.transaction_type === "withdrawal"
                                ? "text-red-600"
                                : ""
                          }`}
                        >
                          {transaction.transaction_type === "deposit"
                            ? "+"
                            : transaction.transaction_type === "withdrawal"
                              ? "-"
                              : ""}
                          {formatCurrency(Number(transaction.amount))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center p-4 text-muted-foreground">
                    No unreconciled transactions
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !statementBalance}>
              {isLoading ? "Reconciling..." : "Reconcile Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
