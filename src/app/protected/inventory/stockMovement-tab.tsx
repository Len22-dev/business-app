"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, TrendingUp, TrendingDown, BarChart3 } from "lucide-react"

export function StockMovementsTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const movements = [
    {
      id: 1,
      product: "iPhone 14 Pro",
      sku: "IPH14P-128",
      type: "Sale",
      quantity: -2,
      unitPrice: 450000,
      totalValue: -900000,
      reference: "INV-001",
      date: "2024-01-15",
      time: "14:30",
      user: "John Doe",
      notes: "Sold to customer",
    },
    {
      id: 2,
      product: "Samsung Galaxy S23",
      sku: "SGS23-256",
      type: "Purchase",
      quantity: 10,
      unitPrice: 380000,
      totalValue: 3800000,
      reference: "PO-045",
      date: "2024-01-15",
      time: "10:15",
      user: "Jane Smith",
      notes: "Stock replenishment",
    },
    {
      id: 3,
      product: "MacBook Air M2",
      sku: "MBA-M2-256",
      type: "Adjustment",
      quantity: -1,
      unitPrice: 650000,
      totalValue: -650000,
      reference: "ADJ-012",
      date: "2024-01-14",
      time: "16:45",
      user: "Admin",
      notes: "Damaged item write-off",
    },
    {
      id: 4,
      product: "AirPods Pro",
      sku: "APP-2ND",
      type: "Sale",
      quantity: -3,
      unitPrice: 95000,
      totalValue: -285000,
      reference: "INV-002",
      date: "2024-01-14",
      time: "11:20",
      user: "John Doe",
      notes: "Bulk sale",
    },
    {
      id: 5,
      product: "Dell XPS 13",
      sku: "DELL-XPS13",
      type: "Transfer In",
      quantity: 5,
      unitPrice: 520000,
      totalValue: 2600000,
      reference: "TRF-008",
      date: "2024-01-13",
      time: "09:30",
      user: "Jane Smith",
      notes: "Transfer from warehouse B",
    },
    {
      id: 6,
      product: "iPhone 14 Pro",
      sku: "IPH14P-128",
      type: "Return",
      quantity: 1,
      unitPrice: 450000,
      totalValue: 450000,
      reference: "RET-003",
      date: "2024-01-12",
      time: "15:10",
      user: "John Doe",
      notes: "Customer return - defective",
    },
  ]

  const movementTypes = ["Sale", "Purchase", "Adjustment", "Transfer In", "Transfer Out", "Return"]

  const filteredMovements = movements.filter((movement) => {
    const matchesSearch =
      movement.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.reference.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || movement.type === typeFilter
    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "today" && movement.date === "2024-01-15") ||
      (dateFilter === "week" && new Date(movement.date) >= new Date("2024-01-09")) ||
      (dateFilter === "month" && new Date(movement.date) >= new Date("2024-01-01"))

    return matchesSearch && matchesType && matchesDate
  })

  const getMovementIcon = (type: string) => {
    switch (type) {
      case "Sale":
      case "Transfer Out":
      case "Adjustment":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      case "Purchase":
      case "Transfer In":
      case "Return":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      default:
        return <BarChart3 className="h-4 w-4 text-blue-500" />
    }
  }

  const getMovementBadge = (type: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      Sale: "destructive",
      Purchase: "default",
      Adjustment: "secondary",
      "Transfer In": "default",
      "Transfer Out": "destructive",
      Return: "outline",
    }
    return variants[type] || "outline"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Stock Movements
              </CardTitle>
              <CardDescription>Track all inventory movements and transactions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products, SKU, or reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Movement Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {movementTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Movements Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>User</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{movement.product}</p>
                        <p className="text-sm text-muted-foreground font-mono">{movement.sku}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getMovementIcon(movement.type)}
                        <Badge variant={getMovementBadge(movement.type)}>{movement.type}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${movement.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                        {movement.quantity > 0 ? "+" : ""}
                        {movement.quantity}
                      </span>
                    </TableCell>
                    <TableCell>₦{movement.unitPrice.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${movement.totalValue > 0 ? "text-green-600" : "text-red-600"}`}>
                        ₦{movement.totalValue.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{movement.reference}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm">{movement.date}</p>
                        <p className="text-xs text-muted-foreground">{movement.time}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{movement.user}</p>
                        {movement.notes && <p className="text-xs text-muted-foreground">{movement.notes}</p>}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredMovements.length === 0 && (
            <div className="text-center py-8">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No movements found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || typeFilter !== "all" || dateFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Stock movements will appear here as they occur"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
