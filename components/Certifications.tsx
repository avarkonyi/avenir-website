import { connection } from "next/server";
import { asc, eq } from "drizzle-orm";
import type { Translation } from "@/lib/i18n";
import { db, certifications } from "@/lib/db";

// Locale-conditional column map for the wide-column-per-locale schema.
// Mirrors the NEWS_COLS pattern in app/[locale]/page.tsx.
const CERTS_COLS = {
  hu: {
    fullName: certifications.fullNameHu,
    description: certifications.descriptionHu,
    scope: certifications.scopeHu,
  },
  en: {
    fullName: certifications.fullNameEn,
    description: certifications.descriptionEn,
    scope: certifications.scopeEn,
  },
  de: {
    fullName: certifications.fullNameDe,
    description: certifications.descriptionDe,
    scope: certifications.scopeDe,
  },
  zh: {
    fullName: certifications.fullNameZh,
    description: certifications.descriptionZh,
    scope: certifications.scopeZh,
  },
} as const;

function formatDate(iso: string | null, locale: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(
      locale === "zh" ? "zh-CN" : locale,
      { year: "numeric", month: "long", day: "numeric" },
    );
  } catch {
    return iso;
  }
}

type CertRow = {
  id: number;
  slug: string;
  name: string;
  standardCode: string | null;
  certificateNumber: string | null;
  fullName: string;
  description: string | null;
  scope: string | null;
  issuer: string;
  issuerUrl: string | null;
  accreditationBody: string | null;
  accreditationNumber: string | null;
  iafMlaMember: boolean;
  verifyUrl: string | null;
  issuedDate: string | null;
  expiresDate: string | null;
  credentialCategory: string | null;
  logoUrl: string | null;
  pdfUrl: string | null;
};

// Inline SVG logo: 200×200 viewBox with navy gradient and "ISO {num}"
// stacked text. role="img" + <title> makes it a legitimate image entity
// for screen readers and SEO crawlers without needing an <img> tag.
function CertificationLogo({
  cert,
  altText,
}: {
  cert: CertRow;
  altText: string;
}) {
  const numPart = cert.name.replace(/^ISO\s*/, "");
  const gradId = `cert-grad-${cert.id}`;
  const titleId = `cert-title-${cert.id}`;
  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-labelledby={titleId}
      className="cert-logo-svg"
    >
      <title id={titleId}>{altText}</title>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0B1E3E" />
          <stop offset="100%" stopColor="#1a3a6b" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" rx="4" fill={`url(#${gradId})`} />
      <text x="100" y="88" textAnchor="middle" className="cert-iso">
        ISO
      </text>
      <text x="100" y="138" textAnchor="middle" className="cert-num">
        {numPart}
      </text>
    </svg>
  );
}

export async function Certifications({
  t,
  locale,
}: {
  t: Translation;
  locale: string;
}) {
  await connection();
  const cols =
    CERTS_COLS[locale as keyof typeof CERTS_COLS] ?? CERTS_COLS.hu;
  const rows = await db
    .select({
      id: certifications.id,
      slug: certifications.slug,
      name: certifications.name,
      standardCode: certifications.standardCode,
      certificateNumber: certifications.certificateNumber,
      fullName: cols.fullName,
      description: cols.description,
      scope: cols.scope,
      issuer: certifications.issuer,
      issuerUrl: certifications.issuerUrl,
      accreditationBody: certifications.accreditationBody,
      accreditationNumber: certifications.accreditationNumber,
      iafMlaMember: certifications.iafMlaMember,
      verifyUrl: certifications.verifyUrl,
      issuedDate: certifications.issuedDate,
      expiresDate: certifications.expiresDate,
      credentialCategory: certifications.credentialCategory,
      logoUrl: certifications.logoUrl,
      pdfUrl: certifications.pdfUrl,
    })
    .from(certifications)
    .where(eq(certifications.active, true))
    .orderBy(asc(certifications.sortOrder));

  if (rows.length === 0) return null;

  return (
    <section
      id="certifications"
      style={{ padding: "100px 5vw", background: "#F8FAFC" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
          }}
        >
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
            {t.certifications.sub}
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
            marginBottom: 52,
          }}
          className="certifications-header-grid"
        >
          <h2
            style={{
              fontFamily: "var(--font-head)",
              fontWeight: 800,
              fontSize: "clamp(36px, 4vw, 54px)",
              color: "#0B1E3E",
              lineHeight: 1.1,
            }}
          >
            {t.certifications.title}
          </h2>
          <p
            style={{
              color: "#556070",
              fontSize: 17,
              lineHeight: 1.7,
              fontWeight: 300,
              paddingTop: 8,
            }}
          >
            {t.certifications.intro}
          </p>
        </div>
        <div className="certifications-grid">
          {rows.map((cert) => {
            // Rich alt-text reuses existing i18n labels (no new key needed)
            const expiresStr = cert.expiresDate
              ? `, ${t.certifications.validUntil} ${formatDate(cert.expiresDate, locale)}`
              : "";
            const altText = `${cert.name} — ${cert.fullName}, ${t.certifications.issuedBy} ${cert.issuer}${expiresStr}`;

            const innerContent = (
              <>
                <CertificationLogo cert={cert} altText={altText} />

                {/* Hidden microdata: every itemProp lives in sr-only spans
                    so AI/SEO/screen-reader can read full credential context
                    while the visual stays minimal. */}
                <span className="sr-only" itemProp="name">
                  {cert.name}
                </span>
                <span className="sr-only">{cert.fullName}</span>
                {cert.description && (
                  <span className="sr-only" itemProp="description">
                    {cert.description}
                  </span>
                )}
                <span
                  className="sr-only"
                  itemProp="recognizedBy"
                  itemScope
                  itemType="https://schema.org/Organization"
                >
                  <span itemProp="name">{cert.issuer}</span>
                  {cert.issuerUrl && (
                    <link itemProp="url" href={cert.issuerUrl} />
                  )}
                </span>
                {cert.issuedDate && (
                  <time
                    className="sr-only"
                    itemProp="dateCreated"
                    dateTime={cert.issuedDate}
                  >
                    {formatDate(cert.issuedDate, locale)}
                  </time>
                )}
                {cert.expiresDate && (
                  <time
                    className="sr-only"
                    itemProp="expires"
                    dateTime={cert.expiresDate}
                  >
                    {formatDate(cert.expiresDate, locale)}
                  </time>
                )}
                {cert.credentialCategory && (
                  <meta
                    itemProp="credentialCategory"
                    content={cert.credentialCategory}
                  />
                )}
                {cert.scope && (
                  <meta itemProp="competencyRequired" content={cert.scope} />
                )}
                {cert.standardCode && (
                  <meta itemProp="identifier" content={cert.standardCode} />
                )}
              </>
            );

            return cert.pdfUrl ? (
              <a
                key={cert.id}
                href={cert.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="certification-card certification-card-link"
                itemScope
                itemType="https://schema.org/EducationalOccupationalCredential"
                aria-label={altText}
              >
                {innerContent}
              </a>
            ) : (
              <article
                key={cert.id}
                className="certification-card certification-card-static"
                itemScope
                itemType="https://schema.org/EducationalOccupationalCredential"
              >
                {innerContent}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
