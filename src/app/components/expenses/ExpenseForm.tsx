"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, Upload } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"

const formSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  date: z.date(),
  category: z.string().min(1, "Category is required"),
  vendor: z.string().min(1, "Vendor is required"),
  notes: z.string().optional(),
  receiptImage: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

const categories = [
  { value: "office", label: "Office Supplies" },
  { value: "travel", label: "Travel" },
  { value: "meals", label: "Meals & Entertainment" },
  { value: "software", label: "Software & Subscriptions" },
  { value: "marketing", label: "Marketing & Advertising" },
  { value: "utilities", label: "Utilities" },
  { value: "rent", label: "Rent & Lease" },
  { value: "professional", label: "Professional Services" },
  { value: "other", label: "Other" },
]

export function ExpenseForm() {
  const router = useRouter()
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: 0,
      date: new Date(),
      category: "",
      vendor: "",
      notes: "",
      receiptImage: "",
    },
  })

  // Update the onSubmit function to handle the Promise returned by router.push()
  async function onSubmit(data: FormValues) {
    try {
      console.log(data)
      // In a real app, you would save the expense here
      await router.push("/expenses")
    } catch (error) {
      console.error("Error submitting expense form:", error)
      // You could also show an error message to the user here
    }
  }

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0]
  //   if (file) {
  //     const reader = new FileReader()
  //     reader.onloadend = () => {
  //       setReceiptPreview(reader.result as string)
  //       form.setValue("receiptImage", reader.result as string)
  //     }
  //     reader.readAsDataURL(file)
  //   }
  // }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter expense description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="0.00"
                        onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vendor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter vendor name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any additional notes about this expense"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <FormField
                  control={form.control}
                  name="receiptImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Receipt Image</FormLabel>
                      <div className="mt-2 flex items-center gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("receipt-upload")?.click()}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Receipt
                        </Button>
                        <FormControl>
                          <Input
                            id="receipt-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                const reader = new FileReader()
                                reader.onloadend = () => {
                                  setReceiptPreview(reader.result as string)
                                  field.onChange(reader.result as string)
                                }
                                reader.readAsDataURL(file)
                              }
                            }}
                          />
                        </FormControl>
                        <p className="text-sm text-muted-foreground">Upload a photo or scan of your receipt</p>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {receiptPreview && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium">Receipt Preview:</p>
                  <div className="overflow-hidden rounded-md border">
                    <Image
                      src={receiptPreview || "/placeholder.svg"}
                      alt="Receipt preview"
                      className="max-h-[300px] w-auto object-contain"
                      width={300}
                      height={300}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              router.push("/expenses")
            }}
          >
            Cancel
          </Button>
          <Button type="submit">Save Expense</Button>
        </div>
      </form>
    </Form>
  )
}

