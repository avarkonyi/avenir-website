type FooterLabels = {
  readonly privacy: string;
  readonly terms: string;
  readonly impressum: string;
};

const DE_SERVICE_LIST_LABELS: Record<string, string> = {
  objektumorzes: "Objektschutz vor Ort",
  portaszolgalat: "Empfangs- und Pförtnerdienst",
  "mystery-shopping-helyszini-audit": "Mystery Shopping und Serviceaudit",
  rendezvenybiztositas: "Veranstaltungssicherheit",
  biztonsagtechnika: "Sicherheitstechnik",
  "tavfelugyelet-vonuloszolgalat":
    "Fernüberwachung und Interventionsdienst",
  "hard-fm": "Hard FM – Technisches Gebäudemanagement",
  "soft-fm": "Soft FM – Infrastrukturelles Gebäudemanagement",
};

export type FooterLegalLink = {
  readonly href: string;
  readonly label: string;
};

export function getLegalFallbackLocale(locale: string): "hu" | "en" | "de" {
  if (locale === "hu") return "hu";
  if (locale === "de") return "de";
  return "en";
}

export function getContactPrivacyHref(locale: string): string {
  return `/${getLegalFallbackLocale(locale)}/adatvedelem`;
}

export function getServiceCardDetailLabel(locale: string): string {
  return locale === "hu" ? "Részletek" : "Details";
}

export const NAV_SECTION_KEYS = [
  "about",
  "services",
  "references",
  "news",
  "career",
  "contact",
] as const;

export type NavSectionKey = (typeof NAV_SECTION_KEYS)[number];

// Homepage section nav keys. The News section renders only for locales
// where the public article layer exists. HU/EN are indexable; DE is a
// noindex review surface. ZH/KO keep the homepage-only frame and must not
// advertise closed news routes.
export function getVisibleNavSectionKeys(
  locale: string,
): readonly NavSectionKey[] {
  return locale === "hu" || locale === "en" || locale === "de"
    ? NAV_SECTION_KEYS
    : NAV_SECTION_KEYS.filter((key) => key !== "news");
}

export function getLocaleServiceListLabel(
  locale: string,
  slug: string,
  fallbackLabel: string,
): string {
  if (locale !== "de") return fallbackLabel;
  return DE_SERVICE_LIST_LABELS[slug] ?? fallbackLabel;
}

export function getFooterLegalLinks(
  locale: string,
  fallbackLabels: FooterLabels,
): FooterLegalLink[] {
  const legalLocale = getLegalFallbackLocale(locale);
  const labels = getFooterLegalLabels(locale, fallbackLabels);

  return [
    { href: `/${legalLocale}/adatvedelem`, label: labels.privacy },
    { href: `/${legalLocale}/aszf`, label: labels.terms },
    { href: `/${legalLocale}/impresszum`, label: labels.impressum },
  ];
}

function getFooterLegalLabels(
  locale: string,
  fallbackLabels: FooterLabels,
): FooterLabels {
  if (locale === "de") {
    return {
      privacy: "Datenschutzerklärung",
      terms: "Rechtliche Hinweise",
      impressum: "Impressum",
    };
  }

  if (locale === "ko") {
    return {
      privacy: "개인정보 처리방침 (영문)",
      terms: "이용약관 (영문)",
      impressum: "회사 정보 (영문)",
    };
  }

  if (locale === "zh") {
    return {
      privacy: "Privacy Policy (English)",
      terms: "Terms of Use (English)",
      impressum: "Legal Notice (English)",
    };
  }

  return fallbackLabels;
}
