import type { MetadataRoute } from "next";
import { SEO_DATA } from "@/lib/seo-data";
import { isIndexableServiceLocale } from "@/lib/services/publication";
import {
  LEGAL_PAGE_LOCALES,
  LEGAL_PAGE_SLUGS,
  legalPageAlternateLanguages,
  legalPageUrl,
  type LegalPageSlug,
} from "@/lib/legal-routes";
import {
  NEWS_INDEXABLE_LOCALES,
  type NewsIndexableLocale,
  newsAlternateLanguages,
  newsDetailUrl,
  newsIndexUrl,
} from "@/lib/news-routing";
import {
  RECRUITMENT_PRIVACY_LOCALES,
  recruitmentPrivacyAlternateLanguages,
  recruitmentPrivacyUrl,
} from "@/lib/recruitment-privacy-routes";
import {
  TRUST_CENTER_LOCALES,
  trustCenterAlternateLanguages,
  trustCenterUrl,
} from "@/lib/trust-center-routes";

const SITEMAP_HOME_LOCALES = ["hu", "en"] as const;
const SERVICE_URL_SEGMENT = "szolgaltatasok";

function localeAlternates(path = "") {
  return {
    languages: {
      ...Object.fromEntries(
        SITEMAP_HOME_LOCALES.map((locale) => [
          locale,
          `${SEO_DATA.url}/${locale}${path}`,
        ]),
      ),
      "x-default": `${SEO_DATA.url}/hu${path}`,
    },
  };
}

function legalAlternates(slug: LegalPageSlug) {
  return {
    languages: legalPageAlternateLanguages(slug),
  };
}

function articleLastModified(article: {
  readonly updatedAt?: Date | null;
  readonly date?: Date | null;
}): Date | undefined {
  return article.updatedAt ?? article.date ?? undefined;
}

export function buildPublicSitemap(
  servicePaths: readonly { locale: string; slug: string; updatedAt?: Date | null }[],
  newsPaths: readonly { locale: NewsIndexableLocale; slug: string; date?: Date | null; updatedAt?: Date | null }[],
): MetadataRoute.Sitemap {
  const sitemapServicePaths = servicePaths.filter(({ locale }) =>
    isIndexableServiceLocale(locale),
  );
  const serviceLocalesBySlug = new Map<string, string[]>();
  const newsIndexLastModified =
    newsPaths.reduce<Date | null>((latest, article) => {
      const lastModified = articleLastModified(article);
      return lastModified && (!latest || lastModified > latest) ? lastModified : latest;
    }, null) ?? undefined;

  for (const { locale, slug } of sitemapServicePaths) {
    const locales = serviceLocalesBySlug.get(slug) ?? [];
    locales.push(locale);
    serviceLocalesBySlug.set(slug, locales);
  }

  const serviceAlternates = (slug: string) => {
    const readyLocales = serviceLocalesBySlug.get(slug) ?? [];
    const languages: Record<string, string> = Object.fromEntries(
      readyLocales.map((locale) => [
        locale,
        `${SEO_DATA.url}/${locale}/${SERVICE_URL_SEGMENT}/${slug}`,
      ]),
    );
    if (readyLocales.includes("hu")) {
      languages["x-default"] =
        `${SEO_DATA.url}/hu/${SERVICE_URL_SEGMENT}/${slug}`;
    }
    return { languages };
  };
  const newsLocalesBySlug = new Map<string, NewsIndexableLocale[]>();
  for (const { locale, slug } of newsPaths) {
    const locales = newsLocalesBySlug.get(slug) ?? [];
    locales.push(locale);
    newsLocalesBySlug.set(slug, locales);
  }
  const newsIndexLocales = NEWS_INDEXABLE_LOCALES.filter((locale) =>
    newsPaths.some((path) => path.locale === locale),
  );

  return [
    ...SITEMAP_HOME_LOCALES.map((locale) => ({
      url: `${SEO_DATA.url}/${locale}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
      alternates: localeAlternates(),
    })),
    // Legal pages are published only for reviewed HU/EN legal routes.
    ...LEGAL_PAGE_LOCALES.flatMap((locale) =>
      LEGAL_PAGE_SLUGS.map((slug) => ({
        url: legalPageUrl(locale, slug),
        changeFrequency: "yearly" as const,
        priority: 0.3,
        alternates: legalAlternates(slug),
      })),
    ),
    // Recruitment privacy notice (PL-091 Option B): locale-specific slug
    // pair, HU/EN only, published after DPO/legal sign-off.
    ...RECRUITMENT_PRIVACY_LOCALES.map((locale) => ({
      url: recruitmentPrivacyUrl(locale),
      changeFrequency: "yearly" as const,
      priority: 0.3,
      alternates: { languages: recruitmentPrivacyAlternateLanguages() },
    })),
    // Trust Center MVP: reviewed HU/EN public proof-summary routes only.
    ...TRUST_CENTER_LOCALES.map((locale) => ({
      url: trustCenterUrl(locale),
      changeFrequency: "yearly" as const,
      priority: 0.35,
      alternates: { languages: trustCenterAlternateLanguages() },
    })),
    ...sitemapServicePaths.map(({ locale, slug, updatedAt }) => ({
      url: `${SEO_DATA.url}/${locale}/${SERVICE_URL_SEGMENT}/${slug}`,
      ...(updatedAt ? { lastModified: updatedAt } : {}),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: serviceAlternates(slug),
    })),
    ...newsIndexLocales.map((locale) => ({
      url: newsIndexUrl(locale),
      lastModified: newsIndexLastModified,
      changeFrequency: "monthly" as const,
      priority: 0.55,
      alternates: {
        languages: newsAlternateLanguages(null, newsIndexLocales),
      },
    })),
    ...newsPaths.map(({ locale, slug, date, updatedAt }) => ({
      url: newsDetailUrl(locale, slug),
      lastModified: articleLastModified({ date, updatedAt }),
      changeFrequency: "monthly" as const,
      priority: 0.5,
      alternates: {
        languages: newsAlternateLanguages(
          slug,
          newsLocalesBySlug.get(slug) ?? [],
        ),
      },
    })),
  ];
}
