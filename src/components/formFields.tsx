// 2. Form Field Components (FormFields.tsx)


import React from "react"
import { Control, FieldPath, FieldValues } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"


interface BaseFieldProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  disabled?: boolean
  required?: boolean
}

interface TextFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  placeholder?: string
  type?: "text" | "number" | "email" | "password"
}


// Text Input Field
export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  disabled,
  required
}: TextFieldProps<T>) {
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
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              disabled={disabled}
              onChange={type === "number" 
                ? (e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? 0 : Number(value));
                  }
                : field.onChange
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}