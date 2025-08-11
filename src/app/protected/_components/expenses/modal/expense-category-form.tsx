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
import { Tag } from "lucide-react"
import { useCreateCategory } from "@/hooks/useCategory"
import { useToast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { createCategorySchema } from "@/lib/zod/productSchema"
import { Form } from "@/components/ui/form"
import { TextField } from "@/components/formFields"
import { TextareaField } from "@/components/formComponents/textArea"
import { SelectField } from "@/components/formComponents/selectFields"

interface AddExpenseCategoryModalProps {
  businessId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface CategoryFormData {
  businessId: string
  name: string
  description?: string
  type: 'product' | 'expense' | 'income'
  isActive: boolean
  color?: string
}

const colorOptions = [
  { value: "#3B82F6", label: "Blue" },
  { value: "#10B981", label: "Green" },
  { value: "#F59E0B", label: "Yellow" },
  { value: "#EF4444", label: "Red" },
  { value: "#8B5CF6", label: "Purple" },
  { value: "#EC4899", label: "Pink" },
  { value: "#6366F1", label: "Indigo" },
  { value: "#6B7280", label: "Gray" },
]

export function AddExpenseCategoryModal({ open, onOpenChange, businessId }: AddExpenseCategoryModalProps) {
  const { mutate: createCategory, isPending } = useCreateCategory()
  const { toast } = useToast()

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      businessId: businessId,
      name: "",
      description: "",
      type: 'expense',
      isActive: true,
      color: "#3B82F6",
    },
  })

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      form.reset({
        businessId: businessId,
        name: "",
        description: "",
        type: 'expense',
        isActive: true,
        color: "#3B82F6",
      })
    }   
  }, [open, businessId, form])

  const handleSubmit = (data: CategoryFormData) => {
    createCategory({
      categoryData: data,
      businessId: data.businessId
    }, {
      onSuccess: (data) => {
        toast({
          title: "Expense category created successfully!",
          description: `Category "${data.name}" has been added to your expense categories.`,
          variant: "default",
        })
        form.reset()
        onOpenChange(false)
      },
      onError: (error: {message?: string}) => {
        toast({
          title: "Failed to create category!",
          description: error.message || "There was an error creating the category. Please try again.",
          variant: "destructive",
        })
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Add Expense Category
          </DialogTitle>
          <DialogDescription>Create a new category to organize your expenses.</DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" noValidate>
            <div className="space-y-2">
              <TextField
                control={form.control}
                name="name"
                label="Category Name *"
                placeholder="Enter category name"
                disabled={isPending}
                required
              />
            </div>

            <div className="space-y-2">
              <TextareaField
                control={form.control}
                name="description"
                label="Description"
                placeholder="Enter category description"
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <SelectField
                control={form.control}
                name="color"
                label="Color"
                placeholder="Select a color"
                options={colorOptions}
                disabled={isPending}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                {...form.register("isActive")}
                disabled={isPending}
              />
              <label htmlFor="isActive" className="text-sm font-medium">
                Active Category
              </label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
              >
                {isPending ? "Creating..." : "Add Category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}