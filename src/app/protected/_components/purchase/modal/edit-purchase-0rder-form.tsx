"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface EditPurchaseOrderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: any
}

interface OrderItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export function EditPurchaseOrderModal({ open, onOpenChange, order }: EditPurchaseOrderModalProps) {
  const [orderDate, setOrderDate] = useState<Date>()
  const [expectedDate, setExpectedDate] = useState<Date>()
  const [formData, setFormData] = useState({
    orderNumber: "",
    supplier: "",
    notes: "",
  })
  const [items, setItems] = useState<OrderItem[]>([{ id: "1", description: "", quantity: 1, unitPrice: 0, total: 0 }])

  useEffect(() => {
    if (order) {
      setFormData({
        orderNumber: order.orderNumber || "",
        supplier: order.supplier || "",
        notes: "",
      })
      if (order.orderDate) {
        setOrderDate(new Date(order.orderDate))
      }
      if (order.expectedDate) {
        setExpectedDate(new Date(order.expectedDate))
      }
      // Set mock items for demonstration
      setItems([
        { id: "1", description: "Laptop Computer", quantity: 5, unitPrice: 150000, total: 750000 },
        { id: "2", description: "Wireless Mouse", quantity: 10, unitPrice: 5000, total: 50000 },
        { id: "3", description: "Keyboard", quantity: 8, unitPrice: 6250, total: 50000 },
      ])
    }
  }, [order])

  const addItem = () => {
    const newItem: OrderItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    }
    setItems([...items, newItem])
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, field: keyof OrderItem, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          if (field === "quantity" || field === "unitPrice") {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice
          }
          return updatedItem
        }
        return item
      }),
    )
  }

  const getTotalAmount = () => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", { formData, items, orderDate, expectedDate })
    onOpenChange(false)
  }

  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Purchase Order</DialogTitle>
          <DialogDescription>Update purchase order information and items.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order-number">Order Number</Label>
                <Input
                  id="order-number"
                  placeholder="PO-2024-001"
                  value={formData.orderNumber}
                  onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Select
                  value={formData.supplier}
                  onValueChange={(value) => setFormData({ ...formData, supplier: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tech Solutions Ltd">Tech Solutions Ltd</SelectItem>
                    <SelectItem value="Office Supplies Co">Office Supplies Co</SelectItem>
                    <SelectItem value="Industrial Equipment">Industrial Equipment</SelectItem>
                    <SelectItem value="Raw Materials Inc">Raw Materials Inc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order-date">Order Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !orderDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {orderDate ? format(orderDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={orderDate} onSelect={setOrderDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expected-date">Expected Delivery</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !expectedDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {expectedDate ? format(expectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={expectedDate} onSelect={setExpectedDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Order Items</Label>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input
                            placeholder="Item description"
                            value={item.description}
                            onChange={(e) => updateItem(item.id, "description", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                          />
                        </TableCell>
                        <TableCell>₦{item.total.toLocaleString()}</TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            disabled={items.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end">
                <div className="text-lg font-semibold">Total: ₦{getTotalAmount().toLocaleString()}</div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes or special instructions"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Order</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
