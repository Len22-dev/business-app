"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Edit } from "lucide-react"

interface Product {
  name: string
  sku: string
  category: string
  description: string
  unitPrice: number
  currentStock: number
  minStock: number
  maxStock: number
  supplier: string
  barcode: string
}


interface EditProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product:Product
}

export function EditProductModal({ open, onOpenChange, product }: EditProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    description: "",
    unitPrice: "",
    currentStock: "",
    minStock: "",
    maxStock: "",
    supplier: "",
    barcode: "",
  })

  const categories = ["Electronics", "Computers", "Mobile Phones", "Accessories", "Gaming"]
  const suppliers = ["Apple Nigeria", "Samsung Electronics", "Dell Technologies", "HP Inc.", "Lenovo"]

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        sku: product.sku || "",
        category: product.category || "",
        description: product.description || "",
        unitPrice: product.unitPrice?.toString() || "",
        currentStock: product.currentStock?.toString() || "",
        minStock: product.minStock?.toString() || "",
        maxStock: product.maxStock?.toString() || "",
        supplier: product.supplier || "",
        barcode: product.barcode || "",
      })
    }
  }, [product])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Updating product:", formData)
    onOpenChange(false)
  }

  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Product
          </DialogTitle>
          <DialogDescription>Update product information and stock levels.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter product name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="Enter SKU"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier} value={supplier}>
                      {supplier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unitPrice">Unit Price (₦) *</Label>
              <Input
                id="unitPrice"
                type="number"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode</Label>
              <Input
                id="barcode"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                placeholder="Enter barcode"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentStock">Current Stock *</Label>
              <Input
                id="currentStock"
                type="number"
                value={formData.currentStock}
                onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minStock">Minimum Stock</Label>
              <Input
                id="minStock"
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxStock">Maximum Stock</Label>
              <Input
                id="maxStock"
                type="number"
                value={formData.maxStock}
                onChange={(e) => setFormData({ ...formData, maxStock: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Product</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
