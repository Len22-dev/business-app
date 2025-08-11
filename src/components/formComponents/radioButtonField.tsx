// Radio Button Field

import React from "react"
import { Control, FieldPath, FieldValues } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export interface BaseFieldProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  disabled?: boolean
  required?: boolean
}

interface RadioFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  options: { value: string; label: string }[]
}

export function RadioField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  disabled,
  required
}: RadioFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              disabled={disabled}
            >
              {options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <label
                    htmlFor={option.value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}