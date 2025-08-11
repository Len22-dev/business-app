"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, Plus, Edit, Trash2 } from "lucide-react"

const customReports = [
  {
    id: "1",
    name: "Monthly Sales by Region",
    description: "Custom report showing sales performance across different regions",
    dataSource: "Sales",
    lastRun: "2024-01-15",
    status: "Active",
  },
  {
    id: "2",
    name: "Top Performing Products",
    description: "Analysis of best-selling products with profit margins",
    dataSource: "Inventory & Sales",
    lastRun: "2024-01-12",
    status: "Active",
  },
  {
    id: "3",
    name: "Customer Payment Patterns",
    description: "Custom analysis of customer payment behaviors",
    dataSource: "Accounting",
    lastRun: "2024-01-10",
    status: "Draft",
  },
]

export function CustomReportsTab() {
  const [reportName, setReportName] = useState("")
  const [description, setDescription] = useState("")
  const [dataSource, setDataSource] = useState("")
  const [selectedFields, setSelectedFields] = useState<string[]>([])

  const availableFields = [
    "Customer Name",
    "Product Name",
    "Sales Amount",
    "Date",
    "Region",
    "Category",
    "Profit Margin",
    "Quantity Sold",
    "Payment Status",
    "Vendor Name",
  ]

  const handleFieldChange = (field: string, checked: boolean) => {
    if (checked) {
      setSelectedFields([...selectedFields, field])
    } else {
      setSelectedFields(selectedFields.filter((f) => f !== field))
    }
  }

  return (
    <div className="space-y-6">
      {/* Create Custom Report */}
      <Card>
        <CardHeader>
          <CardTitle>Create Custom Report</CardTitle>
          <CardDescription>Build your own reports with custom data sources and fields</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="report-name">Report Name</Label>
              <Input
                id="report-name"
                placeholder="Enter report name"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data-source">Data Source</Label>
              <Select value={dataSource} onValueChange={setDataSource}>
                <SelectTrigger>
                  <SelectValue placeholder="Select data source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="inventory">Inventory</SelectItem>
                  <SelectItem value="accounting">Accounting</SelectItem>
                  <SelectItem value="expenses">Expenses</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="banking">Banking</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what this report will show"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Select Fields to Include</Label>
            <div className="grid gap-2 md:grid-cols-3">
              {availableFields.map((field) => (
                <div key={field} className="flex items-center space-x-2">
                  <Checkbox
                    id={field}
                    checked={selectedFields.includes(field)}
                    onCheckedChange={(checked) => handleFieldChange(field, checked as boolean)}
                  />
                  <Label htmlFor={field} className="text-sm">
                    {field}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Report
            </Button>
            <Button variant="outline">Save as Draft</Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing Custom Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Your Custom Reports</CardTitle>
          <CardDescription>Manage and run your custom reports</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Data Source</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{report.name}</div>
                      <div className="text-sm text-muted-foreground">{report.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>{report.dataSource}</TableCell>
                  <TableCell>{report.lastRun}</TableCell>
                  <TableCell>
                    <Badge variant={report.status === "Active" ? "default" : "secondary"}>{report.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
