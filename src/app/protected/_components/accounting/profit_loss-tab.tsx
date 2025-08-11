"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, TrendingUp, TrendingDown, Calendar } from "lucide-react"

// Sample P&L data
const profitLossData = {
  currentPeriod: "January 2024",
  previousPeriod: "December 2023",
  revenue: {
    salesRevenue: { current: 25000000, previous: 22000000 },
    serviceRevenue: { current: 3750000, previous: 3200000 },
    otherIncome: { current: 0, previous: 150000 },
    total: { current: 28750000, previous: 25350000 },
  },
  costOfSales: {
    directMaterials: { current: 8500000, previous: 7800000 },
    directLabor: { current: 2250000, previous: 2100000 },
    total: { current: 10750000, previous: 9900000 },
  },
  operatingExpenses: {
    salariesAndWages: { current: 4200000, previous: 4000000 },
    rentAndUtilities: { current: 1500000, previous: 1500000 },
    marketingAndAdvertising: { current: 800000, previous: 650000 },
    professionalServices: { current: 450000, previous: 400000 },
    officeExpenses: { current: 300000, previous: 280000 },
    depreciation: { current: 500000, previous: 500000 },
    other: { current: 0, previous: 120000 },
    total: { current: 7750000, previous: 7450000 },
  },
}

export function ProfitLossTab() {
  const [selectedPeriod, setSelectedPeriod] = useState("current-month")
  const [comparisonPeriod, setComparisonPeriod] = useState("previous-month")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    return null
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600"
    if (change < 0) return "text-red-600"
    return "text-muted-foreground"
  }

  // Calculate totals
  const grossProfit = {
    current: profitLossData.revenue.total.current - profitLossData.costOfSales.total.current,
    previous: profitLossData.revenue.total.previous - profitLossData.costOfSales.total.previous,
  }

  const operatingIncome = {
    current: grossProfit.current - profitLossData.operatingExpenses.total.current,
    previous: grossProfit.previous - profitLossData.operatingExpenses.total.previous,
  }

  const netIncome = operatingIncome // Simplified for this example

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Profit & Loss Statement</CardTitle>
              <CardDescription>Financial performance analysis and period comparison</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Change Period
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>

          {/* Period Selection */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Period:</span>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-month">Current Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="current-quarter">Current Quarter</SelectItem>
                  <SelectItem value="current-year">Current Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Compare with:</span>
              <Select value={comparisonPeriod} onValueChange={setComparisonPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="previous-month">Previous Month</SelectItem>
                  <SelectItem value="same-month-last-year">Same Month Last Year</SelectItem>
                  <SelectItem value="previous-quarter">Previous Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Account</TableHead>
                  <TableHead className="text-right">{profitLossData.currentPeriod}</TableHead>
                  <TableHead className="text-right">{profitLossData.previousPeriod}</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                  <TableHead className="text-right">% Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Revenue Section */}
                <TableRow className="bg-muted/50">
                  <TableCell className="font-semibold">REVENUE</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Sales Revenue</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(profitLossData.revenue.salesRevenue.current)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(profitLossData.revenue.salesRevenue.previous)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(
                      profitLossData.revenue.salesRevenue.current - profitLossData.revenue.salesRevenue.previous,
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {getChangeIcon(
                        calculatePercentageChange(
                          profitLossData.revenue.salesRevenue.current,
                          profitLossData.revenue.salesRevenue.previous,
                        ),
                      )}
                      <span
                        className={getChangeColor(
                          calculatePercentageChange(
                            profitLossData.revenue.salesRevenue.current,
                            profitLossData.revenue.salesRevenue.previous,
                          ),
                        )}
                      >
                        {calculatePercentageChange(
                          profitLossData.revenue.salesRevenue.current,
                          profitLossData.revenue.salesRevenue.previous,
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Service Revenue</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(profitLossData.revenue.serviceRevenue.current)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(profitLossData.revenue.serviceRevenue.previous)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(
                      profitLossData.revenue.serviceRevenue.current - profitLossData.revenue.serviceRevenue.previous,
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {getChangeIcon(
                        calculatePercentageChange(
                          profitLossData.revenue.serviceRevenue.current,
                          profitLossData.revenue.serviceRevenue.previous,
                        ),
                      )}
                      <span
                        className={getChangeColor(
                          calculatePercentageChange(
                            profitLossData.revenue.serviceRevenue.current,
                            profitLossData.revenue.serviceRevenue.previous,
                          ),
                        )}
                      >
                        {calculatePercentageChange(
                          profitLossData.revenue.serviceRevenue.current,
                          profitLossData.revenue.serviceRevenue.previous,
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow className="border-t">
                  <TableCell className="font-semibold">Total Revenue</TableCell>
                  <TableCell className="text-right font-bold text-green-600">
                    {formatCurrency(profitLossData.revenue.total.current)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(profitLossData.revenue.total.previous)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(profitLossData.revenue.total.current - profitLossData.revenue.total.previous)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {getChangeIcon(
                        calculatePercentageChange(
                          profitLossData.revenue.total.current,
                          profitLossData.revenue.total.previous,
                        ),
                      )}
                      <span
                        className={`font-semibold ${getChangeColor(
                          calculatePercentageChange(
                            profitLossData.revenue.total.current,
                            profitLossData.revenue.total.previous,
                          ),
                        )}`}
                      >
                        {calculatePercentageChange(
                          profitLossData.revenue.total.current,
                          profitLossData.revenue.total.previous,
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </TableCell>
                </TableRow>

                {/* Cost of Sales Section */}
                <TableRow className="bg-muted/50">
                  <TableCell className="font-semibold">COST OF SALES</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Direct Materials</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(profitLossData.costOfSales.directMaterials.current)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(profitLossData.costOfSales.directMaterials.previous)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(
                      profitLossData.costOfSales.directMaterials.current -
                        profitLossData.costOfSales.directMaterials.previous,
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {getChangeIcon(
                        calculatePercentageChange(
                          profitLossData.costOfSales.directMaterials.current,
                          profitLossData.costOfSales.directMaterials.previous,
                        ),
                      )}
                      <span
                        className={getChangeColor(
                          calculatePercentageChange(
                            profitLossData.costOfSales.directMaterials.current,
                            profitLossData.costOfSales.directMaterials.previous,
                          ),
                        )}
                      >
                        {calculatePercentageChange(
                          profitLossData.costOfSales.directMaterials.current,
                          profitLossData.costOfSales.directMaterials.previous,
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Direct Labor</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(profitLossData.costOfSales.directLabor.current)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(profitLossData.costOfSales.directLabor.previous)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(
                      profitLossData.costOfSales.directLabor.current - profitLossData.costOfSales.directLabor.previous,
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {getChangeIcon(
                        calculatePercentageChange(
                          profitLossData.costOfSales.directLabor.current,
                          profitLossData.costOfSales.directLabor.previous,
                        ),
                      )}
                      <span
                        className={getChangeColor(
                          calculatePercentageChange(
                            profitLossData.costOfSales.directLabor.current,
                            profitLossData.costOfSales.directLabor.previous,
                          ),
                        )}
                      >
                        {calculatePercentageChange(
                          profitLossData.costOfSales.directLabor.current,
                          profitLossData.costOfSales.directLabor.previous,
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow className="border-t">
                  <TableCell className="font-semibold">Total Cost of Sales</TableCell>
                  <TableCell className="text-right font-bold text-red-600">
                    {formatCurrency(profitLossData.costOfSales.total.current)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(profitLossData.costOfSales.total.previous)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(
                      profitLossData.costOfSales.total.current - profitLossData.costOfSales.total.previous,
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {getChangeIcon(
                        calculatePercentageChange(
                          profitLossData.costOfSales.total.current,
                          profitLossData.costOfSales.total.previous,
                        ),
                      )}
                      <span
                        className={`font-semibold ${getChangeColor(
                          calculatePercentageChange(
                            profitLossData.costOfSales.total.current,
                            profitLossData.costOfSales.total.previous,
                          ),
                        )}`}
                      >
                        {calculatePercentageChange(
                          profitLossData.costOfSales.total.current,
                          profitLossData.costOfSales.total.previous,
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </TableCell>
                </TableRow>

                {/* Gross Profit */}
                <TableRow className="bg-green-50 border-t-2">
                  <TableCell className="font-bold">GROSS PROFIT</TableCell>
                  <TableCell className="text-right font-bold text-green-600 text-lg">
                    {formatCurrency(grossProfit.current)}
                  </TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(grossProfit.previous)}</TableCell>
                  <TableCell className="text-right font-bold">
                    {formatCurrency(grossProfit.current - grossProfit.previous)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {getChangeIcon(calculatePercentageChange(grossProfit.current, grossProfit.previous))}
                      <span
                        className={`font-bold ${getChangeColor(
                          calculatePercentageChange(grossProfit.current, grossProfit.previous),
                        )}`}
                      >
                        {calculatePercentageChange(grossProfit.current, grossProfit.previous).toFixed(1)}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>

                {/* Operating Expenses */}
                <TableRow className="bg-muted/50">
                  <TableCell className="font-semibold">OPERATING EXPENSES</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Salaries and Wages</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(profitLossData.operatingExpenses.salariesAndWages.current)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(profitLossData.operatingExpenses.salariesAndWages.previous)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(
                      profitLossData.operatingExpenses.salariesAndWages.current -
                        profitLossData.operatingExpenses.salariesAndWages.previous,
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {getChangeIcon(
                        calculatePercentageChange(
                          profitLossData.operatingExpenses.salariesAndWages.current,
                          profitLossData.operatingExpenses.salariesAndWages.previous,
                        ),
                      )}
                      <span
                        className={getChangeColor(
                          calculatePercentageChange(
                            profitLossData.operatingExpenses.salariesAndWages.current,
                            profitLossData.operatingExpenses.salariesAndWages.previous,
                          ),
                        )}
                      >
                        {calculatePercentageChange(
                          profitLossData.operatingExpenses.salariesAndWages.current,
                          profitLossData.operatingExpenses.salariesAndWages.previous,
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Rent and Utilities</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(profitLossData.operatingExpenses.rentAndUtilities.current)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(profitLossData.operatingExpenses.rentAndUtilities.previous)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(
                      profitLossData.operatingExpenses.rentAndUtilities.current -
                        profitLossData.operatingExpenses.rentAndUtilities.previous,
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {getChangeIcon(
                        calculatePercentageChange(
                          profitLossData.operatingExpenses.rentAndUtilities.current,
                          profitLossData.operatingExpenses.rentAndUtilities.previous,
                        ),
                      )}
                      <span
                        className={getChangeColor(
                          calculatePercentageChange(
                            profitLossData.operatingExpenses.rentAndUtilities.current,
                            profitLossData.operatingExpenses.rentAndUtilities.previous,
                          ),
                        )}
                      >
                        {calculatePercentageChange(
                          profitLossData.operatingExpenses.rentAndUtilities.current,
                          profitLossData.operatingExpenses.rentAndUtilities.previous,
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-6">Marketing and Advertising</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(profitLossData.operatingExpenses.marketingAndAdvertising.current)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(profitLossData.operatingExpenses.marketingAndAdvertising.previous)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(
                      profitLossData.operatingExpenses.marketingAndAdvertising.current -
                        profitLossData.operatingExpenses.marketingAndAdvertising.previous,
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {getChangeIcon(
                        calculatePercentageChange(
                          profitLossData.operatingExpenses.marketingAndAdvertising.current,
                          profitLossData.operatingExpenses.marketingAndAdvertising.previous,
                        ),
                      )}
                      <span
                        className={getChangeColor(
                          calculatePercentageChange(
                            profitLossData.operatingExpenses.marketingAndAdvertising.current,
                            profitLossData.operatingExpenses.marketingAndAdvertising.previous,
                          ),
                        )}
                      >
                        {calculatePercentageChange(
                          profitLossData.operatingExpenses.marketingAndAdvertising.current,
                          profitLossData.operatingExpenses.marketingAndAdvertising.previous,
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow className="border-t">
                  <TableCell className="font-semibold">Total Operating Expenses</TableCell>
                  <TableCell className="text-right font-bold text-red-600">
                    {formatCurrency(profitLossData.operatingExpenses.total.current)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(profitLossData.operatingExpenses.total.previous)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(
                      profitLossData.operatingExpenses.total.current - profitLossData.operatingExpenses.total.previous,
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {getChangeIcon(
                        calculatePercentageChange(
                          profitLossData.operatingExpenses.total.current,
                          profitLossData.operatingExpenses.total.previous,
                        ),
                      )}
                      <span
                        className={`font-semibold ${getChangeColor(
                          calculatePercentageChange(
                            profitLossData.operatingExpenses.total.current,
                            profitLossData.operatingExpenses.total.previous,
                          ),
                        )}`}
                      >
                        {calculatePercentageChange(
                          profitLossData.operatingExpenses.total.current,
                          profitLossData.operatingExpenses.total.previous,
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </TableCell>
                </TableRow>

                {/* Net Income */}
                <TableRow className="bg-blue-50 border-t-2">
                  <TableCell className="font-bold text-lg">NET INCOME</TableCell>
                  <TableCell className="text-right font-bold text-blue-600 text-xl">
                    {formatCurrency(netIncome.current)}
                  </TableCell>
                  <TableCell className="text-right font-bold text-lg">{formatCurrency(netIncome.previous)}</TableCell>
                  <TableCell className="text-right font-bold text-lg">
                    {formatCurrency(netIncome.current - netIncome.previous)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {getChangeIcon(calculatePercentageChange(netIncome.current, netIncome.previous))}
                      <span
                        className={`font-bold text-lg ${getChangeColor(
                          calculatePercentageChange(netIncome.current, netIncome.previous),
                        )}`}
                      >
                        {calculatePercentageChange(netIncome.current, netIncome.previous).toFixed(1)}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Gross Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {((grossProfit.current / profitLossData.revenue.total.current) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Previous: {((grossProfit.previous / profitLossData.revenue.total.previous) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Operating Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {((operatingIncome.current / profitLossData.revenue.total.current) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Previous: {((operatingIncome.previous / profitLossData.revenue.total.previous) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Net Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {((netIncome.current / profitLossData.revenue.total.current) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Previous: {((netIncome.previous / profitLossData.revenue.total.previous) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
