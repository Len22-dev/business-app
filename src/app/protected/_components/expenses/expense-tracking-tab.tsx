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
import { AddExpenseModal } from "./modal/add-expense-form"
import { ViewExpenseModal } from "./modal/view-expense-form"
import { EditExpenseModal } from "./modal/edit-expense-form"

interface Expense {
  id: string
  date: string
  description: string
  category: string
  vendor: string
  amount: number
  status: string
  receipt: string
}

const mockExpenses = [
  {
    id: "EXP-001",
    date: "2024-01-15",
    description: "Office Supplies",
    category: "Office Expenses",
    vendor: "Office Mart Ltd",
    amount: 45000,
    status: "Approved",
    receipt: "Yes",
  },
  {
    id: "EXP-002",
    date: "2024-01-14",
    description: "Fuel for Company Vehicle",
    category: "Transportation",
    vendor: "Total Nigeria",
    amount: 25000,
    status: "Pending",
    receipt: "Yes",
  },
  {
    id: "EXP-003",
    date: "2024-01-13",
    description: "Internet Subscription",
    category: "Utilities",
    vendor: "MTN Nigeria",
    amount: 15000,
    status: "Approved",
    receipt: "No",
  },
  {
    id: "EXP-004",
    date: "2024-01-12",
    description: "Marketing Materials",
    category: "Marketing",
    vendor: "Print Pro",
    amount: 75000,
    status: "Rejected",
    receipt: "Yes",
  },
]

export function ExpenseTrackingTab() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const handleView = (expense: Expense) => {
    setSelectedExpense(expense)
    setShowViewModal(true)
  }

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense)
    setShowEditModal(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Approved
          </Badge>
        )
      case "Pending":
        return <Badge variant="secondary">Pending</Badge>
      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Expense Tracking</CardTitle>
          <CardDescription>Track and manage all business expenses with approval workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
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
              Add Expense
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Expense ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Receipt</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.id}</TableCell>
                    <TableCell>{expense.date}</TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>{expense.vendor}</TableCell>
                    <TableCell>₦{expense.amount.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(expense.status)}</TableCell>
                    <TableCell>
                      <Badge variant={expense.receipt === "Yes" ? "default" : "secondary"}>{expense.receipt}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(expense)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(expense)}>
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

      <AddExpenseModal open={showAddModal} onOpenChange={setShowAddModal} />
      <ViewExpenseModal open={showViewModal} onOpenChange={setShowViewModal} expense={selectedExpense} />
      <EditExpenseModal open={showEditModal} onOpenChange={setShowEditModal} expense={selectedExpense} />
    </div>
  )
}
