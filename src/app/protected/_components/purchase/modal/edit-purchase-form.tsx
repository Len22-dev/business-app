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
import { useUpdatePurchase, usePurchase } from "@/hooks/usePurchase"
import { useToast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { updatePurchaseSchema } from "@/lib/zod/purchaseSchema"
import { Form } from "@/components/ui/form"
import { TextField } from "@/components/formFields"
import { SelectField } from "@/components/formComponents/selectFields"
import { DateField } from "@/components/formComponents/dateField"

interface EditPurchaseModalProps {
  businessId: string
  purchaseId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface PurchaseFormData {
  businessId?: string
  vendorId?: string
  locationId?: string
  createdBy?: string
  purchaseDate?: Date
  total?: number
  subtotal?: number
  tax?: number
  discount?: number
  status?: 'paid' | 'pending'
}

const statusOptions = [
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
]

export function EditPurchaseModal({ open, onOpenChange, businessId, purchaseId }: EditPurchaseModalProps) {
  const { mutate: updatePurchase, isPending } = useUpdatePurchase()
  const { data: purchaseData, isLoading } = usePurchase(purchaseId)
  const { toast } = useToast()

  const form = useForm<PurchaseFormData>({
    resolver: zodResolver(updatePurchaseSchema),
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

  // Populate form when purchase data is loaded
  useEffect(() => {
    if (purchaseData && open) {
      form.reset({
        businessId: businessId,
        vendorId: purchaseData.vendorId || "",
        locationId: purchaseData.locationId || "",
        createdBy: purchaseData.createdBy || "",
        purchaseDate: new Date(purchaseData.purchaseDate),
        total: purchaseData.total,
        subtotal: purchaseData.subtotal,
        tax: purchaseData.tax,
        discount: purchaseData.discount,
        status: purchaseData.status as any,
      })
    }   
  }, [purchaseData, open, businessId, form])

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
    updatePurchase({
      id: purchaseId,
      data: {
        vendorId: data.vendorId,
        locationId: data.locationId,
        purchaseDate: data.purchaseDate,
        total: data.total,
        subtotal: data.subtotal,
        tax: data.tax,
        discount: data.discount,
        status: data.status,
      }
    }, {
      onSuccess: (data) => {
        toast({
          title: "Purchase updated successfully!",
          description: `Purchase has been updated.`,
          variant: "default",
        })
        onOpenChange(false)
      },
      onError: (error: {message?: string}) => {
        toast({
          title: "Failed to update purchase!",
          description: error.message || "There was an error updating the purchase. Please try again.",
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
            <div className="text-center">Loading purchase data...</div>
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
            <ShoppingBag className="h-5 w-5" />
            Edit Purchase
          </DialogTitle>
          <DialogDescription>Update purchase details and information.</DialogDescription>
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
                disabled={true} // Should not be editable
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
                {isPending ? "Updating..." : "Update Purchase"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}