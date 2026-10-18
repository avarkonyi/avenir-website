import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/page-metadata";
import { notFound } from "next/navigation";
import { getTranslation } from "@/lib/i18n";
import {
  getResponsibleDisclosureContent,
  responsibleDisclosureAlternateLanguages,
  responsibleDisclosureUrl,
} from "@/lib/responsible-disclosure-content";
import { SEO_DATA } from "@/lib/seo-data";
import {
  LegalHeader,
  LegalPageChrome,
  LegalSection,
} from "@/components/LegalPageChrome";

export function generateStaticParams() {
  return [{ locale: "hu" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "hu") notFound();
  const content = getResponsibleDisclosureContent("hu");
  const title = `${content.title} — ${SEO_DATA.legalNameShort}`;
  const url = responsibleDisclosureUrl("hu");

  return buildPageMetadata({
    locale: "hu",
    title,
    description: content.description,
    url,
    index: true,
    languages: responsibleDisclosureAlternateLanguages(),
    type: "article",
  });
}

export default async function HuResponsibleDisclosurePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "hu") notFound();
  const t = getTranslation("hu");
  const content = getResponsibleDisclosureContent("hu");

  return (
    <LegalPageChrome
      t={t}
      locale="hu"
      pageTitle={content.title}
      pageDescription={content.description}
      pageSlug={content.slug}
    >
      <LegalHeader
        title={content.title}
        lastUpdated={content.lastUpdated}
        intro={content.intro}
      />
      {content.sections.map((section) => (
        <LegalSection
          key={section.id}
          id={section.id}
          title={section.title}
          body={section.body}
        />
      ))}
    </LegalPageChrome>
  );
}
