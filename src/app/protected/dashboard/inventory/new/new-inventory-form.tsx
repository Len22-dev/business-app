"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { useBusinessContext } from "@/context/business-context"

interface NewInventoryFormProps {
  userId: string
}

export function NewInventoryForm({ userId }: NewInventoryFormProps) {
  const { currentBusiness } = useBusinessContext()
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [quantity, setQuantity] = useState("")
  const [unitPrice, setUnitPrice] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate business selection
      if (!currentBusiness) {
        throw new Error("No business selected")
      }

      const { error } = await supabase.from("inventory").insert({
        user_id: userId,
        business_id: currentBusiness.id,
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

      router.refresh()
      router.push("/dashboard/inventory")
    } catch (error: unknown ) {
      let message = "Failed to add inventory item";
      if (error instanceof Error) {
        message = error.message;
      }
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
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
          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Item"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/inventory")}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
