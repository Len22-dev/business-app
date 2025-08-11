"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { AddExpenseCategoryModal } from "./modal/expense-category-form"
import { EditExpenseCategoryModal } from "./modal/edit-category-form"

const mockCategories = [
  {
    id: "CAT-001",
    name: "Office Expenses",
    description: "General office supplies and equipment",
    color: "#3B82F6",
    totalExpenses: 450000,
    expenseCount: 15,
  },
  {
    id: "CAT-002",
    name: "Transportation",
    description: "Fuel, vehicle maintenance, and travel expenses",
    color: "#10B981",
    totalExpenses: 320000,
    expenseCount: 12,
  },
  {
    id: "CAT-003",
    name: "Utilities",
    description: "Internet, electricity, water, and phone bills",
    color: "#F59E0B",
    totalExpenses: 180000,
    expenseCount: 8,
  },
  {
    id: "CAT-004",
    name: "Marketing",
    description: "Advertising, promotional materials, and campaigns",
    color: "#EF4444",
    totalExpenses: 275000,
    expenseCount: 10,
  },
  {
    id: "CAT-005",
    name: "Professional Services",
    description: "Legal, accounting, and consulting fees",
    color: "#8B5CF6",
    totalExpenses: 150000,
    expenseCount: 6,
  },
]

export function ExpenseCategoriesTab() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const handleEdit = (category: any) => {
    setSelectedCategory(category)
    setShowEditModal(true)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Expense Categories</CardTitle>
          <CardDescription>Organize your expenses into categories for better tracking and reporting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-[300px]"
              />
            </div>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Total Expenses</TableHead>
                  <TableHead>Expense Count</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>₦{category.totalExpenses.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{category.expenseCount} expenses</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(category)}>
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

      <AddExpenseCategoryModal open={showAddModal} onOpenChange={setShowAddModal} />
      <EditExpenseCategoryModal open={showEditModal} onOpenChange={setShowEditModal} category={selectedCategory} />
    </div>
  )
}
