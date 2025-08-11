import type React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Calendar, CreditCard, User, DollarSign } from "lucide-react"
import { useSale } from "@/hooks/useSales"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

interface ViewSaleModalProps {
  saleId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800'
    case 'part_payment':
      return 'bg-yellow-100 text-yellow-800'
    case 'pending':
      return 'bg-blue-100 text-blue-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    case 'refunded':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getPaymentMethodLabel = (method: string) => {
  switch (method) {
    case 'cash':
      return 'Cash'
    case 'bank_transfer':
      return 'Bank Transfer'
    case 'card':
      return 'Card'
    case 'mobile_money':
      return 'Mobile Money'
    case 'cheque':
      return 'Cheque'
    default:
      return method
  }
}

export function ViewSaleModal({ open, onOpenChange, saleId }: ViewSaleModalProps) {
  const { data: saleData, isLoading } = useSale(saleId)

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex items-center justify-center p-6">
            <div className="text-center">Loading sale details...</div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!saleData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex items-center justify-center p-6">
            <div className="text-center text-red-500">Sale not found</div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Sale Details
          </DialogTitle>
          <DialogDescription>
            Sale #{saleData.saleNumber} - {format(new Date(saleData.saleDate), "PPP")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Sale Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Sale Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Amount</p>
                  <p className="text-2xl font-bold">₦{saleData.totalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Payment Status</p>
                  <Badge className={getStatusColor(saleData.paymentStatus)}>
                    {saleData.paymentStatus.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Subtotal</p>
                  <p className="text-lg font-semibold">₦{saleData.subtotal.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tax</p>
                  <p className="text-lg font-semibold">₦{(saleData.tax || 0).toLocaleString()}</p>
                </div>
              </div>

              {saleData.discount && saleData.discount > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Discount</p>
                  <p className="text-lg font-semibold text-green-600">-₦{saleData.discount.toLocaleString()}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Customer</p>
                  <p className="text-lg">{saleData.customer?.name || 'Walk-in Customer'}</p>
                </div>
                {saleData.customer?.email && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-lg">{saleData.customer.email}</p>
                  </div>
                )}
                {saleData.customer?.phone && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-lg">{saleData.customer.phone}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Payment Method</p>
                  <p className="text-lg">{getPaymentMethodLabel(saleData.paymentMethod)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Sales Status</p>
                  <Badge variant="outline">
                    {saleData.salesStatus.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Date Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Sale Date</p>
                  <p className="text-lg">{format(new Date(saleData.saleDate), "PPP")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Created</p>
                  <p className="text-lg">{format(new Date(saleData.created_at), "PPP")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sale Items */}
          {saleData.items && saleData.items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sale Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {saleData.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.product?.name || 'Unknown Product'}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity} × ₦{item.unitPrice.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₦{item.totalPrice.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {saleData.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{saleData.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}