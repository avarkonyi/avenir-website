import { cache } from "react";
import { and, asc, eq, inArray, isNull, sql } from "drizzle-orm";
import { db, services } from "@/lib/db";
import { redactedDbIdentity, sanitizeDbErrorMessage } from "@/lib/db/redact";
import { LOCALES, type Locale } from "@/lib/i18n";

// Normalized row shape returned to public renderers. Locale fallback
// to HU is already applied to `name` and `shortDesc`; `shortDesc` may
// be empty string when neither the requested locale nor HU has a
// value (services.shortDesc* columns are all nullable).
export type LocalizedServiceRow = {
  readonly slug: string;
  readonly icon: string | null;
  readonly name: string;
  readonly shortDesc: string;
};

// Active + published + top-level services, ordered by sortOrder ASC,
// with HU fallback applied to nullable EN/DE/ZH locale columns and
// values trimmed.
//
// Caller responsibilities:
//  - call `await connection()` before invoking (this helper does not
//    opt the caller into dynamic rendering — that is the page /
//    layout / component author's choice).
//  - apply empty-field guards appropriate to the surface (Footer
//    needs name only; JSON-LD ItemList needs both name + shortDesc).
//  - map UI-coupled fields (e.g. icon → safeIconName).
async function loadActiveTopLevelServices(
  locale: string,
): Promise<LocalizedServiceRow[]> {
  const safeLocale: Locale = (LOCALES as readonly string[]).includes(locale)
    ? (locale as Locale)
    : "hu";

  const rows = await db
    .select({
      slug: services.slug,
      icon: services.icon,
      nameHu: services.nameHu,
      nameEn: services.nameEn,
      nameDe: services.nameDe,
      nameZh: services.nameZh,
      shortDescHu: services.shortDescHu,
      shortDescEn: services.shortDescEn,
      shortDescDe: services.shortDescDe,
      shortDescZh: services.shortDescZh,
    })
    .from(services)
    .where(
      and(
        eq(services.isActive, true),
        eq(services.isPublished, true),
        isNull(services.parentId),
      ),
    )
    .orderBy(asc(services.sortOrder));

  return rows.map((row) => {
    const namesByLocale: Record<Locale, string | null> = {
      hu: row.nameHu,
      en: row.nameEn,
      de: row.nameDe,
      zh: row.nameZh,
    };
    const descsByLocale: Record<Locale, string | null> = {
      hu: row.shortDescHu,
      en: row.shortDescEn,
      de: row.shortDescDe,
      zh: row.shortDescZh,
    };
    const name =
      namesByLocale[safeLocale]?.trim() || row.nameHu?.trim() || "";
    const shortDesc =
      descsByLocale[safeLocale]?.trim() || row.shortDescHu?.trim() || "";
    return {
      slug: row.slug,
      icon: row.icon,
      name,
      shortDesc,
    };
  });
}

export const getActiveTopLevelServices = cache(loadActiveTopLevelServices);

// ────────────────────────────────────────────────────────────────────────
// Service detail page queries (P5 Phase 1)
// ────────────────────────────────────────────────────────────────────────

function safeLocaleOf(locale: string): Locale {
  return (LOCALES as readonly string[]).includes(locale)
    ? (locale as Locale)
    : "hu";
}

// Homepage service-card publication predates detail pages, so
// services.isPublished alone is not enough to expose a detail URL.
// A service detail page is public only when that exact locale has the
// mandatory detail baseline. EN/DE/ZH must not become public via HU
// fallback content.
function requiredDetailFieldsFor(locale: Locale) {
  switch (locale) {
    case "en":
      return [
        services.seoTitleEn,
        services.seoDescriptionEn,
        services.longDescEn,
        services.valuePropositionEn,
      ];
    case "de":
      return [
        services.seoTitleDe,
        services.seoDescriptionDe,
        services.longDescDe,
        services.valuePropositionDe,
      ];
    case "zh":
      return [
        services.seoTitleZh,
        services.seoDescriptionZh,
        services.longDescZh,
        services.valuePropositionZh,
      ];
    case "hu":
    default:
      return [
        services.seoTitleHu,
        services.seoDescriptionHu,
        services.longDescHu,
        services.valuePropositionHu,
      ];
  }
}

function publishedDetailPredicate(locale: Locale) {
  const requiredFields = requiredDetailFieldsFor(locale);
  return and(
    eq(services.isPublished, true),
    eq(services.isActive, true),
    ...requiredFields.map(
      (field) => sql`nullif(trim(${field}), '') is not null`,
    ),
  );
}

function pickLocalized<T>(
  byLocale: Record<Locale, T | null>,
  fallback: T | null,
  locale: Locale,
): T | null {
  const value = byLocale[locale];
  if (value !== null && value !== undefined) {
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed.length > 0) return trimmed as unknown as T;
    } else if (Array.isArray(value)) {
      if (value.length > 0) return value;
    } else {
      return value;
    }
  }
  if (fallback !== null && fallback !== undefined) {
    if (typeof fallback === "string") {
      const trimmed = fallback.trim();
      if (trimmed.length > 0) return trimmed as unknown as T;
      return null;
    }
    if (Array.isArray(fallback)) {
      return fallback.length > 0 ? fallback : null;
    }
    return fallback;
  }
  return null;
}

export type LocalizedServiceDetail = {
  readonly id: number;
  readonly slug: string;
  readonly icon: string | null;
  readonly imageUrl: string | null;
  readonly name: string;
  readonly shortDesc: string;
  readonly longDesc: string;
  readonly seoTitle: string;
  readonly seoDescription: string;
  readonly valueProposition: string;
  readonly highlights: readonly string[];
  readonly useCases: readonly string[];
  readonly includedItems: readonly string[];
  readonly processSteps: readonly { title: string; body: string }[];
  readonly trustItems: readonly { title: string; body: string }[];
  readonly faq: readonly { q: string; a: string }[];
  readonly relatedSlugs: readonly string[];
};

// Fetch a single published+active service by slug, with HU fallback
// applied to every locale-aware text/json column. Returns null when
// the row is missing OR not eligible for public render (draft or
// soft-deleted).
//
// The detail page must call notFound() on null — this helper does
// not throw, since "service exists but is unpublished" is a valid
// state in the admin and not an error.
async function loadPublishedServiceDetailBySlug(
  slug: string,
  locale: string,
): Promise<LocalizedServiceDetail | null> {
  const safeLocale = safeLocaleOf(locale);
  const [row] = await db
    .select()
    .from(services)
    .where(
      and(
        eq(services.slug, slug),
        publishedDetailPredicate(safeLocale),
      ),
    )
    .limit(1);

  if (!row) return null;

  const name =
    pickLocalized<string>(
      { hu: row.nameHu, en: row.nameEn, de: row.nameDe, zh: row.nameZh },
      row.nameHu,
      safeLocale,
    ) ?? "";
  const shortDesc =
    pickLocalized<string>(
      {
        hu: row.shortDescHu,
        en: row.shortDescEn,
        de: row.shortDescDe,
        zh: row.shortDescZh,
      },
      row.shortDescHu,
      safeLocale,
    ) ?? "";
  const longDesc =
    pickLocalized<string>(
      {
        hu: row.longDescHu,
        en: row.longDescEn,
        de: row.longDescDe,
        zh: row.longDescZh,
      },
      row.longDescHu,
      safeLocale,
    ) ?? "";
  const seoTitle =
    pickLocalized<string>(
      {
        hu: row.seoTitleHu,
        en: row.seoTitleEn,
        de: row.seoTitleDe,
        zh: row.seoTitleZh,
      },
      row.seoTitleHu,
      safeLocale,
    ) ?? "";
  const seoDescription =
    pickLocalized<string>(
      {
        hu: row.seoDescriptionHu,
        en: row.seoDescriptionEn,
        de: row.seoDescriptionDe,
        zh: row.seoDescriptionZh,
      },
      row.seoDescriptionHu,
      safeLocale,
    ) ?? "";
  const valueProposition =
    pickLocalized<string>(
      {
        hu: row.valuePropositionHu,
        en: row.valuePropositionEn,
        de: row.valuePropositionDe,
        zh: row.valuePropositionZh,
      },
      row.valuePropositionHu,
      safeLocale,
    ) ?? "";

  const highlights =
    pickLocalized<string[]>(
      {
        hu: row.highlightsHu,
        en: row.highlightsEn,
        de: row.highlightsDe,
        zh: row.highlightsZh,
      },
      row.highlightsHu,
      safeLocale,
    ) ?? [];

  const useCases =
    pickLocalized<string[]>(
      {
        hu: row.useCasesHu,
        en: row.useCasesEn,
        de: row.useCasesDe,
        zh: row.useCasesZh,
      },
      row.useCasesHu,
      safeLocale,
    ) ?? [];
  const includedItems =
    pickLocalized<string[]>(
      {
        hu: row.includedItemsHu,
        en: row.includedItemsEn,
        de: row.includedItemsDe,
        zh: row.includedItemsZh,
      },
      row.includedItemsHu,
      safeLocale,
    ) ?? [];
  const processSteps =
    pickLocalized<{ title: string; body: string }[]>(
      {
        hu: row.processStepsHu,
        en: row.processStepsEn,
        de: row.processStepsDe,
        zh: row.processStepsZh,
      },
      row.processStepsHu,
      safeLocale,
    ) ?? [];
  const trustItems =
    pickLocalized<{ title: string; body: string }[]>(
      {
        hu: row.trustItemsHu,
        en: row.trustItemsEn,
        de: row.trustItemsDe,
        zh: row.trustItemsZh,
      },
      row.trustItemsHu,
      safeLocale,
    ) ?? [];
  const faq =
    pickLocalized<{ q: string; a: string }[]>(
      { hu: row.faqHu, en: row.faqEn, de: row.faqDe, zh: row.faqZh },
      row.faqHu,
      safeLocale,
    ) ?? [];

  return {
    id: row.id,
    slug: row.slug,
    icon: row.icon,
    imageUrl: row.imageUrl,
    name,
    shortDesc,
    longDesc,
    seoTitle,
    seoDescription,
    valueProposition,
    highlights,
    useCases,
    includedItems,
    processSteps,
    trustItems,
    faq,
    relatedSlugs: row.relatedServiceSlugs ?? [],
  };
}

export const getPublishedServiceDetailBySlug = cache(
  loadPublishedServiceDetailBySlug,
);

// All published+active service slugs, used by:
//   - sitemap generation (one entry per locale × slug)
//   - generateStaticParams for the detail route
export type PublishedServicePath = {
  readonly locale: Locale;
  readonly slug: string;
};

type ServiceReadinessRow = {
  readonly slug: string;
  readonly seoTitleHu: string | null;
  readonly seoDescriptionHu: string | null;
  readonly longDescHu: string | null;
  readonly valuePropositionHu: string | null;
  readonly seoTitleEn: string | null;
  readonly seoDescriptionEn: string | null;
  readonly longDescEn: string | null;
  readonly valuePropositionEn: string | null;
  readonly seoTitleDe: string | null;
  readonly seoDescriptionDe: string | null;
  readonly longDescDe: string | null;
  readonly valuePropositionDe: string | null;
  readonly seoTitleZh: string | null;
  readonly seoDescriptionZh: string | null;
  readonly longDescZh: string | null;
  readonly valuePropositionZh: string | null;
};

const SERVICE_READINESS_SELECT = {
  slug: services.slug,
  seoTitleHu: services.seoTitleHu,
  seoDescriptionHu: services.seoDescriptionHu,
  longDescHu: services.longDescHu,
  valuePropositionHu: services.valuePropositionHu,
  seoTitleEn: services.seoTitleEn,
  seoDescriptionEn: services.seoDescriptionEn,
  longDescEn: services.longDescEn,
  valuePropositionEn: services.valuePropositionEn,
  seoTitleDe: services.seoTitleDe,
  seoDescriptionDe: services.seoDescriptionDe,
  longDescDe: services.longDescDe,
  valuePropositionDe: services.valuePropositionDe,
  seoTitleZh: services.seoTitleZh,
  seoDescriptionZh: services.seoDescriptionZh,
  longDescZh: services.longDescZh,
  valuePropositionZh: services.valuePropositionZh,
} as const;

function hasRequiredDetailFields(
  row: ServiceReadinessRow,
  locale: Locale,
): boolean {
  const values =
    locale === "hu"
      ? [
          row.seoTitleHu,
          row.seoDescriptionHu,
          row.longDescHu,
          row.valuePropositionHu,
        ]
      : locale === "en"
        ? [
            row.seoTitleEn,
            row.seoDescriptionEn,
            row.longDescEn,
            row.valuePropositionEn,
          ]
        : locale === "de"
          ? [
              row.seoTitleDe,
              row.seoDescriptionDe,
              row.longDescDe,
              row.valuePropositionDe,
            ]
          : [
              row.seoTitleZh,
              row.seoDescriptionZh,
              row.longDescZh,
              row.valuePropositionZh,
            ];

  return values.every((value) => value !== null && value.trim().length > 0);
}

async function loadAllPublishedServicePaths(): Promise<
  PublishedServicePath[]
> {
  const rows = await db
    .select(SERVICE_READINESS_SELECT)
    .from(services)
    .where(and(eq(services.isPublished, true), eq(services.isActive, true)))
    .orderBy(asc(services.sortOrder));

  return LOCALES.flatMap((locale) =>
    rows
      .filter((row) => hasRequiredDetailFields(row, locale))
      .map((row) => ({ locale, slug: row.slug })),
  );
}

export const getAllPublishedServicePaths = cache(
  loadAllPublishedServicePaths,
);

export async function getAllPublishedServicePathsForBuild(
  surface: string,
): Promise<PublishedServicePath[]> {
  try {
    return await getAllPublishedServicePaths();
  } catch (error) {
    console.error(
      [
        `[service-paths] ${surface}: failed to read DB-backed published service paths.`,
        "Failing generation instead of emitting an incomplete service layer.",
        `DB target: ${redactedDbIdentity()}.`,
        `Cause: ${sanitizeDbErrorMessage(error)}.`,
        "Full DATABASE_URL was not printed.",
      ].join(" "),
    );

    throw new Error(
      `[service-paths] ${surface}: service path generation requires a reachable database.`,
    );
  }
}

async function runSanitizedServiceQuery<T>(
  surface: string,
  query: () => Promise<T>,
): Promise<T> {
  try {
    return await query();
  } catch (error) {
    console.error(
      [
        `[service-detail] ${surface}: failed to read DB-backed service detail data.`,
        `DB target: ${redactedDbIdentity()}.`,
        `Cause: ${sanitizeDbErrorMessage(error)}.`,
        "Full DATABASE_URL was not printed.",
      ].join(" "),
    );

    throw new Error(
      `[service-detail] ${surface}: service detail data requires a reachable database.`,
    );
  }
}

export function getPublishedServiceDetailBySlugForPublic(
  slug: string,
  locale: string,
  surface: string,
): Promise<LocalizedServiceDetail | null> {
  return runSanitizedServiceQuery(surface, () =>
    getPublishedServiceDetailBySlug(slug, locale),
  );
}

export function getPublishedServiceLocalesBySlugForPublic(
  slug: string,
  surface: string,
): Promise<Locale[]> {
  return runSanitizedServiceQuery(surface, () =>
    getPublishedServiceLocalesBySlug(slug),
  );
}

export function getPublishedServicesBySlugsForPublic(
  slugs: readonly string[],
  locale: string,
  surface: string,
): Promise<LocalizedServiceRow[]> {
  return runSanitizedServiceQuery(surface, () =>
    getPublishedServicesBySlugs(slugs, locale),
  );
}

async function loadPublishedServiceLocalesBySlug(
  slug: string,
): Promise<Locale[]> {
  const [row] = await db
    .select(SERVICE_READINESS_SELECT)
    .from(services)
    .where(
      and(
        eq(services.slug, slug),
        eq(services.isPublished, true),
        eq(services.isActive, true),
      ),
    )
    .limit(1);

  if (!row) return [];

  return LOCALES.filter((locale) => hasRequiredDetailFields(row, locale));
}

export const getPublishedServiceLocalesBySlug = cache(
  loadPublishedServiceLocalesBySlug,
);

// Hydrate related-service link cards (name + shortDesc only). Returns
// rows in the order requested by `slugs`; missing or unpublished slugs
// are silently dropped (admin can list a slug that was later
// unpublished — better to skip it than 404 the entire detail page).
async function loadPublishedServicesBySlugs(
  slugs: readonly string[],
  locale: string,
): Promise<LocalizedServiceRow[]> {
  if (slugs.length === 0) return [];
  const safeLocale = safeLocaleOf(locale);
  const rows = await db
    .select({
      slug: services.slug,
      icon: services.icon,
      nameHu: services.nameHu,
      nameEn: services.nameEn,
      nameDe: services.nameDe,
      nameZh: services.nameZh,
      shortDescHu: services.shortDescHu,
      shortDescEn: services.shortDescEn,
      shortDescDe: services.shortDescDe,
      shortDescZh: services.shortDescZh,
    })
    .from(services)
    .where(
      and(
        inArray(services.slug, [...slugs]),
        publishedDetailPredicate(safeLocale),
      ),
    );

  const bySlug = new Map<string, (typeof rows)[number]>();
  for (const r of rows) bySlug.set(r.slug, r);

  return slugs
    .map((slug) => bySlug.get(slug))
    .filter((r): r is (typeof rows)[number] => r !== undefined)
    .map((row) => {
      const name =
        pickLocalized<string>(
          { hu: row.nameHu, en: row.nameEn, de: row.nameDe, zh: row.nameZh },
          row.nameHu,
          safeLocale,
        ) ?? "";
      const shortDesc =
        pickLocalized<string>(
          {
            hu: row.shortDescHu,
            en: row.shortDescEn,
            de: row.shortDescDe,
            zh: row.shortDescZh,
          },
          row.shortDescHu,
          safeLocale,
        ) ?? "";
      return { slug: row.slug, icon: row.icon, name, shortDesc };
    });
}

export const getPublishedServicesBySlugs = cache(loadPublishedServicesBySlugs);
