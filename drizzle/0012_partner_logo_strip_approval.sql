ALTER TABLE "partners" ADD COLUMN "show_in_logo_strip" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "partners" ADD COLUMN "logo_usage_approved_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "partners" ADD COLUMN "logo_usage_approved_by" text;--> statement-breakpoint
ALTER TABLE "partners" ADD COLUMN "logo_usage_scope" text;--> statement-breakpoint
CREATE INDEX "idx_partners_logo_strip_public" ON "partners" USING btree ("sort_order","name") WHERE "partners"."is_active" = true AND "partners"."is_published" = true AND "partners"."show_in_logo_strip" = true AND "partners"."logo_url" IS NOT NULL AND "partners"."logo_usage_approved_at" IS NOT NULL;
