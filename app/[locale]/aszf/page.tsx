import type { Metadata } from "next";
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
    </LegalPageChrome>
  );
}
