import { connection } from "next/server";
import { and, asc, eq, isNull } from "drizzle-orm";
import { db, services } from "@/lib/db";
import { LOCALES, getTranslation, type Locale } from "@/lib/i18n";
import { Icon, ICON_NAMES, type IconName } from "./Icon";

// Public Services grid — DB-backed since P2 cutover Commit 2.
//
// Reads active + published + top-level services from DB ordered by
// sortOrder ASC. The visible render order now follows DB sortOrder
// (matching SCHEMA_SERVICE_ORDER from lib/seo-data.ts), which is a
// deliberate change from the prior i18n array-literal order.
//
// Locale columns for EN/DE/ZH are nullable in the schema (Iter 3C
// C1), so we SELECT all four locale columns and fall back to HU at
// the application layer when the picked locale's value is empty.
// (Career.tsx uses pure SQL projection because positions has all 4
// locales NOT NULL — services can't get away with that.)
//
// Section chrome (h2 title + eyebrow) stays in i18n. The list data
// is the only thing migrated to DB.

export async function Services({ locale }: { locale: string }) {
  await connection();

  const safeLocale = asLocale(locale);
  const t = getTranslation(safeLocale);

  const rows = await db
    .select({
      slug: services.slug,
      icon: services.icon,
      sortOrder: services.sortOrder,
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

  // Build cards with HU fallback. Empty-field guard drops any row
  // whose title or description is empty after fallback — defense in
  // depth: even if the DB filter were bypassed (or a canonical row
  // somehow lost both HU and locale-X content), the public site
  // doesn't render incomplete cards.
  const cards = rows
    .map((row) => {
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

      const title =
        namesByLocale[safeLocale]?.trim() || row.nameHu?.trim() || "";
      const description =
        descsByLocale[safeLocale]?.trim() ||
        row.shortDescHu?.trim() ||
        "";

      return {
        id: row.slug,
        icon: safeIconName(row.icon),
        title,
        description,
      };
    })
    .filter((card) => card.title.length > 0 && card.description.length > 0);

  return (
    <section id="services" style={{ padding: "100px 5vw", background: "#F8FAFC" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div style={{ width: 40, height: 3, background: "#D1172E" }} />
            <span
              style={{
                fontFamily: "var(--font-head)",
                fontSize: 13,
                letterSpacing: 2.5,
                color: "#D1172E",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              {t.servicesSub}
            </span>
            <div style={{ width: 40, height: 3, background: "#D1172E" }} />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-head)",
              fontWeight: 800,
              fontSize: "clamp(36px, 4vw, 54px)",
              color: "#0B1E3E",
              lineHeight: 1.1,
            }}
          >
            {t.servicesTitle}
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 24,
          }}
        >
          {cards.map((card) => (
            <div key={card.id} className="service-card">
              <div className="service-icon-wrap">
                <Icon name={card.icon} size={26} />
              </div>
              <h3 className="service-title" style={{ fontFamily: "var(--font-head)" }}>
                {card.title}
              </h3>
              <p className="service-desc">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── helpers ────────────────────────────────────────────────────────────

function asLocale(input: string): Locale {
  return (LOCALES as readonly string[]).includes(input)
    ? (input as Locale)
    : "hu";
}

// Icon component accepts plain `string` and silently renders nothing
// for unknown names. Admin can save a typo into services.icon (e.g.,
// "shielf"), which would otherwise leave the card iconless on the
// public site. Guard against that: validate against the public
// ICON_NAMES const, fall back to "shield" for unknown / null.
function safeIconName(dbIcon: string | null): IconName {
  if (dbIcon && (ICON_NAMES as readonly string[]).includes(dbIcon)) {
    return dbIcon as IconName;
  }
  return "shield";
}
