"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react"
import type { DateRange } from "react-day-picker"

const financialReports = [
  {
    id: "1",
    name: "Profit & Loss Statement",
    description: "Comprehensive income statement showing revenue and expenses",
    type: "P&L",
    period: "Monthly",
    lastGenerated: "2024-01-15",
    status: "Ready",
  },
  {
    id: "2",
    name: "Balance Sheet",
    description: "Statement of financial position showing assets and liabilities",
    type: "Balance Sheet",
    period: "Quarterly",
    lastGenerated: "2024-01-10",
    status: "Ready",
  },
  {
    id: "3",
    name: "Cash Flow Statement",
    description: "Analysis of cash inflows and outflows",
    type: "Cash Flow",
    period: "Monthly",
    lastGenerated: "2024-01-12",
    status: "Processing",
  },
  {
    id: "4",
    name: "Budget vs Actual",
    description: "Comparison of budgeted vs actual financial performance",
    type: "Budget Analysis",
    period: "Monthly",
    lastGenerated: "2024-01-08",
    status: "Ready",
  },
]

const financialMetrics = [
  {
    title: "Total Revenue",
    value: "₦2,450,000",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Net Profit",
    value: "₦485,000",
    change: "+8.2%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "Operating Expenses",
    value: "₦1,965,000",
    change: "-3.1%",
    trend: "down",
    icon: TrendingDown,
  },
  {
    title: "Profit Margin",
    value: "19.8%",
    change: "+2.1%",
    trend: "up",
    icon: PieChart,
  },
]

export function FinancialReportsTab() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [reportType, setReportType] = useState("")
  const [period, setPeriod] = useState("")

  return (
    <div className="space-y-6">
      {/* Financial Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {financialMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className={`text-xs ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {metric.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Financial Report</CardTitle>
          <CardDescription>Create custom financial reports for specific periods and criteria</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="report-type">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="profit-loss">Profit & Loss</SelectItem>
                  <SelectItem value="balance-sheet">Balance Sheet</SelectItem>
                  <SelectItem value="cash-flow">Cash Flow</SelectItem>
                  <SelectItem value="budget-analysis">Budget Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="period">Period</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date Range</Label>
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
          <CardTitle>Available Financial Reports</CardTitle>
          <CardDescription>View and download previously generated financial reports</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Last Generated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financialReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{report.name}</div>
                      <div className="text-sm text-muted-foreground">{report.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>{report.type}</TableCell>
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
