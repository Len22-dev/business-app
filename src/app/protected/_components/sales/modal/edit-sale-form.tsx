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
import { useUpdateSale, useSale } from "@/hooks/useSales"
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

interface EditSaleModalProps {
  businessId: string
  saleId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface SaleFormData {
  businessId: string
  customerName: string
  description?: string
  status: 'paid' | 'part_payment' | 'pending' | 'failed' | 'refunded'
  paymentMethod: 'cash' | 'bank_transfer' | 'card' | 'mobile_money' | 'cheque'
  bankId?: string
  cardId?: string
  totalAmount: number
  saleDate: Date
  dueDate: Date
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

export function EditSaleModal({ open, onOpenChange, businessId, saleId }: EditSaleModalProps) {
  const { mutate: updateSale, isPending } = useUpdateSale()
  const { data: saleData, isLoading } = useSale(saleId)
  const { toast } = useToast()

  const form = useForm<SaleFormData>({
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
      dueDate: new Date(),
    },
  })

  // Populate form when sale data is loaded
  useEffect(() => {
    if (saleData && open) {
      form.reset({
        businessId: businessId,
        customerName: saleData.customer?.name || "",
        description: saleData.notes || "",
        status: saleData.paymentStatus as any,
        paymentMethod: saleData.paymentMethod as any,
        bankId: "",
        cardId: "",
        totalAmount: saleData.totalAmount,
        saleDate: new Date(saleData.saleDate),
        dueDate: new Date(saleData.dueDate || saleData.saleDate),
      })
    }   
  }, [saleData, open, businessId, form])

  const handleSubmit = (data: SaleFormData) => {
    updateSale({
      id: saleId,
      data: {
        totalAmount: data.totalAmount,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.status,
        saleDate: data.saleDate,
      }
    }, {
      onSuccess: (data) => {
        toast({
          title: "Sale updated successfully!",
          description: `Sale has been updated.`,
          variant: "default",
        })
        onOpenChange(false)
      },
      onError: (error: {message?: string}) => {
        toast({
          title: "Failed to update sale!",
          description: error.message || "There was an error updating the sale. Please try again.",
          variant: "destructive",
        })
      },
    })
  }

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex items-center justify-center p-6">
            <div className="text-center">Loading sale data...</div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Edit Sale
          </DialogTitle>
          <DialogDescription>Update sale details and payment information.</DialogDescription>
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
                  disabled={true} // Customer name should not be editable
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
                {isPending ? "Updating..." : "Update Sale"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}