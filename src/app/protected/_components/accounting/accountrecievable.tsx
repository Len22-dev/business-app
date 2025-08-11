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
  Mail,
  Phone,
  MoreHorizontal,
  Download,
  AlertTriangle,
  Clock,
} from "lucide-react"

// Sample receivables data
const sampleReceivables = [
  {
    id: "REC-001",
    customer: "Dangote Group",
    customerEmail: "accounts@dangote.com",
    invoiceNumber: "INV-2024-001",
    invoiceDate: "2024-01-15",
    dueDate: "2024-02-15",
    amount: 2500000,
    outstanding: 2500000,
    status: "Current",
    daysOverdue: 0,
    agingBucket: "0-30 days",
    lastPayment: null,
    paymentTerms: "Net 30",
  },
  {
    id: "REC-002",
    customer: "TechHub Nigeria",
    customerEmail: "billing@techhub.ng",
    invoiceNumber: "INV-2024-002",
    invoiceDate: "2024-01-14",
    dueDate: "2024-02-14",
    amount: 750000,
    outstanding: 750000,
    status: "Current",
    daysOverdue: 1,
    agingBucket: "0-30 days",
    lastPayment: null,
    paymentTerms: "Net 30",
  },
  {
    id: "REC-003",
    customer: "StartUp Inc",
    customerEmail: "finance@startup.com",
    invoiceNumber: "INV-2024-003",
    invoiceDate: "2024-01-13",
    dueDate: "2024-02-13",
    amount: 300000,
    outstanding: 300000,
    status: "Overdue",
    daysOverdue: 5,
    agingBucket: "0-30 days",
    lastPayment: null,
    paymentTerms: "Net 30",
  },
  {
    id: "REC-004",
    customer: "Lagos Property Ltd",
    customerEmail: "accounts@lagosprop.com",
    invoiceNumber: "INV-2023-045",
    invoiceDate: "2023-11-15",
    dueDate: "2023-12-15",
    amount: 1200000,
    outstanding: 1200000,
    status: "Overdue",
    daysOverdue: 45,
    agingBucket: "31-60 days",
    lastPayment: null,
    paymentTerms: "Net 30",
  },
  {
    id: "REC-005",
    customer: "Global Supplies Ltd",
    customerEmail: "billing@globalsupplies.ng",
    invoiceNumber: "INV-2023-038",
    invoiceDate: "2023-10-20",
    dueDate: "2023-11-20",
    amount: 850000,
    outstanding: 850000,
    status: "Overdue",
    daysOverdue: 75,
    agingBucket: "61-90 days",
    lastPayment: null,
    paymentTerms: "Net 30",
  },
  {
    id: "REC-006",
    customer: "Enterprise Solutions",
    customerEmail: "procurement@enterprise.ng",
    invoiceNumber: "INV-2023-025",
    invoiceDate: "2023-09-10",
    dueDate: "2023-10-10",
    amount: 1500000,
    outstanding: 1500000,
    status: "Overdue",
    daysOverdue: 120,
    agingBucket: "90+ days",
    lastPayment: null,
    paymentTerms: "Net 30",
  },
]

export function ReceivablesTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterAging, setFilterAging] = useState("all")
  const [sortBy, setSortBy] = useState("dueDate")
  const [sortOrder, setSortOrder] = useState("asc")

  // Filter and sort receivables
  const filteredAndSortedReceivables = useMemo(() => {
    const filtered = sampleReceivables.filter((receivable) => {
      const matchesSearch =
        receivable.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receivable.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receivable.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === "all" || receivable.status.toLowerCase() === filterStatus.toLowerCase()
      const matchesAging = filterAging === "all" || receivable.agingBucket === filterAging
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
        case "customer":
          aValue = a.customer.toLowerCase()
          bValue = b.customer.toLowerCase()
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
    current: filteredAndSortedReceivables
      .filter((r) => r.agingBucket === "0-30 days" && r.daysOverdue <= 0)
      .reduce((sum, r) => sum + r.outstanding, 0),
    "0-30": filteredAndSortedReceivables
      .filter((r) => r.agingBucket === "0-30 days" && r.daysOverdue > 0)
      .reduce((sum, r) => sum + r.outstanding, 0),
    "31-60": filteredAndSortedReceivables
      .filter((r) => r.agingBucket === "31-60 days")
      .reduce((sum, r) => sum + r.outstanding, 0),
    "61-90": filteredAndSortedReceivables
      .filter((r) => r.agingBucket === "61-90 days")
      .reduce((sum, r) => sum + r.outstanding, 0),
    "90+": filteredAndSortedReceivables
      .filter((r) => r.agingBucket === "90+ days")
      .reduce((sum, r) => sum + r.outstanding, 0),
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
            <p className="text-xs text-muted-foreground">Collection risk</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Accounts Receivable</CardTitle>
              <CardDescription>Track outstanding customer payments and aging</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Aging Report
              </Button>
              <Button variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Send Reminders
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
              <div className="text-sm text-muted-foreground">Average Days Outstanding</div>
              <div className="text-2xl font-bold">32</div>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search receivables..."
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
                    <Button variant="ghost" onClick={() => toggleSort("customer")} className="h-auto p-0 font-semibold">
                      Customer
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Invoice</TableHead>
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
                  <TableHead>Aging</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedReceivables.map((receivable) => (
                  <TableRow key={receivable.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{receivable.customer}</div>
                        <div className="text-sm text-muted-foreground">{receivable.customerEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{receivable.invoiceNumber}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(receivable.invoiceDate).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {receivable.daysOverdue > 0 && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        {receivable.daysOverdue === 0 && <Clock className="h-4 w-4 text-yellow-500" />}
                        {new Date(receivable.dueDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">{formatCurrency(receivable.outstanding)}</TableCell>
                    <TableCell>
                      <span
                        className={receivable.daysOverdue > 0 ? "text-red-600 font-medium" : "text-muted-foreground"}
                      >
                        {receivable.daysOverdue > 0 ? `${receivable.daysOverdue} days` : "Current"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getAgingColor(receivable.agingBucket)}>{receivable.agingBucket}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(receivable.status)}>{receivable.status}</Badge>
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
                            View Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Reminder
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            Call Customer
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
