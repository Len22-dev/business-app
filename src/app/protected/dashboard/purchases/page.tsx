import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { PurchaseContent } from "../../_components/purchase/purchase-content"
// import { createClient } from "@/lib/supabase/server"
 import { AuthChecker } from "@/hooks/userCherker"
import { inventoryApi } from '@/hooks/useGeneral'

export default async function PurchasesPage({ params }: { params: { businessId: string } }) {
    const queryClient = new QueryClient()

   try {
    // Prefetch using your existing API function
    await queryClient.prefetchQuery({
      queryKey: ['inventory', params.businessId], // Must match useInventory key
      queryFn: () => inventoryApi.getInventory({ businessId: params.businessId }),
    })
  } catch (error) {
    // Handle prefetch errors gracefully - component will show loading state
    console.warn('Failed to prefetch inventory:', error)
  }
  const {user, business} = await AuthChecker()

  return (
     <HydrationBoundary state={dehydrate(queryClient)}>
       <PurchaseContent userId={user.id} businessId={business?.business_id}/>
     </HydrationBoundary>
  )
}