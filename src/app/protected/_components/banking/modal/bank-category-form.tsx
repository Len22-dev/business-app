"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface CategorizeTransactionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: any
}

export function CategorizeTransactionModal({ open, onOpenChange, transaction }: CategorizeTransactionModalProps) {
  const [category, setCategory] = useState("")
  const [subcategory, setSubcategory] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (transaction) {
      setCategory(transaction.category || "")
      setSubcategory("")
      setNotes("")
    }
  }, [transaction])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle categorization here
    console.log("Transaction categorized:", { category, subcategory, notes })
    onOpenChange(false)
  }

  if (!transaction) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  const categories = {
    "Sales Revenue": ["Product Sales", "Service Revenue", "Consulting", "Licensing"],
    "Office Expenses": ["Rent", "Utilities", "Supplies", "Maintenance"],
    Payroll: ["Salaries", "Benefits", "Taxes", "Bonuses"],
    Equipment: ["Computers", "Furniture", "Machinery", "Software"],
    Marketing: ["Advertising", "Promotions", "Events", "Digital Marketing"],
    Travel: ["Transportation", "Accommodation", "Meals", "Conference"],
    "Professional Services": ["Legal", "Accounting", "Consulting", "Insurance"],
    "Bank Charges": ["Transaction Fees", "Account Fees", "Interest", "Penalties"],
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Categorize Transaction</DialogTitle>
          <DialogDescription>Assign a category to this transaction for better financial tracking.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Transaction Details */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Description:</span>
                <span>{transaction.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Amount:</span>
                <span className={`font-semibold ${transaction.type === "Credit" ? "text-green-600" : "text-red-600"}`}>
                  {transaction.type === "Credit" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span>{new Date(transaction.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Reference:</span>
                <span className="font-mono text-sm">{transaction.reference}</span>
              </div>
            </div>
          </div>

          <Separator />

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={category}
                  onValueChange={(value) => {
                    setCategory(value)
                    setSubcategory("") // Reset subcategory when category changes
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(categories).map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {category && categories[category as keyof typeof categories] && (
                <div>
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Select value={subcategory} onValueChange={setSubcategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories[category as keyof typeof categories].map((subcat) => (
                        <SelectItem key={subcat} value={subcat}>
                          {subcat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes about this transaction"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Current Category Display */}
              {transaction.category && (
                <div>
                  <Label>Current Category:</Label>
                  <div className="mt-1">
                    <Badge variant="outline">{transaction.category}</Badge>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={!category}>
                Save Category
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
