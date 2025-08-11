"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface EditInvoiceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: any
}

interface InvoiceItem {
  description: string
  quantity: number
  rate: number
  amount: number
}

export function EditCustomerModal({ open, onOpenChange, invoice }: EditInvoiceModalProps) {
  const [formData, setFormData] = useState({
    customer: "",
    customerEmail: "",
    invoiceNumber: "",
    date: new Date(),
    dueDate: new Date(),
    status: "",
    notes: "",
    terms: "",
  })

  const [items, setItems] = useState<InvoiceItem[]>([{ description: "", quantity: 1, rate: 0, amount: 0 }])

  useEffect(() => {
    if (invoice) {
      setFormData({
        customer: invoice.customer,
        customerEmail: invoice.customerEmail,
        invoiceNumber: invoice.invoiceNumber,
        date: new Date(invoice.date),
        dueDate: new Date(invoice.dueDate),
        status: invoice.status,
        notes: invoice.notes || "",
        terms: invoice.terms || "Payment is due within 30 days of invoice date.",
      })
      setItems(invoice.items || [{ description: "", quantity: 1, rate: 0, amount: 0 }])
    }
  }, [invoice])

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, rate: 0, amount: 0 }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = [...items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    // Calculate amount when quantity or rate changes
    if (field === "quantity" || field === "rate") {
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].rate
    }

    setItems(updatedItems)
  }

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
  const tax = subtotal * 0.075 // 7.5% VAT in Nigeria
  const total = subtotal + tax

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Invoice updated:", { formData, items, subtotal, tax, total })
    onOpenChange(false)
  }

  if (!invoice) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Invoice</DialogTitle>
          <DialogDescription>Update the invoice information. Make changes and save.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="customer">Customer Name</Label>
                  <Input
                    id="customer"
                    placeholder="Enter customer name"
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Customer Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    placeholder="customer@example.com"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Invoice Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Invoice Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-4">
                <div>
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <Input
                    id="invoiceNumber"
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Sent">Sent</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Invoice Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.date}
                        onSelect={(date) => setFormData({ ...formData, date: date || new Date() })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.dueDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dueDate ? format(formData.dueDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.dueDate}
                        onSelect={(date) => setFormData({ ...formData, dueDate: date || new Date() })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>

            {/* Invoice Items */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Invoice Items</CardTitle>
                <Button type="button" onClick={addItem} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="grid gap-4 md:grid-cols-6 items-end">
                      <div className="md:col-span-2">
                        <Label htmlFor={`description-${index}`}>Description</Label>
                        <Input
                          id={`description-${index}`}
                          placeholder="Item description"
                          value={item.description}
                          onChange={(e) => updateItem(index, "description", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                        <Input
                          id={`quantity-${index}`}
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, "quantity", Number.parseInt(e.target.value) || 1)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`rate-${index}`}>Rate (₦)</Label>
                        <Input
                          id={`rate-${index}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => updateItem(index, "rate", Number.parseFloat(e.target.value) || 0)}
                          required
                        />
                      </div>
                      <div>
                        <Label>Amount</Label>
                        <div className="text-sm font-medium py-2">{formatCurrency(item.amount)}</div>
                      </div>
                      <div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(index)}
                          disabled={items.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="mt-6 space-y-2 text-right">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT (7.5%):</span>
                    <span className="font-medium">{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes for the customer"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="terms">Terms & Conditions</Label>
                  <Textarea
                    id="terms"
                    placeholder="Payment terms and conditions"
                    value={formData.terms}
                    onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Update Invoice
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
