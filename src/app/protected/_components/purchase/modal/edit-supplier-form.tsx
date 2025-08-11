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

interface EditSupplierModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier: any
}

export function EditSupplierModal({ open, onOpenChange, supplier }: EditSupplierModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    category: "",
    contactPerson: "",
    taxId: "",
    bankAccount: "",
    paymentTerms: "",
    notes: "",
  })

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name || "",
        email: supplier.email || "",
        phone: supplier.phone || "",
        address: supplier.address || "",
        category: supplier.category || "",
        contactPerson: "",
        taxId: "",
        bankAccount: "",
        paymentTerms: "",
        notes: "",
      })
    }
  }, [supplier])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
    onOpenChange(false)
  }

  if (!supplier) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Supplier</DialogTitle>
          <DialogDescription>Update supplier information and details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Supplier Name</Label>
              <Input
                id="name"
                placeholder="Enter supplier name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="supplier@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="+234 xxx xxx xxxx"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="Enter supplier address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Office Equipment">Office Equipment</SelectItem>
                    <SelectItem value="Machinery">Machinery</SelectItem>
                    <SelectItem value="Raw Materials">Raw Materials</SelectItem>
                    <SelectItem value="Services">Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-person">Contact Person</Label>
                <Input
                  id="contact-person"
                  placeholder="Primary contact name"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tax-id">Tax ID</Label>
                <Input
                  id="tax-id"
                  placeholder="Enter tax identification"
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank-account">Bank Account</Label>
                <Input
                  id="bank-account"
                  placeholder="Account number"
                  value={formData.bankAccount}
                  onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-terms">Payment Terms</Label>
              <Select
                value={formData.paymentTerms}
                onValueChange={(value) => setFormData({ ...formData, paymentTerms: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="net-30">Net 30 days</SelectItem>
                  <SelectItem value="net-15">Net 15 days</SelectItem>
                  <SelectItem value="net-7">Net 7 days</SelectItem>
                  <SelectItem value="cod">Cash on Delivery</SelectItem>
                  <SelectItem value="advance">Advance Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes (optional)"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Supplier</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
