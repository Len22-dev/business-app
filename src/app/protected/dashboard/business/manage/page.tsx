import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BusinessSettings } from "@/app/components/dashboard/business/business-settings"
import { ManageUsers } from "@/app/components/dashboard/business/manage-users"
import { InviteUserForm } from "@/app/components/dashboard/business/invite-user"
import { BusinessProvider } from "@/context/business-context"
import { AuthChecker } from "@/hooks/userCherker"

export default async function ManageBusinessPage() {
   await AuthChecker()

  return (
    <BusinessProvider>
      <div className="container mx-auto py-8">
        <h1 className="mb-6 text-2xl font-bold">Manage Business</h1>

        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="settings">Business Settings</TabsTrigger>
            <TabsTrigger value="users">Team Members</TabsTrigger>
            <TabsTrigger value="invite">Invite Users</TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <BusinessSettings />
          </TabsContent>

          <TabsContent value="users">
            <ManageUsers />
          </TabsContent>

          <TabsContent value="invite">
            <InviteUserForm />
          </TabsContent>
        </Tabs>
      </div>
    </BusinessProvider>
  )
}
