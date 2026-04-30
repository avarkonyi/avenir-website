import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslation, LOCALES, type Locale } from "@/lib/i18n";
import { SEO_DATA } from "@/lib/seo-data";
import {
  LegalPageChrome,
  LegalHeader,
  LegalSection,
} from "@/components/LegalPageChrome";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();
  const t = getTranslation(locale);
  const title = `${t.legal.terms.title} — ${SEO_DATA.legalNameShort}`;
  const description = t.legal.terms.intro.slice(0, 160);
  const url = `${SEO_DATA.url}/${locale}/aszf`;

  return {
    metadataBase: new URL(SEO_DATA.url),
    title,
    description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: url,
      languages: {
        hu: `${SEO_DATA.url}/hu/aszf`,
        en: `${SEO_DATA.url}/en/aszf`,
        de: `${SEO_DATA.url}/de/aszf`,
        zh: `${SEO_DATA.url}/zh/aszf`,
        "x-default": `${SEO_DATA.url}/hu/aszf`,
      },
    },
    openGraph: { type: "article", title, description, url },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();
  const t = getTranslation(locale);

  return (
    <LegalPageChrome
      t={t}
      locale={locale}
      pageTitle={t.legal.terms.title}
      pageDescription={t.legal.terms.intro.slice(0, 160)}
      pageSlug="aszf"
    >
      <LegalHeader
        title={t.legal.terms.title}
        lastUpdated={t.legal.terms.lastUpdated}
        version={t.legal.terms.version}
        intro={t.legal.terms.intro}
      />
      {t.legal.terms.sections.map((s) => (
        <LegalSection key={s.id} id={s.id} title={s.title} body={s.body} />
      ))}

      {/* Section 14 — Data Protection cross-reference. Resolves audit
          P0-2: DPO disclosure was on privacy + impresszum but missing
          from ASZF. Structured block with DPO contact + clickable link
          to the full Privacy Policy. */}
      <section id="data-protection" style={{ marginBottom: 32 }}>
        <h2
          style={{
            fontFamily: "var(--font-head)",
            fontSize: 22,
            fontWeight: 700,
            marginBottom: 12,
            color: "#0B1E3E",
          }}
        >
          {t.legal.terms.dataProtection.title}
        </h2>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.75,
            color: "rgba(11,30,62,0.85)",
            marginBottom: 16,
          }}
        >
          {t.legal.terms.dataProtection.body}
        </p>
        <div
          style={{
            background: "rgba(11,30,62,0.04)",
            border: "1px solid rgba(11,30,62,0.08)",
            borderRadius: 4,
            padding: "16px 20px",
            marginBottom: 16,
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-head)",
              fontSize: 14,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: 10,
              color: "#0B1E3E",
            }}
          >
            {t.legal.terms.dataProtection.dpoLabel}
          </h3>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(11,30,62,0.9)", margin: 0 }}>
            {t.legal.terms.dataProtection.dpoName}
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0 }}>
            <a
              href={`mailto:${t.legal.terms.dataProtection.dpoEmail}`}
              style={{ color: "#D1172E", textDecoration: "none" }}
            >
              {t.legal.terms.dataProtection.dpoEmail}
            </a>
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0 }}>
            <a
              href={`tel:${t.legal.terms.dataProtection.dpoPhone.replace(/\s/g, "")}`}
              style={{ color: "#D1172E", textDecoration: "none" }}
            >
              {t.legal.terms.dataProtection.dpoPhone}
            </a>
          </p>
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(11,30,62,0.85)" }}>
          <Link
            href={t.legal.terms.dataProtection.privacyLinkHref}
            style={{ color: "#D1172E", textDecoration: "underline", fontWeight: 600 }}
          >
            {t.legal.terms.dataProtection.privacyLinkText} →
          </Link>
        </p>
      </section>

      {/* Version history footer — small fine-print block at the very
          end of the document, separated from §14 by a top border.
          Moved out of §13 body after §14 was added (would have been
          orphaned mid-document). */}
      <p
        style={{
          marginTop: 48,
          paddingTop: 24,
          borderTop: "1px solid rgba(11,30,62,0.12)",
          fontSize: 12,
          lineHeight: 1.6,
          color: "rgba(11,30,62,0.5)",
          fontStyle: "italic",
        }}
      >
        {t.legal.terms.versionHistory}
      </p>
    </LegalPageChrome>
  );
}
