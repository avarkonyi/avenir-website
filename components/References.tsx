import type { Translation } from "@/lib/i18n";
import {
  getApprovedHomepageReferences,
  getReferenceAlt,
  getReferenceAriaLabel,
  getReferenceDescription,
  getReferenceSectionCopy,
  getReferenceServiceChips,
} from "@/lib/references";

// Proof-gated section: renders only source-approved public reference cards.
// It intentionally does not render generic placeholders, testimonials, case
// studies, outcome claims, or unapproved DB partner-logo rows.
export async function References({
  t,
  locale,
}: {
  t: Translation;
  locale: string;
}) {
  void t;
  const references = getApprovedHomepageReferences(locale);
  if (references.length === 0) return null;

  const copy = getReferenceSectionCopy(locale);

  return (
    <section
      id="references"
      style={{ padding: "80px 5vw", background: "#F8FAFC" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          className="references-grid"
          style={{
            display: "grid",
            gap: 12,
            justifyItems: "center",
            margin: "0 auto 32px",
            maxWidth: 720,
            textAlign: "center",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: "var(--font-head)",
              fontWeight: 800,
              fontSize: "clamp(30px, 3vw, 42px)",
              color: "#0B1E3E",
              lineHeight: 1.1,
            }}
          >
            {copy.title}
          </h2>
          <p style={{ margin: 0, color: "var(--avenir-text-muted)", fontSize: 17, lineHeight: 1.7, fontWeight: 300 }}>
            {copy.intro}
          </p>
        </div>
        <div className="approved-reference-grid">
          {references.map((reference) => (
            <a
              key={reference.key}
              className="approved-reference-card"
              href={reference.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={getReferenceAriaLabel(locale, reference)}
            >
              <div className="approved-reference-logo-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={reference.logoPath}
                  alt={getReferenceAlt(locale, reference)}
                  width={180}
                  height={76}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="approved-reference-meta">
                <div>
                  <h3>{reference.displayName}</h3>
                  <p className="approved-reference-description">
                    {getReferenceDescription(locale, reference)}
                  </p>
                </div>
                <div className="approved-reference-chips" aria-label={copy.intro}>
                  {getReferenceServiceChips(locale, reference.services).map((label) => (
                    <span key={label} className="approved-reference-chip">
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
