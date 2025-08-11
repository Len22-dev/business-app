import { NewExpenseForm } from "../new-expense-form"
import { AuthChecker } from "@/hooks/userCherker"

export default async function NewExpensePage() {
  const user = await AuthChecker()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Add New Expense</h2>
      <NewExpenseForm userId={user.id} />
    </div>
  )
}
