"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Eye, Edit, Trash2, Phone, Mail } from "lucide-react"
import { AddSupplierModal } from "./modal/add-supplier-form"
import { ViewSupplierModal } from "./modal/view-supplier-form"
import { EditSupplierModal } from "./modal/edit-supplier-form"

export interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  address: string
  category: string
  totalOrders: number
  totalValue: number
  status: string
  rating: number
}

const mockSuppliers = [
  {
    id: "SUP-001",
    name: "Tech Solutions Ltd",
    email: "info@techsolutions.ng",
    phone: "+234 801 234 5678",
    address: "123 Technology Drive, Lagos",
    category: "Technology",
    totalOrders: 15,
    totalValue: 2450000,
    status: "Active",
    rating: 4.8,
  },
  {
    id: "SUP-002",
    name: "Office Supplies Co",
    email: "sales@officesupplies.ng",
    phone: "+234 802 345 6789",
    address: "456 Business Avenue, Abuja",
    category: "Office Equipment",
    totalOrders: 28,
    totalValue: 1850000,
    status: "Active",
    rating: 4.5,
  },
  {
    id: "SUP-003",
    name: "Industrial Equipment",
    email: "orders@industrial.ng",
    phone: "+234 803 456 7890",
    address: "789 Industrial Estate, Port Harcourt",
    category: "Machinery",
    totalOrders: 8,
    totalValue: 5200000,
    status: "Active",
    rating: 4.9,
  },
  {
    id: "SUP-004",
    name: "Raw Materials Inc",
    email: "procurement@rawmaterials.ng",
    phone: "+234 804 567 8901",
    address: "321 Manufacturing Zone, Kano",
    category: "Raw Materials",
    totalOrders: 22,
    totalValue: 3100000,
    status: "Inactive",
    rating: 4.2,
  },
]

export function SuppliersTab() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const handleView = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setShowViewModal(true)
  }

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setShowEditModal(true)
  }

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
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Suppliers</CardTitle>
          <CardDescription>Manage your supplier relationships and contact information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-[300px]"
              />
            </div>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{supplier.name}</div>
                        <div className="text-sm text-muted-foreground">{supplier.address}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1" />
                          {supplier.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1" />
                          {supplier.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{supplier.category}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{supplier.totalOrders} orders</Badge>
                    </TableCell>
                    <TableCell>₦{supplier.totalValue.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-500">{getRatingStars(supplier.rating)}</span>
                        <span className="text-sm text-muted-foreground">({supplier.rating})</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(supplier.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(supplier)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(supplier)}>
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

      <AddSupplierModal open={showAddModal} onOpenChange={setShowAddModal} />
      <ViewSupplierModal open={showViewModal} onOpenChange={setShowViewModal} supplier={selectedSupplier} />
      <EditSupplierModal open={showEditModal} onOpenChange={setShowEditModal} supplier={selectedSupplier} />
    </div>
  )
}
