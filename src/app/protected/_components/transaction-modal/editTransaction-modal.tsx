// EditTransactionModal.tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { useUpdateTransaction } from "@/hooks/useTransaction"
import { useToast } from "@/components/ui/use-toast"
import { updateTransactionSchema } from "@/lib/zod/transactionSchema"
import { BaseModal } from "@/components/baseModal"
import { SelectField } from "@/components/formComponents/selectFields"
import { TextField } from "@/components/formFields"
import { DateField } from "@/components/formComponents/dateField"
import { TextareaField } from "@/components/formComponents/textArea"
import { z } from "zod"

type UpdateTransactionType = z.infer<typeof updateTransactionSchema>

interface TransactionType {
  id: string
  businessId: string
  categoryId?: string
  item: string
  description: string
  amount: number
  type: "income" | "expense" | "transfer"
  transactionStatus: "pending" | "completed" | "failed" | "cancelled" 
  transactionDate: Date | undefined
  reference?: string
  attachments?: string[]
  metadata?: object
}

interface EditTransactionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: TransactionType
  businessId: string
  id: string
}

export function EditTransactionModal({ 
  open, 
  onOpenChange, 
  transaction,
  businessId,
  id 
}: EditTransactionModalProps) {
  const { mutate: updateTransaction, isPending } = useUpdateTransaction()
  const { toast } = useToast()

  const form = useForm<UpdateTransactionType>({
    resolver: zodResolver(updateTransactionSchema),
    defaultValues: {
      id: id,
      businessId,
      item: "",
      description: "",
      amount: 0,
      type: "income",
      transactionStatus: "pending",
      transactionDate: new Date() || undefined,
    },
  })

  // Pre-populate form when transaction changes
  useEffect(() => {
    if (transaction && open) {
      form.reset({
        id: transaction.id,
        businessId: transaction.businessId,
        item: transaction.item || "",
        description: transaction.description || "",
        amount: transaction.amount || 0,
        type: transaction.type || "income",
        transactionStatus: transaction.transactionStatus || "pending",
        transactionDate: transaction.transactionDate ? new Date(transaction.transactionDate) : new Date(),
        categoryId: transaction.categoryId,
        reference: transaction.reference,
        attachments: transaction.attachments,
        metadata: transaction.metadata,
      })
    }
  }, [transaction, open, form])

  const onSubmit = (data: UpdateTransactionType) => {
    updateTransaction(
      { 
        id: id, 
        data, 
      }, 
      {
        onSuccess: () => {
          toast({ title: 'Success', description: 'Transaction updated successfully' })
          onOpenChange(false)
        },
        onError: (error: { message?: string }) => {
          toast({
            title: 'Error',
            description: error.message || 'Failed to update transaction',
            variant: 'destructive',
          })
        },
      }
    )
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
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => onOpenChange(false)}
        disabled={isPending}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        form="edit-transaction-form"
        disabled={isPending}
      >
        {isPending ? "Updating..." : "Update Transaction"}
      </Button>
    </>
  )

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Transaction"
      description="Update the transaction information below."
      footer={footer}
    >
      <Form {...form}>
        <form id="edit-transaction-form" onSubmit={form.handleSubmit(onSubmit)}>
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
            
            <TextField
              control={form.control}
              name="reference"
              label="Reference"
              placeholder="Enter reference number (optional)"
              disabled={isPending}
            />
          </div>
        </form>
      </Form>
    </BaseModal>
  )
}