"use client"

import { useState, useEffect, useCallback } from "react"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { AddInventoryModal } from "@/app/components/dashboard/modals/add-inventory-modal"

interface InventoryClientProps {
  userId: string
  businessId: string
}

// Fixed: Correct type for the joined data structure from Supabase
interface InventoryWithProducts {
  id: string
  product_id: string
  available_quantity: number
  location?: string
  last_updated?: string
  products: {
    name: string
    unit_price: number
    cost_price: number
    category?: string
  } | null
}

export function InventoryClient({ userId, businessId }: InventoryClientProps) {
  // Fixed: Use the correct type
  const [inventory, setInventory] = useState<InventoryWithProducts[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const fetchInventory = useCallback(async () => {
    try {
      const { data } = await supabase
        .from("inventory")
        .select(
          `
            id,
            product_id,
            available_quantity,
            location,
            last_updated,
            products (
              name,
              unit_price,
              cost_price,
              category
            )
          `
        )
        .eq("business_id", businessId)
        .order("created_at", { ascending: true })
      
      // Fixed: Handle the data structure properly
      if (data) {
        // Transform the data to handle the joined relationship properly
        const transformedData = data.map(item => ({
          ...item,
          products: Array.isArray(item.products) && item.products.length > 0 
            ? item.products[0] 
            : null
        }))
        console.log("Transformed Data:", transformedData)
        setInventory(transformedData as InventoryWithProducts[])
      }
    } catch (error) {
      console.error("Error fetching inventory:", error)
    } finally {
      setIsLoading(false)
    }
  }, [supabase, businessId])

  useEffect(() => {
    fetchInventory()
  }, [userId, businessId, fetchInventory])

  const handleAddSuccess = () => {
    fetchInventory()
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>View and manage your inventory</CardDescription>
        </CardHeader>
        <CardContent>
          {inventory && inventory.length > 0 ? (
            <div className="rounded-md border">
              <div className="grid grid-cols-5 border-b px-4 py-3 font-medium">
                <div>Name</div>
                <div>Category</div>
                <div>Quantity</div>
                <div>Unit Price</div>
                <div>Total Value</div>
              </div>
              <div className="divide-y">
                {inventory.map((item) => (
                  <div key={item.id} className="grid grid-cols-5 px-4 py-3">
                    {/* Fixed: Correct property access */}
                    <div className="font-medium">{item.products?.name || "Unknown Product"}</div>
                    <div>{item.products?.category || "-"}</div>
                    <div>{item.available_quantity || "-"}</div>
                    <div>{formatCurrency(Number(item.products?.unit_price || 0))}</div>
                    <div>{formatCurrency(Number(item.products?.unit_price || 0) * item.available_quantity)}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-center text-muted-foreground">No inventory items found</p>
              <Button onClick={() => setIsAddModalOpen(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Item
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AddInventoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        userId={userId}
        businessId={businessId}
        onSuccess={handleAddSuccess}
      />
    </div>
  )
}