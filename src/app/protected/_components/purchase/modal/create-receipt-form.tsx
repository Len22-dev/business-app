"use client"

import type React from "react"

import { useState } from "react"
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

interface CreateReceiptModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ReceiptItem {
  id: string
  description: string
  orderedQty: number
  receivedQty: number
  condition: string
  notes: string
}

export function CreateReceiptModal({ open, onOpenChange }: CreateReceiptModalProps) {
  const [receiptDate, setReceiptDate] = useState<Date>()
  const [formData, setFormData] = useState({
    receiptNumber: "",
    purchaseOrder: "",
    supplier: "",
    notes: "",
  })
  const [items, setItems] = useState<ReceiptItem[]>([
    { id: "1", description: "", orderedQty: 0, receivedQty: 0, condition: "Good", notes: "" },
  ])

  const addItem = () => {
    const newItem: ReceiptItem = {
      id: Date.now().toString(),
      description: "",
      orderedQty: 0,
      receivedQty: 0,
      condition: "Good",
      notes: "",
    }
    setItems([...items, newItem])
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, field: keyof ReceiptItem, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value }
        }
        return item
      }),
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", { formData, items, receiptDate })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Purchase Receipt</DialogTitle>
          <DialogDescription>Record received items from a purchase order.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="receipt-number">Receipt Number</Label>
                <Input
                  id="receipt-number"
                  placeholder="REC-2024-001"
                  value={formData.receiptNumber}
                  onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchase-order">Purchase Order</Label>
                <Select
                  value={formData.purchaseOrder}
                  onValueChange={(value) => setFormData({ ...formData, purchaseOrder: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select PO" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PO-2024-001">PO-2024-001</SelectItem>
                    <SelectItem value="PO-2024-002">PO-2024-002</SelectItem>
                    <SelectItem value="PO-2024-003">PO-2024-003</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="receipt-date">Receipt Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !receiptDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {receiptDate ? format(receiptDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={receiptDate} onSelect={setReceiptDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
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
                  <SelectItem value="tech-solutions">Tech Solutions Ltd</SelectItem>
                  <SelectItem value="office-supplies">Office Supplies Co</SelectItem>
                  <SelectItem value="industrial">Industrial Equipment</SelectItem>
                  <SelectItem value="raw-materials">Raw Materials Inc</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Received Items</Label>
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
                      <TableHead>Ordered</TableHead>
                      <TableHead>Received</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Notes</TableHead>
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
                            min="0"
                            value={item.orderedQty}
                            onChange={(e) => updateItem(item.id, "orderedQty", Number.parseInt(e.target.value) || 0)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            value={item.receivedQty}
                            onChange={(e) => updateItem(item.id, "receivedQty", Number.parseInt(e.target.value) || 0)}
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={item.condition}
                            onValueChange={(value) => updateItem(item.id, "condition", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Good">Good</SelectItem>
                              <SelectItem value="Damaged">Damaged</SelectItem>
                              <SelectItem value="Defective">Defective</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            placeholder="Notes"
                            value={item.notes}
                            onChange={(e) => updateItem(item.id, "notes", e.target.value)}
                          />
                        </TableCell>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes about the receipt"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Receipt</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
