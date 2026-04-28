import type { MetadataRoute } from "next";
import { SEO_DATA, SEO_LOCALES } from "@/lib/seo-data";

const LEGAL_SLUGS = ["adatvedelem", "aszf", "impresszum"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const homepageAlternates = Object.fromEntries(
    SEO_LOCALES.map((l) => [l, `${SEO_DATA.url}/${l}`]),
  );

  return [
    {
      url: `${SEO_DATA.url}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: homepageAlternates },
    },
    ...SEO_LOCALES.map((locale) => ({
      url: `${SEO_DATA.url}/${locale}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...SEO_LOCALES.flatMap((locale) =>
      LEGAL_SLUGS.map((slug) => ({
        url: `${SEO_DATA.url}/${locale}/${slug}`,
        lastModified,
        changeFrequency: "yearly" as const,
        priority: 0.3,
        alternates: {
          languages: Object.fromEntries(
            SEO_LOCALES.map((l) => [l, `${SEO_DATA.url}/${l}/${slug}`]),
          ),
        },
      })),
    ),
  ];
}
