import { SalesContent } from "../../_components/sales/sales-content"
// import { SalesClient } from "./sales-client"
import { AuthChecker } from "@/hooks/userCherker"

export default async function SalesPage() {
  const {user, business} = await AuthChecker() 
  

  return <SalesContent userId={user.id} businessId={business?.business_id}/>
}