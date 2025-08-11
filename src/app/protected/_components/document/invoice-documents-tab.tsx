"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Eye, FileText } from "lucide-react"

const invoiceDocuments = [
  {
    id: "1",
    name: "Invoice_INV-001.pdf",
    invoiceNumber: "INV-001",
    customer: "Acme Corp",
    amount: "₦150,000",
    date: "2024-01-15",
    status: "Paid",
  },
  {
    id: "2",
    name: "Invoice_INV-002.pdf",
    invoiceNumber: "INV-002",
    customer: "Tech Solutions Ltd",
    amount: "₦275,000",
    date: "2024-01-14",
    status: "Pending",
  },
  {
    id: "3",
    name: "Invoice_INV-003.pdf",
    invoiceNumber: "INV-003",
    customer: "Global Enterprises",
    amount: "₦320,000",
    date: "2024-01-12",
    status: "Overdue",
  },
]

export function InvoiceDocumentsTab() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invoice Documents</CardTitle>
          <CardDescription>Manage all invoice-related documents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoice documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{doc.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{doc.invoiceNumber}</TableCell>
                  <TableCell>{doc.customer}</TableCell>
                  <TableCell>{doc.amount}</TableCell>
                  <TableCell>{doc.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        doc.status === "Paid" ? "default" : doc.status === "Pending" ? "secondary" : "destructive"
                      }
                    >
                      {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
