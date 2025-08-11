"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { name: "Paid", value: 18 },
  { name: "Due", value: 4 },
  { name: "Overdue", value: 2 },
]

const COLORS = ["#22c55e", "#f59e0b", "#ef4444"]

export function InvoiceStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Status</CardTitle>
        <CardDescription>Current invoice summary</CardDescription>
      </CardHeader>
      <CardContent className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

