import { SEO_DATA } from "@/lib/seo-data";

export type ResponsibleDisclosureLocale = "hu" | "en";
export type ResponsibleDisclosureSlug =
  | "felelos-hibabejelentes"
  | "responsible-disclosure";

type DisclosureSection = {
  readonly id: string;
  readonly title: string;
  readonly body: string;
};

type DisclosureContent = {
  readonly locale: ResponsibleDisclosureLocale;
  readonly slug: ResponsibleDisclosureSlug;
  readonly title: string;
  readonly lastUpdated: string;
  readonly intro: string;
  readonly description: string;
  readonly sections: readonly DisclosureSection[];
};

export const RESPONSIBLE_DISCLOSURE_LOCALES = ["hu", "en"] as const;

const RESPONSIBLE_DISCLOSURE_CONTENT: Record<
  ResponsibleDisclosureLocale,
  DisclosureContent
> = {
  hu: {
    locale: "hu",
    slug: "felelos-hibabejelentes",
    title: "Felelős hibabejelentés",
    lastUpdated: "Hatályos: 2026. június 12.",
    intro:
      "Ezen az oldalon keresztül a www.afm.hu weboldallal kapcsolatos technikai biztonsági hibák felelős bejelentéséhez adunk útmutatást.",
    description:
      "Útmutató a www.afm.hu weboldallal kapcsolatos technikai biztonsági hibák felelős bejelentéséhez.",
    sections: [
      {
        id: "cel",
        title: "Cél",
        body:
          "Ez az oldal a www.afm.hu weboldallal kapcsolatos technikai biztonsági hibák felelős bejelentésére szolgál. A cél az, hogy a bejelentések kezelhető, kárminimalizáló és ellenőrizhető formában érkezzenek meg.",
      },
      {
        id: "kapcsolat",
        title: "Kapcsolat",
        body:
          "Technikai biztonsági hibák: security@afm.hu\nAdatvédelmi ügyek: dpo@afm.hu\nÁltalános megkeresések: info@afm.hu",
      },
      {
        id: "mit-tartalmazzon",
        title: "Mit tartalmazzon a bejelentés?",
        body:
          "Kérjük, a bejelentés lehetőség szerint tartalmazza az érintett URL-t vagy funkciót, a hiba rövid leírását, a reprodukciós lépéseket, a szükséges technikai bizonyítékot és egy kapcsolattartási e-mail-címet.",
      },
      {
        id: "scope",
        title: "Scope",
        body:
          "A felelős hibabejelentési scope az Avenir nyilvános weboldalára és a weboldalhoz közvetlenül kapcsolódó publikus felületekre korlátozódik.\n\nNem tartoznak ide ügyfélrendszerek, partnerrendszerek, harmadik fél rendszerei, fizikai telephelyek, belső rendszerek, e-mailes vagy social engineering jellegű tesztek.",
      },
      {
        id: "nem-engedelyezett-tesztek",
        title: "Nem engedélyezett tesztek",
        body:
          "Nem engedélyezett fizikai behatolási kísérlet, social engineering, phishing, spam, DoS / DDoS / terheléses teszt, rosszindulatú kód használata, adatok letöltése, másolása vagy hozzáférési jogosultságon túli megtekintése, valamint ügyfél-, partner- vagy harmadik fél rendszereinek tesztelése.",
      },
      {
        id: "adatvedelem-es-karminimalizalas",
        title: "Adatvédelem és kárminimalizálás",
        body:
          "A bejelentő ne töltsön le szükségtelen adatot, ne másoljon vagy hozzon nyilvánosságra személyes vagy üzleti adatot. Véletlen hozzáférés esetén kérjük, haladéktalanul jelezze a helyzetet, és az adatot ne továbbítsa szükségtelenül.",
      },
      {
        id: "visszajelzes",
        title: "Visszajelzés",
        body:
          "A bejelentéseket a rendelkezésre álló információk alapján megvizsgáljuk, és szükség esetén a megadott elérhetőségen visszajelzünk.",
      },
      {
        id: "nincs-jutalomprogram",
        title: "Nincs jutalomprogram",
        body:
          "Avenir jelenleg nem működtet nyilvános hibavadászati vagy jutalmazási programot.",
      },
      {
        id: "johiszemuseg",
        title: "Jóhiszemű bejelentések kezelése",
        body:
          "A jóhiszemű, kárt nem okozó és a fenti kereteket tiszteletben tartó bejelentéseket együttműködően kezeljük.",
      },
    ],
  },
  en: {
    locale: "en",
    slug: "responsible-disclosure",
    title: "Responsible disclosure",
    lastUpdated: "Effective: 12 June 2026",
    intro:
      "This page explains how to responsibly report technical security issues related to the www.afm.hu website.",
    description:
      "Guidance for responsibly reporting technical security issues related to the www.afm.hu website.",
    sections: [
      {
        id: "purpose",
        title: "Purpose",
        body:
          "This page is intended for responsible reports of technical security issues related to the www.afm.hu website. Reports should be submitted in a manageable, harm-minimising and verifiable form.",
      },
      {
        id: "contact",
        title: "Contact",
        body:
          "Technical security issues: security@afm.hu\nData protection matters: dpo@afm.hu\nGeneral enquiries: info@afm.hu",
      },
      {
        id: "what-to-include",
        title: "What to include",
        body:
          "Where possible, please include the affected URL or function, a short description of the issue, reproduction steps, technical evidence if needed and a contact email address.",
      },
      {
        id: "scope",
        title: "Scope",
        body:
          "The responsible disclosure scope is limited to the public Avenir website and directly related public website surfaces.\n\nCustomer systems, partner systems, third-party systems, physical sites, internal systems, email testing and social engineering are not in scope.",
      },
      {
        id: "out-of-scope-testing",
        title: "Out-of-scope testing",
        body:
          "Physical intrusion attempts, social engineering, phishing, spam, DoS / DDoS / load testing, malicious code, downloading, copying or viewing data beyond authorised access, and testing customer, partner or third-party systems are not permitted.",
      },
      {
        id: "privacy-and-harm-minimisation",
        title: "Privacy and harm minimisation",
        body:
          "Reporters should not download unnecessary data, copy personal or business data, or disclose it publicly. If accidental access occurs, please report it promptly and avoid unnecessary forwarding of the data.",
      },
      {
        id: "response",
        title: "Response",
        body:
          "We review reports based on the information provided and, where appropriate, respond using the contact details supplied.",
      },
      {
        id: "no-bug-bounty-programme",
        title: "No bug bounty programme",
        body:
          "Avenir does not currently operate a public bug bounty or reward programme.",
      },
      {
        id: "good-faith-reports",
        title: "Good-faith reports",
        body:
          "Good-faith reports that do not cause harm and respect the framework above are handled in a cooperative manner.",
      },
    ],
  },
};

export function isResponsibleDisclosureLocale(
  locale: string,
): locale is ResponsibleDisclosureLocale {
  return (RESPONSIBLE_DISCLOSURE_LOCALES as readonly string[]).includes(locale);
}

export function getResponsibleDisclosureContent(
  locale: ResponsibleDisclosureLocale,
): DisclosureContent {
  return RESPONSIBLE_DISCLOSURE_CONTENT[locale];
}

export function responsibleDisclosureUrl(
  locale: ResponsibleDisclosureLocale,
): string {
  const content = getResponsibleDisclosureContent(locale);
  return `${SEO_DATA.url}/${locale}/${content.slug}`;
}

export function responsibleDisclosureAlternateLanguages() {
  return {
    hu: responsibleDisclosureUrl("hu"),
    en: responsibleDisclosureUrl("en"),
    "x-default": responsibleDisclosureUrl("en"),
  };
}
