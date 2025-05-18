import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { CashFlowReport } from "@/components/reports/cash-flow-report"
import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"

export default function CashFlowPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Cash Flow" description="Track the flow of cash in and out of your business over time.">
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
      <CashFlowReport />
    </DashboardShell>
  )
}

