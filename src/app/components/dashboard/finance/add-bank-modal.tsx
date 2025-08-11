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
import type { AccountType } from "@/lib/types"
// import { useBusinessContext } from "@/context/business-context"


interface AddBankModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  onSuccess: () => void
  businessId: string
}

export function AddBankModal({ isOpen, onClose, userId, onSuccess, businessId }: AddBankModalProps) {
  // const { currentBusiness } = useBusinessContext()
  const [name, setName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [accountType, setAccountType] = useState<AccountType>("checking")
  const [initialBalance, setInitialBalance] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate business selection
      if (!businessId) {
        throw new Error("No business selected")
      }

      const { error } = await supabase.from("banks").insert({
        user_id: userId,
        business_id: businessId,
        name,
        account_number: accountNumber,
        account_type: accountType,
        balance: Number(initialBalance) || 0,
        is_active: true,
      })

      if (error) {
        throw error
      }

      toast({
        title: "Success",
        description: "Bank account has been added successfully",
      })

      // Reset form
      setName("")
      setAccountNumber("")
      setAccountType("checking")
      setInitialBalance("")

      onSuccess()
      onClose()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add bank account",
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
            <DialogTitle>Add New Bank Account</DialogTitle>
            <DialogDescription>Enter the details of your bank account.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Bank Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="account-number">Account Number</Label>
              <Input
                id="account-number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="account-type">Account Type</Label>
              <Select
                value={accountType}
                onValueChange={(value) => setAccountType(value as AccountType)}
                disabled={isLoading}
              >
                <SelectTrigger id="account-type">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Checking</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                </SelectContent>
              </Select>
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Bank"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
