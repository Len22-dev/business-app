import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { InvoiceForm } from "@/components/invoices/invoice-form"

export default function NewInvoicePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Create Invoice" description="Create a new invoice for your customers." />
      <InvoiceForm />
    </DashboardShell>
  )
}

