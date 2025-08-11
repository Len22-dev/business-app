"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, Package, AlertTriangle, TrendingDown, BarChart3 } from "lucide-react"
import type { DateRange } from "react-day-picker"

const inventoryMetrics = [
  {
    title: "Total Products",
    value: "1,247",
    change: "+23",
    icon: Package,
  },
  {
    title: "Low Stock Items",
    value: "18",
    change: "-5",
    icon: AlertTriangle,
  },
  {
    title: "Out of Stock",
    value: "3",
    change: "-2",
    icon: TrendingDown,
  },
  {
    title: "Inventory Value",
    value: "₦3,450,000",
    change: "+8.5%",
    icon: BarChart3,
  },
]

const inventoryReports = [
  {
    id: "1",
    name: "Stock Level Report",
    description: "Current stock levels and reorder points for all products",
    period: "Real-time",
    lastGenerated: "2024-01-15",
    status: "Ready",
  },
  {
    id: "2",
    name: "Inventory Valuation Report",
    description: "Financial valuation of current inventory holdings",
    period: "Monthly",
    lastGenerated: "2024-01-10",
    status: "Ready",
  },
  {
    id: "3",
    name: "Stock Movement Report",
    description: "Analysis of inventory movements and turnover rates",
    period: "Monthly",
    lastGenerated: "2024-01-12",
    status: "Processing",
  },
  {
    id: "4",
    name: "ABC Analysis Report",
    description: "Product categorization based on value and movement",
    period: "Quarterly",
    lastGenerated: "2024-01-08",
    status: "Ready",
  },
]

export function InventoryReportsTab() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [reportType, setReportType] = useState("")
  const [period, setPeriod] = useState("")

  return (
    <div className="space-y-6">
      {/* Inventory Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {inventoryMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">{metric.change} from last update</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Inventory Report</CardTitle>
          <CardDescription>Create comprehensive inventory reports with detailed analytics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stock-level">Stock Level Report</SelectItem>
                  <SelectItem value="inventory-valuation">Inventory Valuation</SelectItem>
                  <SelectItem value="stock-movement">Stock Movement</SelectItem>
                  <SelectItem value="abc-analysis">ABC Analysis</SelectItem>
                  <SelectItem value="reorder-report">Reorder Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="real-time">Real-time</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            </div>
          </div>
          <Button className="w-full md:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </CardContent>
      </Card>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Available Inventory Reports</CardTitle>
          <CardDescription>View and download previously generated inventory reports</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Last Generated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{report.name}</div>
                      <div className="text-sm text-muted-foreground">{report.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>{report.period}</TableCell>
                  <TableCell>{report.lastGenerated}</TableCell>
                  <TableCell>
                    <Badge variant={report.status === "Ready" ? "default" : "secondary"}>{report.status}</Badge>
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
