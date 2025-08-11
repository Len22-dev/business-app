//import { createClient } from "@/lib/supabase/server"
//import { redirect } from "next/navigation"
//import { FinanceClient } from "./finance-client"
//import type { Bank, BankCard, BankTransaction } from "@/lib/types"
//import { AuthChecker } from "@/hooks/userCherker"
import { AccountingContent } from "../../_components/accounting/account-content"

export default async function FinancePage() {
 // const { business } = await AuthChecker()
  // const businessId = business?.business_id
  // const supabase = await createClient()

  // // Fetch user
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()

  // if (!user) {
  //   redirect("/login")
  // }

  // // Fetch banks with their cards
  // const { data: banks } = await supabase
  //   .from("banks")
  //   .select("*")
  //   .eq("user_id", user.id)
  //   .order("name", { ascending: true })

  //   console.log(banks)
  // // Fetch all cards
  // const { data: cards } = await supabase.from("bank_cards").select("*").eq("user_id", user.id)

  // // Fetch transactions
  // const { data: transactions } = await supabase
  //   .from("bank_transactions")
  //   .select("*")
  //   .eq("user_id", user.id)
  //   .order("transaction_date", { ascending: false })

  // Organize cards by bank
  // const banksWithCards =
  //   banks?.map((bank) => {
  //     const bankCards = cards?.filter((card) => card.bank_id === bank.id) || []
  //     return {
  //       ...bank,
  //       cards: bankCards,
  //     }
  //   }) || []

  return (
    <div>
      <AccountingContent/>
      {/* <FinanceClient
        businessId={businessId}
        userId={user.id}
        banks={banksWithCards as (Bank & { cards: BankCard[] })[]}
        transactions={transactions as BankTransaction[]}
      /> */}
    </div>
  )
}
