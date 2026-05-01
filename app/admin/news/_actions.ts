"use server";

import { and, eq, isNull, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db, news } from "@/lib/db";
import { FALLBACK_SLUG, SLUG_MAX_LENGTH, slugify } from "@/lib/utils/slugify";

// Server actions for the News CRUD module. Auth check happens inside
// each function — middleware gates /admin/* but server actions are also
// reachable via direct POST to the action URL, so a defense-in-depth
// check is mandatory.
//
// Slug strategy:
//   - User-entered slug wins (they may want a custom URL).
//   - Otherwise: slugify(titleHu).
//   - Either way, run through uniqueSlug() to dedup against existing
//     non-deleted rows. Suffix grows -2, -3, … and shrinks the base
//     when needed to stay under SLUG_MAX_LENGTH.
//
// IMPORTANT: redirect() throws NEXT_REDIRECT internally (Next.js
// control-flow exception). Wrapping it in try/catch swallows the
// redirect and breaks navigation. The pattern below puts redirect()
// AFTER the try/catch, on the happy path only.

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
};

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

  // Collision. Iterate -2, -3, … shrinking the base if base + suffix
  // would exceed SLUG_MAX_LENGTH.
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

// Empty / whitespace-only EN/DE/ZH variants collapse to NULL so the public
// renderer can fall back to HU. HU lead/body are NOT NULL in the DB but
// allow empty strings (admin may publish a title-only teaser).
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

export async function createNews(payload: NewsFormPayload): Promise<void> {
  await requireAdmin();

  if (!payload.titleHu || payload.titleHu.trim().length === 0) {
    throw new Error("A magyar cím kötelező.");
  }

  let newId: number;
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
      })
      .returning({ id: news.id });

    newId = inserted.id;
    revalidatePath("/admin/news");
    revalidatePath("/admin");
  } catch (err) {
    console.error("createNews error:", err);
    throw err instanceof Error ? err : new Error("A hír mentése sikertelen.");
  }

  redirect(`/admin/news/${newId}/edit`);
}

export async function updateNews(
  id: number,
  payload: NewsFormPayload,
): Promise<void> {
  await requireAdmin();

  if (!payload.titleHu || payload.titleHu.trim().length === 0) {
    throw new Error("A magyar cím kötelező.");
  }

  try {
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
        updatedAt: new Date(),
      })
      .where(eq(news.id, id));

    revalidatePath("/admin/news");
    revalidatePath(`/admin/news/${id}/edit`);
    revalidatePath("/admin");
  } catch (err) {
    console.error("updateNews error:", err);
    throw err instanceof Error
      ? err
      : new Error("A hír frissítése sikertelen.");
  }
  // No redirect: user stays on /edit, revalidate refreshes the data.
}

export async function deleteNews(id: number): Promise<void> {
  await requireAdmin();

  try {
    await db
      .update(news)
      .set({ deletedAt: new Date() })
      .where(eq(news.id, id));
    revalidatePath("/admin/news");
    revalidatePath("/admin");
  } catch (err) {
    console.error("deleteNews error:", err);
    throw err instanceof Error ? err : new Error("A hír törlése sikertelen.");
  }

  redirect("/admin/news");
}
