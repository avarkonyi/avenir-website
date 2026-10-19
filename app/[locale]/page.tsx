import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { References } from "@/components/References";
import { Certifications } from "@/components/Certifications";
import { News } from "@/components/News";
import { Career } from "@/components/Career";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { getTranslation } from "@/lib/i18n";
import { LOCALES, type Locale } from "@/lib/locales";
import { buildPageMetadata } from "@/lib/page-metadata";
import { buildServiceItemListSchema } from "@/lib/homepage-schema";
import { getContactServiceFallbackOptions } from "@/lib/homepage-content";
import { JsonLd } from "@/components/JsonLd";
import { META_DESCRIPTIONS, META_TAGLINES, SEO_DATA, type SeoLocale } from "@/lib/seo-data";
import { isIndexableServiceLocale } from "@/lib/services/publication";
import {
  getActiveTopLevelServices,
  getAllPublishedServicePathsForBuild,
} from "@/lib/db/queries/services";
import { getRenderableServicePaths } from "@/lib/services/review-services";
import {
  getPublishedNewsIndexForPublic,
} from "@/lib/db/queries/news";
import {
  getContactFormCopy,
  getLocaleServiceListLabel,
} from "@/lib/locale-ui-helpers";
import {
  isPublicNewsLocale,
  newsDetailHref,
} from "@/lib/news-routing";


export const revalidate = 3600;

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
  const seoLocale = locale as SeoLocale;
  return buildPageMetadata({
    locale,
    title: `${SEO_DATA.legalNameShort} — ${META_TAGLINES[seoLocale]}`,
    description: META_DESCRIPTIONS[seoLocale],
    url: `${SEO_DATA.url}/${locale}`,
    // Only hu/en are production languages; de/zh/ko/fr homepages are
    // noindex review surfaces without hreflang.
    index: isIndexableServiceLocale(locale),
    languages: {
      hu: `${SEO_DATA.url}/hu`,
      en: `${SEO_DATA.url}/en`,
      "x-default": `${SEO_DATA.url}/hu`,
    },
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();
  const t = getTranslation(locale);

  const articles = isPublicNewsLocale(locale)
    ? (await getPublishedNewsIndexForPublic(locale, "homepage news cards")).map((r) => ({
          id: r.id,
          title: r.title,
          lead: r.lead,
          date: r.date.toISOString(),
          imageUrl: r.imageUrl,
          href: newsDetailHref(locale, r.slug),
        }))
    : [];

  // Service-of-interest dropdown options for the Contact form via
  // shared helper (lib/db/queries/services.ts). Contact is a client
  // component so we fetch here and pass serializable props.
  //
  // Wire-format contract: option `value` MUST be services.slug
  // (string) — never the numeric services.id — so /api/contact
  // validation and lib/email-templates/notification.ts
  // contact-service-labels.ts keeps service slugs renderable in admin/email.
  const serviceRows = await getActiveTopLevelServices(locale);
  const serviceOptions = serviceRows
    .map((row) => ({
      slug: row.slug,
      label: getLocaleServiceListLabel(locale, row.slug, row.name),
    }))
    .filter((opt) => opt.label.length > 0);
  const publishedServiceDetailPaths = await getAllPublishedServicePathsForBuild(
    "homepage service detail links",
  );
  const readyServiceDetailPaths = getRenderableServicePaths(publishedServiceDetailPaths);
  // JSON-LD ItemList requires both name and description. Items link to the
  // canonical service page only where that page is public and indexable.
  const serviceListSchema = buildServiceItemListSchema(
    locale as SeoLocale,
    serviceRows
      .filter((row) => row.name.length > 0 && row.shortDesc.length > 0)
      .map((row) => {
        const isPublicPage =
          isIndexableServiceLocale(locale) &&
          readyServiceDetailPaths.some((p) => p.locale === locale && p.slug === row.slug);
        return {
          name: row.name,
          description: row.shortDesc,
          ...(isPublicPage
            ? { url: `${SEO_DATA.url}/${locale}/szolgaltatasok/${row.slug}` }
            : {}),
        };
      }),
  );

  return (
    <>
      <JsonLd schemas={[serviceListSchema]} />
      <Nav t={{ nav: t.nav }} />
      <main id="main">
        <Hero t={{ hero: t.hero, stats: t.stats }} />
        <About t={t} />
        <Services
          locale={locale}
          readyServiceDetailPaths={readyServiceDetailPaths}
        />
        <References t={t} locale={locale} />
        <Certifications t={t} locale={locale} />
        {isPublicNewsLocale(locale) && (
          <News
            t={{
              newsSub: t.newsSub,
              newsTitle: t.newsTitle,
              newsText: t.newsText,
              newsEmpty: t.newsEmpty,
              newsReadMore: t.newsReadMore,
            }}
            locale={locale}
            articles={articles}
          />
        )}
        <Career t={t} locale={locale} />
        <Contact
          t={{
            contactSub: t.contactSub,
            contactTitle: t.contactTitle,
            contactLabels: t.contactLabels,
            // narrowed copy: parked special-service strings stay server-side
            form: getContactFormCopy(t.form),
          }}
          locale={locale}
          serviceOptions={serviceOptions}
          serviceFallbackOptions={getContactServiceFallbackOptions(locale, t.services)}
        />
      </main>
      <Footer
        t={t}
        locale={locale}
        readyServiceDetailPaths={readyServiceDetailPaths}
      />
    </>
  );
}
