"use client"

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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createCategorySchema } from "@/lib/zod/productSchema"
import { useToast } from "@/components/ui/use-toast"
import { TextField } from "@/components/formFields"
import { SelectField } from "@/components/formComponents/selectFields"
import { Form } from "@/components/ui/form"

interface AddCategoryModalProps {
  open: boolean
  businessId: string
  onOpenChange: (open: boolean) => void
}

interface CategoryType {
  businessId: string
  parentId?: string
  name: string
  description?: string
  color?: string
  type: 'product' | 'expense' | 'income'
  isActive: boolean
}

export function AddCategoryModal({ open, onOpenChange, businessId }: AddCategoryModalProps) {
  const {mutate: createCategory, isPending} = useCreateCategory()
  const {toast} = useToast()

  const form = useForm<CategoryType>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      businessId: businessId,
      parentId: undefined,
      name: "",
      description: "",
      color: "#3B82F6",
      type: "product", // Default to product type for inventory categories
      isActive: true,
    },
  })

  const predefinedColors = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EF4444",
    "#06B6D4",
    "#84CC16",
    "#F97316",
    "#EC4899",
    "#6366F1",
  ]

  const handleSubmit = (data: CategoryType) => {
    createCategory({categoryData: data, businessId}, {
      onSuccess: () => {
        toast({
          title: "Category added successfully",
          description: "You have successfully added a new category",
          variant: "default",
        })
        form.reset()
        onOpenChange(false)
      },
      onError: (error:{message?: string }) => {
        console.error('Error creating category:', error);
        toast({
          title: "Error adding category",
          description: error.message || "An error occurred while creating the category",
          variant: "destructive",
        })
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Add New Category
          </DialogTitle>
          <DialogDescription>Create a new product category to organize your inventory.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <TextField
              control={form.control}
              name="name"
              label="Category Name"
              placeholder="Enter category name"
              disabled={isPending}
              required
            />
          </div>

          <div className="space-y-2">
            <SelectField
              control={form.control}
              name="type"
              label="Category Type"
              placeholder="Select category type"
              options={[
                { value: "product", label: "Product" },
                { value: "expense", label: "Expense" },
                { value: "income", label: "Income" },
              ]}
              disabled={isPending}
              required
            />
          </div>

          <div className="space-y-2">
           <TextField
              control={form.control}
              name="description"
              label="Category Description"
              placeholder="Enter category description"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: form.watch("color") }}
              />
             <TextField
              control={form.control}
              name="color"
              label="Category Color"
              placeholder="Enter category color"
              disabled={isPending}
            />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {predefinedColors.map((colorOption) => (
                <button
                  key={colorOption}
                  type="button"
                  className={`w-6 h-6 rounded-full border-2 ${
                    form.watch("color") === colorOption ? "border-gray-800" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: colorOption }}
                  onClick={() => form.setValue("color", colorOption)}
                />
              ))}  
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
              { isPending ? "Adding..." : "Add Category"}
            </Button>
          </DialogFooter>
        </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
