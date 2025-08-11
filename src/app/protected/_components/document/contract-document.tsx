"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Eye, FileText } from "lucide-react"

const contractDocuments = [
  {
    id: "1",
    name: "Supplier_Contract_SC-001.pdf",
    contractNumber: "SC-001",
    party: "ABC Suppliers Ltd",
    type: "Supplier Agreement",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    status: "Active",
  },
  {
    id: "2",
    name: "Employment_Contract_EC-002.pdf",
    contractNumber: "EC-002",
    party: "John Doe",
    type: "Employment Contract",
    startDate: "2024-01-15",
    endDate: "2025-01-14",
    status: "Active",
  },
  {
    id: "3",
    name: "Service_Agreement_SA-003.pdf",
    contractNumber: "SA-003",
    party: "Tech Services Inc",
    type: "Service Agreement",
    startDate: "2023-12-01",
    endDate: "2024-01-31",
    status: "Expiring Soon",
  },
]

export function ContractDocumentsTab() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contract Documents</CardTitle>
          <CardDescription>Manage all contracts and legal agreements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contract documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Contract #</TableHead>
                <TableHead>Party</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contractDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{doc.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{doc.contractNumber}</TableCell>
                  <TableCell>{doc.party}</TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>{doc.startDate}</TableCell>
                  <TableCell>{doc.endDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        doc.status === "Active"
                          ? "default"
                          : doc.status === "Expiring Soon"
                            ? "destructive"
                            : "secondary"
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
