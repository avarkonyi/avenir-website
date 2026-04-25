import type { Translation } from "@/lib/i18n";

export function References({ t }: { t: Translation }) {
  return (
    <section
      id="references"
      style={{ padding: "100px 5vw", background: "#0B1E3E" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 40, height: 3, background: "#D1172E" }} />
          <span
            style={{
              fontSize: 13,
              letterSpacing: 2.5,
              color: "#D1172E",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {t.refSub}
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
            alignItems: "center",
            marginBottom: 60,
          }}
        >
          <h2
            style={{
              fontWeight: 800,
              fontSize: "clamp(36px, 4vw, 54px)",
              color: "#fff",
              lineHeight: 1.1,
            }}
          >
            {t.refTitle}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 17, lineHeight: 1.7, fontWeight: 300 }}>
            {t.refText}
          </p>
        </div>
        {/* Category pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          {t.refs.map((r, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                padding: "12px 24px",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#D1172E" }} />
              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 600, letterSpacing: 0.5 }}>
                {r}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
