"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, TrendingUp, TrendingDown, User, Calendar } from "lucide-react"

interface ViewAdjustmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  adjustment: any
}

export function ViewAdjustmentModal({ open, onOpenChange, adjustment }: ViewAdjustmentModalProps) {
  if (!adjustment) return null

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      Pending: "secondary",
      Approved: "default",
      Rejected: "destructive",
    }
    return variants[status] || "outline"
  }

  const getAdjustmentIcon = (adjustmentValue: number) => {
    if (adjustmentValue > 0) return <TrendingUp className="h-5 w-5 text-green-500" />
    if (adjustmentValue < 0) return <TrendingDown className="h-5 w-5 text-red-500" />
    return <AlertTriangle className="h-5 w-5 text-yellow-500" />
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Adjustment Details
          </DialogTitle>
          <DialogDescription>Complete information about adjustment {adjustment.reference}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Reference</p>
                  <p className="font-mono text-lg">{adjustment.reference}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={getStatusBadge(adjustment.status)}>{adjustment.status}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Product</p>
                  <p className="font-semibold">{adjustment.product}</p>
                  <p className="text-sm text-muted-foreground font-mono">{adjustment.sku}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Adjustment Type</p>
                  <Badge variant="outline">{adjustment.type}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stock Changes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {getAdjustmentIcon(adjustment.adjustment)}
                Stock Changes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{adjustment.quantityBefore}</p>
                  <p className="text-sm text-muted-foreground">Before</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    {getAdjustmentIcon(adjustment.adjustment)}
                  </div>
                  <p className={`text-2xl font-bold ${adjustment.adjustment > 0 ? "text-green-600" : "text-red-600"}`}>
                    {adjustment.adjustment > 0 ? "+" : ""}
                    {adjustment.adjustment}
                  </p>
                  <p className="text-sm text-muted-foreground">Adjustment</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{adjustment.quantityAfter}</p>
                  <p className="text-sm text-muted-foreground">After</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Impact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Financial Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Unit Cost</p>
                  <p className="text-xl font-bold">₦{adjustment.unitCost.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Value Impact</p>
                  <p className={`text-xl font-bold ${adjustment.totalValue >= 0 ? "text-green-600" : "text-red-600"}`}>
                    ₦{adjustment.totalValue.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reason and Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Reason and Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reason</p>
                <p className="text-sm">{adjustment.reason}</p>
              </div>
              {adjustment.notes && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Additional Notes</p>
                  <p className="text-sm">{adjustment.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Audit Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Audit Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Created By
                  </p>
                  <p className="text-sm">{adjustment.createdBy}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date & Time
                  </p>
                  <p className="text-sm">
                    {adjustment.date} at {adjustment.time}
                  </p>
                </div>
              </div>
              {adjustment.approvedBy && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {adjustment.status === "Approved" ? "Approved By" : "Reviewed By"}
                    </p>
                    <p className="text-sm">{adjustment.approvedBy}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
