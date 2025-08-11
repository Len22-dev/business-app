import type React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Receipt, Calendar, DollarSign, Tag, FileText } from "lucide-react"
import { useExpense } from "@/hooks/useExpenses"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

interface ViewExpenseModalProps {
  expenseId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Define the expense data structure for better type safety
interface ExpenseData {
  totalAmount?: number
  paidAmount?: number
  balanceDue?: number
  lastPaymentDate?: string | Date
  isReimbursable?: boolean
  isReimbursed?: boolean
  isRecurring?: boolean
  recurringFrequency?: string
  notes?: string
  reference?: string
  receipt?: string
  tags?: string[]
  created_at?: string | Date
  updated_at?: string | Date
  approvedAt?: string | Date
}

export function ViewExpenseModal({ open, onOpenChange, expenseId }: ViewExpenseModalProps) {
  const { data: expenseData, isLoading } = useExpense(expenseId) as {
    data: ExpenseData | undefined
    isLoading: boolean
  }

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex items-center justify-center p-6">
            <div className="text-center">Loading expense details...</div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!expenseData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex items-center justify-center p-6">
            <div className="text-center text-red-500">Expense not found</div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Helper function to safely format dates
  const formatDate = (date: string | Date | undefined): string => {
    if (!date) return 'N/A'
    try {
      return format(new Date(date), "PPP")
    } catch (error) {
      console.warn('Invalid date format:', date, error)
      return 'Invalid date'
    }
  }

  // Helper function to safely format currency
  const formatCurrency = (amount: number | undefined): string => {
    if (amount === undefined || amount === null) return '0'
    return amount.toLocaleString()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Expense Details
          </DialogTitle>
          <DialogDescription>
            Expense details and information
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Expense Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Expense Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Amount</p>
                  <p className="text-2xl font-bold">₦{formatCurrency(expenseData.totalAmount)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Paid Amount</p>
                  <p className="text-lg font-semibold">₦{formatCurrency(expenseData.paidAmount)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Balance Due</p>
                  <p className="text-lg font-semibold">₦{formatCurrency(expenseData.balanceDue)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Payment Date</p>
                  <p className="text-lg font-semibold">
                    {expenseData.lastPaymentDate ? formatDate(expenseData.lastPaymentDate) : 'Not paid'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Reimbursable</p>
                  <Badge variant={expenseData.isReimbursable ? "default" : "secondary"}>
                    {expenseData.isReimbursable ? "Yes" : "No"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Reimbursed</p>
                  <Badge variant={expenseData.isReimbursed ? "default" : "secondary"}>
                    {expenseData.isReimbursed ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Recurring</p>
                  <Badge variant={expenseData.isRecurring ? "default" : "secondary"}>
                    {expenseData.isRecurring ? "Yes" : "No"}
                  </Badge>
                </div>
                {expenseData.isRecurring && expenseData.recurringFrequency && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Recurring Frequency</p>
                    <p className="text-lg font-semibold capitalize">{expenseData.recurringFrequency}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {expenseData.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{expenseData.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Reference Information */}
          {expenseData.reference && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Reference Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="text-sm font-medium text-gray-500">Reference</p>
                  <p className="text-lg">{expenseData.reference}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Receipt */}
          {expenseData.receipt && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Receipt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Receipt URL</p>
                  <a 
                    href={expenseData.receipt} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    View Receipt
                  </a>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {expenseData.tags && expenseData.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {expenseData.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Date Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Date Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Created</p>
                  <p className="text-lg">{formatDate(expenseData.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Updated</p>
                  <p className="text-lg">{formatDate(expenseData.updated_at)}</p>
                </div>
              </div>
              
              {expenseData.approvedAt && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Approved At</p>
                    <p className="text-lg">{formatDate(expenseData.approvedAt)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}