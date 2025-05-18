import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ProfitLossReport } from "@/components/reports/profit-loss-report"
import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"

export default function ProfitLossPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Profit & Loss"
        description="View your business income, expenses, and net profit over time."
      >
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </DashboardHeader>
      <ProfitLossReport />
    </DashboardShell>
  )
}

