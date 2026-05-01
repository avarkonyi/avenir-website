-- Add soft-delete column to messages + adjust the unread index +
-- introduce a new inbox-filter index (Phase 2 Iter 2 admin Messages CRUD).
--
-- Strategy:
--   1. ADD COLUMN deleted_at — nullable, default NULL (no backfill needed)
--   2. DROP the old idx_messages_unread (filter changes — adds deleted_at)
--   3. CREATE idx_messages_unread with the new filter (read_at NULL AND deleted_at NULL)
--   4. CREATE idx_messages_inbox (all active, newest first)
--
-- Existing rows: all get deleted_at = NULL (= active), so the inbox
-- view shows everything currently in the DB. No data migration needed.
--
-- Run order:
--   1. npm run db:migrate   (or apply via Neon SQL editor)
--   2. Verify: SELECT column_name FROM information_schema.columns
--              WHERE table_name = 'messages' AND column_name = 'deleted_at';

ALTER TABLE "messages" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
DROP INDEX IF EXISTS "idx_messages_unread";--> statement-breakpoint
CREATE INDEX "idx_messages_unread" ON "messages" USING btree ("created_at" DESC) WHERE "messages"."read_at" IS NULL AND "messages"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX "idx_messages_inbox" ON "messages" USING btree ("created_at" DESC) WHERE "messages"."deleted_at" IS NULL;
