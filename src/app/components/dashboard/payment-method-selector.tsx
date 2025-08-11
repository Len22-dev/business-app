// Fixed PaymentMethodSelector with proper value handling
"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import type { Bank, BankCard, PaymentMethod, PaymentStatus } from "@/lib/types"

interface PaymentMethodSelectorProps {
  userId: string
  status: PaymentStatus
  onPaymentMethodChange: (method: PaymentMethod | "") => void
  onBankChange: (bankId: string) => void
  onCardChange: (cardId: string) => void
  defaultPaymentMethod?: PaymentMethod | ""
  defaultBankId?: string
  defaultCardId?: string
  disabled?: boolean
  businessId: string
}

export function PaymentMethodSelector({
  userId,
  status,
  onPaymentMethodChange,
  onBankChange,
  onCardChange,
  defaultPaymentMethod = "",
  defaultBankId = "",
  defaultCardId = "",
  disabled = false,
  businessId,
}: PaymentMethodSelectorProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">(defaultPaymentMethod)
  const [bankId, setBankId] = useState(defaultBankId)
  const [cardId, setCardId] = useState(defaultCardId)
  const [banks, setBanks] = useState<Bank[]>([])
  const [cards, setCards] = useState<BankCard[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  // Only fetch banks when payment method requires it (bank_transfer or card)
  useEffect(() => {
    const fetchBanks = async () => {
      // Only fetch if status allows payment AND payment method requires bank
      if (!businessId || 
          (status !== "paid" && status !== "part_payment") || 
          (paymentMethod !== "bank_transfer" && paymentMethod !== "card")) {
        setBanks([])
        return
      }

      setLoading(true)
      try {
        const { data, error } = await supabase
          .from("banks")
          .select("*")
          .eq("user_id", userId)
          .eq("business_id", businessId)
          .eq("is_active", true)
          .order("name")

        if (error) {
          console.error('Error fetching banks:', error)
          setBanks([])
          return
        }

        setBanks(data || [])

        // Reset bank selection if previously selected bank is no longer available
        if (bankId && data && !data.some((bank) => bank.id === bankId)) {
          setBankId("")
          onBankChange("")
        }
      } catch (error) {
        console.error('Error fetching banks:', error)
        setBanks([])
      } finally {
        setLoading(false)
      }
    }

    fetchBanks()
  }, [userId, businessId, paymentMethod, supabase, status, cardId, bankId, onBankChange]) // Removed status and bankId from dependencies

  // Fetch cards when bank changes and payment method is card
  useEffect(() => {
    const fetchCards = async () => {
      // Only fetch cards if payment method is card and bank is selected
      if (!bankId || 
          !businessId || 
          (status !== "paid" && status !== "part_payment") || 
          paymentMethod !== "card") {
        setCards([])
        return
      }

      setLoading(true)
      try {
        const { data, error } = await supabase
          .from("bank_cards")
          .select("*")
          .eq("bank_id", bankId)
          .eq("business_id", businessId)
          .eq("user_id", userId)
          .eq("is_active", true)

        if (error) {
          console.error('Error fetching cards:', error)
          setCards([])
          return
        }

        setCards(data || [])

        // Reset card selection if previously selected card is no longer available
        if (cardId && data && !data.some((card) => card.id === cardId)) {
          setCardId("")
          onCardChange("")
        }
      } catch (error) {
        console.error('Error fetching cards:', error)
        setCards([])
      } finally {
        setLoading(false)
      }
    }

    fetchCards()
  }, [bankId, businessId, userId, paymentMethod, supabase, status, cardId, onCardChange]) // Removed status from dependenciesardId and status from dependencies

  // Handle payment method change
  const handlePaymentMethodChange = (value: string) => {
    // Don't allow empty selection
    if (value === "default" || value === "") {
      return
    }

    const method = value as PaymentMethod
    setPaymentMethod(method)
    onPaymentMethodChange(method)

    // Reset bank and card if payment method changes to something that doesn't need them
    if (method !== "bank_transfer" && method !== "card") {
      setBankId("")
      setCardId("")
      onBankChange("")
      onCardChange("")
      setBanks([]) // Clear banks array
      setCards([]) // Clear cards array
    }
    
    // Reset card if changing from card to bank_transfer
    if (method === "bank_transfer" && paymentMethod === "card") {
      setCardId("")
      onCardChange("")
      setCards([]) // Clear cards array
    }
  }

  // Handle bank change
  const handleBankChange = (value: string) => {
    if (value === "default" || value === "") {
      return
    }

    setBankId(value)
    onBankChange(value)

    // Reset card when bank changes
    setCardId("")
    onCardChange("")
  }

  // Handle card change
  const handleCardChange = (value: string) => {
    if (value === "default" || value === "") {
      return
    }

    setCardId(value)
    onCardChange(value)
  }

  // Reset states when status changes to something other than paid/part_payment
  useEffect(() => {
    if (status !== "paid" && status !== "part_payment") {
      setPaymentMethod("")
      setBankId("")
      setCardId("")
      setBanks([])
      setCards([])
      onPaymentMethodChange("")
      onBankChange("")
      onCardChange("")
    }
  }, [status, onPaymentMethodChange, onBankChange, onCardChange])

  // If status is not paid or part_payment, don't show payment method
  if (status !== "paid" && status !== "part_payment") {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="payment-method">Payment Method *</Label>
        <Select 
          value={paymentMethod || ""} 
          onValueChange={handlePaymentMethodChange} 
          disabled={disabled || loading}
        >
          <SelectTrigger id="payment-method">
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            <SelectItem value="card">Card</SelectItem>
            <SelectItem value="mobile_money">Mobile Money</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Show bank selection for bank transfer or card payment */}
      {(paymentMethod === "bank_transfer" || paymentMethod === "card") && (
        <div className="grid gap-2">
          <Label htmlFor="bank">Bank Account *</Label>
          <Select 
            value={bankId || ""} 
            onValueChange={handleBankChange} 
            disabled={disabled || loading || banks.length === 0}
          >
            <SelectTrigger id="bank">
              <SelectValue placeholder={
                loading ? "Loading banks..." : 
                banks.length === 0 ? "No bank accounts available" : 
                "Select bank account"
              } />
            </SelectTrigger>
            <SelectContent>
              {banks.map((bank) => (
                <SelectItem key={bank.id} value={bank.id}>
                  {bank.name} - {bank.account_number}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {banks.length === 0 && !loading && (
            <p className="text-sm text-muted-foreground">
              No bank accounts found. Please add a bank account first.
            </p>
          )}
        </div>
      )}

      {/* Show card selection for card payment */}
      {paymentMethod === "card" && bankId && (
        <div className="grid gap-2">
          <Label htmlFor="card">Card *</Label>
          <Select 
            value={cardId || ""} 
            onValueChange={handleCardChange} 
            disabled={disabled || loading || cards.length === 0}
          >
            <SelectTrigger id="card">
              <SelectValue placeholder={
                loading ? "Loading cards..." :
                cards.length === 0 ? "No cards available for selected bank" : 
                "Select card"
              } />
            </SelectTrigger>
            <SelectContent>
              {cards.map((card) => (
                <SelectItem key={card.id} value={card.id}>
                  {card.card_type.toUpperCase()} - *{card.card_number?.slice(-4) || "****"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {cards.length === 0 && !loading && bankId && (
            <p className="text-sm text-muted-foreground">
              No cards found for the selected bank. Please add a card first.
            </p>
          )}
        </div>
      )}
    </div>
  )
}