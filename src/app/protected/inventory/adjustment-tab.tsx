"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, MoreHorizontal, Eye, Edit, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"
import { CreateAdjustmentModal } from "./modal/createAdjustment-modal"
import { ViewAdjustmentModal } from "./modal/viewAdjustment-modal"

interface Adjustment {
  id: number
  reference: string
  product: string
  sku: string
  type: string
  quantityBefore: number
  quantityAfter: number
  adjustment: number
  unitCost: number
  totalValue: number
  reason: string
  status: string
  createdBy: string
  approvedBy: string | null
  date: string
  time: string
}

export function AdjustmentsTab({businessId}: {businessId: string}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedAdjustment, setSelectedAdjustment] = useState<Adjustment | null>(null)

  const adjustments = [
    {
      id: 1,
      reference: "ADJ-001",
      product: "iPhone 14 Pro",
      sku: "IPH14P-128",
      type: "Damage",
      quantityBefore: 27,
      quantityAfter: 25,
      adjustment: -2,
      unitCost: 450000,
      totalValue: -900000,
      reason: "Water damage - customer return",
      status: "Approved",
      createdBy: "John Doe",
      approvedBy: "Jane Smith",
      date: "2024-01-15",
      time: "14:30",
    },
    {
      id: 2,
      reference: "ADJ-002",
      product: "Samsung Galaxy S23",
      sku: "SGS23-256",
      type: "Found",
      quantityBefore: 13,
      quantityAfter: 15,
      adjustment: 2,
      unitCost: 380000,
      totalValue: 760000,
      reason: "Found during stock count",
      status: "Pending",
      createdBy: "Jane Smith",
      approvedBy: null,
      date: "2024-01-14",
      time: "16:45",
    },
    {
      id: 3,
      reference: "ADJ-003",
      product: "MacBook Air M2",
      sku: "MBA-M2-256",
      type: "Theft",
      quantityBefore: 8,
      quantityAfter: 7,
      adjustment: -1,
      unitCost: 650000,
      totalValue: -650000,
      reason: "Missing from warehouse - suspected theft",
      status: "Approved",
      createdBy: "Admin",
      approvedBy: "Manager",
      date: "2024-01-13",
      time: "09:15",
    },
    {
      id: 4,
      reference: "ADJ-004",
      product: "AirPods Pro",
      sku: "APP-2ND",
      type: "Recount",
      quantityBefore: 42,
      quantityAfter: 45,
      adjustment: 3,
      unitCost: 95000,
      totalValue: 285000,
      reason: "Physical count correction",
      status: "Rejected",
      createdBy: "John Doe",
      approvedBy: "Jane Smith",
      date: "2024-01-12",
      time: "11:20",
    },
  ]

  const adjustmentTypes = ["Damage", "Theft", "Found", "Recount", "Expired", "Other"]
  const statuses = ["Pending", "Approved", "Rejected"]

  const filteredAdjustments = adjustments.filter((adjustment) => {
    const matchesSearch =
      adjustment.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adjustment.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adjustment.reference.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || adjustment.type === typeFilter
    const matchesStatus = statusFilter === "all" || adjustment.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      Pending: "secondary",
      Approved: "default",
      Rejected: "destructive",
    }
    return variants[status] || "outline"
  }

  const getAdjustmentIcon = (adjustment: number) => {
    if (adjustment > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (adjustment < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <AlertTriangle className="h-4 w-4 text-yellow-500" />
  }

  const handleView = (adjustment: Adjustment) => {
    setSelectedAdjustment(adjustment)
    setShowViewModal(true)
  }

  const totalAdjustments = adjustments.length
  const pendingAdjustments = adjustments.filter((adj) => adj.status === "Pending").length
  const totalValue = adjustments
    .filter((adj) => adj.status === "Approved")
    .reduce((sum, adj) => sum + adj.totalValue, 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Adjustments</CardTitle>
            <AlertTriangle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAdjustments}</div>
            <p className="text-xs text-muted-foreground">All time adjustments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAdjustments}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Value Impact</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalValue >= 0 ? "text-green-600" : "text-red-600"}`}>
              ₦{totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Approved adjustments</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Stock Adjustments
              </CardTitle>
              <CardDescription>Manage inventory adjustments for damages, theft, and corrections</CardDescription>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Adjustment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search adjustments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Adjustment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {adjustmentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Adjustments Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Adjustment</TableHead>
                  <TableHead>Value Impact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdjustments.map((adjustment) => (
                  <TableRow key={adjustment.id}>
                    <TableCell className="font-mono text-sm">{adjustment.reference}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{adjustment.product}</p>
                        <p className="text-sm text-muted-foreground font-mono">{adjustment.sku}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{adjustment.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getAdjustmentIcon(adjustment.adjustment)}
                        <div>
                          <p className={`font-medium ${adjustment.adjustment > 0 ? "text-green-600" : "text-red-600"}`}>
                            {adjustment.adjustment > 0 ? "+" : ""}
                            {adjustment.adjustment}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {adjustment.quantityBefore} → {adjustment.quantityAfter}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${adjustment.totalValue >= 0 ? "text-green-600" : "text-red-600"}`}>
                        ₦{adjustment.totalValue.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadge(adjustment.status)}>{adjustment.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm">{adjustment.date}</p>
                        <p className="text-xs text-muted-foreground">{adjustment.time}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(adjustment)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {adjustment.status === "Pending" && (
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Adjustment
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredAdjustments.length === 0 && (
            <div className="text-center py-8">
              <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No adjustments found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || typeFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Stock adjustments will appear here when created"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateAdjustmentModal open={showCreateModal} onOpenChange={setShowCreateModal} businessId={businessId} />
      <ViewAdjustmentModal open={showViewModal} onOpenChange={setShowViewModal} adjustment={selectedAdjustment} />
    </div>
  )
}
