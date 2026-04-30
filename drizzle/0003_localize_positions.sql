-- Localize positions table — wide-column-per-locale pattern matching
-- news, client_references, certifications. Resolves audit P0-3:
-- positions appeared HU-only on /en, /de, /zh pages.
--
-- Strategy:
--   1. Rename the 3 existing HU columns: title → title_hu, etc. Existing
--      rows preserve their HU content under the new name.
--   2. Add 9 new locale columns (3 fields × 3 new locales) with a
--      temporary DEFAULT '' so existing rows accept the NOT NULL
--      constraint. Real translations are populated by
--      `scripts/update-positions-prod.ts` (run after migration), then
--      the DEFAULT is dropped so future inserts must supply values.
--
-- Run order:
--   1. Apply this migration:    npm run db:migrate    (or via Neon SQL)
--   2. Populate translations:   npm run db:update-positions
--   3. Verify:                  SELECT title_hu, title_en FROM positions;

ALTER TABLE "positions" RENAME COLUMN "title" TO "title_hu";--> statement-breakpoint
ALTER TABLE "positions" RENAME COLUMN "location" TO "location_hu";--> statement-breakpoint
ALTER TABLE "positions" RENAME COLUMN "type" TO "type_hu";--> statement-breakpoint
ALTER TABLE "positions" ADD COLUMN "title_en" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "positions" ADD COLUMN "title_de" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "positions" ADD COLUMN "title_zh" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "positions" ADD COLUMN "location_en" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "positions" ADD COLUMN "location_de" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "positions" ADD COLUMN "location_zh" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "positions" ADD COLUMN "type_en" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "positions" ADD COLUMN "type_de" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "positions" ADD COLUMN "type_zh" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "positions" ALTER COLUMN "title_en" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "positions" ALTER COLUMN "title_de" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "positions" ALTER COLUMN "title_zh" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "positions" ALTER COLUMN "location_en" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "positions" ALTER COLUMN "location_de" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "positions" ALTER COLUMN "location_zh" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "positions" ALTER COLUMN "type_en" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "positions" ALTER COLUMN "type_de" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "positions" ALTER COLUMN "type_zh" DROP DEFAULT;
