import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { InvoiceList } from "@/components/invoices/invoice-list"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function InvoicesPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Invoices" description="Manage your invoices and get paid faster.">
        <Button asChild>
          <Link href="/invoices/new">
            <Plus className="mr-2 h-4 w-4" /> New Invoice
          </Link>
        </Button>
      </DashboardHeader>
      <InvoiceList />
    </DashboardShell>
  )
}

