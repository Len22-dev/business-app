"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Edit, Trash2, UserPlus } from "lucide-react"
import { AddUserModal } from "./modal/add-user-form"

const users = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@eaziegrow.com",
    role: "Administrator",
    department: "IT",
    status: "Active",
    lastLogin: "2024-01-15 10:30 AM",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@eaziegrow.com",
    role: "Manager",
    department: "Sales",
    status: "Active",
    lastLogin: "2024-01-15 09:15 AM",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@eaziegrow.com",
    role: "User",
    department: "Accounting",
    status: "Active",
    lastLogin: "2024-01-14 04:45 PM",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah.wilson@eaziegrow.com",
    role: "User",
    department: "HR",
    status: "Inactive",
    lastLogin: "2024-01-10 02:20 PM",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

const userStats = [
  { title: "Total Users", value: "24", change: "+2 this month" },
  { title: "Active Users", value: "21", change: "87.5% active" },
  { title: "Administrators", value: "3", change: "12.5% of users" },
  { title: "Last 30 Days", value: "18", change: "Users logged in" },
]

export function UserManagementTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddUserModal, setShowAddUserModal] = useState(false)

  return (
    <div className="space-y-6">
      {/* User Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {userStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Button onClick={() => setShowAddUserModal(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === "Administrator" ? "default" : "secondary"}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === "Active" ? "default" : "secondary"}>{user.status}</Badge>
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddUserModal open={showAddUserModal} onOpenChange={setShowAddUserModal} />
    </div>
  )
}
