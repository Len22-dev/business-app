"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useBusinessContext } from "@/context/business-context"
import { InviteUserForm } from "./invite-user"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, UserPlus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

type BusinessUserWithProfile = {
  id: string
  business_id: string
  user_id: string
  role: string
  status: string
  created_at: string
  profiles: {
    id: string
    email: string
    full_name: string
  } | null
}

type BusinessInvitation = {
  id: string
  business_id: string
  email: string
  role: string
  token: string
  created_at: string
  expires_at: string
}

export function ManageUsers() {
  const [users, setUsers] = useState<BusinessUserWithProfile[]>([])
  const [invitations, setInvitations] = useState<BusinessInvitation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showInviteForm, setShowInviteForm] = useState(false)
  const { toast } = useToast()
  const { currentBusiness, userRole } = useBusinessContext()
  const supabase = createClient()

  const fetchUsers = async () => {
    if (!currentBusiness) return

    setIsLoading(true)
    try {
      // Fetch business users with profiles
      const { data: businessUsers, error } = await supabase
        .from("business_users")
        .select(`
          *,
          profiles (id, email, full_name)
        `)
        .eq("business_id", currentBusiness.id)
        .order("created_at")

      if (error) throw error
      setUsers(businessUsers as BusinessUserWithProfile[])

      // Fetch pending invitations
      const { data: invitationsData, error: invitationsError } = await supabase
        .from("business_invitations")
        .select("*")
        .eq("business_id", currentBusiness.id)
        .gte("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })

      if (invitationsError) throw invitationsError
      setInvitations(invitationsData)
    } catch (error: any) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to load users",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [currentBusiness])

  const handleUpdateRole = async (userId: string, newRole: string) => {
    if (!currentBusiness || userRole !== "admin") return

    try {
      const { error } = await supabase
        .from("business_users")
        .update({ role: newRole })
        .eq("business_id", currentBusiness.id)
        .eq("user_id", userId)

      if (error) throw error

      toast({
        title: "Role updated",
        description: "User role has been updated successfully",
      })

      fetchUsers()
    } catch (error: any) {
      console.error("Error updating role:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update role",
        variant: "destructive",
      })
    }
  }

  const handleRemoveUser = async (userId: string) => {
    if (!currentBusiness || userRole !== "admin") return

    try {
      const { error } = await supabase
        .from("business_users")
        .delete()
        .eq("business_id", currentBusiness.id)
        .eq("user_id", userId)

      if (error) throw error

      toast({
        title: "User removed",
        description: "User has been removed from the business",
      })

      fetchUsers()
    } catch (error: any) {
      console.error("Error removing user:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to remove user",
        variant: "destructive",
      })
    }
  }

  const handleCancelInvitation = async (invitationId: string) => {
    if (!currentBusiness || userRole !== "admin") return

    try {
      const { error } = await supabase.from("business_invitations").delete().eq("id", invitationId)

      if (error) throw error

      toast({
        title: "Invitation cancelled",
        description: "The invitation has been cancelled",
      })

      fetchUsers()
    } catch (error: any) {
      console.error("Error cancelling invitation:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to cancel invitation",
        variant: "destructive",
      })
    }
  }

  if (!currentBusiness) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Please select a business to manage users</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage your team members and their permissions</CardDescription>
        </div>
        {userRole === "admin" && (
          <Button onClick={() => setShowInviteForm(!showInviteForm)}>
            <UserPlus className="mr-2 h-4 w-4" />
            {showInviteForm ? "Hide Form" : "Invite User"}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {showInviteForm && (
          <div className="mb-6">
            <InviteUserForm />
          </div>
        )}

        <Tabs defaultValue="members">
          <TabsList className="mb-4">
            <TabsTrigger value="members">Members ({users.length})</TabsTrigger>
            <TabsTrigger value="invitations">Pending Invitations ({invitations.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-2">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : users.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">No team members found</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    {userRole === "admin" && <TableHead className="w-[100px]">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.profiles?.full_name || "N/A"}</TableCell>
                      <TableCell>{user.profiles?.email || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "admin" ? "default" : "outline"}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === "accepted" ? "success" : "secondary"}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </TableCell>
                      {userRole === "admin" && (
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleUpdateRole(user.user_id, "admin")}
                                disabled={user.role === "admin"}
                              >
                                Make Admin
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateRole(user.user_id, "manager")}
                                disabled={user.role === "manager"}
                              >
                                Make Manager
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateRole(user.user_id, "member")}
                                disabled={user.role === "member"}
                              >
                                Make Member
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleUpdateRole(user.user_id, "viewer")}
                                disabled={user.role === "viewer"}
                              >
                                Make Viewer
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleRemoveUser(user.user_id)}
                                className="text-destructive"
                              >
                                Remove User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>

          <TabsContent value="invitations">
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-2">
                    <div className="space-y-2 w-full">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : invitations.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">No pending invitations</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead>Expires</TableHead>
                    {userRole === "admin" && <TableHead className="w-[100px]">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.map((invitation) => (
                    <TableRow key={invitation.id}>
                      <TableCell>{invitation.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(invitation.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(invitation.expires_at).toLocaleDateString()}</TableCell>
                      {userRole === "admin" && (
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleCancelInvitation(invitation.id)}>
                            Cancel
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
