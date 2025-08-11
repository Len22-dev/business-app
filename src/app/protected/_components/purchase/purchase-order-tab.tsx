"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Plus, Search, MoreHorizontal, Eye, Edit, Trash2, Filter } from "lucide-react"
import { AddPurchaseModal } from "@/app/components/dashboard/modals/add-purchase-modal"
import { ViewPurchaseOrderModal } from "./modal/view-purchase-order-form"
import { EditPurchaseOrderModal } from "./modal/edit-purchase-0rder-form"
import { useBusinessPurchases } from "@/hooks/usePurchase"


interface PurchaseOrder {
  id: string
  orderNumber: string
  supplier: string
  orderDate: string
  expectedDate: string
  totalAmount: number
  status: string
  items: number
}

const mockPurchaseOrders = [
  {
    id: "PO-001",
    orderNumber: "PO-2024-001",
    supplier: "Tech Solutions Ltd",
    orderDate: "2024-01-15",
    expectedDate: "2024-01-25",
    totalAmount: 850000,
    status: "Pending",
    items: 5,
  },
  {
    id: "PO-002",
    orderNumber: "PO-2024-002",
    supplier: "Office Supplies Co",
    orderDate: "2024-01-12",
    expectedDate: "2024-01-22",
    totalAmount: 320000,
    status: "Approved",
    items: 8,
  },
  {
    id: "PO-003",
    orderNumber: "PO-2024-003",
    supplier: "Industrial Equipment",
    orderDate: "2024-01-10",
    expectedDate: "2024-01-30",
    totalAmount: 1250000,
    status: "Received",
    items: 3,
  },
  {
    id: "PO-004",
    orderNumber: "PO-2024-004",
    supplier: "Raw Materials Inc",
    orderDate: "2024-01-08",
    expectedDate: "2024-01-18",
    totalAmount: 675000,
    status: "Cancelled",
    items: 12,
  },
]

interface  PurchaseProps {
  userId: string
  businessId: string
}

export function PurchaseOrdersTab({userId, businessId}:PurchaseProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const {refetch} = useBusinessPurchases(businessId)
  const handleView = (order: PurchaseOrder) => {
    setSelectedOrder(order)
    setShowViewModal(true)
  }

  const handleEdit = (order: PurchaseOrder) => {
    setSelectedOrder(order)
    setShowEditModal(true)
  }

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

  
  const handleAddSuccess = () => {
    refetch()
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders</CardTitle>
          <CardDescription>Create and manage purchase orders for your suppliers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-[300px]"
                />
              </div>
              <DatePickerWithRange />
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Order
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Number</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Expected Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPurchaseOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>{order.supplier}</TableCell>
                    <TableCell>{order.orderDate}</TableCell>
                    <TableCell>{order.expectedDate}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{order.items} items</Badge>
                    </TableCell>
                    <TableCell>₦{order.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(order)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(order)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddPurchaseModal  isOpen={showCreateModal}  onClose={setShowCreateModal} onSuccess={handleAddSuccess} userId={userId} businessId={businessId} />
      <ViewPurchaseOrderModal open={showViewModal} onOpenChange={setShowViewModal} order={selectedOrder} />
      <EditPurchaseOrderModal open={showEditModal} onOpenChange={setShowEditModal} order={selectedOrder} />
    </div>
  )
}
