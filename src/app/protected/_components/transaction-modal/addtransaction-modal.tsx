// AddTransactionModal.tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { useCreateTransaction } from "@/hooks/useTransaction"
import { useToast } from "@/components/ui/use-toast"
import { createTransactionSchema} from "@/lib/zod/transactionSchema"
import { TextField } from "@/components/formFields"
import { TextareaField } from "@/components/formComponents/textArea"
import { SelectField } from "@/components/formComponents/selectFields"
import { DateField } from "@/components/formComponents/dateField"
import { BaseModal } from "@/components/baseModal"
interface AddTransactionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  businessId: string
}
 type type = "income" | "expense" | "transfer"

 interface TransactionType {
  businessId: string
  item: string
  description: string
  amount: number
  type: type
  transactionStatus: "pending" | "completed" | "failed" | "cancelled" 
  transactionDate: Date 
}

export function AddTransactionModal({ open, onOpenChange, businessId }: AddTransactionModalProps) {
  const { mutate: createTransaction, isPending } = useCreateTransaction()
  const { toast } = useToast()

  const form = useForm<TransactionType>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      businessId,
      item: "",
      description: "",
      amount: 0,
      type: "income",
      transactionStatus: "pending",
      transactionDate: new Date() || undefined,
      
    },
  })

  const onSubmit = (data: TransactionType) => {
    createTransaction({ transactionData: data, businessId }, {
      onSuccess: () => {
        toast({ title: 'Success', description: 'Transaction added successfully' })
        form.reset()
        onOpenChange(false)
      },
      onError: (error: { message?: string }) => {
        toast({
          title: 'Error',
          description: error.message || 'Failed to add transaction',
          variant: 'destructive',
        })
      },
    })
  }

  const transactionTypes = [
    { value: "income", label: "Income" },
    { value: "expense", label: "Expense" },
    { value: "transfer", label: "Transfer" },
  ]

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
    { value: "cancelled", label: "Cancelled" },
  ]

  const footer = (
    <>
      <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
        Cancel
      </Button>
      <Button 
        type="submit" 
        form="add-transaction-form"
        className="bg-green-600 hover:bg-green-700" 
        disabled={isPending}
      >
        {isPending ? "Adding..." : "Add Transaction"}
      </Button>
    </>
  )

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Transaction"
      description="Create a new transaction record. Fill in all the required information."
      footer={footer}
    >
      <Form {...form}>
        <form id="add-transaction-form" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <SelectField
              control={form.control}
              name="type"
              label="Type"
              placeholder="Select type"
              options={transactionTypes}
              disabled={isPending}
              required
            />
            
            <TextField
              control={form.control}
              name="amount"
              label="Amount (₦)"
              placeholder="0.00"
              type="number"
              disabled={isPending}
              required
            />
            
            <TextField
              control={form.control}
              name="item"
              label="Item"
              placeholder="Enter item name"
              disabled={isPending}
              required
            />
            
            <DateField
              control={form.control}
              name="transactionDate"
              label="Date"
              disabled={isPending}
              required
            />
            
            <SelectField
              control={form.control}
              name="transactionStatus"
              label="Status"
              placeholder="Select status"
              options={statusOptions}
              disabled={isPending}
              required
            />
            
            <TextareaField
              control={form.control}
              name="description"
              label="Description"
              placeholder="Enter transaction description"
              disabled={isPending}
            />
            
            {/* <TextField
              control={form.control}
              name="reference"
              label="Reference"
              placeholder="Enter reference number (optional)"
              disabled={isPending}
            /> */}
          </div>
        </form>
      </Form>
    </BaseModal>
  )
}
