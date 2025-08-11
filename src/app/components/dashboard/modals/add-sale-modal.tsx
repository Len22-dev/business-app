"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { TextField } from "@/components/formFields"
import { TextareaField } from "@/components/formComponents/textArea"
import { SelectField } from "@/components/formComponents/selectFields"
import { DateField } from "@/components/formComponents/dateField"
import { BaseModal } from "@/components/baseModal"
import { ItemSelector, TransactionItem as SaleItem } from "@/app/components/dashboard/item-selector"
import { PaymentMethodSelector } from "@/app/components/dashboard/payment-method-selector"
import type { PaymentMethod } from "@/lib/types"
import { useCreateSale } from '@/hooks/useSales'
import { saleFormSchema } from "@/lib/zod/salesSchema"
import { LocationSelector } from "@/app/protected/inventory/modal/location-select"
import { useBusinessLocations } from "@/hooks/useLocation"

interface LocationOption {
  value: string
  label: string
}
interface Location {
  id: string
  name: string
}

type SaleFormData = z.infer<typeof saleFormSchema>

interface AddSaleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  businessId: string
  onSuccess: () => void
}

export function AddSaleModal({ open, onOpenChange, userId, businessId, onSuccess }: AddSaleModalProps) {
  const [items, setItems] = useState<SaleItem[]>([])
  const [totalAmount, setTotalAmount] = useState(0)
  const { mutate: createSale, isPending } = useCreateSale()
  const { toast } = useToast()

  const { data: locationsData } = useBusinessLocations(businessId, {
      isActive: true,
      limit: 100
    })
    
    // Transform locations for the success toast
    const locationOptions = locationsData?.locations?.map((location: Location) => ({
      value: location.id,
      label: location.name
    })) || []

  const form = useForm<SaleFormData>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: {
      businessId,
      customerName: "",
      description: "",
      status: "pending",
      paymentMethod: 'cash',
      locationId: undefined,
      bankId: "",
      cardId: "",
      totalAmount: 0,
      saleDate: new Date(),
      dueDate: new Date(),
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
  }, [open, form])

  // Updated onSubmit function in AddSaleModal
const onSubmit = (data: SaleFormData) => {
  // Validate that items exist and have products selected
  if (items.length === 0) {
    toast({
      title: 'Error',
      description: 'Please add at least one item to the sale',
      variant: 'destructive',
    })
    return
  }

  // Check if all items have productId (for sales)
  const itemsWithoutProduct = items.filter(item => !item.productId)
  if (itemsWithoutProduct.length > 0) {
    toast({
      title: 'Error',
      description: 'Please select products from inventory for all items',
      variant: 'destructive',
    })
    return
  }

  if (totalAmount <= 0) {
    toast({
      title: 'Error',
      description: 'Sale total must be greater than zero',
      variant: 'destructive',
    })
    return
  }

  // Additional validation for payment methods
  if ((data.status === 'paid' || data.status === 'part_payment' || data.status === 'pending')) {
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
  const saleData = {
    userId,
    businessId: data.businessId,
    customerName: data.customerName,
    description: data.description || "",
    locationId: data.locationId || "",
    status: data.status,
    paymentMethod: data.paymentMethod,
    bankId: data.bankId || "",
    cardId: data.cardId || "",
    totalAmount: data.totalAmount,
    saleDate: data.saleDate,
    dueDate: data.dueDate,
  }

  const itemsForApi = items.map(item => ({
    productId: item.productId || "",
    quantity: item.quantity,
    unitPrice: item.price,
    totalPrice: item.total,
  }))

  console.log('Submitting sale data:', { saleData, items: itemsForApi }); // Debug log

  createSale({ saleData, items: itemsForApi, businessId }, {
    onSuccess: () => {
      const selectedLocation = locationOptions.find((locate: LocationOption) => locate.value === data.locationId)
      toast({
        title: 'Sales added successfully',
        description: selectedLocation 
            ? `Your sales data has been added with "${selectedLocation.label}" successfully.`
            : "Your product has been added to the inventory.",
          variant: "default",
      })
      form.reset()
      setItems([])
      onSuccess()
      onOpenChange(false)
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

  const paymentStatusOptions = [
    { value: "paid", label: "Paid" },
    { value: "part_payment", label: "Partially Paid" },
    { value: "unpaid", label: "Unpaid" },
    { value: "pending", label: "Pending" },
    { value: "failed", label: "Failed" },
    { value: "refunded", label: "Refunded" },
  ]

  const footer = (
    <>
      <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
        Cancel
      </Button>
      <Button 
        type="submit" 
        form="add-sale-form"
        className="bg-green-600 hover:bg-green-700" 
        disabled={isPending || items.length === 0 || totalAmount === 0}
      >
        {isPending ? "Adding..." : "Add Sale"}
      </Button>
    </>
  )

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Sale"
      description="Enter the details of your sale transaction. Fill in all the required information."
      footer={footer}
      className="max-w-max"
    >
      <Form {...form}>
        <form id="add-sale-form" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4 w-full">
            {/* Customer Name and Total Amount Row */}
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                control={form.control}
                name="customerName"
                label="Customer Name"
                placeholder="Enter customer name"
                disabled={isPending}
                required
              />
              
              <div className="space-y-2">
                <Label htmlFor="total-amount">Total Amount (₦)</Label>
                <Input 
                  id="total-amount" 
                  type="number" 
                  step="0.01" 
                  value={totalAmount.toFixed(2)} 
                  readOnly 
                  className="bg-muted" 
                />
              </div>
            </div>

            {/* Item Selector */}
            <div className="space-y-2">
              <Label>Sale Items</Label>
              <ItemSelector 
                userId={userId} 
                businessId={businessId} 
                onItemsChange={(newItems) => setItems(newItems as SaleItem[])} 
                type="sale" 
              />
              {items.length === 0 && (
                <p className="text-sm text-muted-foreground">Please add at least one item to continue</p>
              )}
            </div>

            {/* Payment Status and Dates Row */}
            <div className="grid space-x-3 md:grid-cols-2">
              <SelectField
                control={form.control}
                name="status"
                label="Payment Status"
                placeholder="Select status"
                options={paymentStatusOptions}
                disabled={isPending}
                required
              />
              <div className="flex items-center justify-between space-x-4 w-full">

              <LocationSelector
               businessId={businessId}
                onLocationChange={(locationId) => {
                  form.setValue("locationId", locationId || "", { 
                    shouldValidate: true,
                    shouldDirty: true 
                  })
                }}
                label="Location"
                placeholder="Search and select a location..."
                required={true}
                error={form.formState.errors.locationId?.message}
                className="w-full"
              />

              </div>
              {/* <div className="flex items-center justify-between space-x-2 w-full">
              </div> */}
            </div>

            {/* Due Date Row */}
            <div className="grid gap-4 md:grid-cols-2">
              <DateField
                control={form.control}
                name="saleDate"
                label="Sale Date"
                disabled={isPending}
                required
              />
              <DateField
                control={form.control}
                name="dueDate"
                label="Due Date"
                disabled={isPending}
                required
              />
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <Label>Payment Details</Label>
              <PaymentMethodSelector
                userId={userId}
                businessId={businessId}
                status={form.watch("status")}
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
                onBankChange={(bankId) => form.setValue("bankId", bankId)}
                onCardChange={(cardId) => form.setValue("cardId", cardId)}
                disabled={isPending}
              />
              
              {/* Display payment method validation errors */}
              {form.formState.errors.paymentMethod && (
                <p className="text-sm text-destructive">{form.formState.errors.paymentMethod.message}</p>
              )}
              {form.formState.errors.bankId && (
                <p className="text-sm text-destructive">{form.formState.errors.bankId.message}</p>
              )}
              {form.formState.errors.cardId && (
                <p className="text-sm text-destructive">{form.formState.errors.cardId.message}</p>
              )}
            </div>

            {/* Description */}
            <TextareaField
              control={form.control}
              name="description"
              label="Description (Optional)"
              placeholder="Enter sale description or notes"
              disabled={isPending}
            />
          </div>
        </form>
      </Form>
    </BaseModal>
  )
}