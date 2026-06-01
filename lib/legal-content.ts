import type { Translation } from "@/lib/i18n";
import { CURRENT_PRIVACY_CONTENT } from "@/lib/current-privacy-content";

type PrivacyContent = Translation["legal"]["privacy"];
type TermsContent = Translation["legal"]["terms"];

function replaceTermsLanguage(text: string): string {
  return text
    .replace(/Felhasználási feltételek/g, "Jogi nyilatkozatok")
    .replace(/felhasználási feltételek/g, "jogi nyilatkozatok")
    .replace(/Felhasználási Feltételek/g, "Jogi nyilatkozatok");
}

export function getPrivacyContent(locale: string, fallback: Translation): PrivacyContent {
  return CURRENT_PRIVACY_CONTENT[locale as "hu" | "en"] ?? fallback.legal.privacy;
}

export function getTermsContent(locale: string, fallback: Translation): TermsContent {
  const base = fallback.legal.terms;
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

  if (locale !== "hu") {
    return {
      ...fallback,
      legal: {
        ...fallback.legal,
        privacy,
      },
    };
  }

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
