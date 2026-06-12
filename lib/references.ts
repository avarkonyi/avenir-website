export type ReferenceLocale = "hu" | "en" | "de" | "zh" | "ko";

export type ReferenceServiceSlug = "objektumorzes" | "portaszolgalat";

export type ApprovedHomepageReference = {
  readonly key: string;
  readonly displayName: string;
  readonly legalEntity: string;
  readonly logoPath: string;
  readonly websiteUrl: string;
  readonly alt: Readonly<Record<"hu" | "en" | "de", string>>;
  readonly description: Readonly<Record<"hu" | "en" | "de", string>>;
  readonly ariaLabel: Readonly<Record<"hu" | "en" | "de", string>>;
  readonly services: readonly ReferenceServiceSlug[];
  readonly approved: boolean;
  readonly usageApproved: boolean;
};

export const APPROVED_HOMEPAGE_REFERENCES: readonly ApprovedHomepageReference[] = [
  {
    key: "autowallis-pest",
    displayName: "AutoWallis Pest",
    legalEntity: "Wallis Motor Pest Kft.",
    logoPath: "/references/autowallis-pest.png",
    websiteUrl: "https://autowallispest.hu/",
    alt: {
      hu: "AutoWallis Pest logó",
      en: "AutoWallis Pest logo",
      de: "Logo von AutoWallis Pest",
    },
    description: {
      hu: "Budapesti prémium autókereskedelmi és szervizhálózat.",
      en: "Premium automotive retail and service network in Budapest.",
      de: "Premium-Autohandels- und Servicenetz in Budapest.",
    },
    ariaLabel: {
      hu: "AutoWallis Pest hivatalos weboldal megnyitása",
      en: "Open AutoWallis Pest official website",
      de: "Offizielle Website von AutoWallis Pest öffnen",
    },
    services: ["objektumorzes", "portaszolgalat"],
    approved: true,
    usageApproved: true,
  },
];

const REFERENCE_SECTION_COPY: Record<"hu" | "en" | "de", {
  readonly title: string;
  readonly intro: string;
}> = {
  hu: {
    title: "Referenciák",
    intro: "Jóváhagyott ügyfélmegjelenések.",
  },
  en: {
    title: "References",
    intro: "Approved client references.",
  },
  de: {
    title: "Referenzen",
    intro: "Freigegebene Kundenreferenzen.",
  },
};

const REFERENCE_SERVICE_LABELS: Record<
  "hu" | "en" | "de",
  Record<ReferenceServiceSlug, string>
> = {
  hu: {
    objektumorzes: "Objektumőrzés",
    portaszolgalat: "Recepciós és portaszolgálat",
  },
  en: {
    objektumorzes: "On-site Security Guarding",
    portaszolgalat: "Reception and Gatehouse Services",
  },
  de: {
    objektumorzes: "Objektschutz vor Ort",
    portaszolgalat: "Empfangs- und Pförtnerdienst",
  },
};

export function shouldRenderHomepageReferences(locale: string): locale is "hu" | "en" | "de" {
  return locale === "hu" || locale === "en" || locale === "de";
}

export function getApprovedHomepageReferences(
  locale: string,
): readonly ApprovedHomepageReference[] {
  if (!shouldRenderHomepageReferences(locale)) return [];
  return APPROVED_HOMEPAGE_REFERENCES.filter(
    (reference) => reference.approved && reference.usageApproved,
  );
}

export function getReferenceSectionCopy(locale: string): {
  readonly title: string;
  readonly intro: string;
} {
  return shouldRenderHomepageReferences(locale)
    ? REFERENCE_SECTION_COPY[locale]
    : REFERENCE_SECTION_COPY.en;
}

export function getReferenceAlt(
  locale: string,
  reference: ApprovedHomepageReference,
): string {
  return shouldRenderHomepageReferences(locale) ? reference.alt[locale] : reference.alt.en;
}

export function getReferenceDescription(
  locale: string,
  reference: ApprovedHomepageReference,
): string {
  return shouldRenderHomepageReferences(locale)
    ? reference.description[locale]
    : reference.description.en;
}

export function getReferenceAriaLabel(
  locale: string,
  reference: ApprovedHomepageReference,
): string {
  return shouldRenderHomepageReferences(locale)
    ? reference.ariaLabel[locale]
    : reference.ariaLabel.en;
}

export function getReferenceWebsiteCta(locale: string): string {
  if (locale === "hu") return "Cégoldal megnyitása";
  if (locale === "de") return "Website öffnen";
  return "Visit website";
}

export function getReferenceServiceChips(
  locale: string,
  services: readonly ReferenceServiceSlug[],
): string[] {
  const labels = shouldRenderHomepageReferences(locale)
    ? REFERENCE_SERVICE_LABELS[locale]
    : REFERENCE_SERVICE_LABELS.en;

  return services.map((service) => labels[service]);
}
