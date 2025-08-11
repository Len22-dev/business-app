"use client"

import type React from "react"

import { useState, useEffect } from "react"
// import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
//import { useBusinessContext } from "@/src/context/business-context"
import { Skeleton } from "@/components/ui/skeleton"
import { supabase } from "@/lib/supabase"
import { Business } from "@/lib/types"

export function BusinessSettings({ business }: { business: Business }) {
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    tax_id: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  //const { currentBusiness, refreshBusinesses } = useBusinessContext()
  // const supabase = createClient()

  useEffect(() => {
    if (business) {
      setFormData({
        name: business.name || "",
        description: business.description || "",
        email: business.email || "",
        phone: business.phone || "",
        address: business.address || "",
        website: business.website || "",
        tax_id: business.tax_id || "",
      })
      setIsLoading(false)
    }
  }, [business])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

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

    setIsSaving(true)

    try {
      const { error } = await supabase
        .from("businesses")
        .update({
          name: formData.name,
          description: formData.description,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          website: formData.website,
          tax_id: formData.tax_id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", business.id)

      if (error) throw error

      toast({
        title: "Settings saved",
        description: "Business settings have been updated successfully",
      })

      // refreshBusinesses()
    } catch (error: any) {
      console.error("Error updating business:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update business settings",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

    if (!business) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Please select a business to manage settings</p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Settings</CardTitle>
        <CardDescription>Update your business information and settings</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="business-settings-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Business Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required disabled={isSaving} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isSaving}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} disabled={isSaving} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={isSaving}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" name="website" value={formData.website} onChange={handleChange} disabled={isSaving} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax_id">Tax ID / Business Number</Label>
              <Input id="tax_id" name="tax_id" value={formData.tax_id} onChange={handleChange} disabled={isSaving} />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="business-settings-form" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  )
}
