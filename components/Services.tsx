import type { Translation } from "@/lib/i18n";
import { Icon } from "./Icon";

export function Services({ t }: { t: Translation }) {
  return (
    <section id="services" style={{ padding: "100px 5vw", background: "#F8FAFC" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
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
              {t.servicesSub}
            </span>
            <div style={{ width: 40, height: 3, background: "#D1172E" }} />
          </div>
          <h2
            style={{
              fontWeight: 800,
              fontSize: "clamp(36px, 4vw, 54px)",
              color: "#0B1E3E",
              lineHeight: 1.1,
            }}
          >
            {t.servicesTitle}
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 24,
          }}
        >
          {t.services.map((svc) => (
            <div key={svc.id} className="service-card">
              <div className="service-icon-wrap">
                <Icon name={svc.icon} size={26} />
              </div>
              <h3 className="service-title">{svc.t}</h3>
              <p className="service-desc">{svc.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
