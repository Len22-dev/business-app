"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Transaction } from "@/lib/drizzle/types"

interface ViewTransactionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: Transaction | null
}

export function ViewTransactionModal({ open, onOpenChange, transaction }: ViewTransactionModalProps) {
  if (!transaction) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>View complete information about this transaction.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">Transaction ID:</div>
            <div className="col-span-2">{transaction.id}</div>
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">Type:</div>
            <div className="col-span-2">
              <Badge variant={transaction.type === "income" ? "default" : "secondary"}>{transaction.type}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">Amount:</div>
            <div
              className={`col-span-2 font-semibold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
            >
              {transaction.type === "income" ? "+" : "-"}
              {formatCurrency(Number(transaction.amount))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">Date:</div>
            <div className="col-span-2">{new Date(transaction.created_at).toLocaleDateString()}</div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">Customer/Vendor:</div>
            <div className="col-span-2">{transaction.reference}</div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">Status:</div>
            <div className="col-span-2">
              <Badge variant={transaction.status === "completed" ? "default" : "outline"}>{transaction.status}</Badge>
            </div>
          </div>

          <Separator />

          <div className="grid gap-2">
            <div className="font-medium">Description:</div>
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">{transaction.description}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
