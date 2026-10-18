import type { Metadata } from "next";
import { OG_LOCALE_MAP, SEO_DATA, type SeoLocale } from "@/lib/seo-data";

// Next.js merges metadata shallowly: a page-level `openGraph`, `twitter` or
// `robots` object replaces the layout's object entirely (including the
// file-based opengraph-image). Every page therefore builds its complete
// social, robots and canonical metadata through this one helper, so share
// previews always carry an image, the page's own title and its locale, and
// the localized 404 boundary inherits no canonical or index directive.

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

export function defaultOgImageUrl(locale: string): string {
  return `${SEO_DATA.url}/${locale}/opengraph-image`;
}

export type PageMetadataInput = {
  locale: string;
  title: string;
  description: string;
  /** Absolute canonical URL of the page. */
  url: string;
  /** Whether the page may be indexed (hu/en production pages only). */
  index: boolean;
  /** hreflang alternates; only emitted for indexable pages. */
  languages?: Record<string, string>;
  type?: "website" | "article";
  /** Absolute page-specific image; defaults to the locale OG image. */
  image?: string | null;
  authors?: Metadata["authors"];
  /** Extra Open Graph article fields (publishedTime, modifiedTime). */
  article?: { publishedTime?: string; modifiedTime?: string };
};

export function buildPageMetadata({
  locale,
  title,
  description,
  url,
  index,
  languages,
  type = "website",
  image,
  authors,
  article,
}: PageMetadataInput): Metadata {
  const ogLocale = OG_LOCALE_MAP[locale as SeoLocale];
  const images = image
    ? [{ url: image }]
    : [{ url: defaultOgImageUrl(locale), ...OG_IMAGE_SIZE, alt: SEO_DATA.name }];

  return {
    metadataBase: new URL(SEO_DATA.url),
    title,
    description,
    ...(authors ? { authors } : {}),
    robots: {
      index,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    alternates: {
      canonical: url,
      ...(index && languages ? { languages } : {}),
    },
    openGraph: {
      type,
      siteName: SEO_DATA.name,
      ...(ogLocale ? { locale: ogLocale } : {}),
      title,
      description,
      url,
      images,
      ...(type === "article" && article ? article : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((entry) => entry.url),
    },
  };
}
