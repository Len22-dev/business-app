"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Settings, ExternalLink, Check, X } from "lucide-react"
import Image from "next/image"

const integrations = [
  {
    id: "paystack",
    name: "Paystack",
    description: "Accept payments and manage transactions",
    category: "Payment",
    status: "connected",
    logo: "/Image3.png",
  },
  {
    id: "flutterwave",
    name: "Flutterwave",
    description: "Payment processing and financial services",
    category: "Payment",
    status: "available",
    logo: "/Image2.png",
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    description: "Sync accounting data with QuickBooks",
    category: "Accounting",
    status: "available",
    logo: "/Image1.png",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Get notifications in your Slack workspace",
    category: "Communication",
    status: "connected",
    logo: "/Image3.png",
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "Sync customer data for email marketing",
    category: "Marketing",
    status: "available",
    logo: "/Image2.png",
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Store and sync documents with Google Drive",
    category: "Storage",
    status: "connected",
    logo: "/Image1.png",
  },
]

export function IntegrationsTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = ["all", "payment", "accounting", "communication", "marketing", "storage"]

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || integration.category.toLowerCase() === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleConnect = (integrationId: string) => {
    console.log("Connecting to:", integrationId)
  }

  const handleDisconnect = (integrationId: string) => {
    console.log("Disconnecting from:", integrationId)
  }

  const handleConfigure = (integrationId: string) => {
    console.log("Configuring:", integrationId)
  }

  return (
    <div className="space-y-6">
      {/* Integration Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Connected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Active integrations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Ready to connect</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Integration types</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Available Integrations</CardTitle>
          <CardDescription>Connect your ERP system with third-party services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search integrations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integrations Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredIntegrations.map((integration) => (
          <Card key={integration.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src={integration.logo || "/vercel.svg"}
                    alt={integration.name}
                    width={50}
                    height={50}
                    className="h-10 w-10 rounded"
                  />
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {integration.category}
                    </Badge>
                  </div>
                </div>
                {integration.status === "connected" ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <X className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{integration.description}</p>
              <div className="flex gap-2">
                {integration.status === "connected" ? (
                  <>
                    <Button variant="outline" size="sm" onClick={() => handleConfigure(integration.id)}>
                      <Settings className="mr-2 h-4 w-4" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDisconnect(integration.id)}>
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button size="sm" onClick={() => handleConnect(integration.id)}>
                    Connect
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* API Settings */}
      <Card>
        <CardHeader>
          <CardTitle>API Settings</CardTitle>
          <CardDescription>Manage API keys and webhook configurations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="flex gap-2">
              <Input id="api-key" type="password" value="••••••••••••••••••••••••••••••••" readOnly />
              <Button variant="outline">Regenerate</Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input id="webhook-url" placeholder="https://your-app.com/webhooks" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable API Access</Label>
              <p className="text-sm text-muted-foreground">Allow external applications to access your data</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
