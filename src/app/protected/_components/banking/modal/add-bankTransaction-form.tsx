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
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useToast } from "@/components/ui/use-toast"
import { Form } from "@/components/ui/form"
import { TextField } from "@/components/formFields"
import { SelectField } from "@/components/formComponents/selectFields"
import { useCreateBankTransaction } from "@/hooks/useBankTransactions"
import { createBankTransactionSchema } from "@/lib/zod/bankTransactionsSchema"
import { useBusinessBanks } from "@/hooks/useBank"
import { BankSelector } from "./bank-selector"
import { DateField } from "@/components/formComponents/dateField"

interface AddBankAccountModalProps {
  businessId: string
  userId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface BankOption {
  value: string
  label: string
}
interface Bank {
  id: string
  name: string
}

export function AddBankAccountModal({ open, onOpenChange, businessId, userId }: AddBankAccountModalProps) {
  const {mutate: createBankTransaction, isPending} = useCreateBankTransaction()
  const {toast} = useToast()

   // Fetch banks for the business (only needed for success toast)
    const { data: banksData } = useBusinessBanks(businessId, {
      isActive: true,
      limit: 100
    })
    
    // Transform banks for the success toast
    const bankOptions = banksData?.banks?.map((bank: Bank) => ({
      value: bank.id,
      label: bank.name
    })) || []

  const form = useForm<z.infer<typeof createBankTransactionSchema>>({
    resolver: zodResolver(createBankTransactionSchema),
    defaultValues: {
    businessId: "",
    createdBy: "",
    bankId: "",
    description: "",
    transactionDate: new Date(),
    type: "sales",
    category: "in",
    reference: "",
    amount: 0,
    balance: 0,
    isReconciled: false,
  },
});

// Reset form when modal opens
  useEffect(() => {
    if (open) {
      form.reset({
        businessId: businessId,
        createdBy: userId,
        bankId: "",
        description: "",
        transactionDate: new Date(),
        type: "sales",
        category: "in",
        reference: "",
        amount: 0,
        balance: 0,
        isReconciled: false,
      })
    }   
  }, [open, businessId, userId, form])

  const handleSubmit = (data: z.infer<typeof createBankTransactionSchema>) => {
    createBankTransaction({transactionData: data, businessId},{
         onSuccess: (data) => {
          const selectedBank = bankOptions.find((bank: BankOption) => bank.value === data.bankId)
           toast({
             title: "Bank transaction added successfully!",
              description: selectedBank 
            ? `Your product "${data.name}" has been added to the "${selectedBank.label}" category.`
            : "Your product has been added to the inventory.",
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

  const transactionTypeOptions = [
    {value:'transfer', label:'Transfer'},
    {value:'sale', label:'Sale'},
    {value:'expense', label:'expense'},
    {value:'purchase', label:'Purchase'},
    {value:'payroll', label:'Payroll/Salary'},
    {value:'journal', label:'Journal'},
    {value:'payment', label:'Payment'},
  ]

  const categoryOptions = [
    {value:'in', label:' In'},
    {value:'out', label:'Out'},
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
              <BankSelector businessId={businessId} 
              onBankChange={(bankId) => {
                form.setValue('bankId', bankId || "", {
                  shouldValidate: true,
                  shouldDirty: true
                })
              }}
              label="Bank Name"
              placeholder="Select a bank..."
              required
              error={form.formState.errors.bankId?.message}
              className="w-full"
              disabled= {isPending}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <TextField
              name= 'description'
              label="Description"
              placeholder="enter the details of the bank transaction"
              required
              control={form.control}
              disabled= {isPending}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <TextField
              name= 'reference'
              label="Transaction Reference Number"
              placeholder="1234567890"
              required
              control={form.control}
              disabled= {isPending}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-3">
                <SelectField
                control={form.control}
                name="type"
                label="Transaction Type"
                options={transactionTypeOptions}
                disabled= {isPending}
                />
              </div>
              <div className="col-span-3">
                <SelectField
                control={form.control}
                name="category"
                label="Transaction's Category"
                options={categoryOptions}
                disabled= {isPending}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
            <DateField
              name= 'transactionDate'
              label="Transaction Date"
              required
              control={form.control}
              disabled= {isPending}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <TextField
              name= 'amount'
              label="Amount"
              placeholder="0.0"
              type="number"
              required
              control={form.control}
              disabled= {isPending}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <TextField
              name= 'balance'
              label="Account Balance"
              placeholder="0.0"
              type="number"
              required
              control={form.control}
              disabled= {isPending}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="bg-green-600 hover:bg-green-700">
             {isPending ? 'Submitting...' : 'Add Transaction'}
            </Button>
          </DialogFooter>
        </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
