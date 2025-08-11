"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Upload, Search, Download, Eye, Trash2, FileText, File, ImageIcon } from "lucide-react"
import { UploadDocumentModal } from "./modal/upload-document-form"

const documents = [
  {
    id: "1",
    name: "Invoice_INV-001.pdf",
    type: "Invoice",
    size: "245 KB",
    uploadedBy: "John Doe",
    uploadedAt: "2024-01-15",
    category: "Financial",
    status: "Active",
  },
  {
    id: "2",
    name: "Purchase_Receipt_PR-123.jpg",
    type: "Receipt",
    size: "1.2 MB",
    uploadedBy: "Jane Smith",
    uploadedAt: "2024-01-14",
    category: "Purchase",
    status: "Active",
  },
  {
    id: "3",
    name: "Supplier_Contract_SC-456.pdf",
    type: "Contract",
    size: "890 KB",
    uploadedBy: "Mike Johnson",
    uploadedAt: "2024-01-12",
    category: "Legal",
    status: "Active",
  },
  {
    id: "4",
    name: "Bank_Statement_Jan2024.pdf",
    type: "Statement",
    size: "567 KB",
    uploadedBy: "Sarah Wilson",
    uploadedAt: "2024-01-10",
    category: "Banking",
    status: "Active",
  },
  {
    id: "5",
    name: "Tax_Document_2023.pdf",
    type: "Tax Document",
    size: "1.5 MB",
    uploadedBy: "John Doe",
    uploadedAt: "2024-01-08",
    category: "Tax",
    status: "Archived",
  },
]

const documentStats = [
  { title: "Total Documents", value: "1,247", icon: FileText },
  { title: "This Month", value: "89", icon: File },
  { title: "Storage Used", value: "2.4 GB", icon: ImageIcon },
  { title: "Categories", value: "12", icon: FileText },
]

export function AllDocumentsTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [showUploadModal, setShowUploadModal] = useState(false)

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "invoice":
      case "receipt":
      case "contract":
        return FileText
      default:
        return File
    }
  }

  return (
    <div className="space-y-6">
      {/* Document Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {documentStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Document Management</CardTitle>
          <CardDescription>Upload, organize, and manage all your business documents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Button onClick={() => setShowUploadModal(true)} className="md:w-auto">
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="invoice">Invoice</SelectItem>
                  <SelectItem value="receipt">Receipt</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="statement">Statement</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="banking">Banking</SelectItem>
                  <SelectItem value="tax">Tax</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Documents</CardTitle>
          <CardDescription>Complete list of uploaded documents</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => {
                const FileIcon = getFileIcon(doc.type)
                return (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{doc.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell>{doc.category}</TableCell>
                    <TableCell>{doc.size}</TableCell>
                    <TableCell>{doc.uploadedBy}</TableCell>
                    <TableCell>{doc.uploadedAt}</TableCell>
                    <TableCell>
                      <Badge variant={doc.status === "Active" ? "default" : "secondary"}>{doc.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <UploadDocumentModal open={showUploadModal} onOpenChange={setShowUploadModal} />
    </div>
  )
}
