import { Control, FieldPath, FieldValues } from "react-hook-form"
import { FormControl, FormField,  FormItem, FormLabel, FormMessage } from "../ui/form"
import { Textarea } from "../ui/textarea"



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

export function TextareaField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled,
  required
}: Omit<TextFieldProps<T>, "type">) {
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
            <Textarea
              placeholder={placeholder}
              {...field}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
