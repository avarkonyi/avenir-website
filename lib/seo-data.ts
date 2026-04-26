// Central source of truth for company facts used in JSON-LD, sitemap,
// robots, manifest, opengraph-image, and metadata.
//
// When updating company info (legal name, address, phone, etc.), edit
// here AND keep Footer.tsx in sync — Footer hardcodes the same facts
// for now (refactor TBD).

export const SEO_DATA = {
  // Branding
  name: "Avenir Facility Management",
  shortName: "Avenir",
  legalName:
    "Avenir Facility Management Szolgáltató Korlátolt Felelősségű Társaság",
  legalNameShort: "Avenir Facility Management Kft.",

  // Web
  url: "https://www.afm.hu",
  // Placeholder asset URLs (designer pack will replace these)
  logoUrl: "https://www.afm.hu/logo.png",
  ogImageUrl: "https://www.afm.hu/og-image.jpg",

  // Identifiers (Hungarian company registry)
  foundingDate: "2018-07-31",
  taxID: "26395124-2-41",
  vatID: "HU26395124",
  registrationId: "01-09-328046",
  iso6523: "0190:01-09-328046",

  // Address
  address: {
    streetAddress: "Királyok útja 291.",
    addressLocality: "Budapest",
    postalCode: "1039",
    addressCountry: "HU",
  },

  // Contact
  contact: {
    phone: "+36-70-316-8218",
    phoneDisplay: "+36 70 316 8218",
    phoneTel: "tel:+36703168218",
    email: "info@afm.hu",
    emailHref: "mailto:info@afm.hu",
  },

  // Brand colours
  themeColor: "#0B1E3E",
  brandRed: "#D1172E",
  backgroundColor: "#ffffff",
} as const;

// FAQs used in FAQPage JSON-LD (HU-only by design — see decision log:
// per-locale schema translation deferred to a later content pass).
export const SEO_FAQS_HU = [
  {
    q: "Milyen szolgáltatásokat nyújt az Avenir Facility Management?",
    a: "Az Avenir Facility Management Kft. nyolc komplex szolgáltatást nyújt egyetlen szerződés keretében: őrzés-védelem, takarítás, épületüzemeltetés, portaszolgálat, zöldterület-kezelés, technikai karbantartás, mystery shopping és Hard FM.",
  },
  {
    q: "Hol érhető el az Avenir Facility Management?",
    a: "Az Avenir Facility Management Magyarország teljes területén nyújt szolgáltatásokat, központja Budapesten található (1039 Budapest, Királyok útja 291.). 30+ aktív helyszínen dolgozunk országszerte.",
  },
  {
    q: "Hány embert foglalkoztat az Avenir?",
    a: "Az Avenir Facility Management 200+ szakképzett munkatársat foglalkoztat — biztonsági őröket, takarítókat, épületüzemeltetési mérnököket és recepciósokat. A cég 2018-ban alakult, vezetői és kulcsmunkatársai több évtizedes szakmai tapasztalattal rendelkeznek.",
  },
  {
    q: "Milyen ügyfeleknek dolgozik az Avenir?",
    a: "Az Avenir ügyfélkörébe irodaházak, bevásárlóközpontok, ipari és logisztikai parkok, valamint közintézmények tartoznak. A cég OPTEN bonitási minősítése A+, közepes vállalkozási kategóriában működik.",
  },
  {
    q: "Hogyan lehet ajánlatot kérni az Avenirtől?",
    a: "Ajánlat a +36 70 316 8218-as telefonszámon, az info@afm.hu e-mail címen, vagy a www.afm.hu weboldalon található űrlapon kérhető. Visszajelzés 2 munkanapon belül.",
  },
] as const;

export const SEO_LOCALES = ["hu", "en", "de", "zh"] as const;
export type SeoLocale = (typeof SEO_LOCALES)[number];

// Mapping for og:locale and og:locale:alternate.
export const OG_LOCALE_MAP: Record<SeoLocale, string> = {
  hu: "hu_HU",
  en: "en_US",
  de: "de_DE",
  zh: "zh_CN",
};

// Per-locale taglines used in <title>: "{legalNameShort} — {tagline}".
// Description comes from t.hero.sub (already per-locale).
export const META_TAGLINES: Record<SeoLocale, string> = {
  hu: "Épületüzemeltetés és vagyonvédelem | Budapest",
  en: "Facility Management and Security Services | Budapest, Hungary",
  de: "Gebäudemanagement und Sicherheitsdienste | Budapest",
  zh: "设施管理与安保服务 | 布达佩斯",
};

// Keywords meta tag — HU primary; other locales fall back to HU since
// keywords carry low SEO weight in 2026. Optimize per-locale later.
export const META_KEYWORDS_HU =
  "facility management, épületüzemeltetés, vagyonvédelem, őrzés-védelem, takarítás, portaszolgálat, Budapest, FM szolgáltató, hard FM, mystery shopping";

// Security-first positioning: Avenir's primary expertise is property
// protection (vagyonvédelem); integrated FM is complementary. Used as
// description for both Organization and ProfessionalService schemas.
export const SECURITY_FIRST_DESCRIPTION =
  "Magyar vagyonvédelmi szakértő integrált épületüzemeltetéssel. 200+ szakember, 30+ aktív helyszín, ISO 9001 + ISO 27001 tanúsított.";

// SecurityService.knowsAbout array — emphasizes property-protection
// capabilities for AI-search and Knowledge Panel context.
export const SCHEMA_KNOWS_ABOUT = [
  "Élőerős őrzés-védelem",
  "Technikai vagyonvédelem",
  "Riasztó-rendszer felügyelet",
  "Beléptetési rendszerek",
  "Portaszolgálat",
  "24/7 diszpécserszolgálat",
  "Mystery Shopping audit",
  "Integrált facility management",
] as const;

// Service ordering used in the JSON-LD ItemList. Security-related items
// surface first (Őrzés-védelem, Portaszolgálat, Mystery Shopping); the
// component-side Services.tsx render order is intentionally unchanged.
export const SCHEMA_SERVICE_ORDER = [
  "security",
  "reception",
  "mystery",
  "cleaning",
  "building",
  "technical",
  "green",
  "hardfm",
] as const;

// Stable @id URL for an EducationalOccupationalCredential schema.
// Used both inside the credential's own top-level JSON-LD object and for
// hasCredential references from Organization + ProfessionalService.
export function credentialId(slug: string): string {
  return `${SEO_DATA.url}/#credential-${slug}`;
}
