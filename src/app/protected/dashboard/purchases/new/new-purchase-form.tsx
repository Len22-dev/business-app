"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ItemSelector, type PurchaseItem } from "@/app/components/dashboard/item-selector"
import { PaymentMethodSelector } from "@/app/components/dashboard/payment-method-selector"
import type { PaymentMethod, PaymentStatus } from "@/lib/types"
import { useBusinessContext } from "@/context/business-context"

interface NewPurchaseFormProps {
  userId: string
}

export function NewPurchaseForm({ userId }: NewPurchaseFormProps) {
  const { currentBusiness } = useBusinessContext()
  const [supplier, setSupplier] = useState("")
  const [description, setDescription] = useState("")
  const [items, setItems] = useState<PurchaseItem[]>([])
  const [status, setStatus] = useState<PaymentStatus>("unpaid")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("")
  const [bankId, setBankId] = useState("")
  const [cardId, setCardId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [totalAmount, setTotalAmount] = useState(0)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  // Update total amount when items change
  useEffect(() => {
    const total = items.reduce((sum, item) => sum + item.total, 0)
    setTotalAmount(total)
  }, [items])

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
      if (!currentBusiness) {
        throw new Error("No business selected")
      }

      // First, insert the purchase record
      const { data: purchaseData, error: purchaseError } = await supabase
        .from("purchases")
        .insert({
          user_id: userId,
          business_id: currentBusiness.id,
          supplier,
          amount: totalAmount,
          description,
          purchase_date: new Date().toISOString(),
          status,
          payment_method: paymentMethod || null,
          bank_id: bankId || null,
          card_id: cardId || null,
        })
        .select()

      if (purchaseError) {
        throw purchaseError
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
          business_id: currentBusiness.id,
          transaction_date: new Date().toISOString(),
          description: `Purchase from ${supplier}`,
          amount: totalAmount,
          transaction_type: "withdrawal",
          category: "Purchases",
          reference_number: purchaseData?.[0]?.id || null,
          is_reconciled: false,
        })

        if (transactionError) {
          throw transactionError
        }

        // Update bank balance
        const { data: bankData } = await supabase.from("banks").select("balance").eq("id", bankId).single()

        if (bankData) {
          const newBalance = Number(bankData.balance) - totalAmount
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

            // For credit cards, purchases increase the balance
            if (cardData.card_type === "credit") {
              newCardBalance += totalAmount
            } else {
              // For debit cards, purchases decrease the balance
              newCardBalance -= totalAmount
            }

            await supabase.from("bank_cards").update({ balance: newCardBalance }).eq("id", cardId)
          }
        }
      }

      // For each item, check if it exists in inventory and update or add
      for (const item of items) {
        if (!item.name || item.quantity <= 0) continue

        // Check if item exists in inventory
        const { data: existingItems } = await supabase
          .from("inventory")
          .select("*")
          .eq("user_id", userId)
          .eq("business_id", currentBusiness.id)
          .ilike("name", item.name)
          .limit(1)

        if (existingItems && existingItems.length > 0) {
          // Update existing inventory item
          const existingItem = existingItems[0]
          await supabase
            .from("inventory")
            .update({
              quantity: existingItem.quantity + item.quantity,
              // Optionally update price if it changed
              unit_price: item.price > 0 ? item.price : existingItem.unit_price,
            })
            .eq("id", existingItem.id)
        } else {
          // Add new inventory item
          await supabase.from("inventory").insert({
            user_id: userId,
            business_id: currentBusiness.id,
            name: item.name,
            quantity: item.quantity,
            unit_price: item.price,
            category: "New Purchase",
          })
        }
      }

      toast({
        title: "Success",
        description: "Purchase has been added successfully",
      })

      router.refresh()
      router.push("/dashboard/purchases")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add purchase",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier Name</Label>
              <Input
                id="supplier"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total-amount">Total Amount</Label>
              <Input id="total-amount" type="number" step="0.01" value={totalAmount} readOnly className="bg-muted" />
            </div>
          </div>

          <ItemSelector
            userId={userId}
            onItemsChange={(newItems) => setItems(newItems as PurchaseItem[])}
            type="purchase"
          />

          <div className="grid gap-4 md:grid-cols-2">
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

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={
                isLoading ||
                items.length === 0 ||
                totalAmount === 0 ||
                ((status === "paid" || status === "partial") && !paymentMethod) ||
                ((paymentMethod === "bank_transfer" || paymentMethod === "card") && !bankId) ||
                (paymentMethod === "card" && !cardId)
              }
            >
              {isLoading ? "Adding..." : "Add Purchase"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/purchases")}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
