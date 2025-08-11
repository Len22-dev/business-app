import { InventoryContent } from "../../inventory/inventory-content"
//import { InventoryClient } from "./inventory-client"
import { AuthChecker } from "@/hooks/userCherker"

export default async function InventoryPage() {
  const { business} = await AuthChecker()
const businessId = business?.business_id 

  return (<div>

    <InventoryContent businessId={businessId}/>
    {/* <InventoryClient userId={user.id} businessId={businessId} /> */}
  </div>
)
}