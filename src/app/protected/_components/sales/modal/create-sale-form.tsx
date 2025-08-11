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
import { ShoppingCart } from "lucide-react"
import { useCreateSale } from "@/hooks/useSales"
import { useToast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { saleFormSchema } from "@/lib/zod/salesSchema"
import { Form } from "@/components/ui/form"
import { TextField } from "@/components/formFields"
import { TextareaField } from "@/components/formComponents/textArea"
import { SelectField } from "@/components/formComponents/selectFields"
import { DateField } from "@/components/formComponents/dateField"
import { z } from "zod"

interface CreateSaleModalProps {
  businessId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}



const statusOptions = [
  { value: 'paid', label: 'Paid' },
  { value: 'part_payment', label: 'Partial Payment' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
]

const paymentMethodOptions = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'card', label: 'Card' },
  { value: 'mobile_money', label: 'Mobile Money' },
  { value: 'cheque', label: 'Cheque' },
]

export function CreateSaleModal({ open, onOpenChange, businessId }: CreateSaleModalProps) {
  const { mutate: createSale, isPending } = useCreateSale()
  const { toast } = useToast()

  const form = useForm<z.infer <typeof saleFormSchema>>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: {
      businessId: businessId,
      customerName: "",
      description: "",
      status: "pending",
      paymentMethod: "cash",
      bankId: "",
      cardId: "",
      totalAmount: 0,
      saleDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  })

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      form.reset({
        businessId: businessId,
        customerName: "",
        description: "",
        status: "pending",
        paymentMethod: "cash",
        bankId: "",
        cardId: "",
        totalAmount: 0,
        saleDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      })
    }   
  }, [open, businessId, form])

  const handleSubmit = (data: z.infer <typeof saleFormSchema>) => {
    createSale({
      saleData: {
        ...data
      },
      items: [], // Items will be added separately
      businessId: data.businessId
    }, {
      onSuccess: () => {
        toast({
          title: "Sale created successfully!",
          description: `Sale for ${form.getValues('customerName')} has been created.`,
          variant: "default",
        })
        form.reset()
        onOpenChange(false)
      },
      onError: (error: {message?: string}) => {
        toast({
          title: "Failed to create sale!",
          description: error.message || "There was an error creating the sale. Please try again.",
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
            <ShoppingCart className="h-5 w-5" />
            Create New Sale
          </DialogTitle>
          <DialogDescription>Create a new sale record with customer and payment details.</DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <TextField
                  control={form.control}
                  name="customerName"
                  label="Customer Name"
                  placeholder="Enter customer name"
                  disabled={isPending}
                  required
                />
              </div>
              <div className="space-y-2">
                <TextField
                  control={form.control}
                  name="totalAmount"
                  type="number"
                  label="Total Amount"
                  placeholder="0.00"
                  disabled={isPending}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <TextareaField
                control={form.control}
                name="description"
                label="Description"
                placeholder="Enter sale description"
                disabled={isPending}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <SelectField
                  control={form.control}
                  name="status"
                  label="Payment Status"
                  placeholder="Select payment status"
                  options={statusOptions}
                  disabled={isPending}
                  required
                />
              </div>
              <div className="space-y-2">
                <SelectField
                  control={form.control}
                  name="paymentMethod"
                  label="Payment Method"
                  placeholder="Select payment method"
                  options={paymentMethodOptions}
                  disabled={isPending}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <DateField
                  control={form.control}
                  name="saleDate"
                  label="Sale Date"
                  disabled={isPending}
                  required
                />
              </div>
              <div className="space-y-2">
                <DateField
                  control={form.control}
                  name="dueDate"
                  label="Due Date"
                  disabled={isPending}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
              >
                {isPending ? "Creating..." : "Create Sale"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}