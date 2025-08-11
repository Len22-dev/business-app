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
import { Calendar, User, Package, FileText } from "lucide-react"

interface ViewReceiptModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  receipt: any
}

const mockReceiptItems = [
  { description: "Laptop Computer", orderedQty: 5, receivedQty: 5, condition: "Good" },
  { description: "Wireless Mouse", orderedQty: 10, receivedQty: 8, condition: "Good" },
  { description: "Keyboard", orderedQty: 8, receivedQty: 8, condition: "Damaged" },
]

export function ViewReceiptModal({ open, onOpenChange, receipt }: ViewReceiptModalProps) {
  if (!receipt) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Complete":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Complete
          </Badge>
        )
      case "Partial":
        return <Badge variant="secondary">Partial</Badge>
      case "Pending":
        return <Badge variant="outline">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case "Good":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Good
          </Badge>
        )
      case "Damaged":
        return <Badge variant="destructive">Damaged</Badge>
      case "Defective":
        return <Badge variant="destructive">Defective</Badge>
      default:
        return <Badge variant="outline">{condition}</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Receipt Details</DialogTitle>
          <DialogDescription>View complete receipt information and received items.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{receipt.receiptNumber}</h3>
            {getStatusBadge(receipt.status)}
          </div>

          <Separator />

          <div className="grid gap-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Purchase Order</p>
                <p className="text-sm text-muted-foreground">{receipt.purchaseOrder}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Supplier</p>
                <p className="text-sm text-muted-foreground">{receipt.supplier}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Receipt Date</p>
                <p className="text-sm text-muted-foreground">{receipt.receiptDate}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Package className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Items Received</p>
                <p className="text-sm text-muted-foreground">{receipt.itemsReceived} items</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Package className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Condition</p>
                {getConditionBadge(receipt.condition)}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-medium">Received Items</h4>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Ordered</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead>Condition</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockReceiptItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.orderedQty}</TableCell>
                      <TableCell>{item.receivedQty}</TableCell>
                      <TableCell>{getConditionBadge(item.condition)}</TableCell>
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
          <Button>Edit Receipt</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
