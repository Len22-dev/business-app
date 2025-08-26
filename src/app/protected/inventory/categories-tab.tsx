"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Tag, Package } from "lucide-react"
import { AddCategoryModal } from "./modal/addCategory-modal"
import { EditCategoryModal } from "./modal/editCategory-modal"

interface Category {
  id: number
  name: string
  description: string
  productCount: number
  totalValue: number
  color: string
  createdDate: string
  lastUpdated: string
}

export function CategoriesTab({businessId}:{businessId: string}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const categories = [
    {
      id: 1,
      name: "Electronics",
      description: "Electronic devices and gadgets",
      productCount: 45,
      totalValue: 15750000,
      color: "#3B82F6",
      createdDate: "2024-01-01",
      lastUpdated: "2024-01-15",
    },
    {
      id: 2,
      name: "Computers",
      description: "Laptops, desktops, and computer accessories",
      productCount: 23,
      totalValue: 8920000,
      color: "#10B981",
      createdDate: "2024-01-01",
      lastUpdated: "2024-01-14",
    },
    {
      id: 3,
      name: "Mobile Phones",
      description: "Smartphones and mobile accessories",
      productCount: 67,
      totalValue: 22340000,
      color: "#F59E0B",
      createdDate: "2024-01-01",
      lastUpdated: "2024-01-15",
    },
    {
      id: 4,
      name: "Accessories",
      description: "Various tech accessories and peripherals",
      productCount: 89,
      totalValue: 5680000,
      color: "#8B5CF6",
      createdDate: "2024-01-02",
      lastUpdated: "2024-01-13",
    },
    {
      id: 5,
      name: "Gaming",
      description: "Gaming consoles, games, and accessories",
      productCount: 34,
      totalValue: 7890000,
      color: "#EF4444",
      createdDate: "2024-01-05",
      lastUpdated: "2024-01-12",
    },
  ]

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setShowEditModal(true)
  }

  const totalProducts = categories.reduce((sum, cat) => sum + cat.productCount, 0)
  const totalValue = categories.reduce((sum, cat) => sum + cat.totalValue, 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Tag className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Active product categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Tag className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Combined inventory value</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Product Categories
              </CardTitle>
              <CardDescription>Organize your products into categories for better management</CardDescription>
            </div>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Categories Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-muted-foreground">Created: {category.createdDate}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{category.description}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{category.productCount} items</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">₦{category.totalValue.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{category.lastUpdated}</p>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(category)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Category
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Category
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-8">
              <Tag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? "Try adjusting your search" : "Get started by creating your first product category"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AddCategoryModal open={showAddModal} onOpenChange={setShowAddModal} businessId={businessId}/>
      {selectedCategory &&(
        <EditCategoryModal 
        open={showEditModal} 
        onOpenChange={setShowEditModal} 
        category={selectedCategory} 
        />
        )}
    </div>
  )
}
