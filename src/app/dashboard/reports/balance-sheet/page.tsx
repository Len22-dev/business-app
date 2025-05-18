import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { BalanceSheetReport } from "@/components/reports/balance-sheet-report"
import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"

export default function BalanceSheetPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Balance Sheet"
        description="View your business assets, liabilities, and equity at a specific point in time."
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
      <BalanceSheetReport />
    </DashboardShell>
  )
}

