import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { InvoiceDetail } from "@/components/invoices/invoice-detail"
import { Button } from "@/components/ui/button"
import { Download, Edit, Send } from "lucide-react"
import Link from "next/link"

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardShell>
      <DashboardHeader heading={`Invoice ${params.id}`} description="View and manage invoice details.">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" size="sm">
            <Send className="mr-2 h-4 w-4" />
            Send
          </Button>
          <Button asChild size="sm">
            <Link href={`/invoices/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </DashboardHeader>
      <InvoiceDetail id={params.id} />
    </DashboardShell>
  )
}

