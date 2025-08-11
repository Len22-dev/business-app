"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Download, Eye, FileText } from "lucide-react"

const receiptDocuments = [
  {
    id: "1",
    name: "Receipt_RCP-001.jpg",
    receiptNumber: "RCP-001",
    vendor: "Office Supplies Co",
    amount: "₦45,000",
    date: "2024-01-15",
    category: "Office Supplies",
  },
  {
    id: "2",
    name: "Receipt_RCP-002.pdf",
    receiptNumber: "RCP-002",
    vendor: "Tech Equipment Ltd",
    amount: "₦125,000",
    date: "2024-01-14",
    category: "Equipment",
  },
  {
    id: "3",
    name: "Receipt_RCP-003.jpg",
    receiptNumber: "RCP-003",
    vendor: "Fuel Station",
    amount: "₦15,000",
    date: "2024-01-12",
    category: "Transportation",
  },
]

export function ReceiptDocumentsTab() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Receipt Documents</CardTitle>
          <CardDescription>Manage all receipt and expense documents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search receipt documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Receipt #</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receiptDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{doc.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{doc.receiptNumber}</TableCell>
                  <TableCell>{doc.vendor}</TableCell>
                  <TableCell>{doc.amount}</TableCell>
                  <TableCell>{doc.category}</TableCell>
                  <TableCell>{doc.date}</TableCell>
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
