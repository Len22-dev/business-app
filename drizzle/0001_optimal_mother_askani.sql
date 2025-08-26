ALTER TABLE "transaction_line_items" DROP CONSTRAINT "transaction_line_items_business_id_businesses_id_fk";
--> statement-breakpoint
ALTER TABLE "payment_allocations" ALTER COLUMN "allocation_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."allocation_type";--> statement-breakpoint
CREATE TYPE "public"."allocation_type" AS ENUM('invoice', 'advance', 'refund', 'adjustment');--> statement-breakpoint
ALTER TABLE "payment_allocations" ALTER COLUMN "allocation_type" SET DATA TYPE "public"."allocation_type" USING "allocation_type"::"public"."allocation_type";--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "payer_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."payer_type";--> statement-breakpoint
CREATE TYPE "public"."payer_type" AS ENUM('customer', 'vendor', 'employee', 'company', 'others');--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "payer_type" SET DATA TYPE "public"."payer_type" USING "payer_type"::"public"."payer_type";--> statement-breakpoint
ALTER TABLE "payroll" ALTER COLUMN "payment_status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "payment_status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "payment_status" SET DEFAULT 'pending'::text;--> statement-breakpoint
DROP TYPE "public"."payment_status";--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'paid', 'failed', 'cancelled', 'refunded', 'part_payment');--> statement-breakpoint
ALTER TABLE "payroll" ALTER COLUMN "payment_status" SET DATA TYPE "public"."payment_status" USING "payment_status"::"public"."payment_status";--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "payment_status" SET DEFAULT 'pending'::"public"."payment_status";--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "payment_status" SET DATA TYPE "public"."payment_status" USING "payment_status"::"public"."payment_status";--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "source_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."source_type";--> statement-breakpoint
CREATE TYPE "public"."source_type" AS ENUM('sales', 'purchase', 'expense', 'others');--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "source_type" SET DATA TYPE "public"."source_type" USING "source_type"::"public"."source_type";--> statement-breakpoint
ALTER TABLE "banks" ALTER COLUMN "currency" SET DEFAULT 'NGN';--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "business_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "transaction_type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "created_by" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "approved_by" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "vendors" DROP COLUMN "payment_terms";--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "payment_terms" jsonb NOT NULL DEFAULT '{"type": "net", "days": 0}';--> statement-breakpoint
ALTER TABLE "vendors" ALTER COLUMN "payment_terms" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "expenses" ADD COLUMN "category_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "transaction_line_items" ADD COLUMN "item" text NOT NULL;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN "currency";--> statement-breakpoint
ALTER TABLE "transaction_line_items" DROP COLUMN "business_id";--> statement-breakpoint
ALTER TABLE "transactions" DROP COLUMN "item";