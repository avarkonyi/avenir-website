-- Phase 2 Iter 3C Commit 1 — services table.
--
-- Self-referencing 2-level hierarchy: parent_id NULL = top-level
-- service, parent_id NOT NULL = sub-service. The DB allows arbitrary
-- nesting (PG can't depth-cap a self-FK in a CHECK constraint); the
-- 2-level cap is enforced in server actions (Iter 3C Commit 3+).
--
-- Soft-delete cascade rule: is_active = false is the soft-delete flag.
-- The DB FK uses ON DELETE RESTRICT only to block hard DELETEs that
-- would orphan children. The "parent with active children cannot be
-- inactivated" rule lives in the inactivateService server action
-- (Iter 3C Commit 4) — DB cannot enforce it because no DELETE happens.
--
-- Locale model: HU required (NOT NULL), EN/DE/ZH nullable. Public
-- renderer falls back to HU when a locale variant is null (matches
-- news convention).
--
-- JSONB highlights: NOT NULL DEFAULT '[]'::jsonb so the TS type stays
-- string[] without nullish guards. Max 6 items per locale enforced
-- in the server action validation, not in the DB.
--
-- Indexes:
--   1. UNIQUE on slug auto-creates a B-tree index (services_slug_unique
--      constraint name) — no explicit idx_services_slug.
--   2. idx_services_parent_id covers admin "fetch children of parent X".
--   3. idx_services_public is partial (WHERE is_published AND is_active),
--      composite on (parent_id, sort_order, id), supports the public
--      site's most frequent query.
--
-- Run order:
--   1. Apply via Neon SQL Editor (manual; same pattern as 0004-0006).
--   2. Verify:
--        SELECT column_name, data_type, is_nullable, column_default
--        FROM information_schema.columns
--        WHERE table_name = 'services'
--        ORDER BY ordinal_position;
--      Expect: 27 columns, jsonb defaults shown as '[]'::jsonb,
--      timestamps default now(), booleans default false / true.
--
--        SELECT indexname, indexdef
--        FROM pg_indexes
--        WHERE tablename = 'services'
--        ORDER BY indexname;
--      Expect 3 indexes: services_pkey (auto), services_slug_unique
--      (auto from UNIQUE), idx_services_parent_id, idx_services_public.

CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"slug" text NOT NULL,
	"icon" text,
	"image_url" text,
	"name_hu" text NOT NULL,
	"name_en" text,
	"name_de" text,
	"name_zh" text,
	"short_desc_hu" text,
	"short_desc_en" text,
	"short_desc_de" text,
	"short_desc_zh" text,
	"long_desc_hu" text,
	"long_desc_en" text,
	"long_desc_de" text,
	"long_desc_zh" text,
	"highlights_hu" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"highlights_en" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"highlights_de" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"highlights_zh" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_parent_id_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "idx_services_parent_id" ON "services" USING btree ("parent_id");
--> statement-breakpoint
CREATE INDEX "idx_services_public" ON "services" USING btree ("parent_id","sort_order","id") WHERE "services"."is_published" = true AND "services"."is_active" = true;
