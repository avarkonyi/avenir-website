ALTER TABLE "messages" ADD COLUMN "lead_status" varchar(30) DEFAULT 'new' NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "lead_owner_name" text;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "lead_next_action_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "lead_next_action_note" text;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "lead_estimated_value" integer;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "lead_site_type" varchar(80);--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "lead_proposal_url" text;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "lead_contract_url" text;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "internal_notes" text;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "lead_updated_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "idx_messages_lead_status" ON "messages" USING btree ("lead_status","created_at" DESC) WHERE "messages"."archived_at" IS NULL;--> statement-breakpoint
CREATE INDEX "idx_messages_next_action" ON "messages" USING btree ("lead_next_action_at" ASC) WHERE "messages"."archived_at" IS NULL AND "messages"."lead_next_action_at" IS NOT NULL;