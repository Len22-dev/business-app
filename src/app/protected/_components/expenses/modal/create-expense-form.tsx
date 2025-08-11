import type React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Receipt } from "lucide-react"
import { useCreateExpense } from "@/hooks/useExpenses"
import { useToast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { createExpenseSchema } from "@/lib/zod/expenseSchema"
import { Form } from "@/components/ui/form"
import { TextField } from "@/components/formFields"
import { TextareaField } from "@/components/formComponents/textArea"
import { SelectField } from "@/components/formComponents/selectFields"
import { DateField } from "@/components/formComponents/dateField"

interface CreateExpenseModalProps {
  businessId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ExpenseFormData {
  businessId: string
  reference?: string
  totalAmount: number
  paidAmount: number
  balanceDue: number
  lastPaymentDate?: Date
  receipt?: string
  isReimbursed: boolean
  isReimbursable: boolean
  isRecurring: boolean
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  createdBy: string
  notes?: string
  tags?: string[]
}

const recurringFrequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
]

export function CreateExpenseModal({ open, onOpenChange, businessId }: CreateExpenseModalProps) {
  const { mutate: createExpense, isPending } = useCreateExpense()
  const { toast } = useToast()

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      businessId: businessId,
      reference: "",
      totalAmount: 0,
      paidAmount: 0,
      balanceDue: 0,
      lastPaymentDate: undefined,
      receipt: "",
      isReimbursed: false,
      isReimbursable: false,
      isRecurring: false,
      recurringFrequency: undefined,
      createdBy: businessId, // Using businessId as placeholder for createdBy
      notes: "",
      tags: [],
    },
  })

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      form.reset({
        businessId: businessId,
        reference: "",
        totalAmount: 0,
        paidAmount: 0,
        balanceDue: 0,
        lastPaymentDate: undefined,
        receipt: "",
        isReimbursed: false,
        isReimbursable: false,
        isRecurring: false,
        recurringFrequency: undefined,
        createdBy: businessId,
        notes: "",
        tags: [],
      })
    }   
  }, [open, businessId, form])

  // Calculate balance due when amounts change
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'totalAmount' || name === 'paidAmount') {
        const totalAmount = value.totalAmount || 0
        const paidAmount = value.paidAmount || 0
        const balanceDue = totalAmount - paidAmount
        form.setValue('balanceDue', balanceDue, { shouldValidate: true })
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  const handleSubmit = (data: ExpenseFormData) => {
    createExpense({
      expenseData: data,
      businessId: data.businessId
    }, {
      onSuccess: (data) => {
        toast({
          title: "Expense created successfully!",
          description: `Expense of ₦${form.getValues('totalAmount').toLocaleString()} has been recorded.`,
          variant: "default",
        })
        form.reset()
        onOpenChange(false)
      },
      onError: (error: {message?: string}) => {
        toast({
          title: "Failed to create expense!",
          description: error.message || "There was an error creating the expense. Please try again.",
          variant: "destructive",
        })
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Create New Expense
          </DialogTitle>
          <DialogDescription>Record a new business expense with all necessary details.</DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <TextField
                  control={form.control}
                  name="totalAmount"
                  type="number"
                  label="Total Amount *"
                  placeholder="0.00"
                  disabled={isPending}
                  required
                />
              </div>
              <div className="space-y-2">
                <TextField
                  control={form.control}
                  name="paidAmount"
                  type="number"
                  label="Paid Amount"
                  placeholder="0.00"
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <TextField
                control={form.control}
                name="balanceDue"
                type="number"
                label="Balance Due"
                placeholder="0.00"
                disabled={true}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <TextField
                  control={form.control}
                  name="reference"
                  label="Reference"
                  placeholder="Enter reference number"
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <DateField
                  control={form.control}
                  name="lastPaymentDate"
                  label="Last Payment Date"
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <TextareaField
                control={form.control}
                name="notes"
                label="Notes"
                placeholder="Enter expense notes"
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <TextField
                control={form.control}
                name="receipt"
                label="Receipt URL"
                placeholder="Enter receipt URL"
                disabled={isPending}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isReimbursable"
                  {...form.register("isReimbursable")}
                  disabled={isPending}
                />
                <label htmlFor="isReimbursable" className="text-sm font-medium">
                  Reimbursable
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isReimbursed"
                  {...form.register("isReimbursed")}
                  disabled={isPending}
                />
                <label htmlFor="isReimbursed" className="text-sm font-medium">
                  Already Reimbursed
                </label>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isRecurring"
                {...form.register("isRecurring")}
                disabled={isPending}
              />
              <label htmlFor="isRecurring" className="text-sm font-medium">
                Recurring Expense
              </label>
            </div>

            {form.watch("isRecurring") && (
              <div className="space-y-2">
                <SelectField
                  control={form.control}
                  name="recurringFrequency"
                  label="Recurring Frequency"
                  placeholder="Select frequency"
                  options={recurringFrequencyOptions}
                  disabled={isPending}
                />
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
              >
                {isPending ? "Creating..." : "Create Expense"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}