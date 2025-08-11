"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, TrendingUp, Users, ShoppingCart, Target } from "lucide-react"
import type { DateRange } from "react-day-picker"

const salesMetrics = [
  {
    title: "Total Sales",
    value: "₦1,850,000",
    change: "+15.3%",
    icon: TrendingUp,
  },
  {
    title: "New Customers",
    value: "142",
    change: "+8.7%",
    icon: Users,
  },
  {
    title: "Orders",
    value: "1,234",
    change: "+12.1%",
    icon: ShoppingCart,
  },
  {
    title: "Conversion Rate",
    value: "3.2%",
    change: "+0.5%",
    icon: Target,
  },
]

const salesReports = [
  {
    id: "1",
    name: "Sales Performance Report",
    description: "Detailed analysis of sales performance by product and region",
    period: "Monthly",
    lastGenerated: "2024-01-15",
    status: "Ready",
  },
  {
    id: "2",
    name: "Customer Analysis Report",
    description: "Customer behavior and purchasing patterns analysis",
    period: "Quarterly",
    lastGenerated: "2024-01-10",
    status: "Ready",
  },
  {
    id: "3",
    name: "Product Sales Report",
    description: "Sales performance by individual products and categories",
    period: "Monthly",
    lastGenerated: "2024-01-12",
    status: "Processing",
  },
  {
    id: "4",
    name: "Sales Forecast Report",
    description: "Predictive analysis of future sales trends",
    period: "Quarterly",
    lastGenerated: "2024-01-08",
    status: "Ready",
  },
]

export function SalesReportsTab() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [reportType, setReportType] = useState("")
  const [period, setPeriod] = useState("")

  return (
    <div className="space-y-6">
      {/* Sales Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {salesMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-green-600">{metric.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Sales Report</CardTitle>
          <CardDescription>Create detailed sales reports with custom filters and date ranges</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales-performance">Sales Performance</SelectItem>
                  <SelectItem value="customer-analysis">Customer Analysis</SelectItem>
                  <SelectItem value="product-sales">Product Sales</SelectItem>
                  <SelectItem value="sales-forecast">Sales Forecast</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
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
          <CardTitle>Available Sales Reports</CardTitle>
          <CardDescription>View and download previously generated sales reports</CardDescription>
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
              {salesReports.map((report) => (
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
