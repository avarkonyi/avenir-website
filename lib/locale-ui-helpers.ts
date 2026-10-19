import type { Translation } from "@/lib/i18n";
import { RECRUITMENT_PRIVACY_SLUGS } from "@/lib/recruitment-privacy-routes";
import { shouldRenderHomepageReferences } from "@/lib/references";

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
  return ({ hu: "Részletek", en: "Details", de: "Details", zh: "详情", ko: "자세히 보기", fr: "En savoir plus" } as Record<string, string>)[locale] ?? "Details";
}

// Contact-form copy actually needed by the client component. The parked
// special-service strings (privateInvestigation, specialDataWarning,
// specialDataWarningLink) stay in the i18n source for the ÁSZF legal context
// and a future special-intake flow, but must not ship in the homepage client
// payload now that the public dropdown no longer offers the option
// (post_launch_backlog PL-015/PL-059).
export type ContactFormCopy = Omit<
  Translation["form"],
  "privateInvestigation" | "specialDataWarning" | "specialDataWarningLink"
>;

export function getContactFormCopy(
  form: Translation["form"],
): ContactFormCopy {
  const {
    privateInvestigation,
    specialDataWarning,
    specialDataWarningLink,
    ...contactFormCopy
  } = form;
  void privateInvestigation;
  void specialDataWarning;
  void specialDataWarningLink;
  return contactFormCopy;
}

// Career-section microcopy linking the recruitment privacy notice
// (PL-091). HU/EN link their own locale's notice; DE shows the approved
// German sentence but links the EN page because no reviewed DE notice
// exists. Other review locales also label the English destination explicitly.
export type CareerPrivacyNotice = {
  readonly before: string;
  readonly linkLabel: string;
  readonly after: string;
  readonly href: string;
};

export function getCareerPrivacyNotice(
  locale: string,
): CareerPrivacyNotice | null {
  const huHref = `/hu/${RECRUITMENT_PRIVACY_SLUGS.hu}`;
  const enHref = `/en/${RECRUITMENT_PRIVACY_SLUGS.en}`;

  if (locale === "hu") {
    return {
      before: "Jelentkezés előtt kérjük, olvassa el a ",
      linkLabel: "pályázói adatkezelési tájékoztatót",
      after: ".",
      href: huHref,
    };
  }
  if (locale === "en") {
    return {
      before: "Before applying, please read the ",
      linkLabel: "recruitment privacy notice",
      after: ".",
      href: enHref,
    };
  }
  if (locale === "de") {
    return {
      before: "Bitte lesen Sie vor Ihrer Bewerbung die ",
      linkLabel: "Datenschutzhinweise für Bewerbungen (auf Englisch)",
      after: ".",
      href: enHref,
    };
  }
  if (locale === "fr") {
    return { before: "Avant de postuler, veuillez lire notre ", linkLabel: "notice de confidentialité pour les candidats (en anglais)", after: ".", href: enHref };
  }
  if (locale === "ko") {
    return { before: "지원하기 전에 ", linkLabel: "지원자 개인정보 처리 안내문(영문)", after: "을 읽어 주세요.", href: enHref };
  }
  if (locale === "zh") {
    return { before: "申请前，请阅读", linkLabel: "求职者隐私声明（英文）", after: "。", href: enHref };
  }
  return null;
}

// The footer map link title was a hardcoded Hungarian string on every
// locale; URL and visible address text are intentionally unchanged.
const FOOTER_MAP_LINK_TITLES: Record<string, string> = {
  hu: "Megnyitás Google Maps-en",
  en: "Open in Google Maps",
  de: "In Google Maps öffnen",
  zh: "在 Google 地图中打开",
  ko: "Google 지도에서 열기",
  fr: "Ouvrir dans Google Maps",
};

export function getFooterMapLinkTitle(locale: string): string {
  return FOOTER_MAP_LINK_TITLES[locale] ?? FOOTER_MAP_LINK_TITLES.hu;
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
// advertise closed news routes. References render only for locales where
// the approved source-gated reference card is available.
export function getVisibleNavSectionKeys(
  locale: string,
): readonly NavSectionKey[] {
  let keys = [...NAV_SECTION_KEYS];

  if (!shouldRenderHomepageReferences(locale)) {
    keys = keys.filter((key) => key !== "references");
  }

  if (locale !== "hu" && locale !== "en" && locale !== "de") {
    keys = keys.filter((key) => key !== "news");
  }

  return keys;
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
      terms: "법적 고지사항(영문)",
      impressum: "회사 정보 (영문)",
    };
  }

  if (locale === "zh") {
    return {
      privacy: "隐私政策（英文）",
      terms: "法律声明（英文）",
      impressum: "公司信息（英文）",
    };
  }

  return fallbackLabels;
}
