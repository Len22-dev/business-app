import type React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Calendar, User, DollarSign, MapPin } from "lucide-react"
import { usePurchase } from "@/hooks/usePurchase"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

interface ViewPurchaseModalProps {
  purchaseId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function ViewPurchaseModal({ open, onOpenChange, purchaseId }: ViewPurchaseModalProps) {
  const { data: purchaseData, isLoading } = usePurchase(purchaseId)

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex items-center justify-center p-6">
            <div className="text-center">Loading purchase details...</div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!purchaseData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex items-center justify-center p-6">
            <div className="text-center text-red-500">Purchase not found</div>
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
            <ShoppingBag className="h-5 w-5" />
            Purchase Details
          </DialogTitle>
          <DialogDescription>
            Purchase recorded on {format(new Date(purchaseData.purchaseDate), "PPP")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Purchase Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Purchase Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Amount</p>
                  <p className="text-2xl font-bold">₦{purchaseData.total.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge className={getStatusColor(purchaseData.status)}>
                    {purchaseData.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Subtotal</p>
                  <p className="text-lg font-semibold">₦{purchaseData.subtotal.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tax</p>
                  <p className="text-lg font-semibold">₦{purchaseData.tax.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Discount</p>
                  <p className="text-lg font-semibold text-green-600">-₦{purchaseData.discount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vendor Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Vendor Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Vendor</p>
                  <p className="text-lg">{purchaseData.vendor?.name || 'Not specified'}</p>
                </div>
                {purchaseData.vendor?.email && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-lg">{purchaseData.vendor.email}</p>
                  </div>
                )}
                {purchaseData.vendor?.phone && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-lg">{purchaseData.vendor.phone}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          {purchaseData.location && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-lg">{purchaseData.location.name}</p>
                </div>
                {purchaseData.location.address && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-lg">{purchaseData.location.address}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

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
                  <p className="text-sm font-medium text-gray-500">Purchase Date</p>
                  <p className="text-lg">{format(new Date(purchaseData.purchaseDate), "PPP")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Created</p>
                  <p className="text-lg">{format(new Date(purchaseData.createdAt), "PPP")}</p>
                </div>
              </div>
              {purchaseData.updatedAt && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500">Last Updated</p>
                  <p className="text-lg">{format(new Date(purchaseData.updatedAt), "PPP")}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Purchase Items */}
          {purchaseData.items && purchaseData.items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Purchase Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {purchaseData.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.product?.name || 'Unknown Product'}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity} × ₦{item.price.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₦{item.total.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Created By */}
          {purchaseData.createdBy && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Created By</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="text-sm font-medium text-gray-500">User ID</p>
                  <p className="text-lg">{purchaseData.createdBy}</p>
                </div>
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