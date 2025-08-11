"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, Filter, ArrowUpDown, Eye, Edit, MoreHorizontal, FileText, Send } from "lucide-react"

// Sample estimates data
const sampleEstimates = [
  {
    id: "EST-001",
    estimateNumber: "EST-2024-001",
    customer: "Potential Client A",
    customerEmail: "contact@clienta.com",
    date: "2024-01-15",
    expiryDate: "2024-02-15",
    amount: 1500000,
    status: "Sent",
    validUntil: "2024-02-15",
  },
  {
    id: "EST-002",
    estimateNumber: "EST-2024-002",
    customer: "New Business Ltd",
    customerEmail: "info@newbusiness.ng",
    date: "2024-01-14",
    expiryDate: "2024-02-14",
    amount: 850000,
    status: "Accepted",
    validUntil: "2024-02-14",
  },
  {
    id: "EST-003",
    estimateNumber: "EST-2024-003",
    customer: "Growth Company",
    customerEmail: "admin@growth.com",
    date: "2024-01-13",
    expiryDate: "2024-02-13",
    amount: 2200000,
    status: "Draft",
    validUntil: "2024-02-13",
  },
  {
    id: "EST-004",
    estimateNumber: "EST-2024-004",
    customer: "Enterprise Solutions",
    customerEmail: "procurement@enterprise.ng",
    date: "2024-01-12",
    expiryDate: "2024-02-12",
    amount: 3500000,
    status: "Expired",
    validUntil: "2024-01-12",
  },
  {
    id: "EST-005",
    estimateNumber: "EST-2024-005",
    customer: "Small Business Co",
    customerEmail: "owner@smallbiz.com",
    date: "2024-01-11",
    expiryDate: "2024-02-11",
    amount: 650000,
    status: "Declined",
    validUntil: "2024-02-11",
  },
]

export function EstimatesTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")

  // Filter and sort estimates
  const filteredAndSortedEstimates = useMemo(() => {
    const filtered = sampleEstimates.filter((estimate) => {
      const matchesSearch =
        estimate.estimateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        estimate.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        estimate.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterStatus === "all" || estimate.status.toLowerCase() === filterStatus.toLowerCase()
      return matchesSearch && matchesFilter
    })

    return filtered.sort((a, b) => {
      let aValue, bValue
      switch (sortBy) {
        case "amount":
          aValue = a.amount
          bValue = b.amount
          break
        case "date":
          aValue = new Date(a.date)
          bValue = new Date(b.date)
          break
        case "customer":
          aValue = a.customer.toLowerCase()
          bValue = b.customer.toLowerCase()
          break
        case "expiryDate":
          aValue = new Date(a.expiryDate)
          bValue = new Date(b.expiryDate)
          break
        default:
          aValue = new Date(a.date)
          bValue = new Date(b.date)
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
      case "accepted":
        return "default"
      case "sent":
        return "secondary"
      case "draft":
        return "outline"
      case "expired":
        return "destructive"
      case "declined":
        return "destructive"
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

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Estimates</CardTitle>
            <CardDescription>Create and manage quotes and estimates for potential customers</CardDescription>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" />
            Create Estimate
          </Button>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search estimates..."
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
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
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
                    onClick={() => toggleSort("estimateNumber")}
                    className="h-auto p-0 font-semibold"
                  >
                    Estimate #
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
                  <Button variant="ghost" onClick={() => toggleSort("date")} className="h-auto p-0 font-semibold">
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => toggleSort("expiryDate")} className="h-auto p-0 font-semibold">
                    Valid Until
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => toggleSort("amount")} className="h-auto p-0 font-semibold">
                    Amount
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedEstimates.map((estimate) => (
                <TableRow key={estimate.id}>
                  <TableCell className="font-medium">{estimate.estimateNumber}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{estimate.customer}</div>
                      <div className="text-sm text-muted-foreground">{estimate.customerEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(estimate.date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(estimate.expiryDate).toLocaleDateString()}</TableCell>
                  <TableCell className="font-semibold">{formatCurrency(estimate.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(estimate.status)}>{estimate.status}</Badge>
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
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Convert to Invoice
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Send className="mr-2 h-4 w-4" />
                          Send to Customer
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
  )
}
