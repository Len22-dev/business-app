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
import { Mail, Phone, MapPin, Tag, Star, CreditCard } from "lucide-react"

interface ViewSupplierModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier: any
}

export function ViewSupplierModal({ open, onOpenChange, supplier }: ViewSupplierModalProps) {
  if (!supplier) return null

  const getStatusBadge = (status: string) => {
    return status === "Active" ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        Active
      </Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    )
  }

  const getRatingStars = (rating: number) => {
    return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Supplier Details</DialogTitle>
          <DialogDescription>View complete supplier information and performance metrics.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{supplier.name}</h3>
            {getStatusBadge(supplier.status)}
          </div>

          <Separator />

          <div className="grid gap-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{supplier.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">{supplier.phone}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Address</p>
                <p className="text-sm text-muted-foreground">{supplier.address}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Category</p>
                <p className="text-sm text-muted-foreground">{supplier.category}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Star className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Rating</p>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-500">{getRatingStars(supplier.rating)}</span>
                  <span className="text-sm text-muted-foreground">({supplier.rating})</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Total Orders</p>
                <p className="text-sm text-muted-foreground">{supplier.totalOrders} orders</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Total Value</p>
                <p className="text-lg font-semibold">₦{supplier.totalValue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button>Edit Supplier</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
