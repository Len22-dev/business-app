"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { useBusinessContext } from "@/src/context/business-context"
import type { Business, UserRole } from "@/lib/types"

export function InviteUserForm({ business }: { business: Business }) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<UserRole>("member")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!business) {
      toast({
        title: "Error",
        description: "No business selected",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Generate a unique token for the invitation
      const token = crypto.randomUUID()

      // Create the invitation
      const { error } = await supabase.from("business_invitations").insert({
        business_id: business.id,
        email,
        role,
        token,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      })

      if (error) throw error

      // Check if user already exists
      const { data: existingUser } = await supabase.from("profiles").select("id").eq("email", email).single()

      if (existingUser) {
        // If user exists, create a business_user record with pending status
        await supabase.from("business_users").insert({
          business_id: business.id,
          user_id: existingUser.id,
          role,
          status: "pending",
        })
      }

      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${email}`,
      })

      // Reset form
      setEmail("")
      setRole("member")
    } catch (error: any) {
      console.error("Error inviting user:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to send invitation",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Team Member</CardTitle>
        <CardDescription>Invite a team member to join your business</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              placeholder="colleague@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={(value) => setRole(value as UserRole)} disabled={isLoading}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !business}>
            {isLoading ? "Sending..." : "Send Invitation"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
