"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FullTransactionWithItems } from "@/lib/zod/transactionSchema"

interface ViewTransactionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: FullTransactionWithItems | null
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
            <div className="font-medium">TratransactionType:</div>
            <div className="col-span-2">
              <Badge variant={transaction.transactionType === "sales" ? "default" : "secondary"}>{transaction.transactionType}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">Amount:</div>
            <div
              className={`col-span-2 font-semibold ${transaction.transactionType === "sales" ? "text-green-600" : "text-red-600"}`}
            >
              {transaction.transactionType === "sales" ? "+" : "-"}
              {formatCurrency(Number(transaction.totalAmount))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">Date:</div>
            <div className="col-span-2">{new Date(transaction.createdAt ?? '').toLocaleDateString()}</div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">Customer/Vendor:</div>
            <div className="col-span-2">{transaction.entityType === 'customer' || transaction.entityType === 'vendor'}</div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">Status:</div>
            <div className="col-span-2">
              <Badge variant={transaction.transactionStatus === "completed" ? "default" : "outline"}>{transaction.transactionStatus}</Badge>
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
