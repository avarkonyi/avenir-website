CREATE TABLE "partners" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"logo_url" text,
	"website_url" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "partners_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
DROP INDEX "idx_messages_unread";--> statement-breakpoint
DROP INDEX "idx_messages_inbox";--> statement-breakpoint
CREATE INDEX "idx_partners_active_sort" ON "partners" USING btree ("is_active","sort_order") WHERE "partners"."is_active" = true;--> statement-breakpoint
CREATE INDEX "idx_messages_unread" ON "messages" USING btree ("created_at" DESC) WHERE "messages"."read_at" IS NULL AND "messages"."archived_at" IS NULL;--> statement-breakpoint
CREATE INDEX "idx_messages_inbox" ON "messages" USING btree ("created_at" DESC) WHERE "messages"."archived_at" IS NULL;