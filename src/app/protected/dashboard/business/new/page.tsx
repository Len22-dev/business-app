import { BusinessSetupForm } from "@/app/components/dashboard/business/business-setup"
import { AuthChecker } from "@/hooks/userCherker"

export default async function NewBusinessPage() {
  await AuthChecker()

  return (
    <div className="container max-w-2xl py-10">
      <h1 className="mb-6 text-2xl font-bold">Create Your Business</h1>
      <BusinessSetupForm  />
    </div>
  )
}
