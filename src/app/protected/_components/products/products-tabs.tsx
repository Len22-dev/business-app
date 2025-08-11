"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, MoreHorizontal, Edit, Eye, Trash2, Package, AlertTriangle } from "lucide-react"
import { AddProductModal } from "./modal/addProduct-modal"
import { ViewProductModal } from "./modal/viewProduct-modal"
import { EditProductModal } from "./modal/editProducts-modal"

interface Product {
  id: number
  name: string
  sku: string
  category: string
  currentStock: number
  minStock: number
  maxStock: number
  unitPrice: number
  totalValue: number
  supplier: string
  status: string
  lastUpdated: string
  description: string
  barcode: string
}

export function ProductsTab({businessId}: {businessId: string}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const products = [
    {
      id: 1,
      name: "iPhone 14 Pro",
      sku: "IPH14P-128",
      category: "Electronics",
      currentStock: 25,
      minStock: 10,
      maxStock: 100,
      unitPrice: 450000,
      totalValue: 11250000,
      supplier: "Apple Nigeria",
      status: "In Stock",
      lastUpdated: "2024-01-15",
      description: "The iPhone 14 Pro is a high-end smartphone with a stunning design, powerful performance, and advanced camera features.",
      barcode: "1234567890123"
    },
    {
      id: 2,
      name: "Samsung Galaxy S23",
      sku: "SGS23-256",
      category: "Electronics",
      currentStock: 3,
      minStock: 8,
      maxStock: 50,
      unitPrice: 380000,
      totalValue: 1140000,
      supplier: "Samsung Electronics",
      status: "Low Stock",
      lastUpdated: "2024-01-14",
      description: "The Samsung Galaxy S23 is a powerful smartphone with a sleek design, advanced camera features, and a long battery life.",
      barcode: "9876543210987"
    },
    {
      id: 3,
      name: "MacBook Air M2",
      sku: "MBA-M2-256",
      category: "Computers",
      currentStock: 0,
      minStock: 5,
      maxStock: 30,
      unitPrice: 650000,
      totalValue: 0,
      supplier: "Apple Nigeria",
      status: "Out of Stock",
      lastUpdated: "2024-01-13",
      description: "The MacBook Air M2 is a powerful laptop with a sleek design, advanced camera features, and a long battery life.",
      barcode: "4567890123456"  
    },
    {
      id: 4,
      name: "AirPods Pro",
      sku: "APP-2ND",
      category: "Accessories",
      currentStock: 45,
      minStock: 15,
      maxStock: 100,
      unitPrice: 95000,
      totalValue: 4275000,
      supplier: "Apple Nigeria",
      status: "In Stock",
      lastUpdated: "2024-01-15",
      description: "The AirPods Pro are wireless earbuds with active noise cancellation and a long battery life.",
      barcode: "7890123456789"
    },
    {
      id: 5,
      name: "Dell XPS 13",
      sku: "DELL-XPS13",
      category: "Computers",
      currentStock: 12,
      minStock: 5,
      maxStock: 25,
      unitPrice: 520000,
      totalValue: 6240000,
      supplier: "Dell Technologies",
      status: "In Stock",
      lastUpdated: "2024-01-12",
      description: "The Dell XPS 13 is a powerful laptop with a sleek design, advanced camera features, and a long battery life.",
      barcode: "1234567890123"
    },
  ]

  const categories = ["Electronics", "Computers", "Accessories", "Mobile Phones"]

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "in-stock" && product.currentStock > product.minStock) ||
      (stockFilter === "low-stock" && product.currentStock <= product.minStock && product.currentStock > 0) ||
      (stockFilter === "out-of-stock" && product.currentStock === 0)

    return matchesSearch && matchesCategory && matchesStock
  })

  const getStockStatus = (product: Product) => {
    if (product.currentStock === 0) return { label: "Out of Stock", variant: "destructive" as const }
    if (product.currentStock <= product.minStock) return { label: "Low Stock", variant: "secondary" as const }
    return { label: "In Stock", variant: "default" as const }
  }

  const handleView = (product: Product) => {
    setSelectedProduct(product)
    setShowViewModal(true)
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setShowEditModal(true)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Management
              </CardTitle>
              <CardDescription>Manage your inventory products and stock levels</CardDescription>
            </div>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Stock Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product)
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.supplier}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{product.currentStock}</span>
                          {product.currentStock <= product.minStock && product.currentStock > 0 && (
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">Min: {product.minStock}</p>
                      </TableCell>
                      <TableCell>₦{product.unitPrice.toLocaleString()}</TableCell>
                      <TableCell>₦{product.totalValue.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(product)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(product)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Product
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || categoryFilter !== "all" || stockFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by adding your first product"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AddProductModal open={showAddModal} onOpenChange={setShowAddModal} businessId={businessId} />
     {selectedProduct &&
     ( 
     <ViewProductModal 
     open={showViewModal} 
     onOpenChange={setShowViewModal} 
     product={selectedProduct}  
     />
     )}
      {selectedProduct && (
        <EditProductModal 
        open={showEditModal} 
        onOpenChange={setShowEditModal} 
        product={selectedProduct} 
        />
        )}
    </div>
  )
}
