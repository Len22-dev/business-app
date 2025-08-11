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
import { Calendar, User, CreditCard, Tag } from "lucide-react"

interface Bill{
  id: number
  billNumber: string
  status: string
  vendor: string
  amount: number
  category: string
  issueDate: string
  dueDate: string
  description: string
  notes: string
}

interface ViewBillModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bill: Bill
}

export function ViewBillModal({ open, onOpenChange, bill }: ViewBillModalProps) {
  if (!bill) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Paid
          </Badge>
        )
      case "Pending":
        return <Badge variant="secondary">Pending</Badge>
      case "Overdue":
        return <Badge variant="destructive">Overdue</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bill Details</DialogTitle>
          <DialogDescription>View complete bill information and payment status.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{bill.billNumber}</h3>
            {getStatusBadge(bill.status)}
          </div>

          <Separator />

          <div className="grid gap-4">
            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Vendor</p>
                <p className="text-sm text-muted-foreground">{bill.vendor}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Issue Date</p>
                <p className="text-sm text-muted-foreground">{bill.issueDate}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Due Date</p>
                <p className="text-sm text-muted-foreground">{bill.dueDate}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Amount</p>
                <p className="text-lg font-semibold">₦{bill.amount.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Category</p>
                <p className="text-sm text-muted-foreground">{bill.category}</p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button>Mark as Paid</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
