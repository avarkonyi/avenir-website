import type { Metadata } from "next";
import { SEO_DATA } from "@/lib/seo-data";
export {
  TRUST_CENTER_LOCALES,
  TRUST_CENTER_SLUGS,
  isTrustCenterLocale,
  trustCenterAlternateLanguages,
  trustCenterPath,
  trustCenterUrl,
} from "@/lib/trust-center-routes";
import {
  type TrustCenterLocale,
  trustCenterAlternateLanguages,
  trustCenterUrl,
} from "@/lib/trust-center-routes";

export type TrustCenterLink = {
  readonly label: string;
  readonly href: string;
  readonly external?: boolean;
};

export type TrustCenterItem = {
  readonly title: string;
  readonly body?: string;
  readonly meta?: readonly string[];
  readonly links?: readonly TrustCenterLink[];
};

export type TrustCenterSection = {
  readonly id: string;
  readonly heading: string;
  readonly body?: string;
  readonly items?: readonly TrustCenterItem[];
  readonly links?: readonly TrustCenterLink[];
};

export type TrustCenterContent = {
  readonly locale: TrustCenterLocale;
  readonly title: string;
  readonly description: string;
  readonly intro: string;
  readonly supportNote: string;
  readonly sections: readonly TrustCenterSection[];
};

const ISO_9001_PDF = "/certifications/iso-9001-marton-843579099.pdf";
const ISO_27001_PDF = "/certifications/iso-27001-marton-988960032.pdf";

export const TRUST_CENTER_CONTENT: Record<
  TrustCenterLocale,
  TrustCenterContent
> = {
  hu: {
    locale: "hu",
    title: "Megfelelőségi központ",
    description:
      "Nyilvánosan megosztható cég-, megfelelőségi és biztonsági információk az Avenir Facility Management Kft.-ről.",
    intro:
      "Az Avenir Facility Management Kft. ezen az oldalon összegzi a nyilvánosan megosztható cég-, megfelelőségi és biztonsági információkat. A részletes jogi adatok az Impresszumban és a kapcsolódó tájékoztatókban érhetők el.",
    supportNote:
      "Az itt szereplő információk beszerzési, audit- és előminősítési folyamatok támogatására szolgálnak. Nem helyettesítik az egyedi szerződéses feltételeket vagy a külön megállapodás alapján átadott dokumentumokat.",
    sections: [
      {
        id: "company",
        heading: "Cégadatok",
        body:
          "Avenir Facility Management Kft. Magyarországon bejegyzett vállalkozás. A részletes cégadatok, adószám, cégjegyzékszám, székhely és jogi elérhetőségek az Impresszumban találhatók.",
        items: [
          {
            title: "Alapadatok",
            meta: [
              "Cégnév: Avenir Facility Management Szolgáltató Korlátolt Felelősségű Társaság",
              "Rövid név: Avenir Facility Kft.",
              "Székhely: 1039 Budapest, Királyok útja 291. B. ép. 15. ajtó",
              "Cégjegyzékszám: 01-09-328046",
              "Adószám: 26395124-2-41",
              "EU VAT: HU26395124",
            ],
            links: [{ label: "Impresszum", href: "/hu/impresszum" }],
          },
        ],
      },
      {
        id: "certifications",
        heading: "Tanúsítványok",
        body:
          "Az Avenir nyilvánosan elérhető tanúsítványai az irányítási rendszerekhez kapcsolódnak. A tanúsítványok nem jelentenek szolgáltatási eredmény-, megfelelőségi vagy válaszidő-garanciát.",
        items: [
          {
            title: "MSZ EN ISO 9001:2015",
            body:
              "Minőségirányítási rendszer. Tanúsítvány száma: 843579099. Kiállító: MartonCert Rendszertanúsító Kft. A tanúsítvány részletei a PDF-ben ellenőrizhetők. Hatály: 2026-03-19 - 2029-03-18.",
            links: [{ label: "ISO 9001 tanúsítvány", href: ISO_9001_PDF }],
          },
          {
            title: "MSZ ISO/IEC 27001:2023",
            body:
              "Információbiztonsági irányítási rendszer. Tanúsítvány száma: 988960032. Kiállító: MCert Rendszertanúsító Kft. A tanúsítvány részletei a PDF-ben ellenőrizhetők. Hatály: 2026-04-27 - 2029-04-26.",
            links: [
              { label: "ISO/IEC 27001 tanúsítvány", href: ISO_27001_PDF },
            ],
          },
        ],
      },
      {
        id: "regulated-operations",
        heading: "Engedélyezett vagyonvédelmi működés",
        body:
          "Az Avenir szabályozott vagyonvédelmi és kapcsolódó engedélyköteles tevékenységeinek részletes engedélyadatai az Impresszumban érhetők el. A Megfelelőségi központban csak összefoglaló jellegű tájékoztatás jelenik meg; az engedélyek nem jelentenek hatósági szerepet vagy szolgáltatási eredménygaranciát.",
        items: [
          {
            title: "Személy- és vagyonvédelem",
            body:
              "Engedélyezett vagyonvédelmi tevékenység jogi és megfelelőségi kontextusban. A pontos engedélyadatok az Impresszumban találhatók.",
          },
          {
            title: "Biztonságtechnika",
            body:
              "Biztonságtechnikai tervező-szerelő jogosultság jogi és megfelelőségi kontextusban. A pontos engedélyadatok az Impresszumban találhatók.",
          },
          {
            title: "Magánnyomozói tevékenység",
            body:
              "Magánnyomozói tevékenység jogi és megfelelőségi kontextusban. A pontos engedélyadatok az Impresszumban találhatók.",
          },
        ],
        links: [{ label: "Impresszum", href: "/hu/impresszum" }],
      },
      {
        id: "data-protection-security",
        heading: "Adatvédelem és biztonsági bejelentések",
        body:
          "Az Avenir a weboldalhoz kapcsolódó adatkezelési és biztonsági tájékoztatókat külön oldalakon teszi elérhetővé. A háttérben kezelt adatfeldolgozói és adattovábbítási dokumentumok nem nyilvános Megfelelőségi központ dokumentumok.",
        items: [
          {
            title: "Adatvédelmi tisztviselő",
            body: "Csegény Fanni, dpo@afm.hu.",
          },
        ],
        links: [
          { label: "Adatkezelési tájékoztató", href: "/hu/adatvedelem" },
          {
            label: "Pályázói adatkezelési tájékoztató",
            href: "/hu/palyazoi-adatkezeles",
          },
          {
            label: "Felelős hibabejelentés",
            href: "/hu/felelos-hibabejelentes",
          },
          { label: "security.txt", href: "/.well-known/security.txt" },
        ],
      },
      {
        id: "approved-references",
        heading: "Jóváhagyott ügyfélmegjelenés",
        body:
          "AutoWallis Pest jóváhagyott ügyfélmegjelenésként szerepelhet. A megjelenés nem minősül ajánlásnak vagy teljesítményállításnak.",
        items: [
          {
            title: "AutoWallis Pest",
            meta: [
              "Belső jogi/proof entitás: Wallis Motor Pest Kft.",
              "Kapcsolódó szolgáltatások: Objektumőrzés; Recepciós és portaszolgálat",
            ],
            links: [
              {
                label: "AutoWallis Pest weboldal",
                href: "https://www.bmw-autowallis.hu",
                external: true,
              },
            ],
          },
        ],
      },
      {
        id: "documents",
        heading: "Dokumentumok és tájékoztatók",
        body:
          "A nyilvános letöltések és tájékoztatók köre a jóváhagyott dokumentumokra és jogi oldalakra korlátozódik.",
        links: [
          { label: "ISO 9001 tanúsítvány", href: ISO_9001_PDF },
          { label: "ISO/IEC 27001 tanúsítvány", href: ISO_27001_PDF },
          { label: "Impresszum", href: "/hu/impresszum" },
          { label: "Adatkezelési tájékoztató", href: "/hu/adatvedelem" },
          {
            label: "Pályázói adatkezelési tájékoztató",
            href: "/hu/palyazoi-adatkezeles",
          },
          {
            label: "Felelős hibabejelentés",
            href: "/hu/felelos-hibabejelentes",
          },
          { label: "security.txt", href: "/.well-known/security.txt" },
        ],
      },
      {
        id: "additional-proof",
        heading: "További dokumentumok kérése",
        body:
          "További, nem nyilvános dokumentumok megosztása külön megállapodás vagy beszerzési folyamat keretében történhet.",
      },
    ],
  },
  en: {
    locale: "en",
    title: "Trust Center",
    description:
      "Publicly shareable company, compliance and security information about Avenir Facility Management Kft.",
    intro:
      "This page summarises the company, compliance and security information that Avenir Facility Management Kft. can share publicly. Detailed legal information is available in the Legal Notice and related notices.",
    supportNote:
      "The information on this page supports procurement, audit and vendor pre-qualification processes. It does not replace contract-specific terms or documents shared under a separate agreement.",
    sections: [
      {
        id: "company",
        heading: "Company information",
        body:
          "Avenir Facility Management Kft. is a company registered in Hungary. Detailed company data, tax number, company registration number, registered seat and legal contact information are available in the Legal Notice.",
        items: [
          {
            title: "Company data",
            meta: [
              "Legal name: Avenir Facility Management Szolgáltató Korlátolt Felelősségű Társaság",
              "Registered short name: Avenir Facility Kft.",
              "Registered seat: 1039 Budapest, Királyok útja 291, building B, door 15, Hungary",
              "Company registration number: 01-09-328046",
              "Tax number: 26395124-2-41",
              "EU VAT ID: HU26395124",
            ],
            links: [{ label: "Legal Notice", href: "/en/impresszum" }],
          },
        ],
      },
      {
        id: "certifications",
        heading: "Certifications",
        body:
          "Avenir's publicly available certificates relate to management systems. The certificates do not constitute a service outcome, compliance or response-time guarantee.",
        items: [
          {
            title: "MSZ EN ISO 9001:2015",
            body:
              "Quality management system. Certificate number: 843579099. Certification body: MartonCert Rendszertanúsító Kft. Certificate details can be verified in the PDF. Valid: 2026-03-19 to 2029-03-18.",
            links: [{ label: "ISO 9001 certificate", href: ISO_9001_PDF }],
          },
          {
            title: "MSZ ISO/IEC 27001:2023",
            body:
              "Information security management system. Certificate number: 988960032. Certification body: MCert Rendszertanúsító Kft. Certificate details can be verified in the PDF. Valid: 2026-04-27 to 2029-04-26.",
            links: [
              { label: "ISO/IEC 27001 certificate", href: ISO_27001_PDF },
            ],
          },
        ],
      },
      {
        id: "regulated-operations",
        heading: "Licensed security operations",
        body:
          "Detailed licence information for Avenir's regulated security and related licensed activities is available in the Legal Notice. The Trust Center provides summary information only; licences do not imply a public-authority role or a service-outcome guarantee.",
        items: [
          {
            title: "Personal and property security",
            body:
              "Licensed security activity in legal and compliance context. Exact licence details are available in the Legal Notice.",
          },
          {
            title: "Security technology",
            body:
              "Security systems designer-installer certificate in legal and compliance context. Exact certificate details are available in the Legal Notice.",
          },
          {
            title: "Private investigation activity",
            body:
              "Private investigation activity in legal and compliance context. Exact licence details are available in the Legal Notice.",
          },
        ],
        links: [{ label: "Legal Notice", href: "/en/impresszum" }],
      },
      {
        id: "data-protection-security",
        heading: "Data protection and security reporting",
        body:
          "Avenir provides website-related privacy and security notices on dedicated public pages. Processor and transfer-safeguard evidence documents are not public Trust Center documents.",
        items: [
          {
            title: "Data Protection Officer",
            body: "Fanni Csegény, dpo@afm.hu.",
          },
        ],
        links: [
          { label: "Privacy Policy", href: "/en/adatvedelem" },
          {
            label: "Recruitment privacy notice",
            href: "/en/recruitment-privacy",
          },
          {
            label: "Responsible disclosure",
            href: "/en/responsible-disclosure",
          },
          { label: "security.txt", href: "/.well-known/security.txt" },
        ],
      },
      {
        id: "approved-references",
        heading: "Approved public reference",
        body:
          "AutoWallis Pest may appear as an approved public client reference. This does not constitute a recommendation or performance claim.",
        items: [
          {
            title: "AutoWallis Pest",
            meta: [
              "Internal legal/proof entity: Wallis Motor Pest Kft.",
              "Related services: On-site Security Guarding; Reception and Gatehouse Services",
            ],
            links: [
              {
                label: "AutoWallis Pest website",
                href: "https://www.bmw-autowallis.hu",
                external: true,
              },
            ],
          },
        ],
      },
      {
        id: "documents",
        heading: "Documents and notices",
        body:
          "Public downloads and notices are limited to approved documents and legal pages.",
        links: [
          { label: "ISO 9001 certificate", href: ISO_9001_PDF },
          { label: "ISO/IEC 27001 certificate", href: ISO_27001_PDF },
          { label: "Legal Notice", href: "/en/impresszum" },
          { label: "Privacy Policy", href: "/en/adatvedelem" },
          {
            label: "Recruitment privacy notice",
            href: "/en/recruitment-privacy",
          },
          {
            label: "Responsible disclosure",
            href: "/en/responsible-disclosure",
          },
          { label: "security.txt", href: "/.well-known/security.txt" },
        ],
      },
      {
        id: "additional-proof",
        heading: "Additional proof requests",
        body:
          "Additional non-public documents may be shared as part of a separate agreement or procurement process.",
      },
    ],
  },
};

export function getTrustCenterContent(
  locale: TrustCenterLocale,
): TrustCenterContent {
  return TRUST_CENTER_CONTENT[locale];
}

export function buildTrustCenterMetadata(locale: TrustCenterLocale): Metadata {
  const content = getTrustCenterContent(locale);
  const title = `${content.title} | ${SEO_DATA.legalNameShort}`;
  const url = trustCenterUrl(locale);

  return {
    metadataBase: new URL(SEO_DATA.url),
    title,
    description: content.description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: url,
      languages: trustCenterAlternateLanguages(),
    },
    openGraph: {
      type: "article",
      title,
      description: content.description,
      url,
    },
  };
}
