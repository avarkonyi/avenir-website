"use client";

import type { Translation } from "@/lib/i18n";

export function Hero({ t }: { t: Translation }) {
  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        background: "#0B1E3E",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "120px 5vw 80px",
      }}
    >
      {/* Full-bleed hero background photo */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img
          src="/uploads/background.png"
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(11,30,62,0.92) 0%, rgba(11,30,62,0.75) 40%, rgba(11,30,62,0.15) 70%, transparent 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(11,30,62,0.25) 0%, rgba(11,30,62,0.5) 100%)",
          }}
        />
      </div>
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
      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 640 }}>
          <div
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
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#D1172E" }} />
            <span
              style={{
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
              fontWeight: 800,
              fontSize: "clamp(44px, 7vw, 92px)",
              lineHeight: 1.0,
              color: "#fff",
              marginBottom: 12,
              textShadow: "0 2px 20px rgba(0,0,0,0.5)",
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
              textShadow: "0 1px 8px rgba(0,0,0,0.4)",
            }}
          >
            {t.hero.sub}
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button
              onClick={() => {
                const el = document.getElementById("services");
                if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: "smooth" });
              }}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "2px solid rgba(255,255,255,0.5)",
                cursor: "pointer",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                padding: "14px 32px",
                borderRadius: 2,
                transition: "all 0.2s",
                backdropFilter: "blur(4px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#fff";
                e.currentTarget.style.background = "rgba(255,255,255,0.18)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              }}
            >
              {t.hero.cta1}
            </button>
            <button
              onClick={() => {
                const el = document.getElementById("contact");
                if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: "smooth" });
              }}
              style={{
                background: "#D1172E",
                border: "2px solid #D1172E",
                cursor: "pointer",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                padding: "14px 32px",
                borderRadius: 2,
                transition: "all 0.2s",
                boxShadow: "0 4px 20px rgba(209,23,46,0.4)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#a80f24";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#D1172E";
              }}
            >
              {t.hero.cta2}
            </button>
          </div>
        </div>
      </div>
      {/* Stats bar overlay (glassmorphism, anchored to hero bottom) */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(255,255,255,0.04)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
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
              <div style={{ fontWeight: 800, fontSize: 36, color: "#D1172E", lineHeight: 1 }}>
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
    </section>
  );
}
