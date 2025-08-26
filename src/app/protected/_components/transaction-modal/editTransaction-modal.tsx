// EditTransactionModal.tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { useUpdateTransaction } from "@/hooks/useTransaction"
import { useToast } from "@/components/ui/use-toast"
import { updateTransactionFormSchema, updateTransactionFormSchemas, updateTransactionSchema } from "@/lib/zod/transactionSchema"
import { BaseModal } from "@/components/baseModal"
import { SelectField } from "@/components/formComponents/selectFields"
import { TextField } from "@/components/formFields"
import { DateField } from "@/components/formComponents/dateField"
import { TextareaField } from "@/components/formComponents/textArea"
import { z } from "zod"

type UpdateTransactionType = z.infer<typeof updateTransactionSchema>

// interface TransactionType {
//   id: string
//   businessId: string
//   categoryId?: string
//   item: string
//   description: string
//   totalAmount: number
//   type: "income" | "expense" | "transfer"
//   transactionStatus: "pending" | "completed" | "failed" | "cancelled" 
//   transactionDate: Date | undefined
//   reference?: string
//   attachments?: string[]
//   metadata?: object
// }

interface EditTransactionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: updateTransactionFormSchemas
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

  const form = useForm<updateTransactionFormSchemas>({
    resolver: zodResolver(updateTransactionFormSchema),
    defaultValues: {
      id: id,
      businessId,
      item: "",
      description: "",
      totalAmount: 0,
      transactionType: "sales",
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
        totalAmount: transaction.totalAmount || 0,
        transactionType: transaction.transactionType || "sales",
        transactionStatus: transaction.transactionStatus || "pending",
        transactionDate: transaction.transactionDate ? new Date(transaction.transactionDate) : new Date(),
        categoryId: transaction.categoryId,
        entityType: transaction.entityType,
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
    { value: "sales", label: "Sales" },
    { value: "expense", label: "Expense" },
    { value: "transfer", label: "Transfer" },
    { value: "payment", label: "Payment" },
    { value: "purchase", label: "Purchase" },
    { value: "payroll", label: "Payroll" },
    { value: "journal", label: "Journal" },
  ]

  const entityTypes = [
    { value: "customer", label: "Customer" },
    { value: "vendor", label: "Vendor" },
    { value: "bank", label: "Bank" },
    { value: "product", label: "Product" },
    { value: "employee", label: "Employee" },
    { value: "other", label: "Other" },
  ]

  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
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
              name="transactionType"
              label="Transaction Type"
              placeholder="Select type"
              options={transactionTypes}
              disabled={isPending}
              required
            />
            
            <TextField
              control={form.control}
              name="totalAmount"
              label="TotaltotalAmount (₦)"
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
            
            <SelectField
              control={form.control}
              name="entityType"
              label="Entity Type"
              placeholder="Select type"
              options={entityTypes}
              disabled={isPending}
              required
            />
          </div>
        </form>
      </Form>
    </BaseModal>
  )
}