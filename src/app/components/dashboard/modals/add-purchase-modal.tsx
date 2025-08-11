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
import { ItemSelector, type TransactionItem as PurchaseItem } from "@/app/components/dashboard/item-selector"
import { PaymentMethodSelector } from "@/app/components/dashboard/payment-method-selector"
import type { PaymentMethod, PaymentStatus, Purchase } from "@/lib/types"
// import { useBusinessContext } from "@/context/business-context"
import { useCreatePurchase } from '@/hooks/usePurchase'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createPurchaseSchema, purchaseSchema } from "@/lib/zod/purchaseSchema"

interface AddPurchaseModalProps {
  isOpen: boolean
  onClose: (isOpen: boolean) => void
  userId: string
  businessId: string
  onSuccess: () => void
}

export function AddPurchaseModal({ isOpen, onClose, userId, businessId, onSuccess }: AddPurchaseModalProps) {
  // const { currentBusiness } = useBusinessContext()
  const [supplier, setSupplier] = useState("")
  const [description, setDescription] = useState("")
  const [items, setItems] = useState<PurchaseItem[]>([])
  const [status, setStatus] = useState<PaymentStatus>("pending")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("")
  const [bankId, setBankId] = useState("")
  const [cardId, setCardId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [totalAmount, setTotalAmount] = useState(0)
  const { toast } = useToast()
  const {mutate: createPurchase, isPending} = useCreatePurchase()

  const form = useForm<Purchase>({
    resolver: zodResolver(createPurchaseSchema),
    defaultValues: {
      businessId,
      vendorId: "",
      createdBy: userId,
      locationId: "",
      description: "",
      purchaseStatus: "pending",
      paymentMethod: "",
      paymentStatus: "pending",
      discount: 0,
      purchaseDate: new Date(),
      subtotal: 0,
      total: 0,
      taxAmount: 0,
      bankId: "",
      dueDate: new Date(),
      totalAmount: 0,
      paidAmount: 0,
      notes: "",
    },
  })


  // Update total amount when items change
  useEffect(() => {
    const total = items.reduce((sum, item) => sum + item.total, 0)
    setTotalAmount(total)
  }, [items])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSupplier("")
      setDescription("")
      setItems([])
      setStatus("pending")
      setPaymentMethod("")
      setBankId("")
      setCardId("")
      setTotalAmount(0)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate payment method if status is paid or partial
      if ((status === "paid" || status === "part_payment") && !paymentMethod) {
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

      // Prepare purchaseData and items for the API
      const purchaseData = {
        userId,
        businessId,
        supplier,
        description,
        status,
        paymentMethod,
        bankId,
        cardId,
        totalAmount,
        purchaseDate: new Date(),
      }
      const itemsForApi = items.map(item => ({
        productId: item.productId || '',
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.total,
      }))

      await createPurchase.mutateAsync({ purchaseData, items: itemsForApi, businessId })

      toast({
        title: 'Success',
        description: 'Purchase has been added successfully',
      })
      onSuccess()
      onClose(isOpen)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add purchase',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Purchase</DialogTitle>
            <DialogDescription>Enter the details of your purchase transaction.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
              businessId={businessId}
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
              businessId={businessId}
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
            <Button type="button" variant="outline" onClick={() => onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading ||
                items.length === 0 ||
                totalAmount === 0 ||
                ((status === "paid" || status === "part_payment") && !paymentMethod) ||
                ((paymentMethod === "bank_transfer" || paymentMethod === "card") && !bankId) ||
                (paymentMethod === "card" && !cardId)
              }
            >
              {isLoading ? "Adding..." : "Add Purchase"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}