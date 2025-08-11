"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Wallet, CreditCard } from "lucide-react"

interface ViewBankAccountModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  account: any
}

export function ViewBankAccountModal({ open, onOpenChange, account }: ViewBankAccountModalProps) {
  if (!account) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "closed":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getAccountIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "current":
        return Building2
      case "savings":
        return Wallet
      case "fixed deposit":
        return CreditCard
      default:
        return Building2
    }
  }

  const IconComponent = getAccountIcon(account.accountType)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bank Account Details</DialogTitle>
          <DialogDescription>Complete information about this bank account.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Header Information */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <IconComponent className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{account.bankName}</h3>
              <p className="text-muted-foreground">{account.accountName}</p>
            </div>
            <Badge variant={getStatusColor(account.status)}>{account.status}</Badge>
          </div>

          <Separator />

          {/* Account Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Account Number:</div>
                <div className="col-span-2 font-mono">
                  {account.accountNumber.slice(0, 4)}****{account.accountNumber.slice(-4)}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Account Type:</div>
                <div className="col-span-2">
                  <Badge variant="outline">{account.accountType}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Current Balance:</div>
                <div className="col-span-2 font-semibold text-lg">{formatCurrency(account.balance)}</div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Currency:</div>
                <div className="col-span-2">{account.currency}</div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Branch:</div>
                <div className="col-span-2">{account.branch}</div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Sort Code:</div>
                <div className="col-span-2 font-mono">{account.sortCode}</div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Opening Date:</div>
                <div className="col-span-2">{new Date(account.openingDate).toLocaleDateString()}</div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Last Transaction:</div>
                <div className="col-span-2">{new Date(account.lastTransaction).toLocaleDateString()}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
