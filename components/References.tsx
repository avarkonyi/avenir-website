import type { Translation } from "@/lib/i18n";
import {
  PartnerLogoStrip,
  getApprovedHomepagePartnerLogos,
} from "@/components/PartnerLogoStrip";

// Proof-gated section: renders only when usage-approved partner logos exist.
// Without approved proof the section would be a "Partnereink" heading over
// generic text with an empty logo strip, so it stays hidden entirely. The
// nav "references" key is also hidden (lib/locale-ui-helpers.ts) until an
// approved reference/logo wall decision is made (post_launch_backlog PL-029).
export async function References({
  t,
  locale,
}: {
  t: Translation;
  locale: string;
}) {
  const partners = await getApprovedHomepagePartnerLogos();
  if (partners.length === 0) return null;

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
              fontFamily: "var(--font-head)",
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
          className="references-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
            alignItems: "center",
            marginBottom: 44,
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-head)",
              fontWeight: 800,
              fontSize: "clamp(36px, 4vw, 54px)",
              color: "#fff",
              lineHeight: 1.1,
            }}
          >
            {t.refTitle}
          </h2>
          <p style={{ color: "var(--avenir-on-dark-muted)", fontSize: 17, lineHeight: 1.7, fontWeight: 300 }}>
            {t.refText}
          </p>
        </div>
        <PartnerLogoStrip locale={locale} partners={partners} />
      </div>
    </section>
  );
}
