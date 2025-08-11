"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  CreditCard,
  MoreHorizontal,
  Download,
  AlertTriangle,
  Clock,
  Plus,
} from "lucide-react"

// Sample payables data
const samplePayables = [
  {
    id: "PAY-001",
    vendor: "Office Supplies Ltd",
    vendorEmail: "billing@officesupplies.ng",
    billNumber: "BILL-2024-001",
    billDate: "2024-01-10",
    dueDate: "2024-02-10",
    amount: 450000,
    outstanding: 450000,
    status: "Current",
    daysOverdue: 0,
    agingBucket: "0-30 days",
    lastPayment: null,
    paymentTerms: "Net 30",
    category: "Office Expenses",
  },
  {
    id: "PAY-002",
    vendor: "Lagos Property Ltd",
    vendorEmail: "accounts@lagosprop.com",
    billNumber: "RENT-2024-01",
    billDate: "2024-01-01",
    dueDate: "2024-01-31",
    amount: 500000,
    outstanding: 500000,
    status: "Overdue",
    daysOverdue: 15,
    agingBucket: "0-30 days",
    lastPayment: null,
    paymentTerms: "Due on receipt",
    category: "Rent",
  },
  {
    id: "PAY-003",
    vendor: "Power Solutions Nigeria",
    vendorEmail: "billing@powersolutions.ng",
    billNumber: "ELEC-2024-001",
    billDate: "2023-12-20",
    dueDate: "2024-01-20",
    amount: 275000,
    outstanding: 275000,
    status: "Overdue",
    daysOverdue: 25,
    agingBucket: "0-30 days",
    lastPayment: null,
    paymentTerms: "Net 30",
    category: "Utilities",
  },
  {
    id: "PAY-004",
    vendor: "Tech Equipment Suppliers",
    vendorEmail: "sales@techequipment.ng",
    billNumber: "INV-TE-2023-089",
    billDate: "2023-11-15",
    dueDate: "2023-12-15",
    amount: 1200000,
    outstanding: 1200000,
    status: "Overdue",
    daysOverdue: 60,
    agingBucket: "31-60 days",
    lastPayment: null,
    paymentTerms: "Net 30",
    category: "Equipment",
  },
  {
    id: "PAY-005",
    vendor: "Marketing Agency Plus",
    vendorEmail: "finance@marketingplus.ng",
    billNumber: "MKT-2023-045",
    billDate: "2023-10-10",
    dueDate: "2023-11-10",
    amount: 850000,
    outstanding: 850000,
    status: "Overdue",
    daysOverdue: 95,
    agingBucket: "90+ days",
    lastPayment: null,
    paymentTerms: "Net 30",
    category: "Marketing",
  },
  {
    id: "PAY-006",
    vendor: "Professional Services Co",
    vendorEmail: "billing@proservices.ng",
    billNumber: "PROF-2024-003",
    billDate: "2024-01-05",
    dueDate: "2024-02-05",
    amount: 320000,
    outstanding: 320000,
    status: "Current",
    daysOverdue: 0,
    agingBucket: "0-30 days",
    lastPayment: null,
    paymentTerms: "Net 30",
    category: "Professional Services",
  },
]

export function PayablesTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterAging, setFilterAging] = useState("all")
  const [sortBy, setSortBy] = useState("dueDate")
  const [sortOrder, setSortOrder] = useState("asc")

  // Filter and sort payables
  const filteredAndSortedPayables = useMemo(() => {
    const filtered = samplePayables.filter((payable) => {
      const matchesSearch =
        payable.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payable.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payable.vendorEmail.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === "all" || payable.status.toLowerCase() === filterStatus.toLowerCase()
      const matchesAging = filterAging === "all" || payable.agingBucket === filterAging
      return matchesSearch && matchesStatus && matchesAging
    })

    return filtered.sort((a, b) => {
      let aValue, bValue
      switch (sortBy) {
        case "amount":
          aValue = a.amount
          bValue = b.amount
          break
        case "dueDate":
          aValue = new Date(a.dueDate)
          bValue = new Date(b.dueDate)
          break
        case "vendor":
          aValue = a.vendor.toLowerCase()
          bValue = b.vendor.toLowerCase()
          break
        case "daysOverdue":
          aValue = a.daysOverdue
          bValue = b.daysOverdue
          break
        default:
          aValue = new Date(a.dueDate)
          bValue = new Date(b.dueDate)
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }, [searchTerm, filterStatus, filterAging, sortBy, sortOrder])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "current":
        return "default"
      case "overdue":
        return "destructive"
      case "paid":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getAgingColor = (bucket: string) => {
    switch (bucket) {
      case "0-30 days":
        return "default"
      case "31-60 days":
        return "secondary"
      case "61-90 days":
        return "destructive"
      case "90+ days":
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
      setSortOrder("asc")
    }
  }

  // Calculate aging summary
  const agingSummary = {
    current: filteredAndSortedPayables
      .filter((p) => p.agingBucket === "0-30 days" && p.daysOverdue <= 0)
      .reduce((sum, p) => sum + p.outstanding, 0),
    "0-30": filteredAndSortedPayables
      .filter((p) => p.agingBucket === "0-30 days" && p.daysOverdue > 0)
      .reduce((sum, p) => sum + p.outstanding, 0),
    "31-60": filteredAndSortedPayables
      .filter((p) => p.agingBucket === "31-60 days")
      .reduce((sum, p) => sum + p.outstanding, 0),
    "61-90": filteredAndSortedPayables
      .filter((p) => p.agingBucket === "61-90 days")
      .reduce((sum, p) => sum + p.outstanding, 0),
    "90+": filteredAndSortedPayables
      .filter((p) => p.agingBucket === "90+ days")
      .reduce((sum, p) => sum + p.outstanding, 0),
  }

  const totalOutstanding = Object.values(agingSummary).reduce((sum, amount) => sum + amount, 0)

  return (
    <div className="space-y-6">
      {/* Aging Summary Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">{formatCurrency(agingSummary.current)}</div>
            <p className="text-xs text-muted-foreground">Not yet due</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">0-30 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-yellow-600">{formatCurrency(agingSummary["0-30"])}</div>
            <p className="text-xs text-muted-foreground">Recently overdue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">31-60 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-orange-600">{formatCurrency(agingSummary["31-60"])}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">61-90 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-red-600">{formatCurrency(agingSummary["61-90"])}</div>
            <p className="text-xs text-muted-foreground">Critical</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">90+ Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-red-800">{formatCurrency(agingSummary["90+"])}</div>
            <p className="text-xs text-muted-foreground">Urgent payment</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Accounts Payable</CardTitle>
              <CardDescription>Track outstanding vendor payments and manage cash flow</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Payment Report
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Record Payment
              </Button>
            </div>
          </div>

          {/* Summary Info */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Total Outstanding</div>
              <div className="text-2xl font-bold">{formatCurrency(totalOutstanding)}</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Overdue Amount</div>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(totalOutstanding - agingSummary.current)}
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Due This Week</div>
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(
                  filteredAndSortedPayables
                    .filter((p) => {
                      const dueDate = new Date(p.dueDate)
                      const today = new Date()
                      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
                      return dueDate >= today && dueDate <= weekFromNow
                    })
                    .reduce((sum, p) => sum + p.outstanding, 0),
                )}
              </div>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payables..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterAging} onValueChange={setFilterAging}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Aging" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Aging</SelectItem>
                <SelectItem value="0-30 days">0-30 Days</SelectItem>
                <SelectItem value="31-60 days">31-60 Days</SelectItem>
                <SelectItem value="61-90 days">61-90 Days</SelectItem>
                <SelectItem value="90+ days">90+ Days</SelectItem>
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
                    <Button variant="ghost" onClick={() => toggleSort("vendor")} className="h-auto p-0 font-semibold">
                      Vendor
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Bill</TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => toggleSort("dueDate")} className="h-auto p-0 font-semibold">
                      Due Date
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => toggleSort("amount")} className="h-auto p-0 font-semibold">
                      Amount
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => toggleSort("daysOverdue")}
                      className="h-auto p-0 font-semibold"
                    >
                      Days Overdue
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedPayables.map((payable) => (
                  <TableRow key={payable.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payable.vendor}</div>
                        <div className="text-sm text-muted-foreground">{payable.vendorEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payable.billNumber}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(payable.billDate).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {payable.daysOverdue > 0 && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        {payable.daysOverdue === 0 && <Clock className="h-4 w-4 text-yellow-500" />}
                        {new Date(payable.dueDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">{formatCurrency(payable.outstanding)}</TableCell>
                    <TableCell>
                      <span className={payable.daysOverdue > 0 ? "text-red-600 font-medium" : "text-muted-foreground"}>
                        {payable.daysOverdue > 0 ? `${payable.daysOverdue} days` : "Current"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{payable.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(payable.status)}>{payable.status}</Badge>
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
                            View Bill
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Make Payment
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
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
    </div>
  )
}
