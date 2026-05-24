import { SEO_DATA } from "@/lib/seo-data";
import type { Locale } from "@/lib/i18n";

export const LEGAL_PAGE_LOCALES = ["hu", "en"] as const satisfies readonly Locale[];
export const LEGAL_PAGE_SLUGS = ["adatvedelem", "aszf", "impresszum"] as const;

export type LegalPageLocale = (typeof LEGAL_PAGE_LOCALES)[number];
export type LegalPageSlug = (typeof LEGAL_PAGE_SLUGS)[number];

export function isLegalPageLocale(locale: string): locale is LegalPageLocale {
  return (LEGAL_PAGE_LOCALES as readonly string[]).includes(locale);
}

export function legalPageStaticParams() {
  return LEGAL_PAGE_LOCALES.map((locale) => ({ locale }));
}

export function legalPageUrl(locale: LegalPageLocale, slug: LegalPageSlug): string {
  return `${SEO_DATA.url}/${locale}/${slug}`;
}

export function legalPageAlternateLanguages(slug: LegalPageSlug) {
  return {
    hu: legalPageUrl("hu", slug),
    en: legalPageUrl("en", slug),
    "x-default": legalPageUrl("hu", slug),
  };
}
