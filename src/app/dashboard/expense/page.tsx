import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ExpenseList } from "@/components/expenses/expense-list"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function ExpensesPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Expenses" description="Track and manage your business expenses.">
        <Button asChild>
          <Link href="/expenses/new">
            <Plus className="mr-2 h-4 w-4" /> New Expense
          </Link>
        </Button>
      </DashboardHeader>
      <ExpenseList />
    </DashboardShell>
  )
}

