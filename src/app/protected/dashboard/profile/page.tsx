import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProfileForm } from "./profile-form"
import type { Profile } from "@/lib/types"

export default async function ProfilePage() {
  const supabase = await createClient()

  // Fetch user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
      <ProfileForm user={user} profile={profile as Profile} />
    </div>
  )
}
