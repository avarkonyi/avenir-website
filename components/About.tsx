import type { Translation } from "@/lib/i18n";
import Image from "next/image";
import { Icon } from "./Icon";

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
          <div style={{ marginBottom: 40 }}>
            {t.aboutText.split("\n\n").map((paragraph, index) => (
              <p
                key={index}
                style={{
                  color: "#556070",
                  fontSize: 17,
                  lineHeight: 1.75,
                  margin: index === 0 ? "0 0 16px" : 0,
                  fontWeight: 300,
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>
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
              position: "relative",
              overflow: "hidden",
              background: "#0B1E3E",
              borderRadius: 4,
              minHeight: 420,
            }}
          >
            <Image
              src="/uploads/company-photo.webp"
              alt={t.aboutTitle}
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              quality={82}
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "rgba(11,30,62,0.08)" }} />
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
