import type { Translation } from "@/lib/i18n";
import { CURRENT_PRIVACY_CONTENT } from "@/lib/current-privacy-content";
import {
  getDePrivacyContent,
  getDeTermsContent,
} from "@/lib/de-legal-content";

type PrivacyContent = Translation["legal"]["privacy"];
type TermsContent = Translation["legal"]["terms"];

function replaceTermsLanguage(text: string): string {
  return text
    .replace(/Felhasználási [Ff]eltételekre/g, "Jogi nyilatkozatokra")
    .replace(/felhasználási feltételekre/g, "jogi nyilatkozatokra")
    .replace(/Felhasználási feltételek/g, "Jogi nyilatkozatok")
    .replace(/felhasználási feltételek/g, "jogi nyilatkozatok")
    .replace(/Felhasználási Feltételek/g, "Jogi nyilatkozatok");
}

export function getPrivacyContent(locale: string, fallback: Translation): PrivacyContent {
  if (locale === "de") {
    return getDePrivacyContent();
  }

  return CURRENT_PRIVACY_CONTENT[locale as "hu" | "en"] ?? fallback.legal.privacy;
}

export function getTermsContent(locale: string, fallback: Translation): TermsContent {
  if (locale === "de") {
    return getDeTermsContent();
  }

  const base = fallback.legal.terms;
  if (locale === "en") {
    return {
      ...base,
      title: "Legal Statements",
      lastUpdated: "Effective: 6 May 2026",
      version: "Version 1.1 — title clarification",
      intro:
        "This document provides information on the use of the www.afm.hu website, the contact and quote-request process, and the legal statements published on the website. It is not a set of general terms and conditions covering the Provider's entire business.",
      sections: base.sections.map((section) => {
        if (section.id === "general") {
          return {
            ...section,
            title: "1. General Provisions and Scope",
            body: "Provider (marketing name): Avenir Facility Management Kft.\nProvider (legal name): Avenir Facility Management Szolgáltató Korlátolt Felelősségű Társaság (the \"Provider\"). Full provider details: see Legal Notice.\nThese Legal Statements have been drawn up with regard to Sections 6:2–6:8 of Act V of 2013 on the Civil Code (Ptk.) and the provisions of Act CVIII of 2001 on Electronic Commerce Services (Ekertv.).\nScope of these Legal Statements: the use of the https://www.afm.hu website and the contact and quote-request process.\nThe Provider's clientele consists exclusively of B2B (business) clients. The Provider does not enter into contracts with consumers (within the meaning of Section 8:1(1)(3) of the Hungarian Civil Code) via this website and does not establish consumer relationships through it. The contact process on the website accepts only B2B-purpose enquiries.\nEffective from: 28 April 2026.\nThe language of these Legal Statements is Hungarian; the Hungarian version is authoritative. The English and German versions are for information only; in case of discrepancy, the Hungarian text prevails.",
          };
        }
        if (section.id === "modification") {
          return {
            ...section,
            title: "13. Modification of the Legal Statements",
            body: "The Provider reserves the right to modify these Legal Statements. Modifications take effect upon publication at https://www.afm.hu/en/aszf. The Provider archives earlier versions and makes them available upon request.",
          };
        }
        return {
          ...section,
          title: section.title.replace(/Terms of Use/g, "Legal Statements"),
          body: section.body.replace(/Terms of Use/g, "Legal Statements"),
        };
      }),
      dataProtection: {
        ...base.dataProtection,
        body: "Processing of personal data in connection with the use of the website is governed by the Privacy Policy. These Legal Statements do not replace the Privacy Policy.",
      },
      versionHistory:
        "Version history: Version 1.1 — Effective from 6 May 2026. The document title was changed to Legal Statements based on DPO comments.",
    };
  }
  if (locale !== "hu") {
    return base;
  }

  return {
    ...base,
    title: "Jogi nyilatkozatok",
    lastUpdated: "Hatályos: 2026. május 6.",
    version: "1.1 verzió - cím pontosítása",
    intro:
      "A jelen dokumentum a www.afm.hu weboldal használatára, a kapcsolatfelvételi és ajánlatkérési folyamatra, valamint a weboldalon közzétett jogi nyilatkozatokra vonatkozó tájékoztatást tartalmazza. A dokumentum nem a teljes üzleti működésre vonatkozó általános szerződési feltételrendszer.",
    sections: base.sections.map((section) => {
      if (section.id === "general") {
        return {
          ...section,
          title: "1. Általános rendelkezések és hatály",
          body: replaceTermsLanguage(section.body)
            .replace(
              "A Jogi nyilatkozatok hatálya: a https://www.afm.hu weboldal használatára, a kapcsolatfelvételi és ajánlatkérési flow-ra.",
              "A Jogi nyilatkozatok hatálya: a https://www.afm.hu weboldal használatára, valamint a kapcsolatfelvételi és ajánlatkérési folyamatra.",
            )
            .replace(
              "A jelen Jogi nyilatkozatok nyelve: magyar; a magyar nyelvű változat az autentikus.",
              "A jelen Jogi nyilatkozatok nyelve: magyar; a magyar nyelvű változat az irányadó.",
            ),
        };
      }

      if (section.id === "modification") {
        return {
          ...section,
          title: "13. A jogi nyilatkozatok módosítása",
          body:
            "A Szolgáltató fenntartja a jogot a jelen jogi nyilatkozatok módosítására. A módosítások a https://www.afm.hu/hu/aszf oldalon történő közzététellel lépnek hatályba. A korábbi verziókat a Szolgáltató archiválja és kérésre rendelkezésre bocsátja.",
        };
      }

      return {
        ...section,
        title: replaceTermsLanguage(section.title),
        body: replaceTermsLanguage(section.body),
      };
    }),
    dataProtection: {
      ...base.dataProtection,
      body:
        "A weboldal használatához kapcsolódó adatkezelésekre az Adatkezelési tájékoztató irányadó. A jogi nyilatkozatok nem helyettesítik az Adatkezelési tájékoztatót.",
    },
    versionHistory:
      "Verziótörténet: 1.1 verzió - Hatály: 2026. május 6-tól. A dokumentum címe DPO észrevétel alapján Jogi nyilatkozatokra módosult.",
  };
}

export function withLegalContent(locale: string, fallback: Translation): Translation {
  const privacy = getPrivacyContent(locale, fallback);
  const terms = getTermsContent(locale, fallback);

  return {
    ...fallback,
    legal: {
      ...fallback.legal,
      privacy,
      terms,
    },
  };
}
