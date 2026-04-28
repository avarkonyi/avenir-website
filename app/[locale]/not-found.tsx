import Link from "next/link";
import { AvenirLogo } from "@/components/AvenirLogo";

// Locale-aware 404, rendered inside the [locale] layout (which already
// provides <html><body>). Cannot read the URL locale here (Next.js
// limitation as of 16.2.x — not-found.tsx receives no params), so we
// render bilingual primary text plus 3-CTA strip per Codex 2 review:
// Primary (homepage) + Secondary (contact) + Tertiary (privacy).
// All four locale roots are exposed below the bilingual block.
export default function LocaleNotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0B1E3E",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "5vw",
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 600, textAlign: "center" }}>
        <div style={{ marginBottom: 32, display: "flex", justifyContent: "center" }}>
          <AvenirLogo size={48} />
        </div>
        <p
          style={{
            fontSize: 56,
            fontFamily: "var(--font-head)",
            fontWeight: 800,
            margin: 0,
            color: "#D1172E",
            lineHeight: 1,
          }}
        >
          404
        </p>
        <h1
          style={{
            fontFamily: "var(--font-head)",
            fontSize: "clamp(22px, 3vw, 32px)",
            fontWeight: 700,
            marginTop: 16,
            marginBottom: 12,
          }}
        >
          Az oldal nem található / Page not found
        </h1>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, lineHeight: 1.65, marginBottom: 28 }}>
          A keresett tartalom nem érhető el. / The content you are looking for is not available.
        </p>

        {/* 3-CTA layout: Primary (Home) + Secondary (Contact) + Tertiary (Privacy) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center", marginBottom: 24 }}>
          <Link
            href="/hu"
            style={{
              background: "#D1172E",
              color: "#fff",
              padding: "14px 28px",
              borderRadius: 4,
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: 1,
              textTransform: "uppercase",
              minWidth: 240,
              textAlign: "center",
            }}
          >
            Vissza a főoldalra / Return to homepage
          </Link>
          <Link
            href="/hu#contact"
            style={{
              background: "transparent",
              color: "#fff",
              padding: "12px 28px",
              borderRadius: 4,
              border: "1px solid rgba(255,255,255,0.3)",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: 0.8,
              textTransform: "uppercase",
              minWidth: 240,
              textAlign: "center",
            }}
          >
            Kapcsolat / Contact us
          </Link>
          <Link
            href="/hu/adatvedelem"
            style={{
              color: "rgba(255,255,255,0.65)",
              textDecoration: "underline",
              fontSize: 13,
              fontWeight: 400,
            }}
          >
            Adatvédelem / Privacy Policy
          </Link>
        </div>

        {/* Locale-root escape hatches */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "center",
            paddingTop: 20,
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {(["hu", "en", "de", "zh"] as const).map((l) => (
            <Link
              key={l}
              href={`/${l}`}
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.75)",
                padding: "6px 14px",
                borderRadius: 3,
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 12,
                letterSpacing: 0.5,
                textTransform: "uppercase",
              }}
            >
              /{l}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
