
// import { AuthChecker } from "@/hooks/userCherker"
// import { createClient } from "@/lib/supabase/server"
import { ReportsContent } from "../../_components/report/report-cont"

export default async function ReportsPage() {
//   const supabase = await createClient()
//  const user = await AuthChecker()

  // Fetch data for reports
  // const { data: sales } = await supabase.from("sales").select("*").eq("user_id", user?.id)

  // const { data: expenses } = await supabase.from("expenses").select("*").eq("user_id", user?.id)

  // const { data: purchases } = await supabase.from("purchases").select("*").eq("user_id", user?.id)

  // Calculate totals
  // const totalSales = sales?.reduce((sum, item) => sum + Number(item.amount), 0) || 0
  // const totalExpenses = expenses?.reduce((sum, item) => sum + Number(item.amount), 0) || 0
  // const totalPurchases = purchases?.reduce((sum, item) => sum + Number(item.amount), 0) || 0
  // const totalCosts = totalExpenses + totalPurchases
  // const netProfit = totalSales - totalCosts

  // Group expenses by category
  // const expensesByCategory: Record<string, number> = {}
  // expenses?.forEach((expense) => {
  //   const category = expense.category || "Other"
  //   expensesByCategory[category] = (expensesByCategory[category] || 0) + Number(expense.amount)
  // })

  // Group purchases by supplier
  // const purchasesBySupplier: Record<string, number> = {}
  // purchases?.forEach((purchase) => {
  //   const supplier = purchase.supplier || "Other"
  //   purchasesBySupplier[supplier] = (purchasesBySupplier[supplier] || 0) + Number(purchase.amount)
  // })

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Financial Reports</h2>
      </div>

     <ReportsContent/>
    </div>
  )
}
