"use client"

import { formatCurrency } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { CreditCard, CheckCircle2 } from "lucide-react"
import type { BankCard } from "@/lib/types"

interface BankCardProps {
  card: BankCard
  onClick?: () => void
}

export function BankCardDisplay({ card, onClick }: BankCardProps) {
  return (
    <Card
      className={`overflow-hidden transition-all hover:shadow-md ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              <span className="font-medium">{card.card_type.toUpperCase()} CARD</span>
            </div>
            {card.is_active && (
              <div className="flex items-center gap-1 text-xs">
                <CheckCircle2 className="h-3 w-3" />
                <span>Active</span>
              </div>
            )}
          </div>
          <div className="mt-4 text-lg font-bold">
            {card.card_number ? `**** **** **** ${card.card_number.slice(-4)}` : "Card Number Not Set"}
          </div>
          <div className="mt-1 text-sm opacity-80">{card.card_holder || "Card Holder"}</div>
          {card.expiry_date && <div className="mt-1 text-xs opacity-70">Expires: {card.expiry_date}</div>}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Balance</div>
            <div className="font-semibold">{formatCurrency(Number(card.balance))}</div>
          </div>
          {card.credit_limit && (
            <div className="mt-1 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Credit Limit</div>
              <div className="font-semibold">{formatCurrency(Number(card.credit_limit))}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
