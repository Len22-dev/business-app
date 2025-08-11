import type React from "react"
import { redirect } from "next/navigation"
import { DashboardShell } from "@/app/components/dashboard/DashboardShell"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { AuthChecker } from "@/hooks/userCherker"
import { Toaster } from "sonner"

// Loading component for the dashboard
function DashboardLoading() {
  return (
    <div className="flex h-screen">
      <div className="w-64 border-r bg-gray-50/40">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <Skeleton className="h-8 w-32" />
          </div>
          <div className="flex-1 space-y-2 p-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1">
        <div className="flex h-14 items-center border-b px-6">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="p-6 space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  )
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await AuthChecker()

  try {
    // Get session server-side
    

    
    return (
      
      <DashboardShell>
            <Suspense fallback={<DashboardLoading />}>
            {children}
          </Suspense>
          <Toaster position="top-center" richColors />
        </DashboardShell>
    )
  } catch (error) {
    console.error("Dashboard layout error:", error)
    // For any unexpected errors, redirect to login
    redirect("/auth/login")
  }
}
