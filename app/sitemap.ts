import type { MetadataRoute } from "next";
import { SEO_DATA, SEO_LOCALES } from "@/lib/seo-data";
import { getAllPublishedServicePathsForBuild } from "@/lib/db/queries/services";
import { getAllPublishedNewsPathsHu } from "@/lib/db/queries/news";

const LEGAL_SLUGS = ["adatvedelem", "aszf", "impresszum"] as const;
const LEGAL_SITEMAP_LOCALES = ["hu"] as const;
const SITE_LAST_MODIFIED = new Date("2026-05-07T00:00:00.000Z");
const SERVICE_URL_SEGMENT = "szolgaltatasok";
const NEWS_INDEX_PATH_HU = "/hu/hirek";
const NEWS_URL_SEGMENT_HU = "hirek";

function localeAlternates(path = "") {
  return {
    languages: {
      ...Object.fromEntries(
        SEO_LOCALES.map((locale) => [
          locale,
          `${SEO_DATA.url}/${locale}${path}`,
        ]),
      ),
      "x-default": `${SEO_DATA.url}/hu${path}`,
    },
  };
}

function legalAlternates(path = "") {
  return {
    languages: {
      hu: `${SEO_DATA.url}/hu${path}`,
      "x-default": `${SEO_DATA.url}/hu${path}`,
    },
  };
}

function huOnlyAlternates(path: string) {
  return {
    languages: {
      hu: `${SEO_DATA.url}${path}`,
      "x-default": `${SEO_DATA.url}${path}`,
    },
  };
}

// Sitemap is async (Next 16 supports async sitemaps) so we can pull
// the live list of published+active service slugs from the DB. Drafts
// (isPublished=false), soft-deleted rows (isActive=false), and
// incomplete locale detail pages are filtered inside the shared
// service-path helper, matching the "no draft or unfinished URL is
// indexable" P5 guarantee. If the DB lookup fails, generation fails
// loudly instead of emitting stale or incomplete service URLs.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [servicePaths, newsPaths] = await Promise.all([
    getAllPublishedServicePathsForBuild("sitemap.xml"),
    getAllPublishedNewsPathsHu(),
  ]);
  const serviceLocalesBySlug = new Map<string, string[]>();

  for (const { locale, slug } of servicePaths) {
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

  return [
    ...SEO_LOCALES.map((locale) => ({
      url: `${SEO_DATA.url}/${locale}`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.9,
      alternates: localeAlternates(),
    })),
    // Non-HU legal pages are intentionally excluded from the sitemap
    // until localized legal content has been reviewed and approved.
    ...LEGAL_SITEMAP_LOCALES.flatMap((locale) =>
      LEGAL_SLUGS.map((slug) => ({
        url: `${SEO_DATA.url}/${locale}/${slug}`,
        lastModified: SITE_LAST_MODIFIED,
        changeFrequency: "yearly" as const,
        priority: 0.3,
        alternates: legalAlternates(`/${slug}`),
      })),
    ),
    ...servicePaths.map(({ locale, slug }) => ({
      url: `${SEO_DATA.url}/${locale}/${SERVICE_URL_SEGMENT}/${slug}`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: serviceAlternates(slug),
    })),
    ...(newsPaths.length > 0
      ? [
          {
            url: `${SEO_DATA.url}${NEWS_INDEX_PATH_HU}`,
            lastModified: SITE_LAST_MODIFIED,
            changeFrequency: "monthly" as const,
            priority: 0.55,
            alternates: huOnlyAlternates(NEWS_INDEX_PATH_HU),
          },
        ]
      : []),
    ...newsPaths.map(({ slug }) => {
      const path = `/hu/${NEWS_URL_SEGMENT_HU}/${slug}`;
      return {
        url: `${SEO_DATA.url}${path}`,
        lastModified: SITE_LAST_MODIFIED,
        changeFrequency: "monthly" as const,
        priority: 0.5,
        alternates: huOnlyAlternates(path),
      };
    }),
  ];
}
