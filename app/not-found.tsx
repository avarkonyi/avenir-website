import Link from "next/link";
import { AvenirLogo } from "@/components/AvenirLogo";

// Global 404 — caught when no app/[locale]/* route matches AND the
// proxy did not rewrite. No parent layout exists, so this file
// provides its own <html><body>. Bilingual labels (no locale context),
// 4 locale-root escape hatches.
export default function GlobalNotFound() {
  return (
    <html lang="hu">
      <body
        style={{
          margin: 0,
          fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
          background: "#0B1E3E",
          color: "#fff",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "5vw",
        }}
      >
        <div style={{ maxWidth: 560, textAlign: "center" }}>
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
            A keresett URL nem érhető el. / The URL you requested is not available.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "center",
            }}
          >
            {(["hu", "en", "de", "zh"] as const).map((l) => (
              <Link
                key={l}
                href={`/${l}`}
                style={{
                  background: "#D1172E",
                  color: "#fff",
                  padding: "12px 22px",
                  borderRadius: 4,
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: 14,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                }}
              >
                /{l}
              </Link>
            ))}
          </div>
        </div>
      </body>
    </html>
  );
}
