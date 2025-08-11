"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, AlertTriangle, TrendingUp, BarChart3 } from "lucide-react"

interface Product {
    name: string
    sku: string
    category: string
    description: string
    unitPrice: number
    currentStock: number
    minStock: number
    maxStock: number
    supplier: string
    barcode: string
    totalValue: number
    lastUpdated: string
}


interface ViewProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product
}

export function ViewProductModal({ open, onOpenChange, product }: ViewProductModalProps) {
  if (!product) return null

  const getStockStatus = () => {
    if (product.currentStock === 0)
      return { label: "Out of Stock", variant: "destructive" as const, color: "text-red-600" }
    if (product.currentStock <= product.minStock)
      return { label: "Low Stock", variant: "secondary" as const, color: "text-orange-600" }
    return { label: "In Stock", variant: "default" as const, color: "text-green-600" }
  }

  const stockStatus = getStockStatus()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Details
          </DialogTitle>
          <DialogDescription>Complete information about {product.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Product Name</p>
                  <p className="text-lg font-semibold">{product.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">SKU</p>
                  <p className="font-mono text-sm">{product.sku}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Category</p>
                  <Badge variant="outline">{product.category}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Supplier</p>
                  <p>{product.supplier}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stock Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Stock Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold">{product.currentStock}</p>
                  <p className="text-sm text-muted-foreground">Current Stock</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <AlertTriangle className="h-8 w-8 text-orange-600" />
                  </div>
                  <p className="text-2xl font-bold">{product.minStock}</p>
                  <p className="text-sm text-muted-foreground">Minimum Stock</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold">{product.maxStock}</p>
                  <p className="text-sm text-muted-foreground">Maximum Stock</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        stockStatus.color === "text-red-600"
                          ? "bg-red-100"
                          : stockStatus.color === "text-orange-600"
                            ? "bg-orange-100"
                            : "bg-green-100"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full ${
                          stockStatus.color === "text-red-600"
                            ? "bg-red-600"
                            : stockStatus.color === "text-orange-600"
                              ? "bg-orange-600"
                              : "bg-green-600"
                        }`}
                      />
                    </div>
                  </div>
                  <Badge variant={stockStatus.variant} className="mb-1">
                    {stockStatus.label}
                  </Badge>
                  <p className="text-sm text-muted-foreground">Status</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Financial Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Unit Price</p>
                  <p className="text-2xl font-bold text-green-600">₦{product.unitPrice.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Stock Value</p>
                  <p className="text-2xl font-bold text-blue-600">₦{product.totalValue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p>{product.lastUpdated}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Stock Status</p>
                <div className="flex items-center gap-2">
                  <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                  {product.currentStock <= product.minStock && product.currentStock > 0 && (
                    <span className="text-sm text-orange-600">⚠️ Reorder recommended</span>
                  )}
                  {product.currentStock === 0 && <span className="text-sm text-red-600">🚫 Out of stock</span>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
