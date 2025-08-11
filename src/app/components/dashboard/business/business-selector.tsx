"use client"
// import { useBusinessContext } from "@/context/business-context"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useBusiness } from "@/hooks/useBusinesses"
import { BusinessSelectorPage } from "./selector"
import { Business } from "@/lib/types"

export function BusinessSelector({ businessId }: { businessId: string }) {
  const { data, isLoading } = useBusiness(businessId)
  const businesses: Business[] = data ? [data] : []
  const router = useRouter()

  if (isLoading) {
    return <div className="h-9 w-[200px] animate-pulse bg-muted rounded-md"></div>
  }

  if (!businessId || businessId.length === 0) {
    return (
      <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => router.push("/business/new")}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Business
      </Button>
    )
  }

  return (
    <div className="flex items-center space-x-2">
     <BusinessSelectorPage business={businesses[0]}/>
    </div>
  )
}
