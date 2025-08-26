import { AuthChecker } from "@/hooks/userCherker"
import { DashboardContent } from "../_components/dashboardPage"



export default async function DashboardPage() {
  const {user, business} = await AuthChecker('owner', )
  const userId = user.id
  const businessId = business?.business_id
  
console.log(businessId)
  return <DashboardContent userId={userId} businessId={businessId}/>
}
