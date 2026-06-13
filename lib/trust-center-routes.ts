import { SEO_DATA } from "@/lib/seo-data";

export const TRUST_CENTER_LOCALES = ["hu", "en"] as const;
export type TrustCenterLocale = (typeof TRUST_CENTER_LOCALES)[number];

export const TRUST_CENTER_SLUGS = {
  hu: "megfelelosegi-kozpont",
  en: "trust-center",
} as const satisfies Record<TrustCenterLocale, string>;

export type TrustCenterSlug =
  (typeof TRUST_CENTER_SLUGS)[TrustCenterLocale];

export function isTrustCenterLocale(
  locale: string,
): locale is TrustCenterLocale {
  return (TRUST_CENTER_LOCALES as readonly string[]).includes(locale);
}

export function trustCenterPath(locale: TrustCenterLocale): string {
  return `/${locale}/${TRUST_CENTER_SLUGS[locale]}`;
}

export function trustCenterUrl(locale: TrustCenterLocale): string {
  return `${SEO_DATA.url}${trustCenterPath(locale)}`;
}

export function trustCenterAlternateLanguages() {
  return {
    hu: trustCenterUrl("hu"),
    en: trustCenterUrl("en"),
    "x-default": trustCenterUrl("hu"),
  };
}
