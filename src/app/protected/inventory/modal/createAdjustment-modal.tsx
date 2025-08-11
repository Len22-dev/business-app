"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle } from "lucide-react"

interface CreateAdjustmentModalProps {
  businessId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateAdjustmentModal({ open, onOpenChange, businessId }: CreateAdjustmentModalProps) {
  const [formData, setFormData] = useState({
    businessId:'',
    product: "",
    type: "",
    quantity: "",
    reason: "",
    notes: "",
  })

  const products = [
    { id: 1, name: "iPhone 14 Pro", sku: "IPH14P-128", currentStock: 25 },
    { id: 2, name: "Samsung Galaxy S23", sku: "SGS23-256", currentStock: 3 },
    { id: 3, name: "MacBook Air M2", sku: "MBA-M2-256", currentStock: 0 },
    { id: 4, name: "AirPods Pro", sku: "APP-2ND", currentStock: 45 },
  ]

  const adjustmentTypes = ["Damage", "Theft", "Found", "Recount", "Expired", "Other"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Creating adjustment:", formData)
    onOpenChange(false)
    // Reset form
    setFormData({
      businessId: businessId,
      product: "",
      type: "",
      quantity: "",
      reason: "",
      notes: "",
    })
  }

  const selectedProduct = products.find((p) => p.id.toString() === formData.product)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Create Stock Adjustment
          </DialogTitle>
          <DialogDescription>Create a new stock adjustment for inventory corrections.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product">Product *</Label>
            <Select value={formData.product} onValueChange={(value) => setFormData({ ...formData, product: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.name} ({product.sku}) - Stock: {product.currentStock}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProduct && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">Current Stock: {selectedProduct.currentStock}</p>
              <p className="text-xs text-muted-foreground">SKU: {selectedProduct.sku}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Adjustment Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {adjustmentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity Adjustment *</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="Enter adjustment (+ or -)"
                required
              />
              <p className="text-xs text-muted-foreground">
                Use negative numbers for reductions, positive for increases
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason *</Label>
            <Input
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Brief reason for adjustment"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional details about the adjustment"
              rows={3}
            />
          </div>

          {selectedProduct && formData.quantity && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-900">Adjustment Preview</p>
              <p className="text-sm text-blue-700">
                Stock will change from {selectedProduct.currentStock} to{" "}
                {selectedProduct.currentStock + Number.parseInt(formData.quantity || "0")}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Adjustment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
