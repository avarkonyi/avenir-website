import { asc, eq } from "drizzle-orm";
import type { Translation } from "@/lib/i18n";
import { db, positions } from "@/lib/db";
import { Icon } from "./Icon";

// Per-locale column selection. Resolves audit P0-3: positions used to
// render HU strings on /en, /de, /zh. The DB schema now stores all four
// locales (migration 0003_localize_positions); the component picks the
// right column based on the URL locale prop.
const LOCALE_COLS = {
  hu: { title: positions.titleHu, location: positions.locationHu, type: positions.typeHu },
  en: { title: positions.titleEn, location: positions.locationEn, type: positions.typeEn },
  de: { title: positions.titleDe, location: positions.locationDe, type: positions.typeDe },
  zh: { title: positions.titleZh, location: positions.locationZh, type: positions.typeZh },
} as const;

type Locale = keyof typeof LOCALE_COLS;

export async function Career({
  t,
  locale,
}: {
  t: Translation;
  locale: string;
}) {
  const cols = LOCALE_COLS[(locale in LOCALE_COLS ? locale : "hu") as Locale];
  const rows = await db
    .select({
      id: positions.id,
      title: cols.title,
      location: cols.location,
      type: cols.type,
      applyEmail: positions.applyEmail,
    })
    .from(positions)
    .where(eq(positions.active, true))
    .orderBy(asc(positions.sortOrder));

  return (
    <section id="career" style={{ padding: "100px 5vw", background: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
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
            {t.careerSub}
          </span>
        </div>
        <div className="career-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, marginBottom: 52 }}>
          <h2
            style={{
              fontFamily: "var(--font-head)",
              fontWeight: 800,
              fontSize: "clamp(36px, 4vw, 54px)",
              color: "#0B1E3E",
              lineHeight: 1.1,
            }}
          >
            {t.careerTitle}
          </h2>
          <p style={{ color: "#556070", fontSize: 17, lineHeight: 1.7, fontWeight: 300, paddingTop: 8, whiteSpace: "pre-line" }}>
            {t.careerText}
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {rows.map((p) => (
            <div key={p.id} className="career-card">
              <div>
                <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 20, color: "#0B1E3E", marginBottom: 8 }}>
                  {p.title}
                </h3>
                <div style={{ display: "flex", gap: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <Icon name="pin" size={13} color="#8A9BB0" />
                    <span style={{ fontSize: 13, color: "#8A9BB0" }}>{p.location}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <Icon name="clock" size={13} color="#8A9BB0" />
                    <span style={{ fontSize: 13, color: "#8A9BB0" }}>{p.type}</span>
                  </div>
                </div>
              </div>
              <a
                href={`mailto:${p.applyEmail}?subject=${encodeURIComponent(`${t.applyBtn} - ${p.title}`)}`}
                className="career-apply-btn"
              >
                {t.applyBtn}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
