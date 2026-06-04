import { cache } from "react";
import { and, asc, eq, inArray, isNull, sql } from "drizzle-orm";
import { db, services } from "@/lib/db";
import { redactedDbIdentity, sanitizeDbErrorMessage } from "@/lib/db/redact";
import { LOCALES, type Locale } from "@/lib/i18n";

type DbLocale = Exclude<Locale, "ko">;

const DB_LOCALES = ["hu", "en", "de", "zh"] as const satisfies readonly DbLocale[];

const KOREAN_SERVICE_DISPLAY: Record<
  string,
  { readonly name: string; readonly shortDesc: string }
> = {
  objektumorzes: {
    name: "현장 보안 인력 서비스",
    shortDesc:
      "사업장 출입 관리, 순찰, 사건 처리, 업무 기록 및 합의된 보고·에스컬레이션을 지원하는 현장 보안 인력 서비스입니다.",
  },
  portaszolgalat: {
    name: "리셉션 및 게이트하우스 서비스",
    shortDesc:
      "방문객, 협력사, 임직원, 열쇠, 우편물·배송물, 출입 기록 및 합의된 에스컬레이션을 관리하는 리셉션 및 게이트하우스 서비스입니다.",
  },
  biztonsagtechnika: {
    name: "보안 기술",
    shortDesc:
      "CCTV, 출입 통제 및 경보 프로세스를 현장별 보안 모델에 맞춰 설계·운영하도록 지원하는 보안 기술 서비스입니다.",
  },
  "tavfelugyelet-vonuloszolgalat": {
    name: "원격 모니터링 및 출동 대응 서비스",
    shortDesc:
      "신호 접수, 경보 확인, 에스컬레이션, 이벤트 기록 및 합의된 조건의 대응 프로세스를 지원하는 원격 모니터링 서비스입니다.",
  },
  "mystery-shopping-helyszini-audit": {
    name: "미스터리 쇼핑 및 서비스 감사",
    shortDesc:
      "실제 고객 접점과 운영 상황에서 서비스 품질을 확인하고, 구조화된 관찰·보고·개선 제안을 제공하는 서비스 감사입니다.",
  },
  rendezvenybiztositas: {
    name: "행사 보안",
    shortDesc:
      "기업 행사, 초청 행사 및 공개 행사에서 출입 관리, 동선 지원, 구역 관리, 사건 기록 및 주최자 기준 에스컬레이션을 지원합니다.",
  },
  "hard-fm": {
    name: "Hard FM",
    shortDesc:
      "계획 예방정비, 장애 대응, 전문 협력사 조율, 장애 기록 및 운영 보고를 지원하는 Hard FM 서비스입니다.",
  },
  "soft-fm": {
    name: "Soft FM",
    shortDesc:
      "청소, 조경, 위생, 폐기물 처리 지원 및 서비스 제공자 관리를 합의된 범위와 품질 확인, 서면 보고에 따라 지원하는 Soft FM 서비스입니다.",
  },
};

function safeDbLocaleOf(locale: string): DbLocale {
  return (DB_LOCALES as readonly string[]).includes(locale)
    ? (locale as DbLocale)
    : "hu";
}

function nonEmptyTrimmed(value: string | null): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
}

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
  const safeLocale = safeDbLocaleOf(locale);

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
    const namesByLocale: Record<DbLocale, string | null> = {
      hu: row.nameHu,
      en: row.nameEn,
      de: row.nameDe,
      zh: row.nameZh,
    };
    const descsByLocale: Record<DbLocale, string | null> = {
      hu: row.shortDescHu,
      en: row.shortDescEn,
      de: row.shortDescDe,
      zh: row.shortDescZh,
    };
    const koDisplay = locale === "ko" ? KOREAN_SERVICE_DISPLAY[row.slug] : null;
    const name =
      koDisplay?.name ??
      nonEmptyTrimmed(namesByLocale[safeLocale]) ??
      nonEmptyTrimmed(row.nameHu) ??
      "";
    const shortDesc =
      koDisplay?.shortDesc ??
      nonEmptyTrimmed(descsByLocale[safeLocale]) ??
      nonEmptyTrimmed(row.shortDescHu) ??
      "";
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

// Homepage service-card publication predates detail pages, so
// services.isPublished alone is not enough to expose a detail URL.
// A service detail page is public only when that exact locale has the
// mandatory detail baseline. EN/DE/ZH must not become public via HU
// fallback content.
function requiredDetailFieldsFor(locale: DbLocale) {
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

function publishedDetailPredicate(locale: DbLocale) {
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
  byLocale: Record<DbLocale, T | null>,
  fallback: T | null,
  locale: DbLocale,
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

function pickLocalizedArray<T>(
  byLocale: Record<DbLocale, T[] | null>,
  locale: DbLocale,
): T[] {
  const value = byLocale[locale];
  return Array.isArray(value) && value.length > 0 ? value : [];
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

// Fetch a single published+active service by slug. Required text fields are
// already gated per requested locale by publishedDetailPredicate(), so HU
// fallback here is only a defensive fallback for legacy nullable display
// columns. Optional detail arrays and FAQ are deliberately locale-strict:
// EN/DE/ZH pages must omit untranslated optional sections instead of leaking
// HU content into non-HU pages.
//
// The detail page must call notFound() on null — this helper does
// not throw, since "service exists but is unpublished" is a valid
// state in the admin and not an error.
async function loadPublishedServiceDetailBySlug(
  slug: string,
  locale: string,
): Promise<LocalizedServiceDetail | null> {
  if (locale === "ko") return null;
  const safeLocale = safeDbLocaleOf(locale);
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

  const highlights = pickLocalizedArray<string>(
    {
      hu: row.highlightsHu,
      en: row.highlightsEn,
      de: row.highlightsDe,
      zh: row.highlightsZh,
    },
    safeLocale,
  );

  const useCases = pickLocalizedArray<string>(
    {
      hu: row.useCasesHu,
      en: row.useCasesEn,
      de: row.useCasesDe,
      zh: row.useCasesZh,
    },
    safeLocale,
  );
  const includedItems = pickLocalizedArray<string>(
    {
      hu: row.includedItemsHu,
      en: row.includedItemsEn,
      de: row.includedItemsDe,
      zh: row.includedItemsZh,
    },
    safeLocale,
  );
  const processSteps = pickLocalizedArray<{ title: string; body: string }>(
    {
      hu: row.processStepsHu,
      en: row.processStepsEn,
      de: row.processStepsDe,
      zh: row.processStepsZh,
    },
    safeLocale,
  );
  const trustItems = pickLocalizedArray<{ title: string; body: string }>(
    {
      hu: row.trustItemsHu,
      en: row.trustItemsEn,
      de: row.trustItemsDe,
      zh: row.trustItemsZh,
    },
    safeLocale,
  );
  const faq = pickLocalizedArray<{ q: string; a: string }>(
    { hu: row.faqHu, en: row.faqEn, de: row.faqDe, zh: row.faqZh },
    safeLocale,
  );

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
  if (locale === "ko") return false;

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
  if (locale === "ko") return [];
  const safeLocale = safeDbLocaleOf(locale);
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
