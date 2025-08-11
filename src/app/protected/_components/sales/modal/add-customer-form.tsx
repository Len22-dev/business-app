"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useCreateCustomer } from "@/hooks/useCustomer"
import { useForm } from "react-hook-form"
import { createCustomerSchema } from "@/lib/zod/customerSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/components/ui/use-toast"
import { TextareaField } from "@/components/formComponents/textArea"
import { SelectField } from "@/components/formComponents/selectFields"
import { TextField } from "@/components/formFields"
import { Form } from "@/components/ui/form"
import { z } from "zod"

interface AddCustomerModalProps {
  businessId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddCustomerModal({ open, onOpenChange, businessId }: AddCustomerModalProps) {
  const {mutate: createCustomer, isPending } = useCreateCustomer()
 const  {toast} = useToast()

  const form = useForm<z.infer <typeof createCustomerSchema>>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
    businessId,
    name: "",
    email: "",
    phone: "",
    address: "",
    customerType: "INDIVIDUAL",
    billingAddress: undefined,
    shippingAddress: undefined,
    city: "",
    state: "",
    country: "",
    isActive: true,
    },
  })

  const customerType = [
    { value: 'INDIVIDUAL', label: 'Individual' },
    { value: 'BUSINESS', label: 'Company' },
]
  

  const handleSubmit = (data: z.infer<typeof createCustomerSchema>) => {
    createCustomer({customerData: data, businessId},{
      onSuccess: () => {
        toast({
          title: "Customer added successfully",
          description: "The customer has been added to your procurement system.",
          variant: 'default'
        })
        form.reset()
        onOpenChange(false)
      },
      onError: (error) => {
        toast({
          title: "Error occurred while adding customer: Failed to add customer",
          description: error.message,
          variant: 'destructive'
        })
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogDescription>Add a new customer to your procurement system.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
            <div className="space-x-2">
              <TextField
                name="name"
                label="Customer Name"
                placeholder="Enter customer name"
                control={form.control}
                required
              />
            </div>
            <div className="space-y-2 w-full">
               <SelectField
              name="customerType"
              label="Customer Type"
              placeholder="Select customer type"
              control={form.control}
              disabled= {isPending}
              options={customerType }
              />

            </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <TextField
                  name="email"
                  label="Email"
                  placeholder="customer@example.com"
                  control={form.control}
                  disabled= {isPending}
                />
              </div>
              <div className="space-y-2">
                <TextField
                  name="phone"
                  label="Phone Number"
                  placeholder="+234 xxx xxx xxxx"
                  control={form.control}
                  disabled= {isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <TextareaField
                name="address"
                label="Address"
                placeholder="Enter customer address"
                control={form.control}
                disabled= {isPending}
              />
            </div>
            <div className="space-y-2">
              <TextareaField
                name="billingAddress"
                label="Billing Address (optional)"
                placeholder="Enter customer billing address"
                control={form.control}
                disabled= {isPending}
              />
            </div>
            <div className="space-y-2">
              <TextareaField
                name="shippingAddress"
                label="Shipping Address (optional)"
                placeholder="Enter customer shipping address"
                control={form.control}
                disabled= {isPending}
              />
            </div>

            <div className="flex gap-4">
              <div className="space-y-2">
               <TextField
               name="city"
               label="City"
               placeholder="Ikeja"
               control={form.control}
               disabled= {isPending}
               />
               </div>
              <div className="space-y-2">
               <TextField
               name="state"
               label="State"
               placeholder="Lagos State"
               control={form.control}
               disabled= {isPending}
               />
               </div>
              <div className="space-y-2">
               <TextField
               name="country"
               label="Country"
               placeholder="Nigeria"
               control={form.control}
               disabled ={isPending}
               />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">{isPending?"Adding customer...": "Add Customer"}</Button>
          </DialogFooter>
        </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
