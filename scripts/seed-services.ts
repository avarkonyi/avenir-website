// Seed the canonical 8 services into the `services` table from the
// i18n source data (lib/i18n/{hu,en,de,zh}.ts).
//
// Usage: npm run db:seed-services
//
// Idempotent per-row upsert by slug — deliberately divergent from
// scripts/seed.ts's all-or-nothing-per-table pattern. The services
// table may already contain admin-created rows from CRUD testing;
// we want to insert/update the canonical 8 without skipping the
// whole table or touching unrelated admin rows.
//
// IMPORTANT — running this resets admin enrichment on canonical rows:
// the upsert UPDATEs every column on a slug match, including
// long_desc_*, highlights_*, image_url, is_featured back to their
// canonical (mostly empty) baseline. Admin-created rows whose slugs
// don't collide with the canonical 8 stay untouched.
//
// CANONICAL SLUGS — the wire format. The contact form's
// <option value> uses these strings, and email-templates/
// notification.ts has SERVICE_LABELS_HU keyed by them. Changing a
// slug here breaks the contact-form → email pipeline silently —
// don't.
//
// SORT ORDER — security-first SEO priority per
// SCHEMA_SERVICE_ORDER in lib/seo-data.ts (used by the JSON-LD
// ItemList today). The admin can drag-reorder later; this is the
// initialization baseline.

import "./load-env";
import { eq } from "drizzle-orm";
import { db, services } from "../lib/db";
import { getTranslation, type Locale } from "../lib/i18n";

type CanonicalEntry = {
  slug: string;
  icon: string;
  sortOrder: number;
};

// Order matches SCHEMA_SERVICE_ORDER from lib/seo-data.ts:
//   security(0), reception(1), mystery(2), cleaning(3),
//   building(4), technical(5), green(6), hardfm(7).
const CANONICAL_SEED: ReadonlyArray<CanonicalEntry> = [
  { slug: "security",  icon: "shield",   sortOrder: 0 },
  { slug: "reception", icon: "desk",     sortOrder: 1 },
  { slug: "mystery",   icon: "eye",      sortOrder: 2 },
  { slug: "cleaning",  icon: "sparkle",  sortOrder: 3 },
  { slug: "building",  icon: "building", sortOrder: 4 },
  { slug: "technical", icon: "wrench",   sortOrder: 5 },
  { slug: "green",     icon: "leaf",     sortOrder: 6 },
  { slug: "hardfm",    icon: "gear",     sortOrder: 7 },
];

// Localized strings for one service slug. Each i18n file has
// `services: Array<{ id, icon, t, d }>`; we look up by id (which
// equals our DB slug) and pull `t` (title) + `d` (short description).
type LocalizedFields = { name: string; shortDesc: string };

function pickFromLocale(locale: Locale, slug: string): LocalizedFields {
  const t = getTranslation(locale);
  const entry = t.services.find((s) => s.id === slug);
  if (!entry) {
    throw new Error(
      `i18n[${locale}].services has no entry with id="${slug}" — ` +
        `i18n source out of sync with canonical seed`,
    );
  }
  return { name: entry.t, shortDesc: entry.d };
}

async function main() {
  console.log("--- seed-services start ---");

  let inserted = 0;
  let updated = 0;

  for (const meta of CANONICAL_SEED) {
    // Build the localized field map by iterating the 4 locales.
    // Throws (and aborts the whole script) if any locale is missing
    // the expected entry — surfaces i18n drift loudly rather than
    // silently writing partial data.
    const localized = {
      hu: pickFromLocale("hu", meta.slug),
      en: pickFromLocale("en", meta.slug),
      de: pickFromLocale("de", meta.slug),
      zh: pickFromLocale("zh", meta.slug),
    };

    // Per spec: UPDATE all schema fields except id + createdAt.
    // Including resets for admin-only enrichment fields (long_desc_*,
    // highlights_*, image_url, is_featured) so re-running the seed
    // restores a known canonical baseline. parentId stays NULL —
    // canonical seed is flat (top-level cards only).
    const values = {
      slug: meta.slug,
      icon: meta.icon,
      parentId: null,
      imageUrl: null,
      nameHu: localized.hu.name,
      nameEn: localized.en.name,
      nameDe: localized.de.name,
      nameZh: localized.zh.name,
      shortDescHu: localized.hu.shortDesc,
      shortDescEn: localized.en.shortDesc,
      shortDescDe: localized.de.shortDesc,
      shortDescZh: localized.zh.shortDesc,
      longDescHu: null,
      longDescEn: null,
      longDescDe: null,
      longDescZh: null,
      highlightsHu: [] as string[],
      highlightsEn: [] as string[],
      highlightsDe: [] as string[],
      highlightsZh: [] as string[],
      sortOrder: meta.sortOrder,
      isFeatured: false,
      isPublished: true,
      isActive: true,
    };

    const existing = await db
      .select({ id: services.id })
      .from(services)
      .where(eq(services.slug, meta.slug))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(services).values(values);
      inserted += 1;
      console.log(
        `  + INSERT slug=${meta.slug} sortOrder=${meta.sortOrder}`,
      );
    } else {
      // Drizzle doesn't auto-touch defaultNow on UPDATE (only INSERT),
      // so set updatedAt explicitly here.
      await db
        .update(services)
        .set({ ...values, updatedAt: new Date() })
        .where(eq(services.id, existing[0].id));
      updated += 1;
      console.log(
        `  ~ UPDATE slug=${meta.slug} sortOrder=${meta.sortOrder} ` +
          `(id=${existing[0].id})`,
      );
    }
  }

  console.log(
    `--- seed-services done — ${inserted} inserted, ${updated} updated ---`,
  );
}

main().catch((err) => {
  console.error("seed-services FAILED:", err);
  process.exit(1);
});
