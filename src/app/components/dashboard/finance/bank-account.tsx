"use client"

import { formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, CreditCard, ChevronRight } from "lucide-react"
import { BankCardDisplay } from "./bank-card"
import type { Bank } from "@/lib/types"
//import { supabase } from "@/lib/supabase"
//import { useEffect, useState } from "react"

interface BankAccountProps {
  bank: Bank
  onBankClick?: (bank: Bank) => void
  onCardClick?: (bankId: string, cardId: string) => void
}

export function BankAccount({ bank, onBankClick, onCardClick }: BankAccountProps) {
 // const [bank_cards, setBankCards] = useState<BankCard[]>([])

 // useEffect(() => {
    // Fetch bank cards
 //   const fetchBankCards = async () => {
 //     const { data, error } = await supabase
 //       .from("bank_cards")
 //       .select("*")
 //       .eq("bank_id", bank.id)
 //       .order("created_at")
 //     if (error) { console.error(error) }
 //     setBankCards(data || [])
 // };
 //   fetchBankCards()
//})

  return (
    <Card className="overflow-hidden">
      <CardHeader
        className={`flex flex-row items-center justify-between bg-muted/50 pb-2 pt-2 ${onBankClick ? "cursor-pointer" : ""}`}
        onClick={() => onBankClick && onBankClick(bank)}
      >
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          <CardTitle className="text-lg">{bank.name}</CardTitle>
        </div>
        {onBankClick && <ChevronRight className="h-5 w-5 text-muted-foreground" />}
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Account</div>
            <div className="font-medium">
              {bank.account_type
                ? bank.account_type.charAt(0).toUpperCase() + bank.account_type.slice(1)
                : "Not specified"}
            </div>
            {bank.account_number && (
              <div className="text-sm text-muted-foreground">
                {bank.account_number.length > 4 ? `**** ${bank.account_number.slice(-4)}` : bank.account_number}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Balance</div>
            <div className="text-xl font-bold">{formatCurrency(Number(bank.balance))}</div>
          </div>
        </div>

        {bank.cards && bank.cards.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <h3 className="font-medium">Cards</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2">
              {bank.cards.map((card) => (
                <BankCardDisplay
                  key={card.id}
                  card={card}
                  onClick={() => onCardClick && onCardClick(bank.id, card.id)}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
