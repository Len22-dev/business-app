"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle, AlertTriangle, Search, Filter, ArrowUpDown, Eye, Plus } from "lucide-react"

// Sample reconciliation data
const sampleReconciliationItems = [
  {
    id: "REC-001",
    date: "2024-01-15",
    description: "Payment from Dangote Group",
    bookAmount: 2500000,
    bankAmount: 2500000,
    difference: 0,
    status: "Matched",
    type: "Credit",
    reference: "TRF/240115/001",
    account: "First Bank - ****1234",
    reconciled: true,
  },
  {
    id: "REC-002",
    date: "2024-01-14",
    description: "Office Rent Payment",
    bookAmount: 500000,
    bankAmount: 500000,
    difference: 0,
    status: "Matched",
    type: "Debit",
    reference: "CHQ/240114/002",
    account: "First Bank - ****1234",
    reconciled: true,
  },
  {
    id: "REC-003",
    date: "2024-01-13",
    description: "Salary Payment - January",
    bookAmount: 1200000,
    bankAmount: 1200000,
    difference: 0,
    status: "Matched",
    type: "Debit",
    reference: "SAL/240113/003",
    account: "GTBank - ****5678",
    reconciled: false,
  },
  {
    id: "REC-004",
    date: "2024-01-12",
    description: "Equipment Purchase",
    bookAmount: 750000,
    bankAmount: 725000,
    difference: 25000,
    status: "Discrepancy",
    type: "Debit",
    reference: "PUR/240112/004",
    account: "Access Bank - ****9012",
    reconciled: false,
  },
  {
    id: "REC-005",
    date: "2024-01-11",
    description: "Service Revenue - TechHub",
    bookAmount: 850000,
    bankAmount: null,
    difference: 850000,
    status: "Missing in Bank",
    type: "Credit",
    reference: "TRF/240111/005",
    account: "First Bank - ****1234",
    reconciled: false,
  },
  {
    id: "REC-006",
    date: "2024-01-10",
    description: "Bank Charges",
    bookAmount: null,
    bankAmount: 5000,
    difference: -5000,
    status: "Missing in Books",
    type: "Debit",
    reference: "CHG/240110/006",
    account: "First Bank - ****1234",
    reconciled: false,
  },
]

export function ReconciliationTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterAccount, setFilterAccount] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  // Filter and sort reconciliation items
  const filteredAndSortedItems = useMemo(() => {
    const filtered = sampleReconciliationItems.filter((item) => {
      const matchesSearch =
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reference.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === "all" || item.status.toLowerCase().includes(filterStatus.toLowerCase())
      const matchesAccount = filterAccount === "all" || item.account.includes(filterAccount)
      return matchesSearch && matchesStatus && matchesAccount
    })

    return filtered.sort((a, b) => {
      let aValue, bValue
      switch (sortBy) {
        case "difference":
          aValue = Math.abs(a.difference)
          bValue = Math.abs(b.difference)
          break
        case "date":
          aValue = new Date(a.date)
          bValue = new Date(b.date)
          break
        case "description":
          aValue = a.description.toLowerCase()
          bValue = b.description.toLowerCase()
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
  }, [searchTerm, filterStatus, filterAccount, sortBy, sortOrder])

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "—"
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "matched":
        return "default"
      case "discrepancy":
        return "destructive"
      case "missing in bank":
        return "secondary"
      case "missing in books":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "matched":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "discrepancy":
      case "missing in bank":
      case "missing in books":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      default:
        return null
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

  const handleSelectItem = (itemId: string) => {
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const handleSelectAll = () => {
    if (selectedItems.length === filteredAndSortedItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredAndSortedItems.map((item) => item.id))
    }
  }

  const matchedItems = filteredAndSortedItems.filter((item) => item.status === "Matched").length
  const discrepancyItems = filteredAndSortedItems.filter((item) => item.status === "Discrepancy").length
  const missingItems = filteredAndSortedItems.filter(
    (item) => item.status === "Missing in Bank" || item.status === "Missing in Books",
  ).length
  const totalDifference = filteredAndSortedItems.reduce((sum, item) => sum + Math.abs(item.difference), 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Bank Reconciliation</CardTitle>
            <CardDescription>Match your book records with bank statements</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              New Reconciliation
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" disabled={selectedItems.length === 0}>
              Mark as Reconciled ({selectedItems.length})
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div className="text-sm text-muted-foreground">Matched</div>
            </div>
            <div className="text-2xl font-bold text-green-600">{matchedItems}</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <div className="text-sm text-muted-foreground">Discrepancies</div>
            </div>
            <div className="text-2xl font-bold text-red-600">{discrepancyItems}</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <div className="text-sm text-muted-foreground">Missing Items</div>
            </div>
            <div className="text-2xl font-bold text-orange-600">{missingItems}</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground">Total Difference</div>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalDifference)}</div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reconciliation items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[160px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="matched">Matched</SelectItem>
              <SelectItem value="discrepancy">Discrepancy</SelectItem>
              <SelectItem value="missing">Missing Items</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterAccount} onValueChange={setFilterAccount}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Account" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              <SelectItem value="First Bank">First Bank</SelectItem>
              <SelectItem value="GTBank">GTBank</SelectItem>
              <SelectItem value="Access Bank">Access Bank</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedItems.length === filteredAndSortedItems.length && filteredAndSortedItems.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => toggleSort("date")} className="h-auto p-0 font-semibold">
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("description")}
                    className="h-auto p-0 font-semibold"
                  >
                    Description
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Book Amount</TableHead>
                <TableHead>Bank Amount</TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => toggleSort("difference")} className="h-auto p-0 font-semibold">
                    Difference
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => handleSelectItem(item.id)}
                    />
                  </TableCell>
                  <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.reference} • {item.account}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className={item.type === "Credit" ? "text-green-600" : "text-red-600"}>
                    {formatCurrency(item.bookAmount)}
                  </TableCell>
                  <TableCell className={item.type === "Credit" ? "text-green-600" : "text-red-600"}>
                    {formatCurrency(item.bankAmount)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${item.difference !== 0 ? "text-red-600" : "text-green-600"}`}>
                        {formatCurrency(item.difference)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      <Badge variant={getStatusColor(item.status)}>{item.status}</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
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
