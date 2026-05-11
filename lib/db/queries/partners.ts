import { and, asc, eq, isNotNull } from "drizzle-orm";
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
        maybeError.message.includes("logo_usage_approved_at")))
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
          isNotNull(partners.logoUsageApprovedAt),
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
