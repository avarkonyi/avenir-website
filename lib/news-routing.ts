import { SEO_DATA } from "@/lib/seo-data";

export const NEWS_PUBLIC_LOCALES = ["hu", "en", "de"] as const;
export const NEWS_INDEXABLE_LOCALES = ["hu", "en"] as const;
export const NEWS_REVIEW_LOCALES = ["de"] as const;
export const NEWS_URL_SEGMENT = "hirek";

export type NewsPublicLocale = (typeof NEWS_PUBLIC_LOCALES)[number];
export type NewsIndexableLocale = (typeof NEWS_INDEXABLE_LOCALES)[number];

export function isPublicNewsLocale(
  locale: string,
): locale is NewsPublicLocale {
  return (NEWS_PUBLIC_LOCALES as readonly string[]).includes(locale);
}

export function isIndexableNewsLocale(
  locale: string,
): locale is NewsIndexableLocale {
  return (NEWS_INDEXABLE_LOCALES as readonly string[]).includes(locale);
}

export function newsIndexPath(locale: NewsPublicLocale): string {
  return `/${locale}/${NEWS_URL_SEGMENT}`;
}

export function newsIndexUrl(locale: NewsPublicLocale): string {
  return `${SEO_DATA.url}${newsIndexPath(locale)}`;
}

export function newsDetailHref(
  locale: NewsPublicLocale,
  slug: string,
): string {
  return `${newsIndexPath(locale)}/${encodeURIComponent(slug)}`;
}

export function newsDetailUrl(
  locale: NewsPublicLocale,
  slug: string,
): string {
  return `${SEO_DATA.url}${newsDetailHref(locale, slug)}`;
}

export function newsAlternateLanguages(
  slug: string | null,
  locales: readonly NewsPublicLocale[],
): Record<string, string> {
  const indexableLocales = locales.filter(isIndexableNewsLocale);
  const languages: Record<string, string> = Object.fromEntries(
    indexableLocales.map((locale) => [
      locale,
      slug ? newsDetailUrl(locale, slug) : newsIndexUrl(locale),
    ]),
  );

  if (indexableLocales.includes("hu")) {
    languages["x-default"] = slug
      ? newsDetailUrl("hu", slug)
      : newsIndexUrl("hu");
  }

  return languages;
}
