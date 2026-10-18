import assert from "node:assert/strict";
import test from "node:test";
import { hu } from "../lib/i18n/hu";
import { getTermsContent } from "../lib/legal-content";
import {
  getDeImpressumContent,
  getDePrivacyContent,
  getDeTermsContent,
} from "../lib/de-legal-content";
import {
  LEGAL_PAGE_LOCALES,
  isLegalPageLocale,
  legalPageAlternateLanguages,
  legalPageStaticParams,
} from "../lib/legal-routes";

test("DE legal routes are renderable but not sitemap/hreflang publishable", () => {
  assert.equal(isLegalPageLocale("de"), true);
  assert.deepEqual(
    legalPageStaticParams().map((param) => param.locale).sort(),
    ["de", "en", "hu"],
  );

  assert.deepEqual([...LEGAL_PAGE_LOCALES], ["hu", "en"]);
  assert.deepEqual(Object.keys(legalPageAlternateLanguages("adatvedelem")).sort(), [
    "en",
    "hu",
    "x-default",
  ]);
});

test("DE privacy source is v1.3, review-noindex copy ready, and analytics wording current", () => {
  const privacy = getDePrivacyContent();

  assert.equal(privacy.title, "Datenschutzerklärung");
  assert.equal(privacy.lastUpdated, "Gültig ab: 13. Juni 2026");
  assert.equal(
    privacy.version,
    "Version 1.3 — Klarstellung zu Google Analytics als Auftragsverarbeiter",
  );
  assert.equal(privacy.sections.length, 15);
  assert.equal(privacy.intro.includes("[Datum der Veröffentlichung]"), false);
  assert.match(privacy.intro, /Alle nicht ungarischen Sprachfassungen/);
  assert.doesNotMatch(privacy.intro, /englische, deutsche und chinesische Fassung/);

  const cookies = privacy.sections.find((section) => section.id === "cookies");
  assert.ok(cookies);
  assert.equal(cookies.title, "8. Cookies und ähnliche Technologien");
  assert.match(cookies.body, /Google Analytics 4 \(GA4\)/);
  assert.match(cookies.body, /nicht vor einer aktiven Einwilligung/);
  assert.match(cookies.body, /keine Namen, E-Mail-Adressen, Telefonnummern/);
  assert.match(cookies.body, /Google Tag Manager/);
  assert.match(cookies.body, /LinkedIn Insight Tag/);
  assert.match(cookies.body, /Marketing-Tracking-Pixel/);
  assert.doesNotMatch(cookies.body, /keine Marketing- oder Analyse-Cookies/);
  assert.doesNotMatch(cookies.body, /Sollten künftig Analyse-/);
  assert.doesNotMatch(cookies.body, /FISA|CLOUD/);

  const processors = privacy.sections.find((section) => section.id === "processors");
  assert.ok(processors);
  assert.match(processors.body, /Resend/);
  assert.match(processors.body, /Standardvertragsklauseln/);
  assert.match(processors.body, /Vercel Inc\. ist.*EU-US Data Privacy Framework/);
  assert.match(processors.body, /Neon/);
  assert.match(processors.body, /Google Analytics 4 \(GA4\)/);
  assert.match(processors.body, /Google Ireland Limited \/ Google LLC/);

  const security = privacy.sections.find((section) => section.id === "security");
  assert.ok(security);
  assert.match(security.body, /ISO 9001 und ISO\/IEC 27001/);
  assert.match(privacy.versionHistory, /Version 1\.3 — Gültig ab 13\. Juni 2026/);
  assert.match(privacy.versionHistory, /Version 1\.2 — Gültig ab 1\. Juni 2026/);
  assert.match(privacy.intro, /vertragsbezogene Verwaltung nach einer erfolgreichen Angebotsanfrage/);
  assert.match(cookies.body, /Analyse-Cookies oder ähnliche Technologien/);
});

test("DE legal notices preserve the current HU section sequence, dates and commitments", () => {
  const terms = getDeTermsContent();

  assert.equal(terms.title, "Rechtliche Hinweise");
  assert.equal(terms.lastUpdated, "Gültig ab: 6. Mai 2026");
  assert.equal(terms.version, "Version 1.1 — Präzisierung des Titels");
  assert.deepEqual(terms.sections.map((section) => section.id), getTermsContent("hu", hu).sections.map((section) => section.id));
  assert.equal(terms.sections.length, 13);
  assert.equal(terms.intro.includes("[Datum der Veröffentlichung]"), false);

  const general = terms.sections.find((section) => section.id === "general");
  assert.ok(general);
  assert.doesNotMatch(general.body, /2 Arbeitstagen/);
  assert.match(general.body, /Inkrafttreten: 28\.04\.2026/);
  assert.match(general.body, /maßgeblich ist die ungarische Fassung/);
  assert.doesNotMatch(general.body, /Mit dem Aufruf|erkennen Sie/);
  const section = (id: string) => terms.sections.find((entry) => entry.id === id)!;
  assert.match(section("contact-form").body, /spätestens am nächsten Werktag/);
  assert.match(section("contact-form").body, /Zeitbedarf.*Komplexität.*Abstimmungen/);
  assert.match(section("contact-form").body, /https:\/\/www\.afm\.hu\/de\/adatvedelem/);
  assert.match(section("magannyomozas").body, /gesonderten Vertrags.*Datenschutzinformation.*Rechtsgrundlage/);
  assert.match(section("magannyomozas").body, /info@afm\.hu angefordert/);
  assert.match(section("magannyomozas").body, /gelöscht, anonymisiert/);
  assert.match(section("ip").body, /strukturierte Daten \(JSON-LD\).*Quellcode/);
  assert.match(section("liability").body, /mittelbare Schäden oder Folgeschäden/);
  assert.doesNotMatch(section("liability").body, /Nichtverfügbarkeit|technischen Störungen/);
  assert.match(section("complaints").body, /innerhalb von 8 Arbeitstagen/);
  assert.match(section("complaints").body, /Abschnitt 12/);
  assert.match(section("law").body, /ausschließliche Zuständigkeit.*Fővárosi Törvényszék/);
  assert.match(section("modification").body, /Veröffentlichung[\s\S]*archiviert[\s\S]*Anfrage/);

  const licenses = terms.sections.find((section) => section.id === "licenses");
  assert.ok(licenses);
  assert.match(licenses.body, /https:\/\/www\.afm\.hu\/de\/impresszum/);
  assert.match(terms.versionHistory, /Version 1\.1 — Gültig ab 6\. Mai 2026/);
  assert.equal(terms.dataProtection.title, "14. Datenschutz");
  assert.match(terms.dataProtection.body, /ersetzen die Datenschutzerklärung nicht/);
  assert.equal(terms.dataProtection.dpoEmail, "dpo@afm.hu");
  assert.equal(terms.dataProtection.privacyLinkHref, "/de/adatvedelem");
  assert.equal(terms.dataProtection.privacyLinkText, "Die vollständige Datenschutzerklärung ist hier verfügbar");
});

test("DE impressum source is available as markdown legal content", () => {
  const impressum = getDeImpressumContent();

  assert.equal(impressum.title, "Impressum");
  assert.equal(impressum.lastUpdated, "Letzte Aktualisierung: 5. Juni 2026");
  assert.equal(impressum.sections.length, 10);
  assert.equal(impressum.intro.includes("[Datum der Veröffentlichung]"), false);
  assert.equal(impressum.sections[0]?.title, "1. Angaben zum Unternehmen");
  assert.match(impressum.sections[0]?.body ?? "", /Avenir Facility Management/);
});

test("DE impressum source follows HU/EN factual structure without fallback labels", () => {
  const impressum = getDeImpressumContent();
  const fullText = [
    impressum.intro,
    ...impressum.sections.flatMap((section) => [section.title, section.body]),
  ].join("\n");

  assert.deepEqual(
    impressum.sections.map((section) => section.title),
    [
      "1. Angaben zum Unternehmen",
      "2. Vertretung",
      "3. Datenschutzbeauftragte",
      "4. Sitz und Kontaktdaten",
      "5. Reglementierter Beruf",
      "6. Behördliche Genehmigungen",
      "7. Aufsichtsbehörden",
      "8. Berufshaftpflichtversicherung",
      "9. Technischer Betrieb / Hosting",
      "10. Urheberrecht und weitere rechtliche Hinweise",
    ],
  );

  assert.match(fullText, /Handelsregisternummer: 01-09-328046/);
  assert.match(fullText, /Steuernummer: 26395124-2-41/);
  assert.match(fullText, /EU-USt-IdNr\.: HU26395124/);
  assert.match(fullText, /Registergericht: Handelsregistergericht des Hauptstädtischen Gerichtshofs/);
  assert.match(fullText, /Ausweis als Sicherheitskraft.*VS0000850/);
  assert.match(fullText, /Privatermittlerausweis.*MA2001317/);
  assert.match(fullText, /Datenschutzbeauftragte: Fanni Csegény/);
  assert.match(fullText, /dpo@afm\.hu/);
  assert.match(fullText, /01030-822\/4926-7\/2023/);
  assert.match(fullText, /01030-822\/4927-3\/2018/);
  assert.match(fullText, /01030-822\/4925-3\/2018/);
  assert.match(fullText, /AH\/37595-14\/2024-2/);
  assert.match(fullText, /Personen- und Vermögensschutz sowie Privatermittlung/);
  assert.match(fullText, /Behördliche Bescheinigung Nr\.: 01030-822\/4927-3\/2018/);
  assert.match(fullText, /Aktenzeichen: AH\/37595-14\/2024-2/);
  assert.match(fullText, /Überprüfung verpflichtend bis: 30\.06\.2026/);
  assert.match(fullText, /Polizeihauptmannschaft des III\. Bezirks Budapest, Abteilung Verwaltungspolizei/);
  assert.match(fullText, /Amt für Verfassungsschutz, Hauptabteilung Industriesicherheit/);
  assert.match(fullText, /Allianz Hungária Biztosító Zártkörűen Működő Részvénytársaság/);
  assert.match(fullText, /Versicherungsschein-Nr\.: 341633910/);
  assert.match(fullText, /Vercel Inc\./);
  assert.match(fullText, /https:\/\/www\.afm\.hu\/de\/adatvedelem/);
  assert.match(fullText, /https:\/\/www\.afm\.hu\/de\/aszf/);
  assert.doesNotMatch(fullText, /\[Datum der Veröffentlichung\]/);
  assert.doesNotMatch(fullText, /Legal Notice|Privacy Policy|Terms of Use/);
  assert.doesNotMatch(fullText, /Adószám|Cégjegyzékszám|Székhely/);
});
