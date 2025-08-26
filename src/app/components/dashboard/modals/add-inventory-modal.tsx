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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
// import { useBusinessContext } from "@/context/business-context"
import { createClient } from "@/lib/supabase/client"
import { useAdjustInventoryQuantity } from "@/hooks/useInventory"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

interface AddInventoryModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  businessId: string
  onSuccess: () => void
}

export function AddInventoryModal({ isOpen, onClose, userId, businessId, onSuccess }: AddInventoryModalProps) {
  // /const { currentBusiness } = useBusinessContext()
  const {mutate: createAdjustment, isPending} = useAdjustInventoryQuantity()
  const {toast } = useToast()  


  const form = useForm<z.infer <typeof >>({
    resolver: zodResolver(),
    defaultValues: {
      name: "",
      category: "",
      quantity: 0,
      unitPrice: 0,
      description: "",
    },
  })
  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      form.reset()
    }
  }, [isOpen])

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate business selection
      if (!businessId) {
        throw new Error("No business selected")
      }

      const { error } = await supabase.from("inventory").insert({
        user_id: userId,
        business_id: businessId,
        name,
        category,
        quantity: Number.parseInt(quantity),
        unit_price: Number.parseFloat(unitPrice),
        description,
      })

      if (error) {
        throw error
      }

      toast({
        title: "Success",
        description: "Inventory item has been added successfully",
      })

      onSuccess()
      onClose()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add inventory item",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Inventory Item</DialogTitle>
            <DialogDescription>Enter the details of your inventory item.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category (Optional)</Label>
              <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit-price">Unit Price</Label>
              <Input
                id="unit-price"
                type="number"
                step="0.01"
                min="0"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}