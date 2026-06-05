import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslation } from "@/lib/i18n";
import { getPrivacyContent } from "@/lib/legal-content";
import { SEO_DATA } from "@/lib/seo-data";
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
  const privacy = getPrivacyContent(locale, t);
  const title = `${privacy.title} — ${SEO_DATA.legalNameShort}`;
  const description = privacy.intro.slice(0, 160);
  const url = legalPageUrl(locale, "adatvedelem");
  const isDeReviewPage = locale === "de";

  return {
    metadataBase: new URL(SEO_DATA.url),
    title,
    description,
    robots: { index: !isDeReviewPage, follow: true },
    alternates: {
      canonical: url,
      languages: legalPageAlternateLanguages("adatvedelem"),
    },
    openGraph: { type: "article", title, description, url },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLegalPageLocale(locale)) notFound();
  const t = getTranslation(locale);
  const privacy = getPrivacyContent(locale, t);

  return (
    <LegalPageChrome
      t={t}
      locale={locale}
      pageTitle={privacy.title}
      pageDescription={privacy.intro.slice(0, 160)}
      pageSlug="adatvedelem"
    >
      <LegalHeader
        title={privacy.title}
        lastUpdated={privacy.lastUpdated}
        version={privacy.version}
        intro={privacy.intro}
      />
      {privacy.sections.map((s) => (
        <LegalSection key={s.id} id={s.id} title={s.title} body={s.body} />
      ))}

      {/* Version history footer — small fine-print block separated
          from the last section by a top border. Out of the sections
          array so it stays anchored to the document end regardless
          of future section additions. */}
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
        {privacy.versionHistory}
      </p>
    </LegalPageChrome>
  );
}
