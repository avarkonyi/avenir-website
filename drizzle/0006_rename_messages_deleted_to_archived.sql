-- Phase 2 Iter 3B — Messages module:
--   1. Rename `deleted_at` to `archived_at` (B1 from the rename audit).
--      What Iter 2 called "soft delete" was always semantically an archive
--      — recoverable by clearing the timestamp, never actually destructive.
--   2. Add 3 reply-related columns so subsequent commits in this iteration
--      (detail view, reply form, archive toggle) ship without further
--      schema changes. Per Correction 1: Commit 1 must establish the full
--      column shape so per-commit smoke builds don't reference missing
--      columns mid-iteration.
--
-- Status is DERIVED from timestamp presence (A2 — no enum):
--   archived_at IS NOT NULL  → 'archived'
--   replied_at  IS NOT NULL  → 'replied'
--   read_at     IS NOT NULL  → 'read'
--   else                     → 'new'
--
-- Indexes: PostgreSQL auto-updates partial-index predicates after
-- RENAME COLUMN (predicates store column references by OID), but we DROP
-- + CREATE explicitly so the migration body documents the post-rename
-- predicate text and matches drizzle-kit's snapshot diff format.
--
-- Idempotent: ADD COLUMN IF NOT EXISTS guards re-runs; the rename can
-- be re-applied iff the source column still exists (otherwise it errors
-- — that's correct, this migration assumes a forward-only timeline).
--
-- Run order:
--   1. Apply via Neon SQL Editor (manual; same pattern as 0004 + 0005)
--   2. Verify:
--        SELECT column_name, is_nullable
--        FROM information_schema.columns
--        WHERE table_name = 'messages'
--          AND column_name IN
--            ('archived_at','replied_at','reply_subject','reply_body');
--      Expect: 4 rows, all is_nullable = YES.
--
--        SELECT indexname, indexdef
--        FROM pg_indexes
--        WHERE tablename = 'messages'
--          AND indexname IN ('idx_messages_unread','idx_messages_inbox');
--      Expect: predicates reference `archived_at`, not `deleted_at`.

ALTER TABLE "messages" RENAME COLUMN "deleted_at" TO "archived_at";--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "replied_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "reply_subject" text;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "reply_body" text;--> statement-breakpoint
DROP INDEX IF EXISTS "idx_messages_unread";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_messages_inbox";--> statement-breakpoint
CREATE INDEX "idx_messages_unread" ON "messages" USING btree ("created_at" DESC) WHERE "messages"."read_at" IS NULL AND "messages"."archived_at" IS NULL;--> statement-breakpoint
CREATE INDEX "idx_messages_inbox" ON "messages" USING btree ("created_at" DESC) WHERE "messages"."archived_at" IS NULL;
