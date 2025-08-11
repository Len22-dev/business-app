"use client"

import { useState } from "react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import type { Purchase } from "@/lib/types"
import { AddPurchaseModal } from "@/app/components/dashboard/modals/add-purchase-modal"
import { useBusinessPurchases } from '@/hooks/usePurchase'

interface PurchasesClientProps {
  userId: string
  businessId: string
}

export function PurchasesClient({ userId, businessId }: PurchasesClientProps) {
  // const [purchases, setPurchases] = useState<Purchase[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  // const [isLoading, setIsLoading] = useState(true)
  // const supabase = createClient()
  const { data, isLoading, refetch } = useBusinessPurchases(userId)
  const purchases = data?.purchases || []

  const handleAddSuccess = () => {
    refetch()
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Purchases</h2>
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
        <h2 className="text-3xl font-bold tracking-tight">Purchases</h2>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Purchase
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purchase History</CardTitle>
          <CardDescription>View and manage your purchase records</CardDescription>
        </CardHeader>
        <CardContent>
          {purchases && purchases.length > 0 ? (
            <div className="rounded-md border">
              <div className="grid grid-cols-5 border-b px-4 py-3 font-medium">
                <div>Supplier</div>
                <div>Date</div>
                <div>Amount</div>
                <div>Status</div>
                <div>Description</div>
              </div>
              <div className="divide-y">
                {purchases.map((purchase: Purchase) => (
                  <div key={purchase.id} className="grid grid-cols-5 px-4 py-3">
                    <div>{purchase.supplier}</div>
                    <div>{formatDate(purchase.purchase_date)}</div>
                    <div>{formatCurrency(Number(purchase.amount))}</div>
                    <div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          purchase.status === "paid"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : purchase.status === "partial"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {purchase.status}
                      </span>
                    </div>
                    <div className="truncate">{purchase.description || "-"}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-center text-muted-foreground">No purchase records found</p>
              <Button onClick={() => setIsAddModalOpen(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Purchase
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AddPurchaseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        userId={userId}
        businessId={businessId}
        onSuccess={handleAddSuccess}
      />
    </div>
  )
}