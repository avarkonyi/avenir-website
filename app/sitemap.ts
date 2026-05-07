import type { MetadataRoute } from "next";
import { SEO_DATA, SEO_LOCALES } from "@/lib/seo-data";

const LEGAL_SLUGS = ["adatvedelem", "aszf", "impresszum"] as const;
const SITE_LAST_MODIFIED = new Date("2026-05-07T00:00:00.000Z");

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

export default function sitemap(): MetadataRoute.Sitemap {
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
  ];
}
