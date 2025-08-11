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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import type { Bank, BankCard, TransactionType } from "@/lib/types"
import { useCreateTransaction } from '@/hooks/useTransaction';

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  banks: Bank[]
  selectedBankId?: string
  onSuccess: () => void
  businessId: string
}

export function AddTransactionModal({
  isOpen,
  onClose,
  userId,
  banks,
  selectedBankId,
  onSuccess,
  businessId,
}: AddTransactionModalProps) {
  const [bankId, setBankId] = useState(selectedBankId || "")
  const [cardId, setCardId] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [transactionType, setTransactionType] = useState<TransactionType>("deposit")
  const [category, setCategory] = useState("")
  const [referenceNumber, setReferenceNumber] = useState("")
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split("T")[0])
  const [availableCards, setAvailableCards] = useState<BankCard[]>([])
  const { toast } = useToast()
  // Remove supabase client

  // Use the React Query mutation hook
  const { mutate: createTransaction, isPending } = useCreateTransaction();

  // Load cards when bank changes (keep this logic if you fetch cards from Supabase or API)
  useEffect(() => {
    if (bankId) {
      const fetchCards = async () => {
        const { data } = await createClient()
          .from("bank_cards")
          .select("*")
          .eq("bank_id", bankId)
          .eq("user_id", userId)
          .eq("is_active", true)

        setAvailableCards(data || [])
        setCardId("")
      }

      fetchCards()
    } else {
      setAvailableCards([])
      setCardId("")
    }
  }, [bankId, userId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankId) {
      toast({ title: 'Error', description: 'Please select a bank', variant: 'destructive' });
      return;
    }
    if (!businessId) {
      toast({ title: 'Error', description: 'No business selected', variant: 'destructive' });
      return;
    }
    const transactionData = {
      bank_id: bankId,
      card_id: cardId || null,
      user_id: userId,
      business_id: businessId,
      transaction_date: new Date(transactionDate).toISOString(),
      description,
      amount: Number(amount),
      transaction_type: transactionType,
      category: category || null,
      reference_number: referenceNumber || null,
      is_reconciled: false,
    };
    createTransaction({transactionData, businessId}, {
      onSuccess: () => {
        toast({ title: 'Success', description: 'Transaction has been added successfully' });
        setDescription("");
        setAmount("");
        setTransactionType("deposit");
        setCategory("");
        setReferenceNumber("");
        setTransactionDate(new Date().toISOString().split("T")[0]);
        if (!selectedBankId) setBankId("");
        setCardId("");
        onSuccess();
        onClose();
      },
      onError: (error: any) => {
        toast({
          title: 'Error',
          description: error.message || 'Failed to add transaction',
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
            <DialogDescription>Enter the details of your bank transaction.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="bank">Bank</Label>
                <Select value={bankId} onValueChange={setBankId} disabled={isPending || !!selectedBankId}>
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
                <Label htmlFor="card">Card (Optional)</Label>
                <Select
                  value={cardId}
                  onValueChange={setCardId}
                  disabled={isPending || !bankId || availableCards.length === 0}
                >
                  <SelectTrigger id="card">
                    <SelectValue placeholder="Select card" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-card">No Card</SelectItem>
                    {availableCards.map((card) => (
                      <SelectItem key={card.id} value={card.id}>
                        {card.card_type.toUpperCase()} - {card.card_number ? `*${card.card_number.slice(-4)}` : "Card"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                disabled={isPending}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  disabled={isPending}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="transaction-type">Transaction Type</Label>
                <Select
                  value={transactionType}
                  onValueChange={(value) => setTransactionType(value as TransactionType)}
                  disabled={isPending}
                >
                  <SelectTrigger id="transaction-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deposit">Deposit</SelectItem>
                    <SelectItem value="withdrawal">Withdrawal</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category (Optional)</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isPending}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="transaction-date">Transaction Date</Label>
                <Input
                  id="transaction-date"
                  type="date"
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                  required
                  disabled={isPending}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reference-number">Reference Number (Optional)</Label>
              <Input
                id="reference-number"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                disabled={isPending}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !bankId || !amount || !description}>
              {isPending ? "Adding..." : "Add Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
