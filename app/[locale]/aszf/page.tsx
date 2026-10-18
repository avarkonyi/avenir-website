import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/page-metadata";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslation } from "@/lib/i18n";
import { getTermsContent } from "@/lib/legal-content";
import { SEO_DATA } from "@/lib/seo-data";
import { toMetaDescription } from "@/lib/meta-description";
import {
  isLegalPageLocale,
  legalPageAlternateLanguages,
  legalPageStaticParams,
  legalPageUrl,
} from "@/lib/legal-routes";
import {
  LegalPageChrome,
  LegalHeader,
  LegalSection,
} from "@/components/LegalPageChrome";

export function generateStaticParams() {
  return legalPageStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLegalPageLocale(locale)) notFound();
  const t = getTranslation(locale);
  const terms = getTermsContent(locale, t);
  const title = `${terms.title} — ${SEO_DATA.legalNameShort}`;
  const description = toMetaDescription(terms.intro);
  const url = legalPageUrl(locale, "aszf");
  const isDeReviewPage = locale === "de";

  return buildPageMetadata({
    locale,
    title,
    description,
    url,
    index: !isDeReviewPage,
    languages: legalPageAlternateLanguages("aszf"),
    type: "article",
  });
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLegalPageLocale(locale)) notFound();
  const t = getTranslation(locale);
  const terms = getTermsContent(locale, t);

  return (
    <LegalPageChrome
      t={t}
      locale={locale}
      pageTitle={terms.title}
      pageDescription={toMetaDescription(terms.intro)}
      pageSlug="aszf"
    >
      <LegalHeader
        title={terms.title}
        lastUpdated={terms.lastUpdated}
        version={terms.version}
        intro={terms.intro}
      />
      {terms.sections.map((s) => (
        <LegalSection key={s.id} id={s.id} title={s.title} body={s.body} />
      ))}

      {/* Section 14 — shared DPO contact and Privacy Policy cross-reference
          for every rendered legal locale, including the DE review page. */}
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
            {terms.dataProtection.title}
          </h2>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.75,
              color: "rgba(11,30,62,0.85)",
              marginBottom: 16,
            }}
          >
            {terms.dataProtection.body}
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
              {terms.dataProtection.dpoLabel}
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(11,30,62,0.9)", margin: 0 }}>
              {terms.dataProtection.dpoName}
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0 }}>
              <a
                href={`mailto:${terms.dataProtection.dpoEmail}`}
                style={{ color: "#D1172E", textDecoration: "none" }}
              >
                {terms.dataProtection.dpoEmail}
              </a>
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0 }}>
              <a
                href={`tel:${terms.dataProtection.dpoPhone.replace(/\s/g, "")}`}
                style={{ color: "#D1172E", textDecoration: "none" }}
              >
                {terms.dataProtection.dpoPhone}
              </a>
            </p>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(11,30,62,0.85)" }}>
            <Link
              href={terms.dataProtection.privacyLinkHref}
              style={{ color: "#D1172E", textDecoration: "underline", fontWeight: 600 }}
            >
              {terms.dataProtection.privacyLinkText} →
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
        {terms.versionHistory}
      </p>
    </LegalPageChrome>
  );
}
