import type React from "react"
import { SelectField } from "@/components/formComponents/selectFields"
import { useBusinessCategories } from "@/hooks/useCategory"
import type { Control, FieldPath, FieldValues } from "react-hook-form"

interface Category {
  id: string
  name: string
}

interface CategoryOption {
  value: string
  label: string
}

interface CategorySelectProps<T extends FieldValues = FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  businessId: string
  disabled?: boolean
  label?: string
  placeholder?: string
}

export const CategorySelect = <T extends FieldValues = FieldValues>({ 
 control, 
 name, 
  businessId, 
 disabled = false,
 label = "Category",
  placeholder = "Select category"
}: CategorySelectProps<T>) => {
  // Fetch categories for the business
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useBusinessCategories(businessId, {
    isActive: true,
    limit: 100
  })
  
  // Transform categories for the select field
  const categoryOptions: CategoryOption[] = categoriesData?.categories?.map((category: Category) => ({
    value: category.id,
    label: category.name
  })) || []
  
  // Add a placeholder option if no categories are available
  const finalCategoryOptions = categoryOptions.length > 0 
    ? categoryOptions 
    : [{ value: "", label: categoriesError ? "Error loading categories" : "No categories available" }]

  const getPlaceholder = () => {
    if (categoriesLoading) return "Loading categories..."
    if (categoriesError) return "Error loading categories"
    return placeholder
  }

  const getCategoryStatusMessage = () => {
    if (categoriesLoading) return null
    if (categoriesError) return null
    
    if (categoryOptions.length === 0) {
      return (
        <p className="text-sm text-muted-foreground">
          No categories found. Categories help organize your products.
        </p>
      )
    }
    
    return (
      <p className="text-sm text-muted-foreground">
        {categoryOptions.length} categor{categoryOptions.length === 1 ? 'y' : 'ies'} available
      </p>
    )
  }

  return (
    <div className="space-y-2">
      <SelectField
        control={control}
        name={name}
        label={label}
        placeholder={getPlaceholder()}
        options={finalCategoryOptions}
        disabled={disabled || categoriesLoading}
      />
      {getCategoryStatusMessage()}
    
    </div>
  )
}