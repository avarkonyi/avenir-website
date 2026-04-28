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
  const title = `${t.legal.privacy.title} — ${SEO_DATA.legalNameShort}`;
  const description = t.legal.privacy.intro.slice(0, 160);
  const url = `${SEO_DATA.url}/${locale}/adatvedelem`;

  return {
    metadataBase: new URL(SEO_DATA.url),
    title,
    description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: url,
      languages: {
        hu: `${SEO_DATA.url}/hu/adatvedelem`,
        en: `${SEO_DATA.url}/en/adatvedelem`,
        de: `${SEO_DATA.url}/de/adatvedelem`,
        zh: `${SEO_DATA.url}/zh/adatvedelem`,
        "x-default": `${SEO_DATA.url}/hu/adatvedelem`,
      },
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
  if (!LOCALES.includes(locale as Locale)) notFound();
  const t = getTranslation(locale);

  return (
    <LegalPageChrome
      t={t}
      locale={locale}
      pageTitle={t.legal.privacy.title}
      pageDescription={t.legal.privacy.intro.slice(0, 160)}
      pageSlug="adatvedelem"
    >
      <LegalHeader
        title={t.legal.privacy.title}
        lastUpdated={t.legal.privacy.lastUpdated}
        version={t.legal.privacy.version}
        intro={t.legal.privacy.intro}
      />
      {t.legal.privacy.sections.map((s) => (
        <LegalSection key={s.id} id={s.id} title={s.title} body={s.body} />
      ))}
    </LegalPageChrome>
  );
}
