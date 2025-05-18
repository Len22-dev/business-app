import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { OverviewStats } from "@/components/dashboard/overview-stats"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { CashFlow } from "@/components/dashboard/cash-flow"
import { ExpenseBreakdown } from "@/components/dashboard/expense-breakdown"
import { InvoiceStatus } from "@/components/dashboard/invoice-status"
import { AccountBalances } from "@/components/dashboard/account-balances"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" description="Overview of your business finances and activities.">
        <Button asChild>
          <Link href="/invoices/new">
            <Plus className="mr-2 h-4 w-4" /> Create Invoice
          </Link>
        </Button>
      </DashboardHeader>
      <div className="grid gap-6">
        <OverviewStats />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <CashFlow className="lg:col-span-4" />
          <ExpenseBreakdown className="lg:col-span-3" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <RecentTransactions className="lg:col-span-4" />
          <div className="grid gap-6 lg:col-span-3">
            <InvoiceStatus />
            <AccountBalances />
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}

