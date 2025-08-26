export interface Profile {
  id: string
  full_name: string | null
  company_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
  deletedAt: string
}

export type Business = {
  id: string
  name: string
  description?: string
  logo_url?: string
  address?: string
  phone?: string
  email?: string
  website?: string
  tax_id?: string
  created_by: string
  created_at: string
  updated_at: string
}

export type BusinessUser = {
  id: string
  business_id: string
  user_id: string
  role: "admin" | "manager" | "member" | "viewer"
  status: "pending" | "accepted" | "rejected"
  created_at: string
  updated_at: string
  deletedAt: string
}

export type Customer = {
  businessId: string
  name: string
  email?: string
  phone?: string
  address?: string
  customerType: "INDIVIDUAL" | "BUSINESS"
  outstandingBalance?: number
  billingAddress?: string
  shippingAddress?: string
  city?: string
  state?: string
  country?: string
  createdAt?: string
  updatedAt?: string
}

export type BusinessInvitation = {
  id: string
  business_id: string
  email: string
  role: "admin" | "manager" | "member" | "viewer"
  token: string
  created_at: string
  expires_at: string
}

export interface BusinessUserExtended {
  id: string
  business_id: string
  user_id: string
  role: UserRole
  status: InvitationStatus
  created_at: string
  updated_at: string
  business?: Business
  profile?: Profile
}

export type UserRole = "admin" | "manager" | "member" | "viewer"
export type InvitationStatus = "pending" | "accepted" | "rejected"

export type Sale = {
  id: string
  user_id: string
  business_id: string
  customer_name: string
  amount: number
  description?: string
  sale_date: string
  created_at: string
  payment_method?: PaymentMethod
  status?: SaleStatus
  bank_id?: string
  card_id?: string
}

export type Expense = {
  id: string
  user_id: string
  business_id: string
  category: string
  amount: number
  description?: string
  expense_date: string
  created_at: string
  payment_method?: PaymentMethod
  status?: PaymentStatus
  bank_id?: string
  card_id?: string
}

export type InventoryItem = {
  id: string
  user_id: string
  business_id: string
  name: string
  category?: string
  available_quantity: number
  unit_price: number
  description?: string
  created_at: string
}

export type Purchase = {
  id: string
  user_id: string
  business_id: string
  supplier: string
  amount: number
  description?: string
  purchase_date: string
  created_at: string
  payment_method?: PaymentMethod
  status?: PaymentStatus
  bank_id?: string
  card_id?: string
}

export type Bank = {
  id: string
  user_id: string
  business_id: string
  name: string
  cards:BankCard[]
  account_number?: string
  account_type: AccountType
  balance: number
  is_active: boolean
  created_at: string
}

export type BankCard = {
  id: string
  bank_id: string
  user_id: string
  business_id: string
  card_type: CardType
  card_number?: string
  card_holder?: string
  expiry_date?: string
  balance: number
  credit_limit?: number
  is_active: boolean
  created_at: string
}

export type BankTransaction = {
  id: string
  bank_id: string
  bank:{
    name:string
  }
   card?: {
    card_number?: string
  }
  card_id?: string
  user_id: string
  business_id: string
  transaction_date: string
  description: string
  amount: number
  transaction_type: TransactionType
  category?: string
  reference_number?: string
  is_reconciled: boolean
  created_at: string
}

export type TransactionType = "deposit" | "withdrawal" | "transfer" | "payment"
export type CardType = "credit" | "debit"
export type AccountType = "checking" | "savings" | "business" | "investment"
export type PaymentMethod = "cash" | "bank_transfer" | "card"| "mobile_money" | "cheque"
export type PaymentStatus = "paid" | 'unpaid' | 'part_payment' | "failed" | "refunded" | "pending"
export type SaleStatus = "draft" | "pending" | "part_payment" | "paid" | "overdue" | "cancelled"
export type ExpenseStatus = "completed" | "pending" | "cancelled"
// export type  