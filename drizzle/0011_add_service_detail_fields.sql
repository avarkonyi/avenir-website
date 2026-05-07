-- Phase 5 Iter 1 — service-detail-page fields.
--
-- Adds the columns required to render dynamic service detail pages
-- (app/[locale]/szolgaltatasok/[slug]/page.tsx) and emit Service /
-- BreadcrumbList / FAQPage JSON-LD with admin-edited content.
--
-- All locale-aware text fields are nullable; HU is the only locale
-- guarded by the publish gate (see assertCanPublishDetail in
-- app/admin/(dashboard)/services/_actions.ts). Compound jsonb columns
-- default to '[]'::jsonb so the TS type stays array-of-T without
-- nullish guards in the renderers.
--
-- relatedServiceSlugs is locale-independent: a service that is
-- adjacent in HU is adjacent in every locale (links resolve to the
-- same slug across locales).
--
-- Apply via Neon SQL Editor (manual; same pattern as 0007 / 0010).

ALTER TABLE "services" ADD COLUMN "seo_title_hu" text;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "seo_title_en" text;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "seo_title_de" text;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "seo_title_zh" text;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "seo_description_hu" text;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "seo_description_en" text;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "seo_description_de" text;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "seo_description_zh" text;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "value_proposition_hu" text;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "value_proposition_en" text;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "value_proposition_de" text;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "value_proposition_zh" text;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "use_cases_hu" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "use_cases_en" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "use_cases_de" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "use_cases_zh" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "included_items_hu" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "included_items_en" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "included_items_de" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "included_items_zh" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "process_steps_hu" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "process_steps_en" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "process_steps_de" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "process_steps_zh" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "trust_items_hu" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "trust_items_en" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "trust_items_de" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "trust_items_zh" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "faq_hu" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "faq_en" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "faq_de" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "faq_zh" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "related_service_slugs" jsonb DEFAULT '[]'::jsonb NOT NULL;
