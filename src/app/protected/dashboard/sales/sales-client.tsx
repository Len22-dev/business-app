"use client"

import { useState } from "react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import type { Sale } from "@/lib/types"
import { AddSaleModal } from "@/app/components/dashboard/modals/add-sale-modal"
import { useBusinessSales } from '@/hooks/useSales'

interface SalesClientProps {
  userId: string
  businessId: string
}

type SaleStatus = "paid" | "partial" | "pending";

export function SalesClient({ userId, businessId }: SalesClientProps) {
  // const [sales, setSales] = useState<Sale[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  // const [isLoading, setIsLoading] = useState(true)
  // const supabase = createClient()
  const { data, isLoading, refetch } = useBusinessSales(businessId)
  const sales = data?.sales || []

  // const fetchSales = useCallback(async () => { ... }, [userId, supabase])
  // useEffect(() => { fetchSales() }, [userId, fetchSales])

  const handleAddSuccess = () => {
    refetch()
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Sales</h2>
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
        <h2 className="text-3xl font-bold tracking-tight">Sales</h2>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Sale
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
          <CardDescription>View and manage your sales records</CardDescription>
        </CardHeader>
        <CardContent>
          {sales && sales.length > 0 ? (
            <div className="rounded-md border">
              <div className="grid grid-cols-5 border-b px-4 py-3 font-medium">
                <div>Customer</div>
                <div>Date</div>
                <div>Amount</div>
                <div>Status</div>
                <div>Description</div>
              </div>
              <div className="divide-y">
                {sales.map((sale: Sale) => (
                  <div key={sale.id} className="grid grid-cols-5 px-4 py-3">
                    <div>{sale.customer_name}</div>
                    <div>{formatDate(sale.sale_date)}</div>
                    <div>{formatCurrency(Number(sale.amount))}</div>
                    <div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          (sale.status as SaleStatus) === "paid"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : (sale.status as SaleStatus) === "partial"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {sale.status}
                      </span>
                    </div>
                    <div className="truncate">{sale.description || "-"}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-center text-muted-foreground">No sales records found</p>
              <Button onClick={() => setIsAddModalOpen(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Sale
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AddSaleModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        userId={userId}
        businessId={businessId}
        onSuccess={handleAddSuccess}
      />
    </div>
  )
}