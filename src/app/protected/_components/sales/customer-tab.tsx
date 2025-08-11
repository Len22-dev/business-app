"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Eye, Edit, Trash2, Phone, Mail } from "lucide-react"
import { AddCustomerModal } from "./modal/add-customer-form"
import { ViewCustomerModal } from "./modal/view-customers-form"
import { EditCustomerModal } from "./modal/edit-customers-form"

export interface Customer {
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

const mockCustomers = [
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

export function CustomersTab({businessId}: { businessId: string }) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const handleView = (customer: Customer) => {
    setSelectedCustomer(customer)
    setShowViewModal(true)
  }

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer)
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
          <CardTitle>Customers</CardTitle>
          <CardDescription>Manage your customer relationships and contact information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-[300px]"
              />
            </div>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
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
                {mockCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">{customer.address}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1" />
                          {customer.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1" />
                          {customer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{customer.category}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{customer.totalOrders} orders</Badge>
                    </TableCell>
                    <TableCell>₦{customer.totalValue.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-500">{getRatingStars(customer.rating)}</span>
                        <span className="text-sm text-muted-foreground">({customer.rating})</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(customer.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(customer)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(customer)}>
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

      <AddCustomerModal open={showAddModal} onOpenChange={setShowAddModal} businessId={businessId} />
      <ViewCustomerModal open={showViewModal} onOpenChange={setShowViewModal} customer={selectedCustomer} />
      <EditCustomerModal open={showEditModal} onOpenChange={setShowEditModal} customer={selectedCustomer} />
    </div>
  )
}
