"use server";

import { and, eq, isNull, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db, news } from "@/lib/db";
import { FALLBACK_SLUG, SLUG_MAX_LENGTH, slugify } from "@/lib/utils/slugify";

const PUBLIC_NEWS_PATHS = ["/hu", "/en", "/de", "/zh"] as const;
const PUBLIC_NEWS_INDEX_PATH_HU = "/hu/hirek";

// Server actions for the News CRUD module.
//
// Result-return pattern (Iter 3A polish): actions no longer call
// redirect() on the happy path. Instead they return an `ActionResult`,
// and the client (NewsForm / DeleteButton) handles the post-success
// navigation via router.push() AFTER showing a toast. Reason: a server-
// side redirect tears down the page before any toast can mount.
// Auth failures and other unexpected errors still throw, since they're
// not user-correctable.
//
// Slug strategy:
//   - User-entered slug wins (custom URL).
//   - Otherwise: slugify(titleHu).
//   - Either way, run through uniqueSlug() to dedup against existing
//     non-deleted rows. Suffix grows -2, -3, … and shrinks the base
//     when needed to stay under SLUG_MAX_LENGTH.

export type NewsFormPayload = {
  titleHu: string;
  titleEn?: string;
  titleDe?: string;
  titleZh?: string;
  leadHu?: string;
  leadEn?: string;
  leadDe?: string;
  leadZh?: string;
  bodyHu?: string;
  bodyEn?: string;
  bodyDe?: string;
  bodyZh?: string;
  slug?: string;
  publishedHu?: boolean;
  publishedEn?: boolean;
  publishedDe?: boolean;
  publishedZh?: boolean;
  date?: Date | string;
  imageUrl?: string | null;
};

export type CreateNewsResult =
  | { ok: true; id: number; message: string }
  | { ok: false; error: string };

export type UpdateNewsResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

export type DeleteNewsResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

async function requireAdmin(): Promise<string> {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }
  return session.user.email;
}

async function uniqueSlug(
  baseSlug: string,
  excludeId?: number,
): Promise<string> {
  const conditions = [eq(news.slug, baseSlug), isNull(news.deletedAt)];
  if (excludeId !== undefined) conditions.push(ne(news.id, excludeId));

  const first = await db
    .select({ id: news.id })
    .from(news)
    .where(and(...conditions))
    .limit(1);
  if (first.length === 0) return baseSlug;

  let counter = 2;
  while (true) {
    const suffix = `-${counter}`;
    const maxBase = SLUG_MAX_LENGTH - suffix.length;
    const candidate = `${baseSlug.slice(0, maxBase)}${suffix}`;

    const existing = await db
      .select({ id: news.id })
      .from(news)
      .where(
        and(
          eq(news.slug, candidate),
          isNull(news.deletedAt),
          ...(excludeId !== undefined ? [ne(news.id, excludeId)] : []),
        ),
      )
      .limit(1);
    if (existing.length === 0) return candidate;
    counter += 1;
  }
}

// Empty / whitespace-only EN/DE/ZH variants collapse to NULL so the
// public renderer can fall back to HU. HU lead/body are NOT NULL in
// the DB but allow empty strings (admin may publish a title-only teaser).
function normLocale(value: string | undefined | null): string | null {
  if (value === undefined || value === null) return null;
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

function normHu(value: string | undefined | null): string {
  if (value === undefined || value === null) return "";
  return value;
}

function resolveBaseSlug(payload: NewsFormPayload): string {
  const userSlug = payload.slug?.trim();
  if (userSlug) {
    const cleaned = slugify(userSlug);
    return cleaned || FALLBACK_SLUG;
  }
  return slugify(payload.titleHu || "");
}

function revalidateNewsViews(
  newsId?: number,
  slugs: readonly (string | null | undefined)[] = [],
) {
  revalidatePath("/admin/news");
  if (newsId !== undefined) {
    revalidatePath(`/admin/news/${newsId}/edit`);
  }
  revalidatePath("/admin");
  for (const path of PUBLIC_NEWS_PATHS) {
    revalidatePath(path);
  }
  revalidatePath(PUBLIC_NEWS_INDEX_PATH_HU);
  revalidatePath("/sitemap.xml");
  const uniqueSlugs = new Set(
    slugs.map((slug) => slug?.trim()).filter((slug): slug is string => !!slug),
  );
  for (const slug of uniqueSlugs) {
    revalidatePath(`/hu/hirek/${slug}`);
  }
}

export async function createNews(
  payload: NewsFormPayload,
): Promise<CreateNewsResult> {
  await requireAdmin();

  if (!payload.titleHu || payload.titleHu.trim().length === 0) {
    return { ok: false, error: "A magyar cím kötelező." };
  }

  try {
    const baseSlug = resolveBaseSlug(payload);
    const finalSlug = await uniqueSlug(baseSlug);

    const [inserted] = await db
      .insert(news)
      .values({
        titleHu: payload.titleHu.trim(),
        titleEn: normLocale(payload.titleEn),
        titleDe: normLocale(payload.titleDe),
        titleZh: normLocale(payload.titleZh),
        leadHu: normHu(payload.leadHu),
        leadEn: normLocale(payload.leadEn),
        leadDe: normLocale(payload.leadDe),
        leadZh: normLocale(payload.leadZh),
        bodyHu: normHu(payload.bodyHu),
        bodyEn: normLocale(payload.bodyEn),
        bodyDe: normLocale(payload.bodyDe),
        bodyZh: normLocale(payload.bodyZh),
        slug: finalSlug,
        publishedHu: payload.publishedHu ?? false,
        publishedEn: payload.publishedEn ?? false,
        publishedDe: payload.publishedDe ?? false,
        publishedZh: payload.publishedZh ?? false,
        date: payload.date ? new Date(payload.date) : new Date(),
        imageUrl: normLocale(payload.imageUrl),
      })
      .returning({ id: news.id });

    revalidateNewsViews(inserted.id, [finalSlug]);

    return {
      ok: true,
      id: inserted.id,
      message: "Hír sikeresen létrehozva.",
    };
  } catch (err) {
    console.error("createNews error:", err);
    return {
      ok: false,
      error:
        err instanceof Error ? err.message : "A hír mentése sikertelen.",
    };
  }
}

export async function updateNews(
  id: number,
  payload: NewsFormPayload,
): Promise<UpdateNewsResult> {
  await requireAdmin();

  if (!payload.titleHu || payload.titleHu.trim().length === 0) {
    return { ok: false, error: "A magyar cím kötelező." };
  }

  try {
    const [existing] = await db
      .select({ slug: news.slug })
      .from(news)
      .where(and(eq(news.id, id), isNull(news.deletedAt)))
      .limit(1);

    const baseSlug = resolveBaseSlug(payload);
    const finalSlug = await uniqueSlug(baseSlug, id);

    await db
      .update(news)
      .set({
        titleHu: payload.titleHu.trim(),
        titleEn: normLocale(payload.titleEn),
        titleDe: normLocale(payload.titleDe),
        titleZh: normLocale(payload.titleZh),
        leadHu: normHu(payload.leadHu),
        leadEn: normLocale(payload.leadEn),
        leadDe: normLocale(payload.leadDe),
        leadZh: normLocale(payload.leadZh),
        bodyHu: normHu(payload.bodyHu),
        bodyEn: normLocale(payload.bodyEn),
        bodyDe: normLocale(payload.bodyDe),
        bodyZh: normLocale(payload.bodyZh),
        slug: finalSlug,
        publishedHu: payload.publishedHu ?? false,
        publishedEn: payload.publishedEn ?? false,
        publishedDe: payload.publishedDe ?? false,
        publishedZh: payload.publishedZh ?? false,
        date: payload.date ? new Date(payload.date) : new Date(),
        imageUrl: normLocale(payload.imageUrl),
        updatedAt: new Date(),
      })
      .where(eq(news.id, id));

    revalidateNewsViews(id, [existing?.slug, finalSlug]);

    return { ok: true, message: "Hír frissítve." };
  } catch (err) {
    console.error("updateNews error:", err);
    return {
      ok: false,
      error:
        err instanceof Error ? err.message : "A hír frissítése sikertelen.",
    };
  }
}

export async function deleteNews(id: number): Promise<DeleteNewsResult> {
  await requireAdmin();

  try {
    const [existing] = await db
      .select({ slug: news.slug })
      .from(news)
      .where(and(eq(news.id, id), isNull(news.deletedAt)))
      .limit(1);

    await db
      .update(news)
      .set({ deletedAt: new Date() })
      .where(eq(news.id, id));
    revalidateNewsViews(id, [existing?.slug]);
    return { ok: true, message: "Hír törölve." };
  } catch (err) {
    console.error("deleteNews error:", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "A hír törlése sikertelen.",
    };
  }
}
