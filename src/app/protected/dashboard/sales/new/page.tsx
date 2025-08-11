import { NewSaleForm } from "./new-sale-form"
import { AuthChecker } from "@/hooks/userCherker"

export default async function NewSalePage() {
 const {user, business} = await AuthChecker()
  const businessId = business?.business_id
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Add New Sale</h2>
      <NewSaleForm userId={user.id} businessId={businessId} />
    </div>
  )
}
