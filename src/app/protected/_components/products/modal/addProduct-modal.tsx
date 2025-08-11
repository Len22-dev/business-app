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
import { Package } from "lucide-react"
import { useCreateProduct } from "@/hooks/useProduct"
import { useBusinessCategories } from "@/hooks/useCategory"
import { useToast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { createProductSchema } from "@/lib/zod/productSchema"
import { Form } from "@/components/ui/form"
import { TextField } from "@/components/formFields"
import { TextareaField } from "@/components/formComponents/textArea"
import { CategorySelector } from "./category-selector"

interface AddProductModalProps {
  businessId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface CategoryOption {
  value: string
  label: string
}
interface Category {
  id: string
  name: string
}

interface Product {
  businessId: string
  name: string
  description?: string
  costPrice: number
  unitPrice: number
  sku?: string | undefined
  barcode?: string | undefined
  categoryId?: string
  isActive: boolean
  trackInventory: boolean
}

export function AddProductModal({ open, onOpenChange, businessId }: AddProductModalProps) {
  const { mutate: createProduct, isPending,  } = useCreateProduct()
  const { toast } = useToast()
  
  // Fetch categories for the business (only needed for success toast)
  const { data: categoriesData } = useBusinessCategories(businessId, {
    isActive: true,
    limit: 100
  })
  
  // Transform categories for the success toast
  const categoryOptions = categoriesData?.categories?.map((category: Category) => ({
    value: category.id,
    label: category.name
  })) || []

  const form = useForm<Product>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      businessId: businessId,
      name: "",
      sku: "",
      description: "",
      unitPrice: 0,
      costPrice: 0,
      barcode: "",
      categoryId: undefined,
      isActive: true,
      trackInventory: true,
    },
  })

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      form.reset({
        businessId: businessId,
        name: "",
        sku: "",
        description: "",
        unitPrice: 0,
        costPrice: 0,
        barcode: "",
        categoryId: undefined,
        isActive: true,
        trackInventory: true,
      })
    }   
  }, [open, businessId, form])

  const handleSubmit = (data: Product) => {
    createProduct({productData: data, businessId},{
      onSuccess: (data) => {
        const selectedCategory = categoryOptions.find((cat: CategoryOption) => cat.value === data.categoryId)
        toast({
          title: "Product added successfully!",
          description: selectedCategory 
            ? `Your product "${data.name}" has been added to the "${selectedCategory.label}" category.`
            : "Your product has been added to the inventory.",
          variant: "default",
        })
        form.reset()
        onOpenChange(false)
      },
      onError: (error: {message?: string}) => {
        toast({
          title: "Failed to add product!",
          description: error.message || "There was an error adding the product. Please try again.",
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
            <Package className="h-5 w-5" />
            Add New Product
          </DialogTitle>
          <DialogDescription>Add a new product to your inventory with all necessary details.</DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <TextField
                  control={form.control}
                  name="name"
                  label="Product Name *"
                  placeholder="Enter product name"
                  disabled={isPending}
                  required
                />
              </div>
                <CategorySelector
                businessId={businessId}
                onCategoryChange={(categoryId) => {
                  form.setValue("categoryId", categoryId || "", { 
                    shouldValidate: true,
                    shouldDirty: true 
                  })
                }}
                label="Category"
                placeholder="Search and select a category..."
                required={true}
                error={form.formState.errors.categoryId?.message}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <TextField
                  control={form.control}
                  name="sku"
                  label="SKU"
                  placeholder="Enter product SKU"
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <TextField
                  control={form.control}
                  name="barcode"
                  label="Barcode"
                  placeholder="Enter barcode"
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <TextareaField
                control={form.control}
                name="description"
                label="Description"
                placeholder="Enter product description"
                disabled={isPending}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <TextField
                  control={form.control}
                  name="costPrice"
                  type="number"
                  label="Cost Price"
                  disabled={isPending}
                  required
                />
              </div>
              <div className="space-y-2">
                <TextField
                  control={form.control}
                  name="unitPrice"
                  label="Unit Price *"
                  type='number'
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
                {isPending ? "Adding..." : "Add Product"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}