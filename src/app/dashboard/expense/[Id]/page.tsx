import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ExpenseDetail } from "@/components/expenses/expense-detail"
import { Button } from "@/components/ui/button"
import { Download, Edit } from "lucide-react"
import Link from "next/link"

export default function ExpenseDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardShell>
      <DashboardHeader heading={`Expense ${params.id}`} description="View and manage expense details.">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button asChild size="sm">
            <Link href={`/expenses/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </DashboardHeader>
      <ExpenseDetail id={params.id} />
    </DashboardShell>
  )
}

