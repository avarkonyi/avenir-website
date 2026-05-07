import type { MetadataRoute } from "next";
import { SEO_DATA, SEO_LOCALES } from "@/lib/seo-data";
import { getAllPublishedServiceSlugs } from "@/lib/db/queries/services";

const LEGAL_SLUGS = ["adatvedelem", "aszf", "impresszum"] as const;
const SITE_LAST_MODIFIED = new Date("2026-05-07T00:00:00.000Z");
const SERVICE_URL_SEGMENT = "szolgaltatasok";

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

// Sitemap is async (Next 16 supports async sitemaps) so we can pull
// the live list of published+active service slugs from the DB. Drafts
// (isPublished=false) and soft-deleted rows (isActive=false) are
// filtered inside getAllPublishedServiceSlugs — they never reach the
// sitemap, matching the "no draft URL is indexable" P5 guarantee.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const serviceSlugs = await getAllPublishedServiceSlugs();

  return [
    ...SEO_LOCALES.map((locale) => ({
      url: `${SEO_DATA.url}/${locale}`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.9,
      alternates: localeAlternates(),
    })),
    ...SEO_LOCALES.flatMap((locale) =>
      LEGAL_SLUGS.map((slug) => ({
        url: `${SEO_DATA.url}/${locale}/${slug}`,
        lastModified: SITE_LAST_MODIFIED,
        changeFrequency: "yearly" as const,
        priority: 0.3,
        alternates: localeAlternates(`/${slug}`),
      })),
    ),
    ...SEO_LOCALES.flatMap((locale) =>
      serviceSlugs.map((slug) => ({
        url: `${SEO_DATA.url}/${locale}/${SERVICE_URL_SEGMENT}/${slug}`,
        lastModified: SITE_LAST_MODIFIED,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: localeAlternates(`/${SERVICE_URL_SEGMENT}/${slug}`),
      })),
    ),
  ];
}
