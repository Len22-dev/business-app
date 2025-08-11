"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, Filter, ArrowUpDown, Eye, Edit, MoreHorizontal, Package, Truck } from "lucide-react"
import { AddSaleModal } from "@/app/components/dashboard/modals/add-sale-modal"
import { useBusinessSales } from "@/hooks/useSales"

// Sample sales orders data
const sampleSalesOrders = [
  {
    id: "SO-001",
    orderNumber: "SO-2024-001",
    customer: "Dangote Group",
    customerEmail: "orders@dangote.com",
    orderDate: "2024-01-15",
    deliveryDate: "2024-01-25",
    amount: 2500000,
    status: "Confirmed",
    items: 5,
    priority: "High",
  },
  {
    id: "SO-002",
    orderNumber: "SO-2024-002",
    customer: "TechHub Nigeria",
    customerEmail: "procurement@techhub.ng",
    orderDate: "2024-01-14",
    deliveryDate: "2024-01-24",
    amount: 750000,
    status: "Processing",
    items: 3,
    priority: "Medium",
  },
  {
    id: "SO-003",
    orderNumber: "SO-2024-003",
    customer: "StartUp Inc",
    customerEmail: "orders@startup.com",
    orderDate: "2024-01-13",
    deliveryDate: "2024-01-23",
    amount: 300000,
    status: "Shipped",
    items: 2,
    priority: "Low",
  },
  {
    id: "SO-004",
    orderNumber: "SO-2024-004",
    customer: "Lagos Property Ltd",
    customerEmail: "supply@lagosprop.com",
    orderDate: "2024-01-12",
    deliveryDate: "2024-01-22",
    amount: 1200000,
    status: "Delivered",
    items: 8,
    priority: "High",
  },
  {
    id: "SO-005",
    orderNumber: "SO-2024-005",
    customer: "Global Supplies Ltd",
    customerEmail: "orders@globalsupplies.ng",
    orderDate: "2024-01-11",
    deliveryDate: "2024-01-21",
    amount: 850000,
    status: "Cancelled",
    items: 4,
    priority: "Medium",
  },
]

interface SalesClientProps {
  userId: string
  businessId: string
}

//type SaleStatus = "paid" | "partial" | "pending";

export function SalesOrdersTab({ userId, businessId }: SalesClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("orderDate")
  const [sortOrder, setSortOrder] = useState("desc")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const {  refetch } = useBusinessSales(businessId)
  //  const sales = data?.sales || []

  // Filter and sort sales orders
  const filteredAndSortedOrders = useMemo(() => {
    const filtered = sampleSalesOrders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterStatus === "all" || order.status.toLowerCase() === filterStatus.toLowerCase()
      return matchesSearch && matchesFilter
    })

    return filtered.sort((a, b) => {
      let aValue, bValue
      switch (sortBy) {
        case "amount":
          aValue = a.amount
          bValue = b.amount
          break
        case "orderDate":
          aValue = new Date(a.orderDate)
          bValue = new Date(b.orderDate)
          break
        case "customer":
          aValue = a.customer.toLowerCase()
          bValue = b.customer.toLowerCase()
          break
        case "deliveryDate":
          aValue = new Date(a.deliveryDate)
          bValue = new Date(b.deliveryDate)
          break
        default:
          aValue = new Date(a.orderDate)
          bValue = new Date(b.orderDate)
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }, [searchTerm, filterStatus, sortBy, sortOrder])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "default"
      case "processing":
        return "secondary"
      case "shipped":
        return "secondary"
      case "delivered":
        return "default"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  const handleAddSuccess = () => {
    refetch()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Sales Orders</CardTitle>
            <CardDescription>Track and manage your sales orders from confirmation to delivery</CardDescription>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" />
            Create Sales Order
          </Button>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sales orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("orderNumber")}
                    className="h-auto p-0 font-semibold"
                  >
                    Order #
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => toggleSort("customer")} className="h-auto p-0 font-semibold">
                    Customer
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => toggleSort("orderDate")} className="h-auto p-0 font-semibold">
                    Order Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("deliveryDate")}
                    className="h-auto p-0 font-semibold"
                  >
                    Delivery Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Items</TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => toggleSort("amount")} className="h-auto p-0 font-semibold">
                    Amount
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customer}</div>
                      <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(order.deliveryDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-center">{order.items}</TableCell>
                  <TableCell className="font-semibold">{formatCurrency(order.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(order.priority)}>{order.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Order
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Package className="mr-2 h-4 w-4" />
                          Update Status
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Truck className="mr-2 h-4 w-4" />
                          Track Shipment
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
       <AddSaleModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        userId={userId}
        businessId={businessId}
        onSuccess={handleAddSuccess}
      />
    </Card>
  )
}
