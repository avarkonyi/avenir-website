import { and, asc, eq, isNotNull, sql } from "drizzle-orm";
import { db, partners } from "@/lib/db";

export type HomepagePartnerLogo = {
  id: number;
  name: string;
  logoUrl: string;
};

function isMissingLogoStripColumnError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const maybeError = err as { code?: unknown; message?: unknown };
  return (
    maybeError.code === "42703" ||
    (typeof maybeError.message === "string" &&
      (maybeError.message.includes("show_in_logo_strip") ||
        maybeError.message.includes("logo_usage_approved_at") ||
        maybeError.message.includes("logo_usage_approved_by") ||
        maybeError.message.includes("logo_usage_scope")))
  );
}

export async function getHomepagePartnerLogos(): Promise<
  HomepagePartnerLogo[]
> {
  try {
    const rows = await db
      .select({
        id: partners.id,
        name: partners.name,
        logoUrl: partners.logoUrl,
      })
      .from(partners)
      .where(
        and(
          eq(partners.isActive, true),
          eq(partners.isPublished, true),
          eq(partners.showInLogoStrip, true),
          isNotNull(partners.logoUrl),
          sql`nullif(trim(${partners.logoUrl}), '') is not null`,
          isNotNull(partners.logoUsageApprovedAt),
          isNotNull(partners.logoUsageApprovedBy),
          sql`nullif(trim(${partners.logoUsageApprovedBy}), '') is not null`,
          isNotNull(partners.logoUsageScope),
          sql`nullif(trim(${partners.logoUsageScope}), '') is not null`,
        ),
      )
      .orderBy(asc(partners.sortOrder), asc(partners.name));

    return rows
      .filter((row) => row.logoUrl !== null && row.logoUrl.trim().length > 0)
      .map((row) => ({
        id: row.id,
        name: row.name,
        logoUrl: row.logoUrl as string,
      }));
  } catch (err) {
    if (isMissingLogoStripColumnError(err)) {
      console.warn(
        "Partner logo strip columns are missing; skipping homepage logo strip until the migration is applied.",
      );
      return [];
    }
    throw err;
  }
}
