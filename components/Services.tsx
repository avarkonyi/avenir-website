import Link from "next/link";
import { getTranslation } from "@/lib/i18n";
import { getActiveTopLevelServices } from "@/lib/db/queries/services";
import { getReadyHuServiceDetailHref } from "@/lib/service-detail-links";
import { Icon, ICON_NAMES, type IconName } from "./Icon";

// Public Services grid — DB-backed via shared
// `getActiveTopLevelServices` helper (lib/db/queries/services.ts),
// which owns the WHERE/ORDER + locale fallback to HU. Empty-field
// guard stays here because the listing surface needs both title and
// description (Footer/Contact accept name-only rows).
//
// Section chrome (h2 title + eyebrow) stays in i18n. The list data
// is the only thing migrated to DB.

export async function Services({ locale }: { locale: string }) {
  const t = getTranslation(locale);
  const rows = await getActiveTopLevelServices(locale);

  const cards = rows
    .map((row) => ({
      id: row.slug,
      icon: safeIconName(row.icon),
      title: row.name,
      description: row.shortDesc,
      href: getReadyHuServiceDetailHref(locale, row.slug),
    }))
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
          {cards.map((card) => {
            const content = (
              <>
                <div className="service-icon-wrap">
                  <Icon name={card.icon} size={26} />
                </div>
                <h3 className="service-title" style={{ fontFamily: "var(--font-head)" }}>
                  {card.title}
                </h3>
                <p className="service-desc">{card.description}</p>
                {card.href && (
                  <span
                    aria-hidden="true"
                    style={{
                      display: "inline-flex",
                      marginTop: 18,
                      fontFamily: "var(--font-head)",
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: 1.2,
                      textTransform: "uppercase",
                      color: "#D1172E",
                    }}
                  >
                    Részletek
                  </span>
                )}
              </>
            );

            if (!card.href) {
              return (
                <div key={card.id} className="service-card">
                  {content}
                </div>
              );
            }

            return (
              <Link
                key={card.id}
                href={card.href}
                className="service-card"
                aria-label={`${card.title} részletei`}
                style={{ display: "block", cursor: "pointer" }}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── helpers ────────────────────────────────────────────────────────────

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
