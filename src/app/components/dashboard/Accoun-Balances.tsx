import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const accounts = [
  {
    id: "1",
    name: "Business Checking",
    balance: 24689.45,
    type: "Checking",
  },
  {
    id: "2",
    name: "Business Savings",
    balance: 15750.2,
    type: "Savings",
  },
  {
    id: "3",
    name: "Tax Reserve",
    balance: 8500.0,
    type: "Savings",
  },
]

export function AccountBalances() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Balances</CardTitle>
        <CardDescription>Your connected bank accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {accounts.map((account) => (
            <div key={account.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{account.name}</p>
                <p className="text-sm text-muted-foreground">{account.type}</p>
              </div>
              <p className="font-medium tabular-nums">${account.balance.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

