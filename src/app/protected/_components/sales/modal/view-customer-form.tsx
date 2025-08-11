"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ViewInvoiceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: any
}

export function ViewCustomerModal({ open, onOpenChange, invoice }: ViewInvoiceModalProps) {
  if (!invoice) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "default"
      case "pending":
        return "secondary"
      case "overdue":
        return "destructive"
      case "draft":
        return "outline"
      case "sent":
        return "secondary"
      default:
        return "outline"
    }
  }

  const subtotal = invoice.items?.reduce((sum: number, item: any) => sum + item.amount, 0) || invoice.amount
  const tax = subtotal * 0.075 // 7.5% VAT
  const total = subtotal + tax

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invoice Details</DialogTitle>
          <DialogDescription>Complete information about this invoice.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Header Information */}
          <div className="flex flex-col md:flex-row md:justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold">EazieGrow</h3>
              <p className="text-muted-foreground">Invoice #{invoice.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <Badge variant={getStatusColor(invoice.status)} className="text-sm">
                {invoice.status}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Customer and Invoice Details */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bill To</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{invoice.customer}</p>
                  <p className="text-muted-foreground">{invoice.customerEmail}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Invoice Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Invoice Date:</span>
                    <span>{new Date(invoice.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Due Date:</span>
                    <span>{new Date(invoice.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invoice Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items?.map((item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.rate)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(item.amount)}</TableCell>
                    </TableRow>
                  )) || (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No detailed items available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Totals */}
              <div className="mt-6 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (7.5%):</span>
                  <span className="font-medium">{formatCurrency(tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
