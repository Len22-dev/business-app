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
import { ShoppingBag } from "lucide-react"
import { useCreatePurchase } from "@/hooks/usePurchase"
import { useToast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { createPurchaseSchema } from "@/lib/zod/purchaseSchema"
import { Form } from "@/components/ui/form"
import { TextField } from "@/components/formFields"
import { SelectField } from "@/components/formComponents/selectFields"
import { DateField } from "@/components/formComponents/dateField"

interface CreatePurchaseModalProps {
  businessId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface PurchaseFormData {
  businessId: string
  vendorId?: string
  locationId?: string
  createdBy?: string
  purchaseDate: Date
  total: number
  subtotal: number
  tax: number
  discount: number
  status: 'paid' | 'pending'
}

const statusOptions = [
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
]

export function CreatePurchaseModal({ open, onOpenChange, businessId }: CreatePurchaseModalProps) {
  const { mutate: createPurchase, isPending } = useCreatePurchase()
  const { toast } = useToast()

  const form = useForm<PurchaseFormData>({
    resolver: zodResolver(createPurchaseSchema),
    defaultValues: {
      businessId: businessId,
      vendorId: "",
      locationId: "",
      createdBy: "",
      purchaseDate: new Date(),
      total: 0,
      subtotal: 0,
      tax: 0,
      discount: 0,
      status: "pending",
    },
  })

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      form.reset({
        businessId: businessId,
        vendorId: "",
        locationId: "",
        createdBy: "",
        purchaseDate: new Date(),
        total: 0,
        subtotal: 0,
        tax: 0,
        discount: 0,
        status: "pending",
      })
    }   
  }, [open, businessId, form])

  // Calculate total when subtotal, tax, or discount changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'subtotal' || name === 'tax' || name === 'discount') {
        const subtotal = value.subtotal || 0
        const tax = value.tax || 0
        const discount = value.discount || 0
        const total = subtotal + tax - discount
        form.setValue('total', total, { shouldValidate: true })
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  const handleSubmit = (data: PurchaseFormData) => {
    createPurchase({
      purchaseData: {
        businessId: data.businessId,
        vendorId: data.vendorId || undefined,
        locationId: data.locationId || undefined,
        createdBy: data.createdBy || undefined,
        purchaseDate: data.purchaseDate,
        total: data.total,
        subtotal: data.subtotal,
        tax: data.tax,
        discount: data.discount,
        status: data.status,
      },
      items: [], // Items will be added separately
      businessId: data.businessId
    }, {
      onSuccess: (data) => {
        toast({
          title: "Purchase created successfully!",
          description: `Purchase of ₦${form.getValues('total').toLocaleString()} has been recorded.`,
          variant: "default",
        })
        form.reset()
        onOpenChange(false)
      },
      onError: (error: {message?: string}) => {
        toast({
          title: "Failed to create purchase!",
          description: error.message || "There was an error creating the purchase. Please try again.",
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
            <ShoppingBag className="h-5 w-5" />
            Create New Purchase
          </DialogTitle>
          <DialogDescription>Record a new purchase with vendor and payment details.</DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <TextField
                  control={form.control}
                  name="vendorId"
                  label="Vendor"
                  placeholder="Select or enter vendor"
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <DateField
                  control={form.control}
                  name="purchaseDate"
                  label="Purchase Date"
                  disabled={isPending}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <TextField
                  control={form.control}
                  name="subtotal"
                  type="number"
                  label="Subtotal"
                  placeholder="0.00"
                  disabled={isPending}
                  required
                />
              </div>
              <div className="space-y-2">
                <TextField
                  control={form.control}
                  name="tax"
                  type="number"
                  label="Tax"
                  placeholder="0.00"
                  disabled={isPending}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <TextField
                  control={form.control}
                  name="discount"
                  type="number"
                  label="Discount"
                  placeholder="0.00"
                  disabled={isPending}
                  required
                />
              </div>
              <div className="space-y-2">
                <TextField
                  control={form.control}
                  name="total"
                  type="number"
                  label="Total"
                  placeholder="0.00"
                  disabled={true} // Auto-calculated
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <SelectField
                  control={form.control}
                  name="status"
                  label="Status"
                  placeholder="Select status"
                  options={statusOptions}
                  disabled={isPending}
                  required
                />
              </div>
              <div className="space-y-2">
                <TextField
                  control={form.control}
                  name="locationId"
                  label="Location"
                  placeholder="Select or enter location"
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <TextField
                control={form.control}
                name="createdBy"
                label="Created By"
                placeholder="Enter creator ID"
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
                {isPending ? "Creating..." : "Create Purchase"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}