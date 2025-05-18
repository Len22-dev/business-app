import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ExpenseForm } from "@/components/expenses/expense-form"

export default function NewExpensePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Add Expense" description="Record a new business expense." />
      <ExpenseForm />
    </DashboardShell>
  )
}

