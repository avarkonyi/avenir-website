import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo-data";
import { RECRUITMENT_PRIVACY_CONTENT } from "@/lib/recruitment-privacy-content";

// PL-091 Option B: the recruitment privacy notice lives on locale-specific
// slugs (decision recorded in docs/legal/recruitment-privacy-review.md).
// This is the single source of truth for the slug pair — the two route
// files, the Nav locale switcher, the career microcopy and the sitemap all
// derive from here. HU is the authoritative language; there is no DE/ZH/KO
// version yet (DE microcopy falls back to the EN page).
export const RECRUITMENT_PRIVACY_LOCALES = ["hu", "en"] as const;

export type RecruitmentPrivacyLocale =
  (typeof RECRUITMENT_PRIVACY_LOCALES)[number];

export const RECRUITMENT_PRIVACY_SLUGS = {
  hu: "palyazoi-adatkezeles",
  en: "recruitment-privacy",
} as const satisfies Record<RecruitmentPrivacyLocale, string>;

export type RecruitmentPrivacySlug =
  (typeof RECRUITMENT_PRIVACY_SLUGS)[RecruitmentPrivacyLocale];

export function isRecruitmentPrivacyLocale(
  locale: string,
): locale is RecruitmentPrivacyLocale {
  return (RECRUITMENT_PRIVACY_LOCALES as readonly string[]).includes(locale);
}

export function recruitmentPrivacyPath(
  locale: RecruitmentPrivacyLocale,
): string {
  return `/${locale}/${RECRUITMENT_PRIVACY_SLUGS[locale]}`;
}

export function recruitmentPrivacyUrl(
  locale: RecruitmentPrivacyLocale,
): string {
  return `${SEO_DATA.url}${recruitmentPrivacyPath(locale)}`;
}

export function recruitmentPrivacyAlternateLanguages() {
  return {
    hu: recruitmentPrivacyUrl("hu"),
    en: recruitmentPrivacyUrl("en"),
    "x-default": recruitmentPrivacyUrl("hu"),
  };
}

// Kept here (pure module) instead of the page component so unit tests can
// import it without pulling the Nav/Footer/db chain.
export function buildRecruitmentPrivacyMetadata(
  locale: RecruitmentPrivacyLocale,
): Metadata {
  const content = RECRUITMENT_PRIVACY_CONTENT[locale];
  const title = `${content.title} — ${SEO_DATA.legalNameShort}`;
  const description = content.intro.slice(0, 160);
  const url = recruitmentPrivacyUrl(locale);

  return {
    metadataBase: new URL(SEO_DATA.url),
    title,
    description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: url,
      languages: recruitmentPrivacyAlternateLanguages(),
    },
    openGraph: { type: "article", title, description, url },
  };
}
