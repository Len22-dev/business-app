"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CompanyProfileTab } from "./business-profile"
import { UserManagementTab } from "./user-management-tab"
import { SystemSettingsTab } from "./system-settings-tab"
import { IntegrationsTab } from "./integration-tab"

export function SettingsContent() {
  const [activeTab, setActiveTab] = useState("company")

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your system configuration and preferences</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="company">Company Profile</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="system">System Settings</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="company" className="space-y-4">
            <CompanyProfileTab />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UserManagementTab />
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <SystemSettingsTab />
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4">
            <IntegrationsTab />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
