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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import type { Bank, CardType } from "@/lib/types"
// import { useBusinessContext } from "@/context/business-context"

interface AddCardModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  businessId: string
  banks: Bank[]
  selectedBankId?: string
  onSuccess: () => void
}

export function AddCardModal({ isOpen, onClose, userId, businessId, banks, selectedBankId, onSuccess }: AddCardModalProps) {
  // const { currentBusiness } = useBusinessContext()
  const [bankId, setBankId] = useState(selectedBankId || "")
  const [cardType, setCardType] = useState<CardType>("debit")
  const [cardNumber, setCardNumber] = useState("")
  const [cardHolder, setCardHolder] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [initialBalance, setInitialBalance] = useState("")
  const [creditLimit, setCreditLimit] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!bankId) {
        throw new Error("Please select a bank")
      }

      // Validate business selection
      if (!businessId) {
        throw new Error("No business selected")
      }

      const { error } = await supabase.from("bank_cards").insert({
        bank_id: bankId,
        user_id: userId,
        business_id: businessId,
        card_type: cardType,
        card_number: cardNumber,
        card_holder: cardHolder,
        expiry_date: expiryDate,
        balance: Number(initialBalance) || 0,
        credit_limit: cardType === "credit" ? Number(creditLimit) || null : null,
        is_active: true,
      })

      if (error) {
        throw error
      }

      toast({
        title: "Success",
        description: "Card has been added successfully",
      })

      // Reset form
      setCardType("debit")
      setCardNumber("")
      setCardHolder("")
      setExpiryDate("")
      setInitialBalance("")
      setCreditLimit("")

      onSuccess()
      onClose()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add card",
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
            <DialogTitle>Add New Card</DialogTitle>
            <DialogDescription>Enter the details of your bank card.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="bank">Bank</Label>
              <Select value={bankId} onValueChange={setBankId} disabled={isLoading || !!selectedBankId}>
                <SelectTrigger id="bank">
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((bank) => (
                    <SelectItem key={bank.id} value={bank.id}>
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="card-type">Card Type</Label>
              <Select value={cardType} onValueChange={(value) => setCardType(value as CardType)} disabled={isLoading}>
                <SelectTrigger id="card-type">
                  <SelectValue placeholder="Select card type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debit">Debit Card</SelectItem>
                  <SelectItem value="credit">Credit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="card-number">Card Number</Label>
              <Input
                id="card-number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="card-holder">Card Holder</Label>
              <Input
                id="card-holder"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expiry-date">Expiry Date (MM/YY)</Label>
              <Input
                id="expiry-date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="initial-balance">Initial Balance</Label>
              <Input
                id="initial-balance"
                type="number"
                step="0.01"
                min="0"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                disabled={isLoading}
              />
            </div>
            {cardType === "credit" && (
              <div className="grid gap-2">
                <Label htmlFor="credit-limit">Credit Limit</Label>
                <Input
                  id="credit-limit"
                  type="number"
                  step="0.01"
                  min="0"
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Card"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
