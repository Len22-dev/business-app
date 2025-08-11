"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Eye, Edit, Trash2, Phone, Mail } from "lucide-react"
import { AddVendorModal } from "./modal/add-vendor-form"
import { EditVendorModal } from "./modal/edit-vendor-form"

interface Vendor {
  id: string
  name: string
  email: string
  phone: string
  address: string
  category: string
  totalExpenses: number
  status: string
}

const mockVendors = [
  {
    id: "VEN-001",
    name: "Office Mart Ltd",
    email: "info@officemart.ng",
    phone: "+234 801 234 5678",
    address: "123 Business District, Lagos",
    category: "Office Supplies",
    totalExpenses: 450000,
    status: "Active",
  },
  {
    id: "VEN-002",
    name: "Total Nigeria",
    email: "corporate@total.ng",
    phone: "+234 802 345 6789",
    address: "456 Victoria Island, Lagos",
    category: "Fuel & Transportation",
    totalExpenses: 250000,
    status: "Active",
  },
  {
    id: "VEN-003",
    name: "MTN Nigeria",
    email: "business@mtn.ng",
    phone: "+234 803 456 7890",
    address: "789 Ikeja, Lagos",
    category: "Telecommunications",
    totalExpenses: 180000,
    status: "Active",
  },
  {
    id: "VEN-004",
    name: "Print Pro",
    email: "orders@printpro.ng",
    phone: "+234 804 567 8901",
    address: "321 Allen Avenue, Lagos",
    category: "Printing & Marketing",
    totalExpenses: 320000,
    status: "Inactive",
  },
]

export function VendorManagementTab() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const handleEdit = (vendor: Vendor) => {
    setSelectedVendor(vendor)
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

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Vendor Management</CardTitle>
          <CardDescription>Manage your vendor relationships and contact information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-[300px]"
              />
            </div>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Vendor
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Total Expenses</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockVendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">{vendor.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{vendor.name}</div>
                        <div className="text-sm text-muted-foreground">{vendor.address}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1" />
                          {vendor.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1" />
                          {vendor.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{vendor.category}</TableCell>
                    <TableCell>₦{vendor.totalExpenses.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(vendor.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(vendor)}>
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

      <AddVendorModal open={showAddModal} onOpenChange={setShowAddModal} />
      <EditVendorModal open={showEditModal} onOpenChange={setShowEditModal} vendor={selectedVendor} />
    </div>
  )
}
