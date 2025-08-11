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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export interface Account {
  bankName: string
  accountName: string
  accountNumber: string
  accountType: string
  branch: string
  sortCode: string
  status: string
  description: string
}

interface EditBankAccountModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  account: Account
}

export function EditBankAccountModal({ open, onOpenChange, account }: EditBankAccountModalProps) {
  const [formData, setFormData] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    accountType: "",
    branch: "",
    sortCode: "",
    status: "",
    description: "",
  })

  useEffect(() => {
    if (account) {
      setFormData({
        bankName: account.bankName,
        accountName: account.accountName,
        accountNumber: account.accountNumber,
        accountType: account.accountType,
        branch: account.branch,
        sortCode: account.sortCode,
        status: account.status,
        description: account.description || "",
      })
    }
  }, [account])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Bank account updated:", formData)
    onOpenChange(false)
  }

  if (!account) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Bank Account</DialogTitle>
          <DialogDescription>Update the bank account information. Make changes and save.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bankName" className="text-right">
                Bank Name
              </Label>
              <Input
                id="bankName"
                placeholder="e.g., First Bank Nigeria"
                className="col-span-3"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="accountName" className="text-right">
                Account Name
              </Label>
              <Input
                id="accountName"
                placeholder="Account holder name"
                className="col-span-3"
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="accountNumber" className="text-right">
                Account Number
              </Label>
              <Input
                id="accountNumber"
                placeholder="1234567890"
                className="col-span-3"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="accountType" className="text-right">
                Account Type
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.accountType}
                  onValueChange={(value) => setFormData({ ...formData, accountType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Current">Current Account</SelectItem>
                    <SelectItem value="Savings">Savings Account</SelectItem>
                    <SelectItem value="Fixed Deposit">Fixed Deposit</SelectItem>
                    <SelectItem value="Call Deposit">Call Deposit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="branch" className="text-right">
                Branch
              </Label>
              <Input
                id="branch"
                placeholder="e.g., Victoria Island"
                className="col-span-3"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sortCode" className="text-right">
                Sort Code
              </Label>
              <Input
                id="sortCode"
                placeholder="e.g., 011-152-003"
                className="col-span-3"
                value={formData.sortCode}
                onChange={(e) => setFormData({ ...formData, sortCode: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <div className="col-span-3">
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right mt-2">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Additional notes about this account"
                className="col-span-3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Update Account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
