-- Phase 2 Iter 3A admin News CRUD: add soft-delete + relax NOT NULL on
-- the optional locale fields (EN/DE/ZH titles, leads, bodies). HU stays
-- required because the public news renderer always falls back to HU when
-- a locale-specific column is empty.
--
-- Idempotent: ADD COLUMN IF NOT EXISTS guards against re-runs; DROP NOT
-- NULL is silently a no-op when the column is already nullable.
--
-- Run order:
--   1. Apply via Neon SQL Editor (manual; same pattern as 0004)
--   2. Verify:
--        SELECT column_name, is_nullable
--        FROM information_schema.columns
--        WHERE table_name = 'news'
--          AND column_name IN
--            ('deleted_at','title_en','title_de','title_zh',
--             'lead_en','lead_de','lead_zh',
--             'body_en','body_de','body_zh');
--      Expect: deleted_at = YES; the 9 locale fields = YES.

ALTER TABLE "news" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "news" ALTER COLUMN "title_en" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "news" ALTER COLUMN "title_de" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "news" ALTER COLUMN "title_zh" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "news" ALTER COLUMN "lead_en" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "news" ALTER COLUMN "lead_de" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "news" ALTER COLUMN "lead_zh" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "news" ALTER COLUMN "body_en" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "news" ALTER COLUMN "body_de" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "news" ALTER COLUMN "body_zh" DROP NOT NULL;
