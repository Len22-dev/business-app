import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { users } from './schema/users-schema';
import { businesses, businessUsers, locations } from './schema/businesses-schema';
import { subscriptions } from './schema/subscriptions-schema';
import { categories, products } from './schema/products-schema';
import { inventory, inventoryLocations } from './schema/inventory-schema';
import { customers } from './schema/customer-schema';
import { vendors } from './schema/vendor-schema';
import { saleItems, sales } from './schema/sales-schema';
import { purchaseItems, purchases } from './schema/purchase-schema';
import { invoiceItems, invoices } from './schema/invoice-schema';
import { payments } from './schema/payment-schema';
import { banks, bankTransactions } from './schema/banking-schema';
import { transactions } from './schema/transactions-schema';
import { expenses } from './schema/expenses-schema';
import { taxRates } from './schema/tax-schema';
import { settings } from './schema/settings-schema';
import { reports } from './schema/report-schema';
import { notifications } from './schema/notifications-schema';
import { auditLogs } from './schema/auditLogs-schema';
import { accounts, journalEntries, ledgerEntries } from './schema/accounts-schema';
import { documents, projects, returns } from './schema';


// User Types
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

// Business Types
export type Business = InferSelectModel<typeof businesses>;
export type NewBusiness = InferInsertModel<typeof businesses>;

export type BusinessUser = InferSelectModel<typeof businessUsers>;
export type NewBusinessUser = InferInsertModel<typeof businessUsers>;

// Subscription Types
export type Subscription = InferSelectModel<typeof subscriptions>;
export type NewSubscription = InferInsertModel<typeof subscriptions>;

// Category Types
export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;

// Location Types
export type Location = InferSelectModel<typeof locations>;
export type NewLocation = InferInsertModel<typeof locations>;

// Inventory Location/warehouse Types
export type InventoryLocation = InferSelectModel<typeof inventoryLocations>;
export type NewInventoryLocation = InferInsertModel<typeof inventoryLocations>;

// Product Types
export type Product = InferSelectModel<typeof products>;
export type NewProduct = InferInsertModel<typeof products>;

export type Inventory = InferSelectModel<typeof inventory>;
export type NewInventory = InferInsertModel<typeof inventory>;

// Customer & Vendor Types
export type Customer = InferSelectModel<typeof customers>;
export type NewCustomer = InferInsertModel<typeof customers>;

export type Vendor = InferSelectModel<typeof vendors>;
export type NewVendor = InferInsertModel<typeof vendors>;

export type Document = InferSelectModel<typeof documents>;
export type NewDocument = InferInsertModel<typeof documents>;

// Sales Types
export type Sale = InferSelectModel<typeof sales>;
export type NewSale = InferInsertModel<typeof sales>;

export type SaleItem = InferSelectModel<typeof saleItems>;
export type NewSaleItem = InferInsertModel<typeof saleItems>;

// Purchase Types
export type Purchase = InferSelectModel<typeof purchases>;
export type NewPurchase = InferInsertModel<typeof purchases>;

export type PurchaseItem = InferSelectModel<typeof purchaseItems>;
export type NewPurchaseItem = InferInsertModel<typeof purchaseItems>;

// Invoice Types
export type Invoice = InferSelectModel<typeof invoices>;
export type NewInvoice = InferInsertModel<typeof invoices>;

export type InvoiceItem = InferSelectModel<typeof invoiceItems>;
export type NewInvoiceItem = InferInsertModel<typeof invoiceItems>;

// Payment Types
export type Payment = InferSelectModel<typeof payments>;
export type NewPayment = InferInsertModel<typeof payments>;

// Banking Types
export type Bank = InferSelectModel<typeof banks>;
export type NewBank = InferInsertModel<typeof banks>;

export type BankTransaction = InferSelectModel<typeof bankTransactions>;
export type NewBankTransaction = InferInsertModel<typeof bankTransactions>;

// Transaction Types
export type Transaction = InferSelectModel<typeof transactions>;
export type NewTransaction = InferInsertModel<typeof transactions>;

export type Expense = InferSelectModel<typeof expenses>;
export type NewExpense = InferInsertModel<typeof expenses>;

// Tax Types
export type TaxRate = InferSelectModel<typeof taxRates>;
export type NewTaxRate = InferInsertModel<typeof taxRates>;

// Settings Types
export type Setting = InferSelectModel<typeof settings>;
export type NewSetting = InferInsertModel<typeof settings>;

// Report Types
export type Report = InferSelectModel<typeof reports>;
export type NewReport = InferInsertModel<typeof reports>;

// Projects Types
export type Projects = InferSelectModel<typeof projects>;
export type NewProjects = InferInsertModel<typeof projects>;

// Task Types
export type Returns = InferSelectModel<typeof returns>;
export type NewReturns = InferInsertModel<typeof returns>;

// Notification Types
export type Notification = InferSelectModel<typeof notifications>;
export type NewNotification = InferInsertModel<typeof notifications>;

// Audit Log Types
export type AuditLog = InferSelectModel<typeof auditLogs>;
export type NewAuditLog = InferInsertModel<typeof auditLogs>;

// Accounting Types
export type Account = InferSelectModel<typeof accounts>;
export type NewAccount = InferInsertModel<typeof accounts>;

export type JournalEntry = InferSelectModel<typeof journalEntries>;
export type NewJournalEntry = InferInsertModel<typeof journalEntries>;

export type LedgerEntry = InferSelectModel<typeof ledgerEntries>;
export type NewLedgerEntry = InferInsertModel<typeof ledgerEntries>;

// Extended Types
export type AccountWithChildren = Account & {
  children: Account[];
  ledgerEntries: LedgerEntry[];
};

export type JournalEntryWithLedger = JournalEntry & {
  ledgerEntries: LedgerEntry[];
};

export type LedgerEntryWithRelations = LedgerEntry & {
  account: Account;
  journalEntry: JournalEntry;
};

// Enum Types
export type UserRole = 'owner' | 'admin' | 'manager' | 'employee' | 'accountant';
export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'past_due' | 'trialing';
export type TransactionType = 'income' | 'expense' | 'transfer';
export type TransactionStatus = 'pending' | 'completed' | 'cancelled' | 'failed';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'part_payment'| 'unpaid';
export type NotificationType = 'info' | 'warning' | 'error' | 'success';

// Extended Types with Relations
export type UserWithBusinesses = User & {
  businessUsers: (BusinessUser & {
    business: Business;
  })[];
};

export type BusinessWithUsers = Business & {
  businessUsers: (BusinessUser & {
    user: User;
  })[];
  subscription?: Subscription;
};

export type ProductWithInventory = Product & {
  inventory?: Inventory;
  category?: Category;
};

export type SaleWithItems = Sale & {
  saleItems: (SaleItem & {
    product: Product;
  })[];
  customer?: Customer;
};

export type PurchaseWithItems = Purchase & {
  purchaseItems: (PurchaseItem & {
    product: Product;
  })[];
  vendor?: Vendor;
};

export type InvoiceWithItems = Invoice & {
  invoiceItems: (InvoiceItem & {
    product?: Product;
  })[];
  customer?: Customer;
  sale?: Sale;
};

export type BankWithTransactions = Bank & {
  bankTransactions: BankTransaction[];
};

// Address Type (used in JSONB fields)
export interface Address {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

// Permissions Type (used in business_users)
export interface Permissions {
  canManageUsers?: boolean;
  canManageProducts?: boolean;
  canManageSales?: boolean;
  canManagePurchases?: boolean;
  canManageInvoices?: boolean;
  canManageExpenses?: boolean;
  canManageBanking?: boolean;
  canViewReports?: boolean;
  canManageSettings?: boolean;
  customPermissions?: string[];
}

// Metadata Types
export interface SaleMetadata {
  source?: string;
  channel?: string;
  tags?: string[];
  customFields?: Record<string, unknown>;
}

export interface ProductSpecifications {
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  color?: string;
  material?: string;
  warranty?: string;
  customSpecs?: Record<string, unknown>;
}

export interface NotificationMetadata {
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  relatedId?: string;
  relatedType?: string;
}

// Report Configuration Types
export interface ReportConfiguration {
  dateRange?: {
    start: string;
    end: string;
  };
  filters?: Record<string, unknown>;
  groupBy?: string[];
  sortBy?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  includeSubCategories?: boolean;
  currency?: string;
}