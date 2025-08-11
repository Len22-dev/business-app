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
import { createExpenseItemSchema } from "@/lib/zod/expenseSchema"
import { Form } from "@/components/ui/form"
import { TextField } from "@/components/formFields"
import { TextareaField } from "@/components/formComponents/textArea"
import { SelectField } from "@/components/formComponents/selectFields"
import { DateField } from "@/components/formComponents/dateField"
import { CategorySelector } from "../../products/modal/category-selector"

interface AddExpenseModalProps {
  businessId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ExpenseItemFormData {
  expenseId: string
  expenseStatus: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'PAID'
  expenseDate: Date
  description: string
  amount: number
  categoryId: string
  receiptUrl?: string
}

const expenseStatusOptions = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'PAID', label: 'Paid' },
]

export function AddExpenseModal({ open, onOpenChange, businessId }: AddExpenseModalProps) {
  const { mutate: createExpense, isPending } = useCreateExpense()
  const { toast } = useToast()

  const form = useForm<ExpenseItemFormData>({
    resolver: zodResolver(createExpenseItemSchema),
    defaultValues: {
      expenseId: "",
      expenseStatus: 'DRAFT',
      expenseDate: new Date(),
      description: "",
      amount: 0,
      categoryId: "",
      receiptUrl: "",
    },
  })

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      form.reset({
        expenseId: "",
        expenseStatus: 'DRAFT',
        expenseDate: new Date(),
        description: "",
        amount: 0,
        categoryId: "",
        receiptUrl: "",
      })
    }   
  }, [open, form])

  const handleSubmit = (data: ExpenseItemFormData) => {
    // Create expense item data structure
    const expenseItemData = {
      ...data,
      businessId: businessId
    }

    createExpense({
      expenseData: expenseItemData,
      businessId: businessId
    }, {
      onSuccess: () => {
        toast({
          title: "Expense added successfully!",
          description: `Expense of ₦${form.getValues('amount').toLocaleString()} has been recorded.`,
          variant: "default",
        })
        form.reset()
        onOpenChange(false)
      },
      onError: (error: {message?: string}) => {
        toast({
          title: "Failed to add expense!",
          description: error.message || "There was an error adding the expense. Please try again.",
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
            Add New Expense
          </DialogTitle>
          <DialogDescription>Record a new business expense with all necessary details.</DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <TextField
                  control={form.control}
                  name="amount"
                  type="number"
                  label="Amount *"
                  placeholder="0.00"
                  disabled={isPending}
                  required
                />
              </div>
              <div className="space-y-2">
                <DateField
                  control={form.control}
                  name="expenseDate"
                  label="Expense Date *"
                  disabled={isPending}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <TextareaField
                control={form.control}
                name="description"
                label="Description *"
                placeholder="Enter expense description"
                disabled={isPending}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <CategorySelector
                  businessId={businessId}
                  onCategoryChange={(categoryId) => {
                    form.setValue("categoryId", categoryId || "", { 
                      shouldValidate: true,
                      shouldDirty: true 
                    })
                  }}
                  label="Category *"
                  placeholder="Search and select a category..."
                  required={true}
                  error={form.formState.errors.categoryId?.message}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <SelectField
                  control={form.control}
                  name="expenseStatus"
                  label="Status"
                  placeholder="Select status"
                  options={expenseStatusOptions}
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <TextField
                control={form.control}
                name="receiptUrl"
                label="Receipt URL"
                placeholder="Enter receipt URL"
                disabled={isPending}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
              >
                {isPending ? "Adding..." : "Add Expense"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}