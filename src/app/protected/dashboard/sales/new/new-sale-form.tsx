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
import { ItemSelector, type SaleItem } from "@/app/components/dashboard/item-selector"
import { PaymentMethodSelector } from "@/app/components/dashboard/payment-method-selector"
import type { PaymentMethod, PaymentStatus } from "@/lib/types"
//import { useBusinessContext } from "@/context/business-context"

interface NewSaleFormProps {
  userId: string
  businessId: string
}

export function NewSaleForm({ userId, businessId }: NewSaleFormProps) {
  //const { currentBusiness } = useBusinessContext()
  const [customerName, setCustomerName] = useState("")
  const [description, setDescription] = useState("")
  const [items, setItems] = useState<SaleItem[]>([])
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
      // if (!currentBusiness) {
      //   throw new Error("No business selected")
      // }

      // First, insert the sale record
      const { data: saleData, error: saleError } = await supabase
        .from("sales")
        .insert({
          user_id: userId,
          business_id: businessId,
          customer_name: customerName,
          amount: totalAmount,
          description,
          status,
          payment_method: paymentMethod || null,
          bank_id: bankId || null,
          card_id: cardId || null,
          sale_date: new Date().toISOString(),
        })
        .select()

      if (saleError) {
        throw saleError
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
          description: `Sale to ${customerName}`,
          amount: totalAmount,
          transaction_type: "deposit",
          category: "Sales",
          reference_number: saleData?.[0]?.id || null,
          is_reconciled: false,
        })

        if (transactionError) {
          throw transactionError
        }

        // Update bank balance
        const { data: bankData } = await supabase.from("banks").select("balance").eq("id", bankId).single()

        if (bankData) {
          const newBalance = Number(bankData.balance) + totalAmount
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

            // For credit cards, payments reduce the balance
            if (cardData.card_type === "credit") {
              newCardBalance -= totalAmount
            } else {
              // For debit cards, deposits increase the balance
              newCardBalance += totalAmount
            }

            await supabase.from("bank_cards").update({ balance: newCardBalance }).eq("id", cardId)
          }
        }
      }

      // If we have items with inventory IDs, update inventory quantities
      for (const item of items) {
        if (item.inventory_id) {
          // Get current inventory item
          const { data: inventoryItem } = await supabase
            .from("inventory")
            .select("quantity")
            .eq("id", item.inventory_id)
            .single()

          if (inventoryItem) {
            // Update inventory quantity
            const newQuantity = Math.max(0, inventoryItem.quantity - item.quantity)
            await supabase.from("inventory").update({ quantity: newQuantity }).eq("id", item.inventory_id)
          }
        }
      }

      toast({
        title: "Success",
        description: "Sale has been added successfully",
      })

      router.refresh()
      router.push("/protected/dashboard/sales")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message[0] || "Failed to add sale",
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
              <Label htmlFor="customer-name">Customer Name</Label>
              <Input
                id="customer-name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total-amount">Total Amount</Label>
              <Input id="total-amount" type="number" step="0.01" value={totalAmount} readOnly className="bg-muted" />
            </div>
          </div>

          <ItemSelector userId={userId} onItemsChange={(newItems) => setItems(newItems as SaleItem[])} type="sale" />

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
              {isLoading ? "Adding..." : "Add Sale"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/sales")}
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
