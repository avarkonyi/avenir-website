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
// IMPORTANT — this is a baseline seed script, not a detail-page seed.
// Run it before pilot detail seeds, not as a casual reset afterward.
// The update payload preserves detail enrichment fields where possible
// by not writing seo_title_*, seo_description_*, long_desc_*,
// value_proposition_*, use_cases_*, included_items_*, process_steps_*,
// trust_items_*, faq_* or related_service_slugs. It still restores the
// homepage-card baseline fields it owns (slug, icon, names,
// short_desc_*, image_url, highlights_*, sort order and publish flags).
// Re-run the relevant pilot seed scripts afterward if detail content
// needs to be republished on staging after any baseline reset or manual
// cleanup. Admin-created rows whose slugs don't collide with the
// canonical 8 stay untouched.
//
// CANONICAL SLUGS — the wire format. The contact form's
// <option value> uses these strings, and email-templates/
// notification.ts has SERVICE_LABELS_HU keyed by them. Changing a
// slug here breaks the contact-form → email pipeline silently —
// don't.
//
// SORT ORDER — canonical seed sort order, security-first SEO
// priority. The admin can drag-reorder later; this is the
// initialization baseline.

import "./load-env";
import { eq, or } from "drizzle-orm";
import { db, services } from "../lib/db";
import { getTranslation, type Locale } from "../lib/i18n";

type CanonicalEntry = {
  slug: string;
  icon: string;
  sortOrder: number;
  // i18nId may diverge from slug after a public detail-page rename
  // (e.g., slug "objektumorzes" maps to i18n entry id "security",
  // "portaszolgalat" maps to i18n entry id "reception",
  // "tavfelugyelet-vonuloszolgalat" maps to i18n entry id
  // "technical", and "mystery-shopping-helyszini-audit" maps to
  // i18n entry id "mystery").
  // Falls back to slug when omitted.
  i18nId?: string;
};

// Canonical seed sort order for the launch-facing portfolio:
//   objektumorzes -> Élőerős objektumőrzés
//   portaszolgalat -> Recepciós és portaszolgálat
//   mystery-shopping-helyszini-audit -> Mystery Shopping és helyszíni audit
//   rendezvenybiztositas -> Rendezvénybiztosítás
//   biztonsagtechnika -> Biztonságtechnika
//   tavfelugyelet-vonuloszolgalat -> Távfelügyelet és vonulószolgálat
//   green         -> Soft FM
//   hardfm        -> Hard FM
//
// P5 Phase 1: legacy generic slugs are being replaced one-by-one with
// Hungarian public service-detail slugs:
//   security  -> objektumorzes
//   reception -> portaszolgalat
//   building  -> biztonsagtechnika
//   technical -> tavfelugyelet-vonuloszolgalat
//   mystery   -> mystery-shopping-helyszini-audit
//   cleaning  -> rendezvenybiztositas
//
// `technical` is the legacy/current baseline slug for Távfelügyelet
// és vonulószolgálat. It must not be mapped to Biztonságtechnika:
// that service uses `building` as legacy and `biztonsagtechnika` as
// the canonical public slug.
//
// `mystery` is the legacy slug for Mystery Shopping és helyszíni
// audit. The canonical public service-detail slug is
// `mystery-shopping-helyszini-audit`, while i18nId remains `mystery`
// because the translation/service label source still uses that key.
//
// `cleaning` is the legacy slug for Rendezvénybiztosítás / Event
// Security. The canonical public service-detail slug is
// `rendezvenybiztositas`, while i18nId remains `cleaning` because the
// translation/service label source still uses that key. `green` is
// separate and belongs to Soft FM, not Rendezvénybiztosítás.
//
// Legacy keys stay accepted by the contact-form/email pipeline (see
// SERVICE_LABELS_HU in lib/email-templates/notification.ts) so any
// stale references continue to render correctly.
//
// `i18nId` is the lookup key into lib/i18n/*.ts services arrays. It
// keeps the legacy ids ("security", "reception", "building",
// "technical", "mystery", "cleaning") so the i18n source files don't
// need a parallel rename in this iteration; only the DB slug changes.
// The legacy lookup below prevents future baseline seed runs from
// recreating duplicate legacy rows after a pilot seed renames them
// in-place.
const CANONICAL_SEED: ReadonlyArray<CanonicalEntry> = [
  { slug: "objektumorzes", icon: "shield",  sortOrder: 0, i18nId: "security"  },
  { slug: "portaszolgalat", icon: "desk",   sortOrder: 1, i18nId: "reception" },
  {
    slug: "mystery-shopping-helyszini-audit",
    icon: "eye",
    sortOrder: 2,
    i18nId: "mystery",
  },
  {
    slug: "rendezvenybiztositas",
    icon: "sparkle",
    sortOrder: 3,
    i18nId: "cleaning",
  },
  { slug: "biztonsagtechnika", icon: "camera", sortOrder: 4, i18nId: "building" },
  {
    slug: "tavfelugyelet-vonuloszolgalat",
    icon: "radar",
    sortOrder: 5,
    i18nId: "technical",
  },
  { slug: "green",         icon: "leaf",    sortOrder: 6, i18nId: "green"     },
  { slug: "hardfm",        icon: "gear",    sortOrder: 7, i18nId: "hardfm"    },
];

// Baseline seeding must update legacy rows in-place instead of
// inserting duplicate old slugs after a pilot detail seed has renamed
// the canonical row.
const LEGACY_SLUG_BY_CANONICAL: Partial<Record<string, string>> = {
  objektumorzes: "security",
  portaszolgalat: "reception",
  biztonsagtechnika: "building",
  "tavfelugyelet-vonuloszolgalat": "technical",
  "mystery-shopping-helyszini-audit": "mystery",
  rendezvenybiztositas: "cleaning",
};

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
    const i18nId = meta.i18nId ?? meta.slug;
    // Build the localized field map by iterating the 4 locales.
    // Throws (and aborts the whole script) if any locale is missing
    // the expected entry — surfaces i18n drift loudly rather than
    // silently writing partial data.
    const localized = {
      hu: pickFromLocale("hu", i18nId),
      en: pickFromLocale("en", i18nId),
      de: pickFromLocale("de", i18nId),
      zh: pickFromLocale("zh", i18nId),
    };

    // Per spec: UPDATE the baseline homepage-card fields this script
    // owns. Detail-page enrichment fields (long_desc_*, seo_title_*,
    // value_proposition_*, use_cases_*, FAQ, related services, etc.)
    // are deliberately omitted so existing pilot/admin detail content
    // is preserved where possible. parentId stays NULL — canonical seed
    // is flat (top-level cards only).
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
      highlightsHu: [] as string[],
      highlightsEn: [] as string[],
      highlightsDe: [] as string[],
      highlightsZh: [] as string[],
      sortOrder: meta.sortOrder,
      isFeatured: false,
      isPublished: true,
      isActive: true,
    };

    const legacySlug = LEGACY_SLUG_BY_CANONICAL[meta.slug];
    const existingWhere = legacySlug
      ? or(eq(services.slug, meta.slug), eq(services.slug, legacySlug))
      : eq(services.slug, meta.slug);

    const existing = await db
      .select({ id: services.id })
      .from(services)
      .where(existingWhere)
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
