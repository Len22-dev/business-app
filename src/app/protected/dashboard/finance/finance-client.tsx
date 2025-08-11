"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, RefreshCw, CreditCard, ArrowLeftRight } from "lucide-react"
import { BankAccount } from "@/app/components/dashboard/finance/bank-account"
import { TransactionList } from "@/app/components/dashboard/finance/transaction-list"
import { AddBankModal } from "@/app/components/dashboard/finance/add-bank-modal"
import { AddCardModal } from "@/app/components/dashboard/finance/add-card-modal"
import { AddTransactionModal } from "@/app/components/dashboard/finance/add-transaction-modal"
import { ReconcileModal } from "@/app/components/dashboard/finance/reconsile-modal"
import { formatCurrency } from "@/lib/utils"
import type { Bank, BankCard, BankTransaction } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"

interface FinanceClientProps {
  userId: string
   banks: (Bank & { cards: BankCard[] })[];
  transactions: BankTransaction[];
  businessId: string
}

export function FinanceClient({ userId, banks:initialBanks, transactions:initialTransactions, businessId }: FinanceClientProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("accounts")
  const [isAddBankModalOpen, setIsAddBankModalOpen] = useState(false)
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false)
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false)
  const [isReconcileModalOpen, setIsReconcileModalOpen] = useState(false)
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null)
  const [banks, ] = useState<(Bank & { cards: BankCard[] })[]>(initialBanks)
  const [cards, setCards] = useState<BankCard[]>([])
  const [transactions, ] = useState<BankTransaction[]>(initialTransactions)
  const [totalBalance, setTotalBalance] = useState(0)
  const [totalCardBalance, setTotalCardBalance] = useState(0)
  const [, setUnreconciledCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      if (!businessId) {
        throw new Error("No business selected")
      }

  // useEffect(() => {
  //   fetchData()
  // }, [ ])


      // Fetch banks
     // const { data: banksData, error: banksError } = await supabase
     //   .from("banks")
     //   .select("*")
     //   .eq("user_id", userId)
     //   .eq("business_id", currentBusiness.id)
     //   .eq("is_active", true)
     //   .order("name")

     //   console.log(banksData?.map(bank => bank.name))
     //   console.log(userId)

     // if (banksError) throw banksError
     // setBanks(banksData || [])

      // Fetch cards
      const { data: cardsData, error: cardsError } = await supabase
        .from("bank_cards")
        .select("*")
        .eq("user_id", userId)
        .eq("business_id", businessId)
        .eq("is_active", true)
        .order("card_type")

      if (cardsError) throw cardsError
      setCards(cardsData || [])

    //   Fetch recent transactions
    //  const { data: transactionsData, error: transactionsError } = await supabase
    //    .from("bank_transactions")
    //    .select("*")
    //    .eq("user_id", userId)
    //    .eq("business_id", currentBusiness.id)
    //    .order("transaction_date", { ascending: false })
    //    .limit(10)

    //  if (transactionsError) throw transactionsError
    //  setTransactions(transactionsData || [])

      // Calculate totals
      const totalBankBalance = banks?.reduce((sum, bank) => sum + Number(bank.balance), 0) || 0
      setTotalBalance(totalBankBalance)

      const totalCardBalance = cardsData?.reduce((sum, card) => sum + Number(card.balance), 0) || 0
      setTotalCardBalance(totalCardBalance)

      // Calculate unreconciled transactions
      const unreconciledCount = transactions?.filter((t) => !t.is_reconciled).length || 0
      setUnreconciledCount(unreconciledCount)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load financial data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchData()
  }

  const handleAddBank = () => {
    setIsAddBankModalOpen(true)
  }

  const handleAddCard = (bank?: Bank) => {
    if (bank) {
      setSelectedBank(bank)
    } else {
      setSelectedBank(null)
    }
    setIsAddCardModalOpen(true)
  }

  const handleAddTransaction = (bank?: Bank) => {
    if (bank) {
      setSelectedBank(bank)
    } else {
      setSelectedBank(null)
    }
    setIsAddTransactionModalOpen(true)
  }

  const handleReconcile = (bank: Bank) => {
    setSelectedBank(bank)
    setIsReconcileModalOpen(true)
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Finance</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => handleAddTransaction()} disabled={isLoading}>
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Bank Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Card Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCardBalance)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Banks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{banks.filter((b) => b.is_active).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cards.filter((c) => c.is_active).length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="accounts">Bank Accounts</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="accounts" className="space-y-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Your Bank Accounts</h3>
            <Button onClick={handleAddBank} disabled={isLoading}>
              <Plus className="mr-2 h-4 w-4" />
              Add Bank
            </Button>
          </div>

          {banks.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {banks.map((bank) => (
                <BankAccount key={bank.id} bank={bank} onBankClick={() => {}} onCardClick={() => {}} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-center text-muted-foreground">No bank accounts found</p>
                <Button onClick={handleAddBank} className="mt-4" disabled={isLoading}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Bank
                </Button>
              </CardContent>
            </Card>
          )}

          {banks.length > 0 && (
            <div className="mt-8 space-y-4">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">Quick Actions</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                <Card className="cursor-pointer hover:bg-muted/50" onClick={handleAddBank}>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Plus className="mb-2 h-8 w-8" />
                    <CardTitle className="text-center text-base">Add Bank</CardTitle>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-muted/50" onClick={() => handleAddCard()}>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <CreditCard className="mb-2 h-8 w-8" />
                    <CardTitle className="text-center text-base">Add Card</CardTitle>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-muted/50" onClick={() => handleAddTransaction()}>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <ArrowLeftRight className="mb-2 h-8 w-8" />
                    <CardTitle className="text-center text-base">Add Transaction</CardTitle>
                  </CardContent>
                </Card>
                {banks.length > 0 && (
                  <Card className="cursor-pointer hover:bg-muted/50" onClick={() => handleReconcile(banks[0])}>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <RefreshCw className="mb-2 h-8 w-8" />
                      <CardTitle className="text-center text-base">Reconcile Account</CardTitle>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>View and manage your bank transactions</CardDescription>
                </div>
                <Button onClick={() => handleAddTransaction()} disabled={isLoading}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Transaction
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <TransactionList transactions={transactions} onTransactionClick={() => {}} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <AddBankModal
        isOpen={isAddBankModalOpen}
        onClose={() => setIsAddBankModalOpen(false)}
        userId={userId}
        businessId={businessId}
        onSuccess={fetchData}
      />

      <AddCardModal
        isOpen={isAddCardModalOpen}
        onClose={() => setIsAddCardModalOpen(false)}
        userId={userId}
        businessId={businessId}
        banks={banks}
        selectedBankId={selectedBank?.id}
        onSuccess={fetchData}
      />

      <AddTransactionModal
        isOpen={isAddTransactionModalOpen}
        onClose={() => setIsAddTransactionModalOpen(false)}
        userId={userId}
        businessId={businessId}
        banks={banks}
        selectedBankId={selectedBank?.id}
        onSuccess={fetchData}
      />

      {selectedBank && (
        <ReconcileModal
          isOpen={isReconcileModalOpen}
          onClose={() => setIsReconcileModalOpen(false)}
          bank={selectedBank}
          transactions={transactions.filter((t) => t.bank_id === selectedBank.id)}
          onSuccess={fetchData}
        />
      )}
    </div>
  )
}
