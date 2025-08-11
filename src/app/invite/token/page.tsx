import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { BusinessSetupForm } from "@/app/dash/business/business-setup"

export default async function NewBusinessPage() {
  const supabase = await createClient()

  // Get session server-side
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Redirect if not authenticated
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container max-w-2xl py-10">
      <h1 className="mb-6 text-2xl font-bold">Create Your Business</h1>
      <BusinessSetupForm  />
    </div>
  )
}
