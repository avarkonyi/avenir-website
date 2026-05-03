import { and, asc, eq, isNull } from "drizzle-orm";
import { db, services } from "@/lib/db";
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
export async function getActiveTopLevelServices(
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
