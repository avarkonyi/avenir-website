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

export function getLegalFallbackLocale(locale: string): "hu" | "en" {
  return locale === "hu" ? "hu" : "en";
}

export function getContactPrivacyHref(locale: string): string {
  return `/${getLegalFallbackLocale(locale)}/adatvedelem`;
}

export function getServiceCardDetailLabel(locale: string): string {
  return locale === "de" ? "Details" : "Részletek";
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
      privacy: "Datenschutzerklärung (Englisch)",
      terms: "Rechtliche Hinweise (Englisch)",
      impressum: "Impressum (Englisch)",
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
