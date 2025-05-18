import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ReportsList } from "@/components/reports/reports-list"

export default function ReportsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Financial Reports"
        description="View and generate financial reports for your business."
      />
      <ReportsList />
    </DashboardShell>
  )
}

