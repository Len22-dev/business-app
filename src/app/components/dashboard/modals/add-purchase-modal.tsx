"use client"

import type React from "react"

import {  useEffect, useState } from "react"
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
import { useToast } from "@/components/ui/use-toast"
import { PaymentMethodSelector } from "@/app/components/dashboard/payment-method-selector"
import type { PaymentMethod } from "@/lib/types"
// import { useBusinessContext } from "@/context/business-context"
import { useCreatePurchase } from '@/hooks/usePurchase'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {  purchaseFormSchema, } from "@/lib/zod/purchaseSchema"
import { z } from "zod"
import { TextareaField } from "@/components/formComponents/textArea"
import { useBusinessLocations } from "@/hooks/useLocation"
import { TextField } from "@/components/formFields"
import { Form } from "@/components/ui/form"
import { SelectField } from "@/components/formComponents/selectFields"
import { DateField } from "@/components/formComponents/dateField"
import { ProductSelector} from "@/app/protected/_components/products/modal/productSelector"
import { ProductItem } from "@/types/product-selector"

interface AddPurchaseModalProps {
  isOpen: boolean
  onClose: (isOpen: boolean) => void
  userId: string
  businessId: string
  onSuccess: () => void
}

interface LocationOption {
  value: string
  label: string
}
interface Location {
  id: string
  name: string
}

type PurchaseFromData = z.infer <typeof purchaseFormSchema>

export function AddPurchaseModal({ isOpen, onClose, userId, businessId, onSuccess }: AddPurchaseModalProps) {
  const [items, setItems] = useState<ProductItem[]>([])
  const [totalAmount, setTotalAmount] = useState(0)
  const { toast } = useToast()
  const {mutate: createPurchase, isPending} = useCreatePurchase()

  const { data: locationsData } = useBusinessLocations(businessId, {
        isActive: true,
        limit: 100
      })
      
      // Transform locations for the success toast
      const locationOptions = locationsData?.locations?.map((location: Location) => ({
        value: location.id,
        label: location.name
      })) || []
  

  const form = useForm<PurchaseFromData>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: {
      businessId: businessId,
      locationId: undefined,
      vendorName: "",
      createdBy: userId,
      description: "",
      purchaseStatus: "pending",
      paymentMethod: "cash",
      bankId: "",
      purchaseDate: new Date(),
      subtotal: 0,
      totalAmount: 0,
      paidAmount: 0,
      balanceDue: 0,
      discount: 0,
      taxAmount: 0,
      expectedDate: new Date(),
      paymentTerms: ''
    },
  })


    // Update total amount when items change
    useEffect(() => {
      const total = items.reduce((sum, item) => sum + item.total, 0)
      setTotalAmount(total)
      form.setValue("totalAmount", total)
    }, [items, form])
  
    // Reset form when modal closes
    useEffect(() => {
      if (!open) {
        form.reset()
        setItems([])
        setTotalAmount(0)
      }
    }, [ form])
  
    // Updated onSubmit function in AddSaleModal
  const onSubmit = (data: PurchaseFromData) => {
    // Validate that items exist and have products selected
    if (items.length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one item to the purchase',
        variant: 'destructive',
      })
      return
    }
  
    // Check if all items have productId (for purchase)
    // const itemsWithoutProduct = items.filter(item => !item.productId)
    // if (itemsWithoutProduct.length > 0) {
    //   toast({
    //     title: 'Error',
    //     description: 'Please select products from inventory for all items',
    //     variant: 'destructive',
    //   })
    //   return
    // }
  
    if (totalAmount <= 0) {
      toast({
        title: 'Error',
        description: 'Purchase total cost must be greater than zero',
        variant: 'destructive',
      })
      return
    }
  
    // Additional validation for payment methods
    if ((data.purchaseStatus === 'paid' || data.purchaseStatus === 'part_payment' || data.purchaseStatus === 'pending')) {
      if (!data.paymentMethod) {
        toast({
          title: 'Error',
          description: 'Choose a payment status option',
          variant: 'destructive',
        })
        return
      }
  
      if ((data.paymentMethod === 'bank_transfer' || data.paymentMethod === 'card') && !data.bankId) {
        toast({
          title: 'Error',
          description: 'Bank account is required for this payment method',
          variant: 'destructive',
        })
        return
      }
  
      if (data.paymentMethod === 'card' && !data.cardId) {
        toast({
          title: 'Error',
          description: 'Card selection is required for card payments',
          variant: 'destructive',
        })
        return
      }
    }
  
    // Prepare data for API
    const purchaseData = {
     businessId: data.businessId,
     locationId: data.locationId,
     createdBy: data.createdBy,
     vendorId: data.vendorName,
     notes: data.description,
     purchaseStatus: data.purchaseStatus,
     paymentMethod: data.paymentMethod,
     bankId: data.bankId,
     cardId: data.cardId,
     purchaseDate: data.purchaseDate,
     subtotal: data.subtotal,
     totalAmount: data.totalAmount,
     paidAmount: data.paidAmount,
     balanceDue: data.balanceDue,
     discount: data.discount,
     taxAmount: data.taxAmount,
     expectedDate: data.expectedDate,
     paymentTerms: data.paymentTerms,
    }
  
    const itemsForApi = items.map(item => ({
      productId: item.id || "",
      quantity: item.quantity,
      unitPrice: item.cost,
      totalPrice: item.total,
    }))
  
    console.log('Submitting purchase data:', { purchaseData, items: itemsForApi }); // Debug log
  
    createPurchase({ purchaseData, items: itemsForApi, businessId }, {
      onSuccess: () => {
        const selectedLocation = locationOptions.find((locate: LocationOption) => locate.value === data.locationId)
        toast({
          title: 'Purchase added successfully',
          description: selectedLocation 
              ? `Your purchase data has been added with "${selectedLocation.label}" successfully.`
              : "Your product has been added to the inventory.",
            variant: "default",
        })
        form.reset()
        setItems([])
        onSuccess()
        onClose(false)
      },
      onError: (error: any) => {
        console.error('Sale creation error:', error); // Debug log
        toast({
          title: 'Error',
          description: error.message || 'Failed to add sale',
          variant: 'destructive',
        })
      },
    })
  }
  
    const purchaseStatusOptions = [
      { value: "paid", label: "Paid" },
      { value: "part_payment", label: "Partially Paid" },
      { value: "unpaid", label: "Unpaid" },
      { value: "pending", label: "Pending" },
      { value: "failed", label: "Failed" },
      { value: "refunded", label: "Refunded" },
    ]
  
    
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New Purchase</DialogTitle>
            <DialogDescription>Enter the details of your purchase transaction.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <TextField
                  name="vendorName"
                  label={'Vendor Name'}
                  control={form.control}
                  required
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total-amount">Total Amount</Label>
                <Input 
                id="total-amount" 
                type="number" 
                step="0.01" 
                value={totalAmount} 
                readOnly className="bg-muted" />
              </div>
            </div>

            <ProductSelector
              userId={userId}
              businessId={businessId}
              onItemsChange={(newItems) => setItems(newItems as ProductItem[])}
            />

            

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <SelectField
                name="purchaseStatus"
                label="Purchase Status"
                control={form.control}
                options={purchaseStatusOptions}
                required
                disabled={isPending}
                />
                <p className="text-red-500">{form.formState.errors.purchaseStatus?.message}</p>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
            <Label>Payment Details</Label>
            <PaymentMethodSelector
              userId={userId}
              businessId={businessId}
              status={form.watch('purchaseStatus')}
              onPaymentMethodChange={(method) => {
                                form.setValue("paymentMethod", method as PaymentMethod)
                                // Clear bank and card when payment method changes
                                if (method !== "bank_transfer" && method !== "card") {
                                  form.setValue("bankId", "")
                                }
                                if (method !== "card") {
                                  form.setValue("cardId", "")
                                }
                              }}
              onBankChange={(bankId) => form.setValue('bankId', bankId) }
              onCardChange={(cardId) => form.setValue('cardId', cardId)}
              disabled={isPending}
            />
            {/* Display payment method validation errors */}
            {form.formState.errors.purchaseStatus && (
            <p className="text-sm text-destructive">{form.formState.errors.purchaseStatus?.message}</p>
            )}
            {form.formState.errors.paymentMethod && (
            <p className="text-sm text-destructive">{form.formState.errors.paymentMethod?.message}</p>
            )}
            {form.formState.errors.bankId && (
            <p className="text-sm text-destructive">{form.formState.errors.bankId?.message}</p>
            )}
            {form.formState.errors.cardId && (
            <p className="text-sm text-destructive">{form.formState.errors.cardId?.message}</p>
            )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <TextareaField
                name="description"
                label='Description'
                control={form.control}
                disabled={isPending}
              />
               {form.formState.errors.description && (
            <p className="text-sm text-destructive">{form.formState.errors.description?.message}</p>
            )}
            </div>
             {/* Due Date Row */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <DateField
                  control={form.control}
                  name="purchaseDate"
                  label="Purchase Date"
                  disabled={isPending}
                  required
                />
                {form.formState.errors.purchaseDate && (
                <p className="text-sm text-destructive">{form.formState.errors.purchaseDate?.message}</p>
                )}
                </div>
                <DateField
                  control={form.control}
                  name="expectedDate"
                  label="Expected Date"
                  disabled={isPending}
                  required
                />
                  {form.formState.errors.expectedDate && (
                <p className="text-sm text-destructive">{form.formState.errors.expectedDate?.message}</p>
                )}
              </div>
             {/* Payment Description */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <TextField
                  control={form.control}
                  name="paidAmount"
                  label="Amount Paid"
                  type="number"
                  disabled={isPending}
                  required
                />
                {form.formState.errors.paidAmount && (
                <p className="text-sm text-destructive">{form.formState.errors.paidAmount?.message}</p>
                )}
                </div>
                <TextField
                  control={form.control}
                  name="balanceDue"
                  label="Balance Due"
                  type="number"
                  disabled={isPending}
                  required
                />
                  {form.formState.errors.balanceDue && (
                <p className="text-sm text-destructive">{form.formState.errors.balanceDue?.message}</p>
                )}
              </div>
          </div>
          <DialogFooter>
            <Button 
            type="button" 
            variant="outline" 
            onClick={() => onClose} 
            disabled={isPending}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isPending ||
                items.length === 0 ||
                totalAmount === 0 ||
                ((status === "paid" || status === "part_payment") && !form.watch('paymentMethod')) ||
                ((form.watch('paymentMethod') === "bank_transfer" ||   form.watch('paymentMethod') === "cash") && !form.watch('bankId')) ||
                (form.watch('paymentMethod') === "card" && !form.watch('cardId'))
              }
            >
              {isPending ? "Adding..." : "Add Purchase"}
            </Button>
          </DialogFooter>
        </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}