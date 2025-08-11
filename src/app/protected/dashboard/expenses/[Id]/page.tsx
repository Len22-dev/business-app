import { DashboardHeader } from "@/app/components/dashboard/DashboardHeader"
import { DashboardShell } from "@/app/components/dashboard/DashboardShell"
import { ExpenseDetail } from "@/components/expenses/expense-detail"
import { Button } from "@/components/ui/button"
import { AuthChecker } from "@/hooks/userCherker"
import { Download, Edit } from "lucide-react"
import Link from "next/link"

export async function ExpenseDetailPage({ params }: { params: { id: string } }) {
  await AuthChecker()
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

