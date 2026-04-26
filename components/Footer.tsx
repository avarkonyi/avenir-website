import type { Translation } from "@/lib/i18n";
import { AvenirLogo } from "./AvenirLogo";

export function Footer({ t }: { t: Translation }) {
  return (
    <footer style={{ background: "#070F1E", padding: "60px 5vw 28px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Top grid: logo+blurb / services / contact / legal */}
        <div
          className="footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1.2fr 1fr",
            gap: 48,
            marginBottom: 40,
          }}
        >
          {/* Column 1: Logo + blurb */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <AvenirLogo size={36} />
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 1.65, fontWeight: 300, maxWidth: 260 }}>
              {t.hero.sub}
            </p>
          </div>

          {/* Column 2: Services links */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-head)",
                color: "rgba(255,255,255,0.85)",
                fontSize: 13,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                fontWeight: 700,
                marginBottom: 18,
              }}
            >
              {t.servicesTitle}
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {t.services.map((s) => (
                <li key={s.id}>
                  <a
                    href="#services"
                    style={{
                      color: "rgba(255,255,255,0.45)",
                      fontSize: 13,
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                  >
                    {s.t}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact info (hardcoded — not from translations) */}
          {/* SOURCE OF TRUTH for company facts: lib/seo-data.ts */}
          {/* Keep these strings synced when seo-data is updated. */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-head)",
                color: "rgba(255,255,255,0.85)",
                fontSize: 13,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                fontWeight: 700,
                marginBottom: 18,
              }}
            >
              {t.contactTitle}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.6, fontWeight: 300 }}>
              <div>1039 Budapest, Királyok útja 291.</div>
              <div>
                <a href="tel:+36703168218" style={{ color: "inherit", textDecoration: "none" }}>
                  +36 70 316 8218
                </a>
              </div>
              <div>
                <a href="mailto:info@afm.hu" style={{ color: "inherit", textDecoration: "none" }}>
                  info@afm.hu
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Legal links */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-head)",
                color: "rgba(255,255,255,0.85)",
                fontSize: 13,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                fontWeight: 700,
                marginBottom: 18,
              }}
            >
              Jogi
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              <li>
                <a href="/adatvedelem" className="footer-link" style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, textDecoration: "none" }}>
                  {t.footer.privacy}
                </a>
              </li>
              <li>
                <a href="/aszf" className="footer-link" style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, textDecoration: "none" }}>
                  {t.footer.terms}
                </a>
              </li>
              <li>
                <a href="/impresszum" className="footer-link" style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, textDecoration: "none" }}>
                  {t.footer.impressum}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24 }}>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, fontWeight: 300, marginBottom: 6 }}>
            {t.footer.rights}
          </p>
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, fontWeight: 300 }}>
            Cégjegyzékszám: 01-09-328046 · Adószám: 26395124-2-41 · Székhely: 1039 Budapest, Királyok útja 291.
          </p>
        </div>
      </div>
    </footer>
  );
}
