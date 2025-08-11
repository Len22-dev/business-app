/**
 * Example usage of the modal forms for Sales, Expenses, and Purchases
 * 
 * This file demonstrates how to integrate the modal forms with your components
 * using the proper hooks and state management.
 */

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

// Sales Modal Imports
import { CreateSaleModal, EditSaleModal, ViewSaleModal } from './sales/modal'

// Expenses Modal Imports  
import { CreateExpenseModal, EditExpenseModal, ViewExpenseModal } from './expenses/modal'

// Purchase Modal Imports
import { CreatePurchaseModal, EditPurchaseModal, ViewPurchaseModal } from './purchase/modal'

interface ModalExamplesProps {
  businessId: string
}

export function ModalExamples({ businessId }: ModalExamplesProps) {
  // Sales Modal States
  const [createSaleOpen, setCreateSaleOpen] = useState(false)
  const [editSaleOpen, setEditSaleOpen] = useState(false)
  const [viewSaleOpen, setViewSaleOpen] = useState(false)
  const [selectedSaleId, setSelectedSaleId] = useState<string>('')

  // Expenses Modal States
  const [createExpenseOpen, setCreateExpenseOpen] = useState(false)
  const [editExpenseOpen, setEditExpenseOpen] = useState(false)
  const [viewExpenseOpen, setViewExpenseOpen] = useState(false)
  const [selectedExpenseId, setSelectedExpenseId] = useState<string>('')

  // Purchase Modal States
  const [createPurchaseOpen, setCreatePurchaseOpen] = useState(false)
  const [editPurchaseOpen, setEditPurchaseOpen] = useState(false)
  const [viewPurchaseOpen, setViewPurchaseOpen] = useState(false)
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<string>('')

  // Example handlers for opening edit/view modals
  const handleEditSale = (saleId: string) => {
    setSelectedSaleId(saleId)
    setEditSaleOpen(true)
  }

  const handleViewSale = (saleId: string) => {
    setSelectedSaleId(saleId)
    setViewSaleOpen(true)
  }

  const handleEditExpense = (expenseId: string) => {
    setSelectedExpenseId(expenseId)
    setEditExpenseOpen(true)
  }

  const handleViewExpense = (expenseId: string) => {
    setSelectedExpenseId(expenseId)
    setViewExpenseOpen(true)
  }

  const handleEditPurchase = (purchaseId: string) => {
    setSelectedPurchaseId(purchaseId)
    setEditPurchaseOpen(true)
  }

  const handleViewPurchase = (purchaseId: string) => {
    setSelectedPurchaseId(purchaseId)
    setViewPurchaseOpen(true)
  }

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold">Modal Forms Examples</h1>
      
      {/* Sales Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Sales Modals</h2>
        <div className="flex gap-4">
          <Button onClick={() => setCreateSaleOpen(true)}>
            Create Sale
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleEditSale('example-sale-id')}
          >
            Edit Sale
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => handleViewSale('example-sale-id')}
          >
            View Sale
          </Button>
        </div>
      </div>

      {/* Expenses Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Expense Modals</h2>
        <div className="flex gap-4">
          <Button onClick={() => setCreateExpenseOpen(true)}>
            Create Expense
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleEditExpense('example-expense-id')}
          >
            Edit Expense
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => handleViewExpense('example-expense-id')}
          >
            View Expense
          </Button>
        </div>
      </div>

      {/* Purchase Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Purchase Modals</h2>
        <div className="flex gap-4">
          <Button onClick={() => setCreatePurchaseOpen(true)}>
            Create Purchase
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleEditPurchase('example-purchase-id')}
          >
            Edit Purchase
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => handleViewPurchase('example-purchase-id')}
          >
            View Purchase
          </Button>
        </div>
      </div>

      {/* Sales Modals */}
      <CreateSaleModal
        businessId={businessId}
        open={createSaleOpen}
        onOpenChange={setCreateSaleOpen}
      />
      
      <EditSaleModal
        businessId={businessId}
        saleId={selectedSaleId}
        open={editSaleOpen}
        onOpenChange={setEditSaleOpen}
      />
      
      <ViewSaleModal
        saleId={selectedSaleId}
        open={viewSaleOpen}
        onOpenChange={setViewSaleOpen}
      />

      {/* Expense Modals */}
      <CreateExpenseModal
        businessId={businessId}
        open={createExpenseOpen}
        onOpenChange={setCreateExpenseOpen}
      />
      
      <EditExpenseModal
        businessId={businessId}
        expenseId={selectedExpenseId}
        open={editExpenseOpen}
        onOpenChange={setEditExpenseOpen}
      />
      
      <ViewExpenseModal
        expenseId={selectedExpenseId}
        open={viewExpenseOpen}
        onOpenChange={setViewExpenseOpen}
      />

      {/* Purchase Modals */}
      <CreatePurchaseModal
        businessId={businessId}
        open={createPurchaseOpen}
        onOpenChange={setCreatePurchaseOpen}
      />
      
      <EditPurchaseModal
        businessId={businessId}
        purchaseId={selectedPurchaseId}
        open={editPurchaseOpen}
        onOpenChange={setEditPurchaseOpen}
      />
      
      <ViewPurchaseModal
        purchaseId={selectedPurchaseId}
        open={viewPurchaseOpen}
        onOpenChange={setViewPurchaseOpen}
      />
    </div>
  )
}

/**
 * Usage in your actual components:
 * 
 * 1. Import the specific modal you need:
 *    import { CreateSaleModal } from '@/app/protected/_components/sales/modal'
 * 
 * 2. Add state for modal visibility:
 *    const [isCreateSaleOpen, setIsCreateSaleOpen] = useState(false)
 * 
 * 3. Add the modal to your JSX:
 *    <CreateSaleModal
 *      businessId={businessId}
 *      open={isCreateSaleOpen}
 *      onOpenChange={setIsCreateSaleOpen}
 *    />
 * 
 * 4. Trigger the modal with a button:
 *    <Button onClick={() => setIsCreateSaleOpen(true)}>
 *      Create Sale
 *    </Button>
 * 
 * The modals will automatically:
 * - Handle form validation using Zod schemas
 * - Make API calls using the appropriate hooks
 * - Show success/error toasts
 * - Reset forms and close on success
 * - Handle loading states
 */