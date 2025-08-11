"use client"

import type React from "react"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { createBankSchema } from "@/lib/zod/bankingSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useCreateBank } from "@/hooks/useBank"
import { useToast } from "@/components/ui/use-toast"
import { Form } from "@/components/ui/form"
import { TextField } from "@/components/formFields"
import { SelectField } from "@/components/formComponents/selectFields"

interface AddBankAccountModalProps {
  businessId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddBankAccountModal({ open, onOpenChange, businessId }: AddBankAccountModalProps) {
  const {mutate: createBank, isPending} = useCreateBank()
  const {toast} = useToast()
  const form = useForm<z.infer<typeof createBankSchema>>({
    resolver: zodResolver(createBankSchema),
    defaultValues: {
    businessId: "",
    bankName: "",
    accountName: "",
    accountNumber: "",
    accountType: "",
    currency: "NGN",
    //routingNumber: "",
    openingBalance: 0,
    currentBalance: 0,
    isActive: true,
  },
});

// Reset form when modal opens
  useEffect(() => {
    if (open) {
      form.reset({
        businessId: businessId,
        bankName: "",
        accountName: "",
        accountNumber: "",
        openingBalance: 0,
        currentBalance: 0,
        accountType: "",
        currency: 'NGN',
        isActive: true,
      //  routingNumber: "",
      })
    }   
  }, [open, businessId, form])

  const handleSubmit = (data: z.infer<typeof createBankSchema>) => {
    createBank({bankData: data, businessId},{
         onSuccess: (data) => {
           toast({
             title: "Bank added successfully!",
             description: `New Bank Added with the name ${data.bankName}`,
             variant: "default",
           })
           form.reset()
           onOpenChange(false)
         },
         onError: (error: {message?: string}) => {
           toast({
             title: "Failed to add bank!",
             description: error.message || "There was an error adding the bank. Please try again.",
             variant: "destructive",
           })
         },
       })
  }

  const accountTypeOptions = [
    {value:'savings', label:' Savings Account'},
    {value:'current', label:'Current Account'},
    {value:'business', label:'Business Account'},
    {value:'dollar', label:'Dollar Account'},
    {value:'checking', label:'Checking Account'},
  ]

  const currencyOptions = [
    {value:'NGN', label:' Naira'},
    {value:'USD', label:'US Dollar'},
    {value:'pounds', label:'Pounds Sterling'},
    {value:'euro', label:'Euro'},
    {value:'cedis', label:'Ghana Cedis'},
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Bank Account</DialogTitle>
          <DialogDescription>
            Add a new bank account to your business. Fill in all the required information.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <TextField
              name= 'bankName'
              label="Bank Name"
              placeholder="e.g First Bank Nigeria (FBN)"
              required
              control={form.control}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <TextField
              name= 'accountName'
              label="Account Name"
              placeholder="John Doe Emmanuel"
              required
              control={form.control}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <TextField
              name= 'accountNumber'
              label="Account Number"
              placeholder="1234567890"
              required
              control={form.control}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-3">
                <SelectField
                control={form.control}
                name="accountType"
                label="Account Type"
                options={accountTypeOptions}
                />
              </div>
              <div className="col-span-3">
                <SelectField
                control={form.control}
                name="currency"
                label="Currency"
                options={currencyOptions}
                />
              </div>
            </div>

            {/* <div className="grid grid-cols-4 items-center gap-4">
            <TextField
              name= 'routingNumber'
              label="Routing Number"
              placeholder="e.g 1234567890"
              required
              control={form.control}
              />
            </div> */}

            <div className="grid grid-cols-4 items-center gap-4">
              <TextField
              name= 'openingBalance'
              label="Opening Balance"
              placeholder="0.0"
              type="number"
              required
              control={form.control}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <TextField
              name= 'currentBalance'
              label="Current Balance"
              placeholder="0.0"
              type="number"
              required
              control={form.control}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="bg-green-600 hover:bg-green-700">
             {isPending ? 'Submitting...' : 'Add Account'}
            </Button>
          </DialogFooter>
        </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
