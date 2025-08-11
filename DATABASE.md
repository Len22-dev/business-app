# Database Schema Documentation

## Overview

This document describes the comprehensive database schema for the multi-tenant business management application. The schema is designed to support sales, inventory, customer management, vendor management, transactions, accounting, expenses, and invoice generation.

## Technology Stack

- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Migration Tool**: Drizzle Kit
- **Type Safety**: TypeScript with inferred types

## Schema Architecture

### Multi-Tenant Design

The application uses a **shared database, shared schema** multi-tenancy model where:
- All businesses share the same database and tables
- Data isolation is achieved through `businessId` foreign keys
- Row-level security ensures businesses can only access their own data

### Core Tables

#### 1. Users (`users`)
Stores user account information.

```typescript
- id: UUID (Primary Key)
- email: Text (Unique, Not Null)
- fullName: Text (Not Null)
- phoneNumber: VARCHAR(20)
- avatar: Text
- isActive: Boolean (Default: true)
- emailVerified: Boolean (Default: false)
- createdAt: Timestamp
- updatedAt: Timestamp
```

#### 2. Businesses (`businesses`)
Stores business/company information.

```typescript
- id: UUID (Primary Key)
- name: Text (Not Null)
- description: Text
- email: Text
- phone: VARCHAR(20)
- website: Text
- logo: Text
- address: JSONB (Address object)
- taxId: VARCHAR(50)
- currency: VARCHAR(3) (Default: 'USD')
- timezone: VARCHAR(50) (Default: 'UTC')
- fiscalYearStart: Integer (Default: 1) // Month 1-12
- isActive: Boolean (Default: true)
- createdAt: Timestamp
- updatedAt: Timestamp
```

#### 3. Business Users (`business_users`)
Junction table for user-business relationships with roles.

```typescript
- id: UUID (Primary Key)
- businessId: UUID (Foreign Key to businesses)
- userId: UUID (Foreign Key to users)
- role: Enum ('owner', 'admin', 'manager', 'employee', 'accountant')
- permissions: JSONB (Custom permissions object)
- isActive: Boolean (Default: true)
- invitedAt: Timestamp
- joinedAt: Timestamp
- createdAt: Timestamp
- updatedAt: Timestamp
```

### Product & Inventory Management

#### 4. Categories (`categories`)
Hierarchical categories for products, expenses, and income.

```typescript
- id: UUID (Primary Key)
- businessId: UUID (Foreign Key to businesses)
- name: Text (Not Null)
- description: Text
- parentId: UUID (Self-referencing Foreign Key)
- type: VARCHAR(20) ('product', 'expense', 'income')
- isActive: Boolean (Default: true)
- createdAt: Timestamp
- updatedAt: Timestamp
```

#### 5. Products (`products`)
Product catalog with specifications.

```typescript
- id: UUID (Primary Key)
- businessId: UUID (Foreign Key to businesses)
- categoryId: UUID (Foreign Key to categories)
- name: Text (Not Null)
- description: Text
- sku: VARCHAR(100)
- barcode: VARCHAR(100)
- unitPrice: Decimal(10,2) (Not Null)
- costPrice: Decimal(10,2)
- images: JSONB (Array of image URLs)
- specifications: JSONB (Product specifications)
- isActive: Boolean (Default: true)
- trackInventory: Boolean (Default: true)
- createdAt: Timestamp
- updatedAt: Timestamp
```

#### 6. Inventory (`inventory`)
Stock levels and inventory tracking.

```typescript
- id: UUID (Primary Key)
- businessId: UUID (Foreign Key to businesses)
- productId: UUID (Foreign Key to products)
- quantity: Integer (Default: 0)
- reservedQuantity: Integer (Default: 0)
- reorderLevel: Integer (Default: 0)
- maxStockLevel: Integer
- location: Text
- lastRestocked: Timestamp
- createdAt: Timestamp
- updatedAt: Timestamp
```

### Customer & Vendor Management

#### 7. Customers (`customers`)
Customer information and billing details.

```typescript
- id: UUID (Primary Key)
- businessId: UUID (Foreign Key to businesses)
- name: Text (Not Null)
- email: Text
- phone: VARCHAR(20)
- company: Text
- taxId: VARCHAR(50)
- billingAddress: JSONB
- shippingAddress: JSONB
- paymentTerms: Integer (Default: 30) // Days
- creditLimit: Decimal(10,2)
- notes: Text
- isActive: Boolean (Default: true)
- createdAt: Timestamp
- updatedAt: Timestamp
```

#### 8. Vendors (`vendors`)
Supplier/vendor information.

```typescript
- id: UUID (Primary Key)
- businessId: UUID (Foreign Key to businesses)
- name: Text (Not Null)
- email: Text
- phone: VARCHAR(20)
- company: Text
- taxId: VARCHAR(50)
- address: JSONB
- paymentTerms: Integer (Default: 30)
- notes: Text
- isActive: Boolean (Default: true)
- createdAt: Timestamp
- updatedAt: Timestamp
```

### Sales Management

#### 9. Sales (`sales`)
Sales transactions with line items.

```typescript
- id: UUID (Primary Key)
- businessId: UUID (Foreign Key to businesses)
- customerId: UUID (Foreign Key to customers)
- saleNumber: VARCHAR(50) (Not Null)
- saleDate: Timestamp
- dueDate: Timestamp
- subtotal: Decimal(10,2) (Not Null)
- taxAmount: Decimal(10,2) (Default: 0)
- discountAmount: Decimal(10,2) (Default: 0)
- totalAmount: Decimal(10,2) (Not Null)
- paidAmount: Decimal(10,2) (Default: 0)
- status: VARCHAR(20) (Default: 'pending')
- notes: Text
- metadata: JSONB
- createdAt: Timestamp
- updatedAt: Timestamp
```

#### 10. Sale Items (`sale_items`)
Line items for sales.

```typescript
- id: UUID (Primary Key)
- saleId: UUID (Foreign Key to sales)
- productId: UUID (Foreign Key to products)
- quantity: Integer (Not Null)
- unitPrice: Decimal(10,2) (Not Null)
- totalPrice: Decimal(10,2) (Not Null)
- createdAt: Timestamp
```

### Purchase Management

#### 11. Purchases (`purchases`)
Purchase orders and transactions.

```typescript
- id: UUID (Primary Key)
- businessId: UUID (Foreign Key to businesses)
- vendorId: UUID (Foreign Key to vendors)
- purchaseNumber: VARCHAR(50) (Not Null)
- purchaseDate: Timestamp
- dueDate: Timestamp
- subtotal: Decimal(10,2) (Not Null)
- taxAmount: Decimal(10,2) (Default: 0)
- totalAmount: Decimal(10,2) (Not Null)
- paidAmount: Decimal(10,2) (Default: 0)
- status: VARCHAR(20) (Default: 'pending')
- notes: Text
- createdAt: Timestamp
- updatedAt: Timestamp
```

#### 12. Purchase Items (`purchase_items`)
Line items for purchases.

```typescript
- id: UUID (Primary Key)
- purchaseId: UUID (Foreign Key to purchases)
- productId: UUID (Foreign Key to products)
- quantity: Integer (Not Null)
- unitPrice: Decimal(10,2) (Not Null)
- totalPrice: Decimal(10,2) (Not Null)
- createdAt: Timestamp
```

### Invoice Management

#### 13. Invoices (`invoices`)
Customer invoices with payment tracking.

```typescript
- id: UUID (Primary Key)
- businessId: UUID (Foreign Key to businesses)
- customerId: UUID (Foreign Key to customers)
- saleId: UUID (Foreign Key to sales)
- invoiceNumber: VARCHAR(50) (Not Null)
- issueDate: Timestamp
- dueDate: Timestamp (Not Null)
- subtotal: Decimal(10,2) (Not Null)
- taxAmount: Decimal(10,2) (Default: 0)
- discountAmount: Decimal(10,2) (Default: 0)
- totalAmount: Decimal(10,2) (Not Null)
- paidAmount: Decimal(10,2) (Default: 0)
- status: Enum ('draft', 'sent', 'paid', 'overdue', 'cancelled')
- notes: Text
- terms: Text
- createdAt: Timestamp
- updatedAt: Timestamp
```

#### 14. Invoice Items (`invoice_items`)
Line items for invoices.

```typescript
- id: UUID (Primary Key)
- invoiceId: UUID (Foreign Key to invoices)
- productId: UUID (Foreign Key to products)
- description: Text (Not Null)
- quantity: Integer (Not Null)
- unitPrice: Decimal(10,2) (Not Null)
- totalPrice: Decimal(10,2) (Not Null)
- createdAt: Timestamp
```

### Payment Management

#### 15. Payments (`payments`)
Payment records for invoices and expenses.

```typescript
- id: UUID (Primary Key)
- businessId: UUID (Foreign Key to businesses)
- invoiceId: UUID (Foreign Key to invoices)
- customerId: UUID (Foreign Key to customers)
- vendorId: UUID (Foreign Key to vendors)
- amount: Decimal(10,2) (Not Null)
- paymentDate: Timestamp
- paymentMethod: VARCHAR(50)
- reference: VARCHAR(100)
- status: Enum ('pending', 'completed', 'failed', 'refunded')
- notes: Text
- createdAt: Timestamp
- updatedAt: Timestamp
```

### Banking

#### 16. Banks (`banks`)
Bank account information.

```typescript
- id: UUID (Primary Key)
- businessId: UUID (Foreign Key to businesses)
- bankName: Text (Not Null)
- accountName: Text (Not Null)
- accountNumber: VARCHAR(50) (Not Null)
- accountType: VARCHAR(20)
- routingNumber: VARCHAR(20)
- balance: Decimal(15,2) (Default: 0)
- currency: VARCHAR(3) (Default: 'USD')
- isActive: Boolean (Default: true)
- createdAt: Timestamp
- updatedAt: Timestamp
```

#### 17. Bank Transactions (`bank_transactions`)
Bank transaction records with reconciliation.

```typescript
- id: UUID (Primary Key)
- businessId: UUID (Foreign Key to businesses)
- bankId: UUID (Foreign Key to banks)
- transactionDate: Timestamp (Not Null)
- description: Text (Not Null)
- amount: Decimal(15,2) (Not Null)
- type: Enum ('income', 'expense', 'transfer')
- category: Text
- reference: VARCHAR(100)
- balance: Decimal(15,2)
- isReconciled: Boolean (Default: false)
- reconciledAt: Timestamp
- createdAt: Timestamp
- updatedAt: Timestamp
```

### Transactions & Expenses

#### 18. Transactions (`transactions`)
General business transactions.

```typescript
- id: UUID (Primary Key)
- businessId: UUID (Foreign Key to businesses)
- categoryId: UUID (Foreign Key to categories)
- type: Enum ('income', 'expense', 'transfer')
- amount: Decimal(10,2) (Not Null)
- description: Text (Not Null)
- transactionDate: Timestamp
- reference: VARCHAR(100)
- status: Enum ('pending', 'completed', 'cancelled', 'failed')
- attachments: JSONB (Array of file URLs)
- metadata: JSONB
- createdAt: Timestamp
- updatedAt: Timestamp
```

#### 19. Expenses (`expenses`)
Business expense tracking.

```typescript
- id: UUID (Primary Key)
- businessId: UUID (Foreign Key to businesses)
- categoryId: UUID (Foreign Key to categories)
- vendorId: UUID (Foreign Key to vendors)
- amount: Decimal(10,2) (Not Null)
- description: Text (Not Null)
- expenseDate: Timestamp
- paymentMethod: VARCHAR(50)
- reference: VARCHAR(100)
- receipt: Text (File URL)
- isReimbursable: Boolean (Default: false)
- isRecurring: Boolean (Default: false)
- recurringFrequency: VARCHAR(20)
- tags: JSONB (Array of tags)
- createdAt: Timestamp
- updatedAt: Timestamp
```

### Tax Management

#### 20. Tax Rates (`tax_rates`)
Configurable tax rates for different transaction types.

```typescript
- id: UUID (Primary Key)
- businessId: UUID (Foreign Key to businesses)
- name: Text (Not Null)
- rate: Decimal(5,4) (Not Null) // e.g., 0.0825 for 8.25%
- type: VARCHAR(20) ('sales', 'purchase', 'income')
- isDefault: Boolean (Default: false)
- isActive: Boolean (Default: true)
- createdAt: Timestamp
- updatedAt: Timestamp
```

### Configuration & Settings

#### 21. Settings (`settings`)
Business-specific configuration settings.

```typescript
- id: UUID (Primary Key)
- businessId: UUID (Foreign Key to businesses)
- key: VARCHAR(100) (Not Null)
- value: JSONB
- description: Text
- createdAt: Timestamp
- updatedAt: Timestamp
```

#### 22. Reports (`reports`)
Saved report configurations.

```typescript
- id: UUID (Primary Key)
- businessId: UUID (Foreign Key to businesses)
- name: Text (Not Null)
- type: VARCHAR(50) ('profit_loss', 'balance_sheet', 'cash_flow', etc.)
- configuration: JSONB
- isPublic: Boolean (Default: false)
- createdBy: UUID (Foreign Key to users)
- createdAt: Timestamp
- updatedAt: Timestamp
```

### Subscription Management

#### 23. Subscriptions (`subscriptions`)
Business subscription and billing information.

```typescript
- id: UUID (Primary Key)
- businessId: UUID (Foreign Key to businesses)
- planName: VARCHAR(50) (Not Null)
- status: Enum ('active', 'inactive', 'cancelled', 'past_due', 'trialing')
- currentPeriodStart: Timestamp (Not Null)
- currentPeriodEnd: Timestamp (Not Null)
- trialEnd: Timestamp
- cancelledAt: Timestamp
- amount: Decimal(10,2)
- currency: VARCHAR(3) (Default: 'USD')
- stripeSubscriptionId: Text
- metadata: JSONB
- createdAt: Timestamp
- updatedAt: Timestamp
```

### Notifications & Audit

#### 24. Notifications (`notifications`)
User and business notifications.

```typescript
- id: UUID (Primary Key)
- businessId: UUID (Foreign Key to businesses)
- userId: UUID (Foreign Key to users)
- title: Text (Not Null)
- message: Text (Not Null)
- type: Enum ('info', 'warning', 'error', 'success')
- isRead: Boolean (Default: false)
- actionUrl: Text
- metadata: JSONB
- expiresAt: Timestamp
- createdAt: Timestamp
```

#### 25. Audit Logs (`audit_logs`)
Comprehensive audit trail for all business operations.

```typescript
- id: UUID (Primary Key)
- businessId: UUID (Foreign Key to businesses)
- userId: UUID (Foreign Key to users)
- action: VARCHAR(50) ('create', 'update', 'delete')
- tableName: VARCHAR(50) (Not Null)
- recordId: UUID (Not Null)
- oldValues: JSONB
- newValues: JSONB
- ipAddress: VARCHAR(45)
- userAgent: Text
- createdAt: Timestamp
```

## Database Setup

### Prerequisites

1. PostgreSQL database (local or cloud)
2. Node.js and npm installed
3. Environment variables configured

### Environment Variables

Create a `.env.local` file with:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/businessapp"
```

### Installation

1. Install dependencies:
```bash
npm install
```

2. Generate migration files:
```bash
npm run db:generate
```

3. Run migrations:
```bash
npm run db:migrate
```

4. Seed the database with sample data:
```bash
npm run db:seed
```

### Available Scripts

- `npm run db:generate` - Generate migration files from schema
- `npm run db:migrate` - Run pending migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Drizzle Studio for database exploration
- `npm run db:push` - Push schema changes directly (development only)
- `npm run db:reset` - Drop all tables, regenerate, migrate, and seed

## Key Features

### Multi-Tenancy
- Row-level security through `businessId` foreign keys
- Shared database architecture for cost efficiency
- Business isolation at the application level

### Audit Trail
- Complete audit logging for all business operations
- Track who made changes, when, and what changed
- IP address and user agent tracking

### Flexible Categorization
- Hierarchical categories for products, expenses, and income
- Self-referencing parent-child relationships
- Type-based categorization

### Inventory Management
- Real-time stock tracking
- Reserved quantity for pending orders
- Reorder level alerts
- Location-based inventory

### Financial Management
- Multi-currency support
- Tax rate management
- Payment tracking
- Bank reconciliation

### Subscription Management
- Built-in subscription handling
- Trial period support
- Integration-ready for payment processors

### Notification System
- User and business-level notifications
- Expiration handling
- Read/unread status tracking

## Performance Considerations

### Indexes
- Primary keys on all tables
- Foreign key indexes for relationships
- Business-specific indexes for multi-tenant queries
- Date-based indexes for time-series data

### Query Optimization
- Pre-built query functions in `queries.ts`
- Efficient joins using Drizzle relations
- Pagination support for large datasets

### Scalability
- Horizontal scaling through business partitioning
- Efficient multi-tenant queries
- Optimized for read-heavy workloads

## Security

### Data Isolation
- Business-level data isolation
- Foreign key constraints
- Application-level access control

### Audit & Compliance
- Complete audit trail
- Soft deletes for important records
- Timestamp tracking for all operations

### Access Control
- Role-based permissions
- Custom permission objects
- Business user management

This schema provides a solid foundation for a comprehensive business management application with proper multi-tenancy, audit trails, and scalability considerations.