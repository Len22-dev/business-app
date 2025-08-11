"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, User, Package, CreditCard } from "lucide-react"

interface ViewPurchaseOrderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: any
}

const mockOrderItems = [
  { description: "Laptop Computer", quantity: 5, unitPrice: 150000, total: 750000 },
  { description: "Wireless Mouse", quantity: 10, unitPrice: 5000, total: 50000 },
  { description: "Keyboard", quantity: 8, unitPrice: 6250, total: 50000 },
]

export function ViewPurchaseOrderModal({ open, onOpenChange, order }: ViewPurchaseOrderModalProps) {
  if (!order) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Approved
          </Badge>
        )
      case "Pending":
        return <Badge variant="secondary">Pending</Badge>
      case "Received":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Received
          </Badge>
        )
      case "Cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Purchase Order Details</DialogTitle>
          <DialogDescription>View complete purchase order information and items.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{order.orderNumber}</h3>
            {getStatusBadge(order.status)}
          </div>

          <Separator />

          <div className="grid gap-4">
            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Supplier</p>
                <p className="text-sm text-muted-foreground">{order.supplier}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Order Date</p>
                <p className="text-sm text-muted-foreground">{order.orderDate}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Expected Delivery</p>
                <p className="text-sm text-muted-foreground">{order.expectedDate}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Package className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Items</p>
                <p className="text-sm text-muted-foreground">{order.items} items</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Total Amount</p>
                <p className="text-lg font-semibold">₦{order.totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-medium">Order Items</h4>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockOrderItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>₦{item.unitPrice.toLocaleString()}</TableCell>
                      <TableCell>₦{item.total.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button>Edit Order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
