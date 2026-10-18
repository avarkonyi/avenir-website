import { isTrustCenterLocale, trustCenterPath } from "./trust-center-routes";

const COPY = {
  hu: {
    label: "Megfelelőségi központ",
    description:
      "Tekintse át cégadatainkat, ISO-tanúsítványainkat és engedélyezési információinkat.",
  },
  en: {
    label: "Trust Center",
    description:
      "View our company details, ISO certificates and licensing information.",
  },
} as const;

export function getTrustCenterNavigation(locale: string) {
  if (!isTrustCenterLocale(locale)) return null;

  return { href: trustCenterPath(locale), ...COPY[locale] };
}
