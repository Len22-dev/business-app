"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Plus, Search, MoreHorizontal, Eye, Edit, Trash2, Filter, Package } from "lucide-react"
import { CreateReceiptModal } from "./modal/create-receipt-form"
import { ViewReceiptModal } from "./modal/view-reciept-form"

interface Receipt {
  id: string
  receiptNumber: string
  purchaseOrder: string
  supplier: string
  receiptDate: string
  itemsReceived: number
  totalValue: number
  status: string
  condition: string
}

const mockReceipts = [
  {
    id: "REC-001",
    receiptNumber: "REC-2024-001",
    purchaseOrder: "PO-2024-001",
    supplier: "Tech Solutions Ltd",
    receiptDate: "2024-01-20",
    itemsReceived: 5,
    totalValue: 850000,
    status: "Complete",
    condition: "Good",
  },
  {
    id: "REC-002",
    receiptNumber: "REC-2024-002",
    purchaseOrder: "PO-2024-002",
    supplier: "Office Supplies Co",
    receiptDate: "2024-01-18",
    itemsReceived: 6,
    totalValue: 280000,
    status: "Partial",
    condition: "Good",
  },
  {
    id: "REC-003",
    receiptNumber: "REC-2024-003",
    purchaseOrder: "PO-2024-003",
    supplier: "Industrial Equipment",
    receiptDate: "2024-01-25",
    itemsReceived: 3,
    totalValue: 1250000,
    status: "Complete",
    condition: "Damaged",
  },
  {
    id: "REC-004",
    receiptNumber: "REC-2024-004",
    purchaseOrder: "PO-2024-004",
    supplier: "Raw Materials Inc",
    receiptDate: "2024-01-22",
    itemsReceived: 10,
    totalValue: 580000,
    status: "Complete",
    condition: "Good",
  },
]

export function ReceiptsTab() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const handleView = (receipt: Receipt) => {
    setSelectedReceipt(receipt)
    setShowViewModal(true)
  }

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
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Purchase Receipts</CardTitle>
          <CardDescription>Track received items and manage inventory updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search receipts..."
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
              Create Receipt
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt Number</TableHead>
                  <TableHead>Purchase Order</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Receipt Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockReceipts.map((receipt) => (
                  <TableRow key={receipt.id}>
                    <TableCell className="font-medium">{receipt.receiptNumber}</TableCell>
                    <TableCell>{receipt.purchaseOrder}</TableCell>
                    <TableCell>{receipt.supplier}</TableCell>
                    <TableCell>{receipt.receiptDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>{receipt.itemsReceived} items</span>
                      </div>
                    </TableCell>
                    <TableCell>₦{receipt.totalValue.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(receipt.status)}</TableCell>
                    <TableCell>{getConditionBadge(receipt.condition)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(receipt)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
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

      <CreateReceiptModal open={showCreateModal} onOpenChange={setShowCreateModal} />
      <ViewReceiptModal open={showViewModal} onOpenChange={setShowViewModal} receipt={selectedReceipt} />
    </div>
  )
}
