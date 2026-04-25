import type { Translation } from "@/lib/i18n";
import { Icon } from "./Icon";

const PLACEHOLDER_POSITIONS = [
  { title: "Biztonsági őr", location: "Budapest / országosan", type: "Teljes munkaidő" },
  { title: "Takarítási csoportvezető", location: "Budapest", type: "Teljes munkaidő" },
  { title: "Épületüzemeltetési mérnök", location: "Budapest", type: "Teljes munkaidő" },
  { title: "Recepcióvezető", location: "Budapest", type: "Teljes munkaidő" },
];

export function Career({ t }: { t: Translation }) {
  return (
    <section id="career" style={{ padding: "100px 5vw", background: "#fff" }}>
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
            {t.careerSub}
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, marginBottom: 52 }}>
          <h2
            style={{
              fontWeight: 800,
              fontSize: "clamp(36px, 4vw, 54px)",
              color: "#0B1E3E",
              lineHeight: 1.1,
            }}
          >
            {t.careerTitle}
          </h2>
          <p style={{ color: "#556070", fontSize: 17, lineHeight: 1.7, fontWeight: 300, paddingTop: 8 }}>
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
          {PLACEHOLDER_POSITIONS.map((p, i) => (
            <div key={i} className="career-card">
              <div>
                <h3 style={{ fontWeight: 700, fontSize: 20, color: "#0B1E3E", marginBottom: 8 }}>
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
                href={`mailto:info@afm.hu?subject=${encodeURIComponent(`Jelentkezés - ${p.title}`)}`}
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
