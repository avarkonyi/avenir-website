import { and, desc, eq, isNull, lte, sql } from "drizzle-orm";
import { db, news } from "@/lib/db";

const NEWS_URL_SEGMENT_HU = "hirek";

function publishedNewsHuPredicate(now = new Date()) {
  return and(
    isNull(news.deletedAt),
    eq(news.publishedHu, true),
    sql`nullif(trim(${news.slug}), '') is not null`,
    sql`nullif(trim(${news.titleHu}), '') is not null`,
    sql`nullif(trim(${news.leadHu}), '') is not null`,
    sql`nullif(trim(${news.bodyHu}), '') is not null`,
    lte(news.date, now),
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
};

export async function getAllPublishedNewsPathsHu(): Promise<
  PublishedNewsPathHu[]
> {
  const rows = await db
    .select({ slug: news.slug })
    .from(news)
    .where(publishedNewsHuPredicate())
    .orderBy(desc(news.date));

  return rows.map((row) => ({
    locale: "hu" as const,
    slug: row.slug.trim(),
  }));
}

export function newsDetailHrefHu(slug: string): string {
  return `/hu/${NEWS_URL_SEGMENT_HU}/${encodeURIComponent(slug)}`;
}
