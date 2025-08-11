CREATE TYPE "public"."account_type" AS ENUM('asset', 'liability', 'equity', 'income', 'expense', 'accounts_receivable', 'accounts_payable', 'bank', 'cash', 'other');--> statement-breakpoint
CREATE TYPE "public"."customer_types" AS ENUM('INDIVIDUAL', 'BUSINESS');--> statement-breakpoint
CREATE TYPE "public"."document_type" AS ENUM('invoice', 'receipt', 'contract', 'general', 'avatar');--> statement-breakpoint
CREATE TYPE "public"."attendance_status" AS ENUM('present', 'absent', 'late', 'early_out', 'holiday');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('cash', 'bank_transfer', 'card', 'cheque', 'mobile_money');--> statement-breakpoint
CREATE TYPE "public"."expense_status" AS ENUM('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'PAID');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('Pending', 'Confirmed', 'Cancelled', 'Partially_Fulfilled');--> statement-breakpoint
CREATE TYPE "public"."stock_movement" AS ENUM('in', 'out', 'adjustment');--> statement-breakpoint
CREATE TYPE "public"."invoice_status" AS ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('info', 'warning', 'error', 'success');--> statement-breakpoint
CREATE TYPE "public"."allocation_type" AS ENUM('INVOICE', 'ADVANCE', 'REFUND', 'ADJUSTMENT');--> statement-breakpoint
CREATE TYPE "public"."payer_type" AS ENUM('CUSTOMER', 'VENDOR', 'EMPLOYEE', 'COMPANY');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED');--> statement-breakpoint
CREATE TYPE "public"."source_type" AS ENUM('SALES', 'PURCHASE', 'EXPENSE');--> statement-breakpoint
CREATE TYPE "public"."transaction_status" AS ENUM('draft', 'pending', 'approved', 'rejected', 'completed', 'cancelled', 'failed');--> statement-breakpoint
CREATE TYPE "public"."sales_status" AS ENUM('draft', 'pending', 'part_payment', 'paid', 'overdue', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'inactive', 'cancelled', 'past_due', 'trialing');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('sales', 'payment', 'payroll', 'purchase', 'expense', 'journal', 'transfer');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('owner', 'admin', 'manager', 'employee', 'accountant');--> statement-breakpoint
CREATE TYPE "public"."work_flow_step_type" AS ENUM('approval', 'review', 'notification');--> statement-breakpoint
CREATE TYPE "public"."work_flow_type" AS ENUM('approval', 'review', 'notification');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"parent_id" uuid,
	"code" varchar(20) NOT NULL,
	"name" text NOT NULL,
	"type" "account_type" NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "journal_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"memo" text,
	"reference" varchar(100),
	"created_by" uuid,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "ledger_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"journal_entry_id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"business_id" uuid NOT NULL,
	"debit_amount" integer DEFAULT 0,
	"credit_amount" integer DEFAULT 0,
	"description" text,
	"reference_type" text,
	"related_customer_id" uuid,
	"related_vendor_id" uuid,
	"related_invoice_id" uuid,
	"related_expense_id" uuid,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "payables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"vendor_id" uuid NOT NULL,
	"bill_number" varchar(100) NOT NULL,
	"bill_date" timestamp NOT NULL,
	"due_date" timestamp NOT NULL,
	"amount" integer DEFAULT 0 NOT NULL,
	"paid_amount" integer DEFAULT 0,
	"balance_amount" integer DEFAULT 0 NOT NULL,
	"status" varchar(20) DEFAULT 'outstanding',
	"reference_type" varchar(50) DEFAULT 'purchase',
	"reference_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "receivables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"invoice_number" varchar(100) NOT NULL,
	"invoice_date" timestamp NOT NULL,
	"due_date" timestamp NOT NULL,
	"amount" integer NOT NULL,
	"paid_amount" integer DEFAULT 0,
	"balance_amount" integer NOT NULL,
	"status" varchar(20) DEFAULT 'outstanding',
	"reference_type" varchar(50) DEFAULT 'sale',
	"reference_id" uuid,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "asset_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"depreciation_rate" integer DEFAULT 0,
	"depreciation_method" varchar(20) DEFAULT 'straight_line',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"category_id" uuid,
	"location_id" uuid,
	"asset_tag" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"serial_number" varchar(100),
	"model" varchar(100),
	"manufacturer" varchar(100),
	"purchase_date" date,
	"purchase_price" integer DEFAULT 0,
	"current_value" integer DEFAULT 0,
	"condition" varchar(50) DEFAULT 'good',
	"status" varchar(20) DEFAULT 'active',
	"assigned_to" uuid,
	"warranty_expiry" date,
	"last_maintenance_date" date,
	"next_maintenance_date" date,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"user_id" uuid,
	"action" varchar(50) NOT NULL,
	"resource_type" varchar(100) NOT NULL,
	"resource_id" uuid,
	"table_name" varchar(50) NOT NULL,
	"record_id" uuid NOT NULL,
	"transaction_id" uuid,
	"old_values" jsonb,
	"new_values" jsonb,
	"changed_fields" jsonb,
	"ip_address" varchar(45),
	"result" varchar(20),
	"user_agent" text,
	"error_code" varchar(50),
	"geographic_location" varchar(100),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "bank_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"bank_id" uuid NOT NULL,
	"transaction_number" serial NOT NULL,
	"transaction_date" timestamp NOT NULL,
	"description" text NOT NULL,
	"amount" integer DEFAULT 0 NOT NULL,
	"type" "transaction_type" NOT NULL,
	"category" text,
	"reference" varchar(100),
	"balance" integer DEFAULT 0 NOT NULL,
	"is_reconciled" boolean DEFAULT false,
	"reconciled_at" timestamp,
	"created_by" uuid NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "banks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"bank_name" text NOT NULL,
	"account_name" text NOT NULL,
	"account_number" varchar(50) NOT NULL,
	"account_type" varchar(20),
	"routing_number" varchar(20),
	"opening_balance" integer DEFAULT 0,
	"current_balance" integer DEFAULT 0,
	"currency" varchar(3) DEFAULT 'USD',
	"is_active" boolean DEFAULT true,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "budgets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"name" text NOT NULL,
	"fiscal_period_id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"budget_amount" integer DEFAULT 0 NOT NULL,
	"actual_amount" integer DEFAULT 0 NOT NULL,
	"variance_amount" integer DEFAULT 0 NOT NULL,
	"variance_percentage" integer DEFAULT 0 NOT NULL,
	"variance_type" varchar(20) DEFAULT 'percentage' NOT NULL,
	"is_active" boolean DEFAULT true,
	"description" text,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "fiscal_periods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"year" integer NOT NULL,
	"period" varchar(20) NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"is_closed" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "business_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "user_role" NOT NULL,
	"permissions" jsonb,
	"is_active" boolean DEFAULT true,
	"invited_at" timestamp,
	"joined_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "businesses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" varchar(100) NOT NULL,
	"short_name" varchar(50) NOT NULL,
	"business_type" varchar(50) NOT NULL,
	"industry" varchar(50) NOT NULL,
	"description" text,
	"email" text,
	"phone" varchar(20),
	"website" text,
	"logo" text,
	"address" text,
	"city" varchar(100),
	"state" varchar(100),
	"country" varchar(100) DEFAULT 'Nigeria',
	"tax_id" varchar(50),
	"registration_number" varchar(50),
	"currency" varchar(3) DEFAULT 'USD',
	"timezone" varchar(50) DEFAULT 'UTC',
	"settings" jsonb,
	"fiscal_year_start" integer DEFAULT 1,
	"is_active" boolean DEFAULT true,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "businesses_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"code" varchar(50) NOT NULL,
	"address" text,
	"city" varchar(100),
	"state" varchar(100),
	"phone" varchar(20),
	"email" varchar(255),
	"manager_id" uuid,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "currencies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"name" text NOT NULL,
	"code" varchar(3) NOT NULL,
	"is_base" boolean DEFAULT false,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "exchange_rates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"from_currency_id" uuid NOT NULL,
	"to_currency_id" uuid NOT NULL,
	"rate" integer NOT NULL,
	"effective_date" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "customer_contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"position" varchar(100),
	"phone" varchar(20),
	"email" varchar(255),
	"is_primary" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" varchar(20),
	"customer_type" "customer_types" DEFAULT 'INDIVIDUAL',
	"address" text,
	"company" text,
	"tax_id" varchar(50),
	"billing_address" jsonb,
	"shipping_address" jsonb,
	"city" varchar(100),
	"state" varchar(100),
	"country" varchar(100) DEFAULT 'Nigeria',
	"payment_terms" integer DEFAULT 30,
	"credit_limit" integer DEFAULT 0,
	"notes" text,
	"outstanding_balance" integer DEFAULT 0,
	"is_active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"uploaded_by" uuid,
	"file_name" varchar(255) NOT NULL,
	"original_name" varchar(255) NOT NULL,
	"document_type" "document_type" NOT NULL,
	"document_number" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"file_url" text NOT NULL,
	"reference_id" uuid,
	"reference_type" text,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "documents_document_number_unique" UNIQUE("document_number")
);
--> statement-breakpoint
CREATE TABLE "attendance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"location_id" uuid NOT NULL,
	"date" timestamp DEFAULT now(),
	"attendance_status" "attendance_status" NOT NULL,
	"notes" text,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "employees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"location_id" uuid,
	"manager_id" uuid,
	"position" text,
	"department" text,
	"salary" integer DEFAULT 0,
	"payroll_type" varchar(20) DEFAULT 'monthly',
	"hire_date" timestamp,
	"bank_name" varchar(100),
	"account_number" varchar(20),
	"account_name" varchar(255),
	"emergency_contact" jsonb,
	"bvn" varchar(11),
	"nin" varchar(11),
	"pension_fund_admin" varchar(255),
	"pension_pin" varchar(20),
	"nsitf_number" varchar(50),
	"itf_number" varchar(50),
	"is_active" boolean DEFAULT true,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "payroll" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"location_id" uuid NOT NULL,
	"amount" integer DEFAULT 0 NOT NULL,
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"basic_salary" integer DEFAULT 0 NOT NULL,
	"allowances" integer DEFAULT 0,
	"overtime_pay" integer DEFAULT 0,
	"gross_pay" integer DEFAULT 0 NOT NULL,
	"tax_deduction" integer DEFAULT 0,
	"pension_deduction" integer DEFAULT 0,
	"other_deductions" integer DEFAULT 0,
	"total_deductions" integer DEFAULT 0,
	"net_pay" integer DEFAULT 0 NOT NULL,
	"payment_date" timestamp DEFAULT now(),
	"payment_method" "payment_method" NOT NULL,
	"payment_status" "payment_status" NOT NULL,
	"notes" text,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "time_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"attendance_id" uuid NOT NULL,
	"project_id" uuid,
	"location_id" uuid,
	"entry_date" timestamp DEFAULT now(),
	"start_time" timestamp DEFAULT now(),
	"end_time" timestamp,
	"break_start" timestamp,
	"break_end" timestamp,
	"break_duration" integer DEFAULT 0 NOT NULL,
	"overtime_hours" integer DEFAULT 0,
	"hours_worked" integer DEFAULT 0 NOT NULL,
	"notes" text,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "expense_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expense_id" uuid NOT NULL,
	"expense_status" "expense_status" DEFAULT 'DRAFT',
	"expense_date" timestamp NOT NULL,
	"description" text NOT NULL,
	"amount" integer NOT NULL,
	"category_id" uuid NOT NULL,
	"receipt_url" varchar(500),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"reference" varchar(100),
	"total_amount" integer DEFAULT 0 NOT NULL,
	"paid_amount" integer DEFAULT 0,
	"balance_due" integer DEFAULT 0,
	"last_payment_date" timestamp,
	"receipt" text,
	"is_reimbursed" boolean DEFAULT false,
	"is_reimbursable" boolean DEFAULT false,
	"is_recurring" boolean DEFAULT false,
	"recurring_frequency" varchar(20),
	"created_by" uuid NOT NULL,
	"approved_by" uuid,
	"approved_at" timestamp,
	"notes" text,
	"tags" jsonb,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "inventory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"location_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"on_hand_quantity" integer DEFAULT 0,
	"on_order_quantity" integer DEFAULT 0,
	"available_quantity" integer DEFAULT 0,
	"reserved_quantity" integer DEFAULT 0,
	"reorder_level" integer DEFAULT 0,
	"max_stock_level" integer,
	"last_restocked" timestamp,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "inventory_locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"address" jsonb,
	"is_active" boolean DEFAULT true,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "lot_numbers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"lot_number" varchar(100) NOT NULL,
	"expiration_date" timestamp,
	"quantity" integer DEFAULT 0 NOT NULL,
	"reserved_quantity" integer DEFAULT 0,
	"reorder_level" integer DEFAULT 0,
	"max_stock_level" integer,
	"location" text,
	"last_restocked" timestamp,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "serial_numbers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"serial_number" varchar(100) NOT NULL,
	"lot_number_id" uuid,
	"status" text DEFAULT 'active' NOT NULL,
	"is_active" boolean DEFAULT true,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "stock_movements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"location_id" uuid,
	"movement_type" "stock_movement" NOT NULL,
	"status" "status" DEFAULT 'Pending',
	"pending_quantity" integer DEFAULT 0,
	"confirmed_quantity" integer NOT NULL,
	"unit_cost" integer DEFAULT 0 NOT NULL,
	"total_cost" integer DEFAULT 0 NOT NULL,
	"reference_id" uuid,
	"reference_document_id" uuid,
	"reference_type" text,
	"notes" text,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoice_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" uuid NOT NULL,
	"product_id" uuid,
	"description" text NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" integer NOT NULL,
	"total_price" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"customer_id" uuid,
	"sale_id" uuid,
	"invoice_number" varchar(50) NOT NULL,
	"issue_date" timestamp DEFAULT now(),
	"due_date" timestamp NOT NULL,
	"subtotal" integer DEFAULT 0 NOT NULL,
	"tax_amount" integer DEFAULT 0,
	"discount_amount" integer DEFAULT 0,
	"total_amount" integer DEFAULT 0 NOT NULL,
	"paid_amount" integer DEFAULT 0,
	"invoice_status" "invoice_status" DEFAULT 'draft',
	"notes" text,
	"terms" text,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid,
	"user_id" uuid,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"type" "notification_type" DEFAULT 'info',
	"is_read" boolean DEFAULT false,
	"action_url" text,
	"metadata" jsonb,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cash_register" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"location_id" uuid,
	"register_by" uuid NOT NULL,
	"session_number" varchar(100) NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp,
	"opening_balance" integer DEFAULT 0 NOT NULL,
	"closing_balance" integer DEFAULT 0,
	"expected_closing" integer DEFAULT 0,
	"total_sales" integer DEFAULT 0,
	"total_cash" integer DEFAULT 0,
	"total_card" integer DEFAULT 0,
	"status" varchar(20) DEFAULT 'open',
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payment_allocations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"payment_id" uuid NOT NULL,
	"allocation_type" "allocation_type" NOT NULL,
	"source_transaction_id" uuid NOT NULL,
	"allocated_amount" integer NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_number" serial NOT NULL,
	"business_id" uuid NOT NULL,
	"source_type" "source_type" NOT NULL,
	"source_id" uuid NOT NULL,
	"payer_type" "payer_type" NOT NULL,
	"payer_id" uuid NOT NULL,
	"bank_account_id" uuid NOT NULL,
	"currency_code" varchar(3) DEFAULT 'NGN',
	"amount" integer NOT NULL,
	"payment_date" timestamp DEFAULT now(),
	"payment_method" "payment_method" NOT NULL,
	"reference" varchar(100),
	"check_number" varchar(50),
	"card_last_four" varchar(4),
	"transaction_id" varchar(100),
	"payment_status" "payment_status" DEFAULT 'PENDING',
	"approved_by" uuid,
	"approved_at" timestamp,
	"created_by" uuid,
	"notes" text,
	"reconciled" boolean DEFAULT false,
	"reconciled_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"parent_id" uuid,
	"type" varchar(20) NOT NULL,
	"is_active" boolean DEFAULT true,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "product_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"variant_name" varchar(255) NOT NULL,
	"sku" varchar(100) NOT NULL,
	"attributes" jsonb,
	"cost_price" integer DEFAULT 0,
	"selling_price" integer DEFAULT 0 NOT NULL,
	"current_stock" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"category_id" uuid,
	"name" text NOT NULL,
	"description" text,
	"sku" varchar(100),
	"barcode" varchar(100),
	"unit_price" integer DEFAULT 0 NOT NULL,
	"cost_price" integer DEFAULT 0 NOT NULL,
	"images" jsonb,
	"specifications" jsonb,
	"is_active" boolean DEFAULT true,
	"track_inventory" boolean DEFAULT true,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "cost_centers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"name" text NOT NULL,
	"code" varchar(50) NOT NULL,
	"description" text,
	"manager_id" uuid,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "purchase_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"purchase_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"unit_cost" integer DEFAULT 0 NOT NULL,
	"total_cost" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "purchases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"created_by" uuid,
	"location_id" uuid,
	"vendor_id" uuid,
	"purchase_number" serial NOT NULL,
	"purchase_date" timestamp DEFAULT now(),
	"expected_date" timestamp,
	"last_payment_date" timestamp,
	"subtotal" integer DEFAULT 0 NOT NULL,
	"tax_amount" integer DEFAULT 0 NOT NULL,
	"total_amount" integer DEFAULT 0 NOT NULL,
	"paid_amount" integer DEFAULT 0 NOT NULL,
	"balance_due" integer DEFAULT 0 NOT NULL,
	"discount" integer DEFAULT 0 NOT NULL,
	"purchase_status" varchar(20) DEFAULT 'pending',
	"notes" text,
	"payment_terms" varchar(50),
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "balance_check" CHECK ("purchases"."balance_due" = "purchases"."total_amount" - "purchases"."paid_amount"),
	CONSTRAINT "paid_amount_check" CHECK ("purchases"."paid_amount" >= 0 AND "purchases"."paid_amount" <= "purchases"."total_amount")
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"name" text NOT NULL,
	"type" varchar(50) NOT NULL,
	"configuration" jsonb,
	"is_public" boolean DEFAULT false,
	"created_by" uuid,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "sale_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sale_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"inventory_location_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" integer DEFAULT 0 NOT NULL,
	"total_price" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sales" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"location_id" uuid NOT NULL,
	"quotation_id" uuid,
	"sale_number" serial NOT NULL,
	"sale_date" timestamp DEFAULT now(),
	"due_date" timestamp,
	"subtotal" integer DEFAULT 0 NOT NULL,
	"tax_amount" integer DEFAULT 0,
	"discount_amount" integer DEFAULT 0,
	"total_amount" integer DEFAULT 0 NOT NULL,
	"paid_amount" integer DEFAULT 0,
	"balance_due" integer DEFAULT 0,
	"last_payment_date" timestamp,
	"sales_status" "sales_status" DEFAULT 'draft',
	"payment_terms" varchar(50),
	"created_by" uuid,
	"notes" text,
	"metadata" jsonb,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "balance_check" CHECK ("sales"."balance_due" = "sales"."total_amount" - "sales"."paid_amount"),
	CONSTRAINT "paid_amount_check" CHECK ("sales"."paid_amount" >= 0 AND "sales"."paid_amount" <= "sales"."total_amount")
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"key" varchar(100) NOT NULL,
	"value" jsonb,
	"description" text,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "subscription_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"price" integer NOT NULL,
	"currency" varchar(3) DEFAULT 'NGN',
	"billing_cycle" varchar(20) NOT NULL,
	"max_employees" integer NOT NULL,
	"features" jsonb,
	"business_types" jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"plan_id" uuid NOT NULL,
	"status" "subscription_status" DEFAULT 'trialing',
	"current_period_start" timestamp NOT NULL,
	"current_period_end" timestamp NOT NULL,
	"trial_end" timestamp,
	"cancelled_at" timestamp,
	"last_payment_date" timestamp,
	"next_payment_date" timestamp,
	"amount" integer DEFAULT 0 NOT NULL,
	"currency" varchar(3) DEFAULT 'USD',
	"metadata" jsonb,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "tax_rates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"name" text NOT NULL,
	"code" varchar(20) NOT NULL,
	"rate" integer NOT NULL,
	"type" varchar(20) NOT NULL,
	"is_default" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "recurring_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"location_id" uuid,
	"name" varchar(255) NOT NULL,
	"transaction_type" varchar(50) NOT NULL,
	"frequency" varchar(20) NOT NULL,
	"amount" integer DEFAULT 0 NOT NULL,
	"next_date" date NOT NULL,
	"end_date" date,
	"category_id" uuid,
	"entity_id" uuid,
	"description" text,
	"is_active" boolean DEFAULT true,
	"last_processed" date,
	"created_by" uuid NOT NULL,
	"updated_by" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transaction_line_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"transaction_id" uuid,
	"product_id" uuid,
	"amount" integer DEFAULT 0 NOT NULL,
	"description" text NOT NULL,
	"quantity" integer DEFAULT 0,
	"unit_amount" integer DEFAULT 0,
	"tax_amount" integer DEFAULT 0,
	"discount_amunt" integer DEFAULT 0,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"category_id" uuid,
	"transaction_number" serial NOT NULL,
	"item" text NOT NULL,
	"transaction_type" "transaction_type" NOT NULL,
	"total_amount" integer DEFAULT 0 NOT NULL,
	"transaction_date" timestamp DEFAULT now(),
	"reference_id" uuid,
	"transaction_status" "transaction_status" DEFAULT 'draft',
	"created_by" uuid NOT NULL,
	"approved_by" uuid NOT NULL,
	"attachments" jsonb,
	"metadata" jsonb,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"full_name" text NOT NULL,
	"phone_number" varchar(20),
	"avatar" text,
	"is_active" boolean DEFAULT true,
	"email_verified" boolean DEFAULT false,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "vendor_contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"vendor_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"position" varchar(100),
	"phone" varchar(20),
	"email" varchar(255),
	"is_primary" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" varchar(20),
	"company" text,
	"tax_id" varchar(50),
	"address" jsonb,
	"payment_terms" integer DEFAULT 30,
	"notes" text,
	"is_active" boolean DEFAULT true,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "approvals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"record_type" varchar(50) NOT NULL,
	"record_id" uuid NOT NULL,
	"request_by" uuid NOT NULL,
	"approved_by" uuid,
	"status" varchar(20) DEFAULT 'pending',
	"requested_at" timestamp DEFAULT now(),
	"processed_at" timestamp,
	"comments" text,
	"approver_comments" text
);
--> statement-breakpoint
CREATE TABLE "work_flow_steps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"work_flow_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"step_number" integer NOT NULL,
	"step_type" "work_flow_step_type" NOT NULL,
	"is_active" boolean DEFAULT true,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "work_flows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"type" "work_flow_type" NOT NULL,
	"is_active" boolean DEFAULT true,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "project_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"project_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"assigned_to" uuid,
	"start_date" date,
	"due_date" date,
	"estimated_hours" integer DEFAULT 0,
	"actual_hours" integer DEFAULT 0,
	"status" varchar(20) DEFAULT 'pending',
	"priority" varchar(20) DEFAULT 'medium',
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"customer_id" uuid,
	"project_number" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"start_date" date,
	"end_date" date,
	"estimated_hours" integer DEFAULT 0,
	"actual_hours" integer DEFAULT 0,
	"hourly_rate" integer DEFAULT 0,
	"fixed_price" integer DEFAULT 0,
	"billing_type" varchar(20) DEFAULT 'hourly',
	"status" varchar(20) DEFAULT 'planning',
	"project_manager_id" uuid,
	"total_expenses" integer DEFAULT 0,
	"total_revenue" integer DEFAULT 0,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "return_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"return_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"unit_price" integer DEFAULT 0 NOT NULL,
	"total_price" integer DEFAULT 0 NOT NULL,
	"condition" varchar(50) DEFAULT 'good',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "returns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"location_id" uuid,
	"return_number" varchar(100) NOT NULL,
	"return_date" date NOT NULL,
	"return_type" varchar(20) NOT NULL,
	"original_transaction_id" uuid NOT NULL,
	"customer_id" uuid,
	"vendor_id" uuid,
	"reason" text,
	"status" varchar(20) DEFAULT 'pending',
	"total_amount" integer DEFAULT 0 NOT NULL,
	"refund_amount" integer DEFAULT 0,
	"refund_method" varchar(50),
	"processed_by" uuid,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "quotation_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"quotation_id" uuid NOT NULL,
	"product_id" uuid,
	"item" text NOT NULL,
	"description" text NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"unit_price" integer DEFAULT 0 NOT NULL,
	"discount" integer DEFAULT 0,
	"total_price" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "quotations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"customer_id" uuid,
	"quotation_number" varchar(100) NOT NULL,
	"quotation_date" date NOT NULL,
	"valid_until" date NOT NULL,
	"status" varchar(20) DEFAULT 'draft',
	"subtotal" integer DEFAULT 0 NOT NULL,
	"tax_amount" integer DEFAULT 0,
	"discount_amount" integer DEFAULT 0,
	"total_amount" integer NOT NULL,
	"notes" text,
	"terms" text,
	"converted_to_sale" boolean DEFAULT false,
	"sale_id" uuid,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_parent_id_accounts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_journal_entry_id_journal_entries_id_fk" FOREIGN KEY ("journal_entry_id") REFERENCES "public"."journal_entries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_related_customer_id_customers_id_fk" FOREIGN KEY ("related_customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_related_vendor_id_vendors_id_fk" FOREIGN KEY ("related_vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_related_invoice_id_invoices_id_fk" FOREIGN KEY ("related_invoice_id") REFERENCES "public"."invoices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_related_expense_id_expenses_id_fk" FOREIGN KEY ("related_expense_id") REFERENCES "public"."expenses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payables" ADD CONSTRAINT "payables_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payables" ADD CONSTRAINT "payables_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "receivables" ADD CONSTRAINT "receivables_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "receivables" ADD CONSTRAINT "receivables_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_categories" ADD CONSTRAINT "asset_categories_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_category_id_asset_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."asset_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_assigned_to_employees_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_transactions" ADD CONSTRAINT "bank_transactions_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_transactions" ADD CONSTRAINT "bank_transactions_bank_id_banks_id_fk" FOREIGN KEY ("bank_id") REFERENCES "public"."banks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_transactions" ADD CONSTRAINT "bank_transactions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "banks" ADD CONSTRAINT "banks_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "banks" ADD CONSTRAINT "banks_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_fiscal_period_id_fiscal_periods_id_fk" FOREIGN KEY ("fiscal_period_id") REFERENCES "public"."fiscal_periods"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fiscal_periods" ADD CONSTRAINT "fiscal_periods_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_users" ADD CONSTRAINT "business_users_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_users" ADD CONSTRAINT "business_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "locations_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "locations_manager_id_employees_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "currencies" ADD CONSTRAINT "currencies_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exchange_rates" ADD CONSTRAINT "exchange_rates_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exchange_rates" ADD CONSTRAINT "exchange_rates_from_currency_id_currencies_id_fk" FOREIGN KEY ("from_currency_id") REFERENCES "public"."currencies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exchange_rates" ADD CONSTRAINT "exchange_rates_to_currency_id_currencies_id_fk" FOREIGN KEY ("to_currency_id") REFERENCES "public"."currencies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_contacts" ADD CONSTRAINT "customer_contacts_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_contacts" ADD CONSTRAINT "customer_contacts_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll" ADD CONSTRAINT "payroll_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll" ADD CONSTRAINT "payroll_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll" ADD CONSTRAINT "payroll_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_attendance_id_attendance_id_fk" FOREIGN KEY ("attendance_id") REFERENCES "public"."attendance"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_items" ADD CONSTRAINT "expense_items_expense_id_expenses_id_fk" FOREIGN KEY ("expense_id") REFERENCES "public"."expenses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_items" ADD CONSTRAINT "expense_items_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_created_by_employees_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_location_id_inventory_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."inventory_locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_locations" ADD CONSTRAINT "inventory_locations_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lot_numbers" ADD CONSTRAINT "lot_numbers_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lot_numbers" ADD CONSTRAINT "lot_numbers_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "serial_numbers" ADD CONSTRAINT "serial_numbers_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "serial_numbers" ADD CONSTRAINT "serial_numbers_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "serial_numbers" ADD CONSTRAINT "serial_numbers_lot_number_id_lot_numbers_id_fk" FOREIGN KEY ("lot_number_id") REFERENCES "public"."lot_numbers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_location_id_inventory_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."inventory_locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_reference_document_id_documents_id_fk" FOREIGN KEY ("reference_document_id") REFERENCES "public"."documents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_sale_id_sales_id_fk" FOREIGN KEY ("sale_id") REFERENCES "public"."sales"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cash_register" ADD CONSTRAINT "cash_register_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cash_register" ADD CONSTRAINT "cash_register_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cash_register" ADD CONSTRAINT "cash_register_register_by_employees_id_fk" FOREIGN KEY ("register_by") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_bank_account_id_banks_id_fk" FOREIGN KEY ("bank_account_id") REFERENCES "public"."banks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cost_centers" ADD CONSTRAINT "cost_centers_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cost_centers" ADD CONSTRAINT "cost_centers_manager_id_employees_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_items" ADD CONSTRAINT "purchase_items_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_items" ADD CONSTRAINT "purchase_items_purchase_id_purchases_id_fk" FOREIGN KEY ("purchase_id") REFERENCES "public"."purchases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_items" ADD CONSTRAINT "purchase_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sale_items" ADD CONSTRAINT "sale_items_sale_id_sales_id_fk" FOREIGN KEY ("sale_id") REFERENCES "public"."sales"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sale_items" ADD CONSTRAINT "sale_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sale_items" ADD CONSTRAINT "sale_items_inventory_location_id_locations_id_fk" FOREIGN KEY ("inventory_location_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales" ADD CONSTRAINT "sales_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales" ADD CONSTRAINT "sales_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales" ADD CONSTRAINT "sales_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settings" ADD CONSTRAINT "settings_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_subscription_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tax_rates" ADD CONSTRAINT "tax_rates_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recurring_transactions" ADD CONSTRAINT "recurring_transactions_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recurring_transactions" ADD CONSTRAINT "recurring_transactions_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recurring_transactions" ADD CONSTRAINT "recurring_transactions_created_by_employees_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recurring_transactions" ADD CONSTRAINT "recurring_transactions_updated_by_employees_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_line_items" ADD CONSTRAINT "transaction_line_items_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_line_items" ADD CONSTRAINT "transaction_line_items_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_line_items" ADD CONSTRAINT "transaction_line_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_contacts" ADD CONSTRAINT "vendor_contacts_tenant_id_businesses_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_contacts" ADD CONSTRAINT "vendor_contacts_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_request_by_users_id_fk" FOREIGN KEY ("request_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_flow_steps" ADD CONSTRAINT "work_flow_steps_work_flow_id_work_flows_id_fk" FOREIGN KEY ("work_flow_id") REFERENCES "public"."work_flows"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_flows" ADD CONSTRAINT "work_flows_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_tasks" ADD CONSTRAINT "project_tasks_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_tasks" ADD CONSTRAINT "project_tasks_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_tasks" ADD CONSTRAINT "project_tasks_assigned_to_employees_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_project_manager_id_employees_id_fk" FOREIGN KEY ("project_manager_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_created_by_employees_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "return_items" ADD CONSTRAINT "return_items_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "return_items" ADD CONSTRAINT "return_items_return_id_returns_id_fk" FOREIGN KEY ("return_id") REFERENCES "public"."returns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "return_items" ADD CONSTRAINT "return_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "returns" ADD CONSTRAINT "returns_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "returns" ADD CONSTRAINT "returns_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "returns" ADD CONSTRAINT "returns_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "returns" ADD CONSTRAINT "returns_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "returns" ADD CONSTRAINT "returns_processed_by_employees_id_fk" FOREIGN KEY ("processed_by") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "returns" ADD CONSTRAINT "returns_created_by_employees_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotation_items" ADD CONSTRAINT "quotation_items_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotation_items" ADD CONSTRAINT "quotation_items_quotation_id_quotations_id_fk" FOREIGN KEY ("quotation_id") REFERENCES "public"."quotations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotation_items" ADD CONSTRAINT "quotation_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_sale_id_sales_id_fk" FOREIGN KEY ("sale_id") REFERENCES "public"."sales"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_created_by_employees_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accounts_business_idx" ON "accounts" USING btree ("business_id");--> statement-breakpoint
CREATE UNIQUE INDEX "accounts_code_idx" ON "accounts" USING btree ("business_id","code");--> statement-breakpoint
CREATE INDEX "accounts_account_type_idx" ON "accounts" USING btree ("type");--> statement-breakpoint
CREATE INDEX "journal_entries_business_idx" ON "journal_entries" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "ledger_entries_business_idx" ON "ledger_entries" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "ledger_entries_account_idx" ON "ledger_entries" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "ledger_entries_journal_entry_idx" ON "ledger_entries" USING btree ("journal_entry_id");--> statement-breakpoint
CREATE INDEX "ledger_entries_reference_type_idx" ON "ledger_entries" USING btree ("reference_type");--> statement-breakpoint
CREATE INDEX "audit_logs_business_idx" ON "audit_logs" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "audit_logs_record_idx" ON "audit_logs" USING btree ("table_name","record_id");--> statement-breakpoint
CREATE INDEX "audit_logs_user_action_idx" ON "audit_logs" USING btree ("user_id","action");--> statement-breakpoint
CREATE INDEX "audit_logs_resource_idx" ON "audit_logs" USING btree ("resource_type","resource_id");--> statement-breakpoint
CREATE INDEX "audit_logs_transaction_idx" ON "audit_logs" USING btree ("transaction_id");--> statement-breakpoint
CREATE INDEX "bank_transactions_business_idx" ON "bank_transactions" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "bank_transactions_bank_idx" ON "bank_transactions" USING btree ("bank_id");--> statement-breakpoint
CREATE INDEX "banks_business_idx" ON "banks" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "budgets_business_idx" ON "budgets" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "budgets_account_idx" ON "budgets" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "fiscal_periods_business_idx" ON "fiscal_periods" USING btree ("business_id");--> statement-breakpoint
CREATE UNIQUE INDEX "business_users_business_user_idx" ON "business_users" USING btree ("business_id","user_id");--> statement-breakpoint
CREATE INDEX "currencies_business_idx" ON "currencies" USING btree ("business_id");--> statement-breakpoint
CREATE UNIQUE INDEX "currencies_code_idx" ON "currencies" USING btree ("business_id","code");--> statement-breakpoint
CREATE INDEX "exchange_rates_business_idx" ON "exchange_rates" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "exchange_rates_from_currency_idx" ON "exchange_rates" USING btree ("from_currency_id");--> statement-breakpoint
CREATE INDEX "exchange_rates_to_currency_idx" ON "exchange_rates" USING btree ("to_currency_id");--> statement-breakpoint
CREATE INDEX "customers_business_idx" ON "customers" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "customers_name_idx" ON "customers" USING btree ("name");--> statement-breakpoint
CREATE INDEX "customers_email_idx" ON "customers" USING btree ("email");--> statement-breakpoint
CREATE INDEX "documents_business_idx" ON "documents" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "documents_document_type_idx" ON "documents" USING btree ("document_type");--> statement-breakpoint
CREATE INDEX "documents_reference_idx" ON "documents" USING btree ("reference_type","reference_id");--> statement-breakpoint
CREATE INDEX "attendance_business_idx" ON "attendance" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "attendance_employee_idx" ON "attendance" USING btree ("employee_id");--> statement-breakpoint
CREATE INDEX "employees_business_idx" ON "employees" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "employees_user_idx" ON "employees" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "employees_position_idx" ON "employees" USING btree ("position");--> statement-breakpoint
CREATE INDEX "payroll_business_idx" ON "payroll" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "payroll_employee_idx" ON "payroll" USING btree ("employee_id");--> statement-breakpoint
CREATE INDEX "time_entries_business_idx" ON "time_entries" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "time_entries_employee_idx" ON "time_entries" USING btree ("employee_id");--> statement-breakpoint
CREATE INDEX "expense_items_expense_status_idx" ON "expense_items" USING btree ("expense_status");--> statement-breakpoint
CREATE INDEX "expense_items_expense_date_idx" ON "expense_items" USING btree ("expense_date");--> statement-breakpoint
CREATE INDEX "expense_items_category_id_idx" ON "expense_items" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "expense_items_receipt_url_idx" ON "expense_items" USING btree ("receipt_url");--> statement-breakpoint
CREATE INDEX "expenses_business_idx" ON "expenses" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "inventory_business_idx" ON "inventory" USING btree ("business_id");--> statement-breakpoint
CREATE UNIQUE INDEX "inventory_product_idx" ON "inventory" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "locations_business_idx" ON "inventory_locations" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "locations_name_idx" ON "inventory_locations" USING btree ("name");--> statement-breakpoint
CREATE INDEX "lot_numbers_business_idx" ON "lot_numbers" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "lot_numbers_product_idx" ON "lot_numbers" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "serial_numbers_business_idx" ON "serial_numbers" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "serial_numbers_product_idx" ON "serial_numbers" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "stock_movements_product_idx" ON "stock_movements" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "stock_movements_date_idx" ON "stock_movements" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "stock_movements_movement_type_idx" ON "stock_movements" USING btree ("movement_type");--> statement-breakpoint
CREATE INDEX "stock_movements_reference_type_idx" ON "stock_movements" USING btree ("reference_type");--> statement-breakpoint
CREATE INDEX "stock_movements_reference_id_idx" ON "stock_movements" USING btree ("reference_id");--> statement-breakpoint
CREATE INDEX "invoice_items_invoice_idx" ON "invoice_items" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "invoices_business_idx" ON "invoices" USING btree ("business_id");--> statement-breakpoint
CREATE UNIQUE INDEX "invoices_number_idx" ON "invoices" USING btree ("business_id","invoice_number");--> statement-breakpoint
CREATE INDEX "notifications_business_idx" ON "notifications" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "notifications_user_idx" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "payments_business_idx" ON "payments" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "categories_business_idx" ON "categories" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "products_business_idx" ON "products" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "products_sku_idx" ON "products" USING btree ("sku");--> statement-breakpoint
CREATE INDEX "cost_centers_business_idx" ON "cost_centers" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "cost_centers_name_idx" ON "cost_centers" USING btree ("name");--> statement-breakpoint
CREATE INDEX "purchase_items_purchase_idx" ON "purchase_items" USING btree ("purchase_id");--> statement-breakpoint
CREATE INDEX "purchases_business_idx" ON "purchases" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "reports_business_idx" ON "reports" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "sale_items_sale_idx" ON "sale_items" USING btree ("sale_id");--> statement-breakpoint
CREATE INDEX "sale_items_product_idx" ON "sale_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "sales_business_idx" ON "sales" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "sales_number_idx" ON "sales" USING btree ("sale_number");--> statement-breakpoint
CREATE INDEX "sales_customer_idx" ON "sales" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "sales_sale_date_idx" ON "sales" USING btree ("sale_date");--> statement-breakpoint
CREATE INDEX "sales_status_idx" ON "sales" USING btree ("sales_status");--> statement-breakpoint
CREATE UNIQUE INDEX "settings_business_key_idx" ON "settings" USING btree ("business_id","key");--> statement-breakpoint
CREATE INDEX "tax_rates_business_idx" ON "tax_rates" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "transactions_business_idx" ON "transactions" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "transactions_date_idx" ON "transactions" USING btree ("transaction_date");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "vendors_business_idx" ON "vendors" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "vendors_name_idx" ON "vendors" USING btree ("name");--> statement-breakpoint
CREATE INDEX "vendors_email_idx" ON "vendors" USING btree ("email");--> statement-breakpoint
CREATE INDEX "work_flow_steps_work_flow_idx" ON "work_flow_steps" USING btree ("work_flow_id");--> statement-breakpoint
CREATE INDEX "work_flows_business_idx" ON "work_flows" USING btree ("business_id");