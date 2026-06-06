import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { db, news } from "@/lib/db";
import { redactedDbIdentity, sanitizeDbErrorMessage } from "@/lib/db/redact";
import {
  NEWS_INDEXABLE_LOCALES,
  NEWS_PUBLIC_LOCALES,
  type NewsIndexableLocale,
  type NewsPublicLocale,
  newsDetailHref,
} from "@/lib/news-routing";

const NEWS_LOCALE_COLUMNS = {
  hu: {
    published: news.publishedHu,
    title: news.titleHu,
    lead: news.leadHu,
    body: news.bodyHu,
  },
  en: {
    published: news.publishedEn,
    title: news.titleEn,
    lead: news.leadEn,
    body: news.bodyEn,
  },
  de: {
    published: news.publishedDe,
    title: news.titleDe,
    lead: news.leadDe,
    body: news.bodyDe,
  },
} as const;

function publishedNewsPredicate(locale: NewsPublicLocale) {
  const cols = NEWS_LOCALE_COLUMNS[locale];

  return and(
    isNull(news.deletedAt),
    eq(cols.published, true),
    sql`nullif(trim(${news.slug}), '') is not null`,
    sql`nullif(trim(${cols.title}), '') is not null`,
    sql`nullif(trim(${cols.lead}), '') is not null`,
    sql`nullif(trim(${cols.body}), '') is not null`,
    sql`${news.date} <= now()`,
  );
}

export type PublishedNewsIndexItem = {
  readonly id: number;
  readonly slug: string;
  readonly title: string;
  readonly lead: string;
  readonly date: Date;
  readonly imageUrl: string | null;
};

export type PublishedNewsDetail = PublishedNewsIndexItem & {
  readonly body: string;
  readonly updatedAt: Date;
};

export type PublishedNewsIndexItemHu = PublishedNewsIndexItem;
export type PublishedNewsDetailHu = PublishedNewsDetail;

type RawNewsIndexRow = {
  readonly id: number;
  readonly slug: string;
  readonly title: string | null;
  readonly lead: string | null;
  readonly date: Date;
  readonly imageUrl: string | null;
};

type RawNewsDetailRow = RawNewsIndexRow & {
  readonly body: string | null;
  readonly updatedAt: Date | null;
};

function requireDbText(value: string | null, field: string): string {
  const normalized = value?.trim();
  if (!normalized) {
    throw new Error(`Published news row has blank ${field}.`);
  }
  return normalized;
}

function trimIndexRow(row: RawNewsIndexRow): PublishedNewsIndexItem {
  return {
    id: row.id,
    slug: row.slug.trim(),
    title: requireDbText(row.title, "title"),
    lead: requireDbText(row.lead, "lead"),
    date: row.date,
    imageUrl: row.imageUrl,
  };
}

function trimDetailRow(row: RawNewsDetailRow): PublishedNewsDetail {
  return {
    ...trimIndexRow(row),
    body: requireDbText(row.body, "body"),
    updatedAt: row.updatedAt ?? row.date,
  };
}

export async function getPublishedNewsIndex(
  locale: NewsPublicLocale,
): Promise<PublishedNewsIndexItem[]> {
  const cols = NEWS_LOCALE_COLUMNS[locale];
  const rows = await db
    .select({
      id: news.id,
      slug: news.slug,
      title: cols.title,
      lead: cols.lead,
      date: news.date,
      imageUrl: news.imageUrl,
    })
    .from(news)
    .where(publishedNewsPredicate(locale))
    .orderBy(desc(news.date));

  return rows.map(trimIndexRow);
}

export async function getPublishedNewsDetailBySlug(
  locale: NewsPublicLocale,
  slug: string,
): Promise<PublishedNewsDetail | null> {
  const cols = NEWS_LOCALE_COLUMNS[locale];
  const [row] = await db
    .select({
      id: news.id,
      slug: news.slug,
      title: cols.title,
      lead: cols.lead,
      body: cols.body,
      date: news.date,
      updatedAt: news.updatedAt,
      imageUrl: news.imageUrl,
    })
    .from(news)
    .where(and(eq(news.slug, slug), publishedNewsPredicate(locale)))
    .limit(1);

  if (!row) return null;
  return trimDetailRow(row);
}

export type PublishedNewsPath = {
  readonly locale: NewsPublicLocale;
  readonly slug: string;
  readonly date: Date;
  readonly updatedAt: Date;
};

export type PublishedNewsIndexablePath = PublishedNewsPath & {
  readonly locale: NewsIndexableLocale;
};

export type PublishedNewsPathHu = PublishedNewsPath & {
  readonly locale: "hu";
};

export async function getAllPublishedNewsPaths(
  locales: readonly NewsPublicLocale[] = NEWS_PUBLIC_LOCALES,
): Promise<PublishedNewsPath[]> {
  const pathGroups = await Promise.all(
    locales.map(async (locale) => {
      const rows = await db
        .select({
          slug: news.slug,
          date: news.date,
          updatedAt: news.updatedAt,
        })
        .from(news)
        .where(publishedNewsPredicate(locale))
        .orderBy(desc(news.date));

      return rows.map((row) => ({
        locale,
        slug: row.slug.trim(),
        date: row.date,
        updatedAt: row.updatedAt ?? row.date,
      }));
    }),
  );

  return pathGroups.flat();
}

export async function getAllPublishedNewsPathsHu(): Promise<
  PublishedNewsPathHu[]
> {
  return (await getAllPublishedNewsPaths(["hu"])) as PublishedNewsPathHu[];
}

export async function getPublishedNewsLocalesForSlug(
  slug: string,
  locales: readonly NewsPublicLocale[] = NEWS_PUBLIC_LOCALES,
): Promise<NewsPublicLocale[]> {
  const paths = await getAllPublishedNewsPaths(locales);
  return paths
    .filter((path) => path.slug === slug)
    .map((path) => path.locale);
}

async function runSanitizedNewsQuery<T>(
  surface: string,
  query: () => Promise<T>,
): Promise<T> {
  try {
    return await query();
  } catch (error) {
    console.error(
      [
        `[news-public] ${surface}: failed to read DB-backed article data.`,
        `DB target: ${redactedDbIdentity()}.`,
        `Cause: ${sanitizeDbErrorMessage(error)}.`,
        "Full DATABASE_URL was not printed.",
      ].join(" "),
    );

    throw new Error(
      `[news-public] ${surface}: article data requires a reachable database.`,
    );
  }
}

export function getPublishedNewsIndexForPublic(
  locale: NewsPublicLocale,
  surface: string,
): Promise<PublishedNewsIndexItem[]> {
  return runSanitizedNewsQuery(surface, () => getPublishedNewsIndex(locale));
}

export function getPublishedNewsDetailBySlugForPublic(
  locale: NewsPublicLocale,
  slug: string,
  surface: string,
): Promise<PublishedNewsDetail | null> {
  return runSanitizedNewsQuery(surface, () =>
    getPublishedNewsDetailBySlug(locale, slug),
  );
}

export function getPublishedNewsLocalesForSlugForPublic(
  slug: string,
  surface: string,
): Promise<NewsPublicLocale[]> {
  return runSanitizedNewsQuery(surface, () =>
    getPublishedNewsLocalesForSlug(slug),
  );
}

export async function getAllPublishedNewsPathsForBuild(
  surface: string,
  locales: readonly NewsPublicLocale[] = NEWS_PUBLIC_LOCALES,
): Promise<PublishedNewsPath[]> {
  try {
    return await getAllPublishedNewsPaths(locales);
  } catch (error) {
    console.error(
      [
        `[news-paths] ${surface}: failed to read DB-backed published article paths.`,
        "Continuing with no pre-rendered news article paths; eligible articles can still render dynamically at request time.",
        `DB target: ${redactedDbIdentity()}.`,
        `Cause: ${sanitizeDbErrorMessage(error)}.`,
        "Full DATABASE_URL was not printed.",
      ].join(" "),
    );

    return [];
  }
}

export async function getAllIndexablePublishedNewsPathsForBuild(
  surface: string,
): Promise<PublishedNewsIndexablePath[]> {
  return (await getAllPublishedNewsPathsForBuild(
    surface,
    NEWS_INDEXABLE_LOCALES,
  )) as PublishedNewsIndexablePath[];
}

export function getPublishedNewsIndexHu(): Promise<PublishedNewsIndexItemHu[]> {
  return getPublishedNewsIndex("hu");
}

export function getPublishedNewsDetailBySlugHu(
  slug: string,
): Promise<PublishedNewsDetailHu | null> {
  return getPublishedNewsDetailBySlug("hu", slug);
}

export function getPublishedNewsIndexHuForPublic(
  surface: string,
): Promise<PublishedNewsIndexItemHu[]> {
  return getPublishedNewsIndexForPublic("hu", surface);
}

export function getPublishedNewsDetailBySlugHuForPublic(
  slug: string,
  surface: string,
): Promise<PublishedNewsDetailHu | null> {
  return getPublishedNewsDetailBySlugForPublic("hu", slug, surface);
}

export async function getAllPublishedNewsPathsHuForBuild(
  surface: string,
): Promise<PublishedNewsPathHu[]> {
  return (await getAllPublishedNewsPathsForBuild(surface, [
    "hu",
  ])) as PublishedNewsPathHu[];
}

export function newsDetailHrefHu(slug: string): string {
  return newsDetailHref("hu", slug);
}
