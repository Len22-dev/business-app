"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, Save } from "lucide-react"

export function CompanyProfileTab() {
  const [companyData, setCompanyData] = useState({
    name: "EazieGrow Technologies",
    email: "info@eaziegrow.com",
    phone: "+234 801 234 5678",
    address: "123 Business District, Victoria Island",
    city: "Lagos",
    state: "Lagos State",
    country: "Nigeria",
    postalCode: "101001",
    website: "www.eaziegrow.com",
    taxId: "12345678-0001",
    industry: "Technology",
    description: "Leading ERP solutions provider for Nigerian businesses",
  })

  const handleInputChange = (field: string, value: string) => {
    setCompanyData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving company profile:", companyData)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Update your company profile and business information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Company Logo */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder.svg?height=80&width=80" />
              <AvatarFallback className="text-lg">EG</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Upload Logo
              </Button>
              <p className="text-sm text-muted-foreground mt-1">Recommended: 200x200px, PNG or JPG</p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={companyData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={companyData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={companyData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={companyData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Address Information</h3>
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Textarea
                id="address"
                value={companyData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                rows={2}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={companyData.city} onChange={(e) => handleInputChange("city", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select value={companyData.state} onValueChange={(value) => handleInputChange("state", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lagos State">Lagos State</SelectItem>
                    <SelectItem value="Abuja FCT">Abuja FCT</SelectItem>
                    <SelectItem value="Rivers State">Rivers State</SelectItem>
                    <SelectItem value="Kano State">Kano State</SelectItem>
                    <SelectItem value="Oyo State">Oyo State</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select value={companyData.country} onValueChange={(value) => handleInputChange("country", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nigeria">Nigeria</SelectItem>
                    <SelectItem value="Ghana">Ghana</SelectItem>
                    <SelectItem value="Kenya">Kenya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal-code">Postal Code</Label>
                <Input
                  id="postal-code"
                  value={companyData.postalCode}
                  onChange={(e) => handleInputChange("postalCode", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Business Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tax-id">Tax ID / TIN</Label>
                <Input
                  id="tax-id"
                  value={companyData.taxId}
                  onChange={(e) => handleInputChange("taxId", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select value={companyData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Services">Services</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Company Description</Label>
              <Textarea
                id="description"
                value={companyData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
                placeholder="Brief description of your company"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
