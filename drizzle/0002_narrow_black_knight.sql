CREATE TABLE "stock_adjustments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"inventory_id" uuid NOT NULL,
	"location_id" uuid,
	"quantity" integer NOT NULL,
	"reason" text NOT NULL,
	"description" text,
	"adjustment_date" timestamp DEFAULT now() NOT NULL,
	"status" "status" DEFAULT 'Pending',
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "inventory_locations" ADD COLUMN "location_type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "inventory_locations" ADD COLUMN "parent_location_id" uuid;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD COLUMN "business_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD COLUMN "inventory_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "location_id" uuid;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "entity_id" uuid;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "entity_type" text;--> statement-breakpoint
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_inventory_id_inventory_id_fk" FOREIGN KEY ("inventory_id") REFERENCES "public"."inventory"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_location_id_inventory_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."inventory_locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "stock_adjustments_product_idx" ON "stock_adjustments" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "stock_adjustments_date_idx" ON "stock_adjustments" USING btree ("created_at");--> statement-breakpoint
ALTER TABLE "inventory_locations" ADD CONSTRAINT "inventory_locations_parent_location_id_inventory_locations_id_fk" FOREIGN KEY ("parent_location_id") REFERENCES "public"."inventory_locations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_inventory_id_inventory_id_fk" FOREIGN KEY ("inventory_id") REFERENCES "public"."inventory"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;