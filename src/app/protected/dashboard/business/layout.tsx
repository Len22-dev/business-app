import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BusinessProvider } from "@/context/business-context"

export default async function BusinessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  try {
    // Get session server-side
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    // Handle session errors
    if (sessionError) {
      console.error("Session error:", sessionError)
      redirect("/login")
    }

    // Redirect if not authenticated
    if (!session) {
      redirect("/login")
    }

    return <BusinessProvider>{children}</BusinessProvider>
  } catch (error) {
    console.error("Business layout error:", error)
    // For any unexpected errors, redirect to login
    redirect("/login")
  }
}
