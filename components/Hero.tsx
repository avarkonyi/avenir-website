import Image from "next/image";
import type { Translation } from "@/lib/i18n";

export function Hero({ t }: { t: Pick<Translation, "hero" | "stats"> }) {
  return (
    <>
    <section
      id="hero"
      className="hero-section"
      style={{
        minHeight: "clamp(680px, 90svh, 790px)",
        background: "#071522",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "120px 5vw 80px",
      }}
    >
      {/* Right-aligned hero photo. next/image with `fill` mode
          requires the parent to have `position: relative|absolute|fixed`
          (we have absolute) and a sized container.
          - `priority` skips lazy-loading (LCP candidate, above-the-fold)
          - `fetchPriority="high"` HTTP/2 stream priority hint (P1-G phase 2)
          - `sizes="100vw"` retains enough detail for the tall cover crop
          - `quality={95}` preserves fine detail in the face and jacket logo. */}
      <div className="hero-photo">
        <Image
          src="/uploads/avenir-security-20261018.png"
          alt={t.hero.bgAlt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={95}
          className="hero-photo-image"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="hero-shade" aria-hidden="true" />
      {/* Red accent line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: "#D1172E",
          zIndex: 1,
        }}
      />
      <div className="hero-content" style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative", zIndex: 2 }}>
        <div className="hero-copy" style={{ maxWidth: 640 }}>
          <div
            className="hero-eyebrow"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 32,
              background: "rgba(209,23,46,0.2)",
              border: "1px solid rgba(209,23,46,0.45)",
              padding: "6px 16px",
              borderRadius: 2,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-head)",
                fontSize: 13,
                letterSpacing: 2.5,
                color: "#ff4a62",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              {t.hero.tag}
            </span>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-head)",
              fontWeight: 700,
              fontSize: "clamp(42px, 5.6vw, 74px)",
              lineHeight: 1.04,
              color: "#fff",
              marginBottom: 12,
            }}
          >
            {t.hero.h1a}
            <br />
            <span style={{ color: "#D1172E" }}>{t.hero.h1b}</span>
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: "clamp(15px, 1.6vw, 18px)",
              maxWidth: 520,
              lineHeight: 1.65,
              margin: "28px 0 44px",
              fontWeight: 300,
            }}
          >
            {t.hero.sub}
          </p>
          <div className="hero-cta-row">
            <a href="#services" className="hero-cta hero-cta--secondary">
              {t.hero.cta1}
            </a>
            <a href="#contact" className="hero-cta hero-cta--primary">
              {t.hero.cta2}
            </a>
          </div>
        </div>
      </div>
    </section>
      {/* Keep the statistics in normal flow, clear of the photo and CTAs. */}
      <div
        className="hero-stats-bar"
        style={{
          background: "#071522",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          className="hero-stats-grid"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            padding: "0 5vw",
          }}
        >
          {t.stats.map((s, i) => (
            <div
              key={i}
              style={{
                padding: "24px 20px",
                textAlign: "center",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none",
              }}
            >
              <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 36, color: "#D1172E", lineHeight: 1 }}>
                {s.n}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.55)",
                  letterSpacing: 1,
                  marginTop: 4,
                }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
