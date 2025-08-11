"use client"

import React from "react"
import type { ChangeEvent } from "react"

import  { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function BusinessSetupForm() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast({
        title: "Business name required",
        description: "Please enter a name for your business",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (userError) throw userError
      if (!userData.user) throw new Error("User not found")

      // Create business
      const { data: business, error: businessError } = await supabase
        .from("businesses")
        .insert({
          name,
          description: description || null,
          created_by: userData.user.id,
        })
        .select()
        .single()

      if (businessError) throw businessError

      // Add user as admin
      const { error: roleError } = await supabase.from("business_users").insert({
        business_id: business.id,
        user_id: userData.user.id,
        role: "admin",
        status: "accepted",
      })

      if (roleError) throw roleError

      toast({
        title: "Business created",
        description: `${name} has been created successfully`,
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Error creating business:", error)
      toast({
        title: "Error creating business",
        description: error.message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Your Business</CardTitle>
        <CardDescription>Set up your business to get started with MyBiz App</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Business Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your business name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              placeholder="Describe your business"
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Business"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
