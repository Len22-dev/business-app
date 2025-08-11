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

interface ViewCustomerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: any
}

export function ViewCustomerModal({ open, onOpenChange, customer }: ViewCustomerModalProps) {
  if (!customer) return null

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
          <DialogTitle>Customer Details</DialogTitle>
          <DialogDescription>View complete customer information and performance metrics.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{customer.name}</h3>
            {getStatusBadge(customer.status)}
          </div>

          <Separator />

          <div className="grid gap-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{customer.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">{customer.phone}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Address</p>
                <p className="text-sm text-muted-foreground">{customer.address}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Category</p>
                <p className="text-sm text-muted-foreground">{customer.category}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Star className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Rating</p>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-500">{getRatingStars(customer.rating)}</span>
                  <span className="text-sm text-muted-foreground">({customer.rating})</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Total Orders</p>
                <p className="text-sm text-muted-foreground">{customer.totalOrders} orders</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Total Value</p>
                <p className="text-lg font-semibold">₦{customer.totalValue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button>Edit Customer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
