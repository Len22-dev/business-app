ALTER TABLE "transactions" RENAME COLUMN "reference_id" TO "reference_number";--> statement-breakpoint
ALTER TABLE "expenses" ADD COLUMN "location_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_reference_number_unique" UNIQUE("reference_number");