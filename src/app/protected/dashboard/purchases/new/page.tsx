import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { NewPurchaseForm } from "./new-purchase-form"

export default async function NewPurchasePage() {
  const supabase = await createClient()

  // Fetch user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Add New Purchase</h2>
      <NewPurchaseForm userId={user.id} />
    </div>
  )
}
