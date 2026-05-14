import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { db, news } from "@/lib/db";
import { redactedDbIdentity, sanitizeDbErrorMessage } from "@/lib/db/redact";

const NEWS_URL_SEGMENT_HU = "hirek";

function publishedNewsHuPredicate() {
  return and(
    isNull(news.deletedAt),
    eq(news.publishedHu, true),
    sql`nullif(trim(${news.slug}), '') is not null`,
    sql`nullif(trim(${news.titleHu}), '') is not null`,
    sql`nullif(trim(${news.leadHu}), '') is not null`,
    sql`nullif(trim(${news.bodyHu}), '') is not null`,
    sql`${news.date} <= now()`,
  );
}

export type PublishedNewsIndexItemHu = {
  readonly id: number;
  readonly slug: string;
  readonly title: string;
  readonly lead: string;
  readonly date: Date;
  readonly imageUrl: string | null;
};

export type PublishedNewsDetailHu = PublishedNewsIndexItemHu & {
  readonly body: string;
  readonly updatedAt: Date;
};

function trimArticle<T extends { slug: string; title: string; lead: string }>(
  row: T,
): T {
  return {
    ...row,
    slug: row.slug.trim(),
    title: row.title.trim(),
    lead: row.lead.trim(),
  };
}

export async function getPublishedNewsIndexHu(): Promise<
  PublishedNewsIndexItemHu[]
> {
  const rows = await db
    .select({
      id: news.id,
      slug: news.slug,
      title: news.titleHu,
      lead: news.leadHu,
      date: news.date,
      imageUrl: news.imageUrl,
    })
    .from(news)
    .where(publishedNewsHuPredicate())
    .orderBy(desc(news.date));

  return rows.map(trimArticle);
}

export async function getPublishedNewsDetailBySlugHu(
  slug: string,
): Promise<PublishedNewsDetailHu | null> {
  const [row] = await db
    .select({
      id: news.id,
      slug: news.slug,
      title: news.titleHu,
      lead: news.leadHu,
      body: news.bodyHu,
      date: news.date,
      updatedAt: news.updatedAt,
      imageUrl: news.imageUrl,
    })
    .from(news)
    .where(and(eq(news.slug, slug), publishedNewsHuPredicate()))
    .limit(1);

  if (!row) return null;
  return {
    ...trimArticle(row),
    body: row.body.trim(),
  };
}

export type PublishedNewsPathHu = {
  readonly locale: "hu";
  readonly slug: string;
  readonly date: Date;
  readonly updatedAt: Date;
};

export async function getAllPublishedNewsPathsHu(): Promise<
  PublishedNewsPathHu[]
> {
  const rows = await db
    .select({
      slug: news.slug,
      date: news.date,
      updatedAt: news.updatedAt,
    })
    .from(news)
    .where(publishedNewsHuPredicate())
    .orderBy(desc(news.date));

  return rows.map((row) => ({
    locale: "hu" as const,
    slug: row.slug.trim(),
    date: row.date,
    updatedAt: row.updatedAt,
  }));
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
        `[news-public] ${surface}: failed to read DB-backed HU article data.`,
        `DB target: ${redactedDbIdentity()}.`,
        `Cause: ${sanitizeDbErrorMessage(error)}.`,
        "Full DATABASE_URL was not printed.",
      ].join(" "),
    );

    throw new Error(
      `[news-public] ${surface}: HU article data requires a reachable database.`,
    );
  }
}

export function getPublishedNewsIndexHuForPublic(
  surface: string,
): Promise<PublishedNewsIndexItemHu[]> {
  return runSanitizedNewsQuery(surface, () => getPublishedNewsIndexHu());
}

export function getPublishedNewsDetailBySlugHuForPublic(
  slug: string,
  surface: string,
): Promise<PublishedNewsDetailHu | null> {
  return runSanitizedNewsQuery(surface, () =>
    getPublishedNewsDetailBySlugHu(slug),
  );
}

export async function getAllPublishedNewsPathsHuForBuild(
  surface: string,
): Promise<PublishedNewsPathHu[]> {
  try {
    return await getAllPublishedNewsPathsHu();
  } catch (error) {
    console.error(
      [
        `[news-paths] ${surface}: failed to read DB-backed published HU article paths.`,
        "Failing generation instead of emitting an incomplete article layer.",
        `DB target: ${redactedDbIdentity()}.`,
        `Cause: ${sanitizeDbErrorMessage(error)}.`,
        "Full DATABASE_URL was not printed.",
      ].join(" "),
    );

    throw new Error(
      `[news-paths] ${surface}: HU article path generation requires a reachable database.`,
    );
  }
}

export function newsDetailHrefHu(slug: string): string {
  return `/hu/${NEWS_URL_SEGMENT_HU}/${encodeURIComponent(slug)}`;
}
