import { Control, FieldPath, FieldValues } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Checkbox } from "../ui/checkbox"


export interface BaseFieldProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  disabled?: boolean
  required?: boolean
}

interface SelectFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  placeholder?: string
  options: { value: string; label: string }[]
}

interface MultiSelectFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  options: { value: string; label: string }[]
}

export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  options,
  disabled,
  required
}: SelectFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <Select onValueChange={field.onChange} value={field.value} disabled={disabled}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// Multi-Select Field (using checkboxes)
export function MultiSelectField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  disabled,
  required
}: MultiSelectFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${name}-${option.value}`}
                  checked={field.value?.includes(option.value) || false}
                  onCheckedChange={(checked) => {
                    const currentValues = field.value || []
                    if (checked) {
                      field.onChange([...currentValues, option.value])
                    } else {
                      field.onChange(currentValues.filter((v: string) => v !== option.value))
                    }
                  }}
                  disabled={disabled}
                />
                <label
                  htmlFor={`${name}-${option.value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
