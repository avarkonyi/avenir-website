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
  // Marketing-rövid forma — meta title, og:site_name, footer copyright
  legalNameShort: "Avenir Facility Management Kft.",
  // Cégbíróság-bejegyzett rövid forma — IAF CertSearch authoritative,
  // surfaced as schema.org Organization.alternateName
  alternateName: "Avenir Facility Kft.",

  // Web
  url: "https://www.afm.hu",
  // Placeholder asset URL (designer pack will replace this)
  logoUrl: "https://www.afm.hu/logo.png",
  // Dynamic OG route (always 200) — replaces former /og-image.jpg
  // placeholder which never existed as a static asset
  ogImageUrl: "https://www.afm.hu/hu/opengraph-image",

  // Identifiers (Hungarian company registry)
  foundingDate: "2018-07-31",
  taxID: "26395124-2-41",
  vatID: "HU26395124",
  registrationId: "01-09-328046",
  iso6523: "0190:01-09-328046",

  // Address — two presentations of the same legal address:
  //
  //   address.streetAddress (full, "Királyok útja 291. B. ép. 15. ajtó")
  //     → JSON-LD PostalAddress, Footer impresszum line (small-print
  //       legal context), llms.txt, future impresszum page, cert cards.
  //       Used everywhere legal/structured precision matters.
  //
  //   addressShort (short, "1039 Budapest, Királyok útja 291.")
  //     → Footer Maps-link visible text, Contact section visible text.
  //       Used for quick-glance B2B browsing where the building/door
  //       detail is visual noise. Maps URL queries also use this short
  //       form (street+number is what Google Maps geocoder needs).
  //
  // Legal precision is preserved in the structured + impresszum surface;
  // the visual surface stays elegant.
  address: {
    streetAddress: "Királyok útja 291. B. ép. 15. ajtó",
    addressLocality: "Budapest",
    postalCode: "1039",
    addressCountry: "HU",
  },
  addressShort: "1039 Budapest, Királyok útja 291.",

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
    a: "Az Avenir Facility Management Kft. nyolc fő szolgáltatási területet fog össze egy felelős kapcsolattartóval: élőerős objektumőrzés, recepciós és portaszolgálat, mystery shopping és helyszíni audit, rendezvénybiztosítás, biztonságtechnika, távfelügyelet és vonulószolgálat, Soft FM és Hard FM.",
  },
  {
    q: "Hol érhető el az Avenir Facility Management?",
    a: "Az Avenir Facility Management Magyarország teljes területén nyújt szolgáltatásokat, központja Budapesten található (1039 Budapest, Királyok útja 291. B. ép. 15. ajtó). 30+ aktív helyszínen dolgozunk országszerte.",
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
export const META_TAGLINES: Record<SeoLocale, string> = {
  hu: "Vagyonvédelem és FM",
  en: "Security and FM",
  de: "Objektschutz und FM",
  zh: "安保与设施管理",
};

// Per-locale meta descriptions. Keep these concise for search snippets;
// the longer hero copy remains visible on-page.
export const META_DESCRIPTIONS: Record<SeoLocale, string> = {
  hu: "Vagyonvédelem, biztonságtechnika, helyszíni audit és FM-támogatás országosan. Egy szerződés, egy felelős kapcsolattartó.",
  en: "Security services, security technology, on-site audits and FM support in Hungary. One contract, one accountable point of contact.",
  de: "Objektschutz, Sicherheitstechnik, Vor-Ort-Audits und FM-Unterstützung in Ungarn. Ein Vertrag, ein verantwortlicher Ansprechpartner.",
  zh: "Avenir 在匈牙利提供安保服务、安防技术、现场审核和设施管理支持，一份合同，一个责任明确的对接人。",
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

// Stable @id URL for an EducationalOccupationalCredential schema.
// Used both inside the credential's own top-level JSON-LD object and for
// hasCredential references from Organization + ProfessionalService.
export function credentialId(slug: string): string {
  return `${SEO_DATA.url}/#credential-${slug}`;
}

// Hivatalos képviselő (cégbíróság-bejegyzett ügyvezető). Telefonja eltér
// a company-general számtól: a vizuális fő-helyeken (Footer, Contact,
// JSON-LD) a +36 70 316 8218 céges-általános marad; az ügyvezető
// +36 70 312 5868 száma kizárólag az impresszum képviselő-szakaszban.
export const SEO_EXECUTIVE = {
  name: "Kovács Attila",
  nameEn: "Attila Kovács",
  titleHu: "ügyvezető",
  titleEn: "Managing Director",
  titleDe: "Geschäftsführer",
  titleZh: "总经理",
  guardCardNumber: "VS0000850",
  pidetectiveNumber: "MA2001317",
  email: "info@afm.hu",
  emailHref: "mailto:info@afm.hu",
  phone: "+36-70-312-5868",
  phoneDisplay: "+36 70 312 5868",
  phoneTel: "tel:+36703125868",
} as const;

// GDPR Art. 37(1)(b)+(c) szerint kijelölt adatvédelmi tisztviselő.
// NAIH-bejelentés Infotv. 25/L. § alapján megtörtént (2026.04.29).
export const SEO_DPO = {
  name: "Csegény Fanni",
  nameEn: "Fanni Csegény",
  email: "dpo@afm.hu",
  emailHref: "mailto:dpo@afm.hu",
  phone: "+36-70-622-6242",
  phoneDisplay: "+36 70 622 6242",
  phoneTel: "tel:+36706226242",
} as const;

// Cégbíróság (a cégjegyzékszám regisztrálója).
export const SEO_COURT_REGISTRY = {
  name: "Fővárosi Törvényszék Cégbírósága",
  nameEn: "Court of Registration of the Budapest-Capital Regional Court",
  address: "1051 Budapest, Nádor u. 28.",
} as const;

// Tárhelyszolgáltató (Ekertv. 4. § f) kötelező disclosure).
// VERIFIED 2026.04.28: Vercel privacy-policy szerinti hivatalos cím.
export const SEO_HOSTING_PROVIDER = {
  name: "Vercel Inc.",
  address: "440 N Barranca Avenue #4133, Covina, CA 91723, USA",
  email: "privacy@vercel.com",
  generalEmail: "support@vercel.com",
} as const;

// Kötelező felelősségbiztosítás (SzVMt. 5/A. § (1) b) szerint).
// Allianz-kötvényszám 2026.04.28 user-confirmed.
export const SEO_LIABILITY = {
  legalBasis: "SzVMt. 5/A. § (1) b)",
  legalBasisEn: "§ 5/A(1)(b) of Hungarian Act CXXXIII of 2005",
  insurerName: "Allianz Hungária Biztosító Zrt.",
  insurerLegalName:
    "Allianz Hungária Biztosító Zártkörűen Működő Részvénytársaság",
  insurerAddress: "1087 Budapest, Könyves Kálmán krt. 48-52.",
  insurerRegNumber: "Cg. 01-10-041356",
  policyNumber: "341633910",
} as const;

// Hatósági engedélyek (3+1: vagyonvédelem őrzés-védés + biztonságtechnika +
// magánnyomozás + nemzetbiztonsági névjegyzék). Iparági standard a B2B
// procurement audithoz: a partner letöltheti a hatósági határozatokat.
export const SEO_LICENSES = [
  {
    type: "guarding",
    number: "01030-822/4926-7/2023",
    validUntil: "2028-01-31",
    indefinite: false,
    issuer: "III. Kerületi Rendőrkapitányság, Igazgatásrendészeti Osztály",
    issuerEn: "3rd District Police Station, Administrative Police Department",
    legalBasis: "SzVMt. (2005. évi CXXXIII. törvény)",
    legalBasisEn: "SzVMt. (Hungarian Act CXXXIII of 2005)",
  },
  {
    type: "security-tech",
    number: "01030-822/4927-3/2018",
    validUntil: null,
    indefinite: true,
    issuer: "III. Kerületi Rendőrkapitányság, Igazgatásrendészeti Osztály",
    issuerEn: "3rd District Police Station, Administrative Police Department",
    legalBasis: "SzVMt. (2005. évi CXXXIII. törvény)",
    legalBasisEn: "SzVMt. (Hungarian Act CXXXIII of 2005)",
  },
  {
    type: "private-investigator",
    number: "01030-822/4925-3/2018",
    validUntil: null,
    indefinite: true,
    issuer: "III. Kerületi Rendőrkapitányság, Igazgatásrendészeti Osztály",
    issuerEn: "3rd District Police Station, Administrative Police Department",
    legalBasis: "SzVMt. (2005. évi CXXXIII. törvény)",
    legalBasisEn: "SzVMt. (Hungarian Act CXXXIII of 2005)",
  },
  {
    type: "national-security",
    number: "AH/37595-14/2024-2",
    validUntil: "2026-06-30",
    indefinite: false,
    issuer: "Alkotmányvédelmi Hivatal Iparbiztonsági Főosztály",
    issuerEn: "Constitution Protection Office, Industrial Security Department",
    legalBasis: "Vbt. (2016. évi XXX. törvény) 120. §",
    legalBasisEn: "§ 120 of Hungarian Act XXX of 2016 (Vbt.)",
  },
] as const;

export type LicenseType = (typeof SEO_LICENSES)[number]["type"];

// Felügyeleti hatóságok (3 darab, eltérő hatáskör).
// VERIFIED 2026.04.28: NAIH naih.hu/ugyfelszolgalat-kapcsolat;
// AH ah.gov.hu/en/contact; III. Kerületi Rk. — felhasználó-megadott.
export const SEO_REGULATORY_BODIES = {
  guarding: {
    area: "guarding",
    name: "III. Kerületi Rendőrkapitányság, Igazgatásrendészeti Osztály",
    nameEn: "3rd District Police Station, Administrative Police Department",
    address: "1036 Budapest, Tímár utca 9/a",
    phone: "+36 (1) 430-4700",
    fax: "+36 (1) 430-4722",
    email: "03rk@budapest.police.hu",
    legalBasis:
      "SzVMt. + 329/2007. (XII.13.) Korm. rendelet 12. § (3) c)",
    legalBasisEn:
      "SzVMt. + Government Decree 329/2007. (XII.13.) § 12(3)(c)",
  },
  nationalSecurity: {
    area: "nationalSecurity",
    name: "Alkotmányvédelmi Hivatal Iparbiztonsági Főosztály",
    nameEn: "Constitution Protection Office, Industrial Security Department",
    address: "1117 Budapest, Fehérvári út 70.",
    postalAddress: "1391 Budapest, 62. Pf. 217",
    phone: "+36 (1) 485-2300",
    legalBasis: "Vbt. (2016. évi XXX. törvény) 120. §",
    legalBasisEn: "§ 120 of Hungarian Act XXX of 2016 (Vbt.)",
  },
  dataProtection: {
    area: "dataProtection",
    name: "Nemzeti Adatvédelmi és Információszabadság Hatóság (NAIH)",
    nameEn: "National Authority for Data Protection and Freedom of Information (NAIH)",
    address: "1055 Budapest, Falk Miksa utca 9-11.",
    postalAddress: "1363 Budapest, Pf.: 9",
    phone: "+36 (1) 391-1400",
    email: "ugyfelszolgalat@naih.hu",
    web: "https://www.naih.hu",
    legalBasis: "GDPR + Infotv. (2011. évi CXII. törvény)",
    legalBasisEn: "GDPR + Infotv. (Hungarian Act CXII of 2011)",
  },
} as const;

// GDPR Art. 28 szerinti adatfeldolgozók. VERIFIED 2026.04.28-ról a
// szolgáltatók privacy/contact oldalairól. Schrems-II konzervatív
// disclosure pattern: NEM állítjuk hogy "data stays in EU" — US-incorporated
// parent + EU-region deployment + provider-specific DPF/SCC guarantees.
export const SEO_DATA_PROCESSORS = [
  {
    id: "resend",
    legalName: "Plus Five Five, Inc.",
    tradeName: "Resend",
    address: "2261 Market Street #5039, San Francisco, CA 94114, USA",
    purposeHu: "Tranzakcionális email továbbítás",
    purposeEn: "Transactional email delivery",
    purposeDe: "Transaktionale E-Mail-Zustellung",
    purposeZh: "事务性电子邮件传输",
    location: "EU Frankfurt (sending region)",
    dpfCertified: false,
  },
  {
    id: "vercel",
    legalName: "Vercel Inc.",
    tradeName: "Vercel",
    address: "440 N Barranca Avenue #4133, Covina, CA 91723, USA",
    purposeHu: "Hosting, edge/CDN szolgáltatás és szerveroldali naplózás",
    purposeEn: "Hosting, edge/CDN service and server-side logging",
    purposeDe: "Hosting, Edge/CDN-Dienst und serverseitige Protokollierung",
    purposeZh: "托管、边缘/CDN 服务及服务器端日志",
    location: "EU edge regions (configured)",
    dpfCertified: true,
  },
  {
    id: "neon",
    legalName: "Neon, LLC",
    tradeName: "Neon (a Databricks, Inc. affiliate)",
    address: "160 Spear Street, Suite 1300, San Francisco, CA 94105, USA",
    purposeHu: "PostgreSQL adatbázis-szolgáltatás",
    purposeEn: "PostgreSQL database service",
    purposeDe: "PostgreSQL-Datenbankdienst",
    purposeZh: "PostgreSQL 数据库服务",
    location: "EU AWS Frankfurt (eu-central-1)",
    dpfCertified: false,
  },
] as const;
