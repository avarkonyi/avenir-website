import { RECRUITMENT_PRIVACY_SLUGS } from "./recruitment-privacy-routes";
import { TRUST_CENTER_SLUGS } from "./trust-center-routes";

const UTILITY_SLUGS = [
  RECRUITMENT_PRIVACY_SLUGS,
  TRUST_CENTER_SLUGS,
  { hu: "felelos-hibabejelentes", en: "responsible-disclosure" },
] as const;

export function getUtilityLocaleHref(pathname: string, targetLocale: string, hash = ""): string | null {
  const currentSlug = pathname.split("/").filter(Boolean)[1];
  const route = UTILITY_SLUGS.find((slugs) => currentSlug === slugs.hu || currentSlug === slugs.en);
  if (!route) return null;
  if (targetLocale !== "hu" && targetLocale !== "en") return `/${targetLocale}`;
  return `/${targetLocale}/${route[targetLocale]}${hash}`;
}
