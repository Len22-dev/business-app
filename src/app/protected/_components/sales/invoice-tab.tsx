"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, Filter, ArrowUpDown, Eye, Edit, MoreHorizontal, Download, Send, Copy } from "lucide-react"
import { CreateInvoiceModal } from "./modal/create-invoice-form"
import { ViewInvoiceModal } from "./modal/view-invoice-form"
import { EditInvoiceModal } from "./modal/edit-invoice-form"

interface Invoice {
  id: string
  invoiceNumber: string
  customer: string
  customerEmail: string
  date: string
  dueDate: string
  amount: number
  status: string
  items: { description: string; quantity: number; rate: number; amount: number }[]
}

// Sample invoice data
const sampleInvoices = [
  {
    id: "INV-001",
    invoiceNumber: "INV-2024-001",
    customer: "Dangote Group",
    customerEmail: "accounts@dangote.com",
    date: "2024-01-15",
    dueDate: "2024-02-15",
    amount: 2500000,
    status: "Paid",
    items: [{ description: "Consulting Services", quantity: 1, rate: 2500000, amount: 2500000 }],
  },
  {
    id: "INV-002",
    invoiceNumber: "INV-2024-002",
    customer: "TechHub Nigeria",
    customerEmail: "billing@techhub.ng",
    date: "2024-01-14",
    dueDate: "2024-02-14",
    amount: 750000,
    status: "Pending",
    items: [{ description: "Software Development", quantity: 1, rate: 750000, amount: 750000 }],
  },
  {
    id: "INV-003",
    invoiceNumber: "INV-2024-003",
    customer: "StartUp Inc",
    customerEmail: "finance@startup.com",
    date: "2024-01-13",
    dueDate: "2024-02-13",
    amount: 300000,
    status: "Overdue",
    items: [{ description: "Marketing Services", quantity: 1, rate: 300000, amount: 300000 }],
  },
  {
    id: "INV-004",
    invoiceNumber: "INV-2024-004",
    customer: "Lagos Property Ltd",
    customerEmail: "accounts@lagosprop.com",
    date: "2024-01-12",
    dueDate: "2024-02-12",
    amount: 1200000,
    status: "Draft",
    items: [{ description: "Property Management", quantity: 1, rate: 1200000, amount: 1200000 }],
  },
  {
    id: "INV-005",
    invoiceNumber: "INV-2024-005",
    customer: "Global Supplies Ltd",
    customerEmail: "billing@globalsupplies.ng",
    date: "2024-01-11",
    dueDate: "2024-02-11",
    amount: 850000,
    status: "Sent",
    items: [{ description: "Supply Chain Consulting", quantity: 1, rate: 850000, amount: 850000 }],
  },
]

export function InvoicesTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  // Filter and sort invoices
  const filteredAndSortedInvoices = useMemo(() => {
    const filtered = sampleInvoices.filter((invoice) => {
      const matchesSearch =
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterStatus === "all" || invoice.status.toLowerCase() === filterStatus.toLowerCase()
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
        case "dueDate":
          aValue = new Date(a.dueDate)
          bValue = new Date(b.dueDate)
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
      case "paid":
        return "default"
      case "pending":
        return "secondary"
      case "overdue":
        return "destructive"
      case "draft":
        return "outline"
      case "sent":
        return "secondary"
      default:
        return "outline"
    }
  }

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsViewModalOpen(true)
  }

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsEditModalOpen(true)
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
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>Create, manage, and track your invoices</CardDescription>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
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
                      onClick={() => toggleSort("invoiceNumber")}
                      className="h-auto p-0 font-semibold"
                    >
                      Invoice #
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
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{invoice.customer}</div>
                        <div className="text-sm text-muted-foreground">{invoice.customerEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(invoice.amount)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(invoice.status)}>{invoice.status}</Badge>
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
                          <DropdownMenuItem onClick={() => handleViewInvoice(invoice)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditInvoice(invoice)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Send className="mr-2 h-4 w-4" />
                            Send
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

      {/* Modals */}
      <CreateInvoiceModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />

      <ViewInvoiceModal open={isViewModalOpen} onOpenChange={setIsViewModalOpen} invoice={selectedInvoice} />

      <EditInvoiceModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} invoice={selectedInvoice} />
    </>
  )
}
