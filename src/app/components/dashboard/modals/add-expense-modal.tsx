"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PaymentMethodSelector } from "@/app/components/dashboard/payment-method-selector"
import type { PaymentMethod, PaymentStatus } from "@/lib/types"
//import { useBusinessContext } from "@/context/business-context"
import { createClient } from "@/lib/supabase/client"

interface AddExpenseModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  businessId: string
  onSuccess: () => void
}

export function AddExpenseModal({ isOpen, onClose, userId, businessId, onSuccess }: AddExpenseModalProps) {
  // const { currentBusiness } = useBusinessContext()
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<PaymentStatus>("unpaid")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("")
  const [bankId, setBankId] = useState("")
  const [cardId, setCardId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const expenseCategories = [
    "Rent",
    "Utilities",
    "Salaries",
    "Supplies",
    "Marketing",
    "Travel",
    "Maintenance",
    "Insurance",
    "Other",
  ]

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCategory("")
      setAmount("")
      setDescription("")
      setStatus("unpaid")
      setPaymentMethod("")
      setBankId("")
      setCardId("")
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate payment method if status is paid or partial
      if ((status === "paid" || status === "partial") && !paymentMethod) {
        throw new Error("Please select a payment method")
      }

      // Validate bank selection if payment method is bank_transfer or card
      if ((paymentMethod === "bank_transfer" || paymentMethod === "card") && !bankId) {
        throw new Error("Please select a bank account")
      }

      // Validate card selection if payment method is card
      if (paymentMethod === "card" && !cardId) {
        throw new Error("Please select a card")
      }

      // Validate business selection
      // if (!currentBusiness) {
      //   throw new Error("No business selected")
      // }

      const expenseAmount = Number.parseFloat(amount)

      // Insert expense record
      const { data: expenseData, error } = await supabase
        .from("expenses")
        .insert({
          user_id: userId,
          business_id: businessId,
          category,
          amount: expenseAmount,
          description,
          expense_date: new Date().toISOString(),
          status,
          payment_method: paymentMethod || null,
          bank_id: bankId || null,
          card_id: cardId || null,
        })
        .select()

      if (error) {
        throw error
      }

      // If payment is made via bank or card, create a transaction and update balances
      if (
        (status === "paid" || status === "partial") &&
        (paymentMethod === "bank_transfer" || paymentMethod === "card")
      ) {
        // Create a bank transaction
        const { error: transactionError } = await supabase.from("bank_transactions").insert({
          bank_id: bankId,
          card_id: paymentMethod === "card" ? cardId : null,
          user_id: userId,
          business_id: businessId,
          transaction_date: new Date().toISOString(),
          description: `Expense: ${category}`,
          amount: expenseAmount,
          transaction_type: "withdrawal",
          category: "Expenses",
          reference_number: expenseData?.[0]?.id || null,
          is_reconciled: false,
        })

        if (transactionError) {
          throw transactionError
        }

        // Update bank balance
        const { data: bankData } = await supabase.from("banks").select("balance").eq("id", bankId).single()

        if (bankData) {
          const newBalance = Number(bankData.balance) - expenseAmount
          await supabase.from("banks").update({ balance: newBalance }).eq("id", bankId)
        }

        // If card payment, update card balance
        if (paymentMethod === "card" && cardId) {
          const { data: cardData } = await supabase
            .from("bank_cards")
            .select("balance, card_type")
            .eq("id", cardId)
            .single()

          if (cardData) {
            let newCardBalance = Number(cardData.balance)

            // For credit cards, expenses increase the balance
            if (cardData.card_type === "credit") {
              newCardBalance += expenseAmount
            } else {
              // For debit cards, expenses decrease the balance
              newCardBalance -= expenseAmount
            }

            await supabase.from("bank_cards").update({ balance: newCardBalance }).eq("id", cardId)
          }
        }
      }

      toast({
        title: "Success",
        description: "Expense has been added successfully",
      })

      onSuccess()
      onClose()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add expense",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>Enter the details of your expense.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required disabled={isLoading}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Payment Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as PaymentStatus)} disabled={isLoading}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="partial">Partially Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Method Selector */}
            <PaymentMethodSelector
              userId={userId}
              status={status}
              onPaymentMethodChange={setPaymentMethod}
              onBankChange={setBankId}
              onCardChange={setCardId}
              disabled={isLoading}
            />

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading ||
                !category ||
                !amount ||
                ((status === "paid" || status === "partial") && !paymentMethod) ||
                ((paymentMethod === "bank_transfer" || paymentMethod === "card") && !bankId) ||
                (paymentMethod === "card" && !cardId)
              }
            >
              {isLoading ? "Adding..." : "Add Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}