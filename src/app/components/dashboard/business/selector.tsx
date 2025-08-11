import React, { useState } from 'react'
import { Business } from '@/lib/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function BusinessSelectorPage({ business }: { business: Business }) {
    const [businessId, setBusinessId] = useState("")
    const businesses = [business]
    const router = useRouter()
  return (
    <div className="flex items-center space-x-2">
      <Select
        value={businessId}
        onValueChange={(value) => setBusinessId(value)}
        disabled={businesses.length <= 1}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select business" />
        </SelectTrigger>
        <SelectContent>
          {businesses.map((business) => (
            <SelectItem key={business.id} value={business.id}>
              {business.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="ghost" size="icon" onClick={() => router.push("/business/new")}>
        <PlusCircle className="h-4 w-4" />
      </Button>
    </div>
  )
}


