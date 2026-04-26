import type { Translation } from "@/lib/i18n";
import { Icon } from "./Icon";
import { AvenirLogo } from "./AvenirLogo";

export function About({ t }: { t: Translation }) {
  return (
    <section id="about" style={{ padding: "100px 5vw", background: "#fff" }}>
      <div
        className="about-grid"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 80,
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
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
              {t.aboutSub}
            </span>
          </div>
          <h2
            style={{
              fontFamily: "var(--font-head)",
              fontWeight: 800,
              fontSize: "clamp(36px, 4vw, 54px)",
              color: "#0B1E3E",
              lineHeight: 1.1,
              marginBottom: 24,
            }}
          >
            {t.aboutTitle}
          </h2>
          <p style={{ color: "#556070", fontSize: 17, lineHeight: 1.75, marginBottom: 40, fontWeight: 300 }}>
            {t.aboutText}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {t.values.map((v, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    background: "#D1172E",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name="check" size={18} color="#fff" />
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 17, color: "#0B1E3E", letterSpacing: 0.3 }}>
                    {v.t}
                  </div>
                  <div style={{ color: "#778899", fontSize: 14, marginTop: 2, lineHeight: 1.5 }}>{v.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Visual block (logo + accent) */}
        <div style={{ position: "relative" }}>
          <div
            className="about-visual-block"
            style={{
              background: "linear-gradient(135deg, #0B1E3E 0%, #1a3a6b 100%)",
              borderRadius: 4,
              padding: 60,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 420,
              gap: 20,
            }}
          >
            <AvenirLogo size={52} />
            <div
              style={{
                width: "70%",
                height: 1,
                background: "rgba(255,255,255,0.12)",
                margin: "8px 0",
              }}
            />
            <div
              style={{
                fontFamily: "var(--font-head)",
                color: "rgba(255,255,255,0.4)",
                fontSize: 11,
                letterSpacing: 2,
                textAlign: "center",
                lineHeight: 2,
              }}
            >
              SINCE 2018
              <br />
              BUDAPEST · HUNGARY
            </div>
            <div
              className="about-photo-badge"
              style={{
                position: "absolute",
                bottom: 16,
                right: 16,
                background: "rgba(255,255,255,0.05)",
                border: "1px dashed rgba(255,255,255,0.15)",
                padding: "6px 12px",
                borderRadius: 2,
              }}
            >
              <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
                company photo
              </span>
            </div>
          </div>
          <div
            className="about-decorative-square"
            style={{
              position: "absolute",
              bottom: -16,
              left: -16,
              width: 100,
              height: 100,
              background: "#D1172E",
              zIndex: -1,
              borderRadius: 2,
            }}
          />
        </div>
      </div>
    </section>
  );
}
