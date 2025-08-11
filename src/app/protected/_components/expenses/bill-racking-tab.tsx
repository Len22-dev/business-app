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
import { AddBillModal } from "./modal/add-bill-form"
import { ViewBillModal } from "./modal/view-bill-form"
import { EditBillModal } from "./modal/edit-bill-form"

interface Bill{
  id: number
  billNumber: string
  vendor: string
  status: string
  amount: number
  category: string
  issueDate: string
  dueDate: string
  description: string
  notes: string
}

const mockBills = [
  {
    id: "BILL-001",
    billNumber: "INV-2024-001",
    vendor: "Office Mart Ltd",
    issueDate: "2024-01-10",
    dueDate: "2024-01-25",
    amount: 125000,
    status: "Pending",
    category: "Office Supplies",
    description: '',
    notes:''
  },
  {
    id: "BILL-002",
    billNumber: "INV-2024-002",
    vendor: "Total Nigeria",
    issueDate: "2024-01-12",
    dueDate: "2024-01-27",
    amount: 85000,
    status: "Paid",
    category: "Fuel & Transportation",
     description: '',
    notes:''
  },
  {
    id: "BILL-003",
    billNumber: "INV-2024-003",
    vendor: "MTN Nigeria",
    issueDate: "2024-01-15",
    dueDate: "2024-01-30",
    amount: 45000,
    status: "Overdue",
    category: "Telecommunications",
     description: '',
    notes:''
  },
  {
    id: "BILL-004",
    billNumber: "INV-2024-004",
    vendor: "Print Pro",
    issueDate: "2024-01-18",
    dueDate: "2024-02-02",
    amount: 195000,
    status: "Pending",
    category: "Printing & Marketing",
     description: '',
    notes:''
  },
]

export function BillTrackingTab() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const handleView = (bill: Bill) => {
    setSelectedBill(bill)
    setShowViewModal(true)
  }

  const handleEdit = (bill: Bill) => {
    setSelectedBill(bill)
    setShowEditModal(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Paid
          </Badge>
        )
      case "Pending":
        return <Badge variant="secondary">Pending</Badge>
      case "Overdue":
        return <Badge variant="destructive">Overdue</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Bill Tracking</CardTitle>
          <CardDescription>Track incoming bills and manage payment schedules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bills..."
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
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Bill
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bill Number</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBills.map((bill) => (
                  <TableRow key={bill.id}>
                    <TableCell className="font-medium">{bill.billNumber}</TableCell>
                    <TableCell>{bill.vendor}</TableCell>
                    <TableCell>{bill.issueDate}</TableCell>
                    <TableCell>{bill.dueDate}</TableCell>
                    <TableCell>₦{bill.amount.toLocaleString()}</TableCell>
                    <TableCell>{bill.category}</TableCell>
                    <TableCell>{getStatusBadge(bill.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(bill)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(bill)}>
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

      <AddBillModal open={showAddModal} onOpenChange={setShowAddModal} />
      {selectedBill &&(
        <
            ViewBillModal 
            open={showViewModal} 
            onOpenChange={setShowViewModal} 
            bill={selectedBill} 
            />
            )}
     {selectedBill &&
     ( 
        <EditBillModal 
        open={showEditModal} 
        onOpenChange={setShowEditModal} 
        bill={selectedBill} 
        />
        )}
    </div>
  )
}
