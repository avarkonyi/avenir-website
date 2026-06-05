import assert from "node:assert/strict";
import test from "node:test";
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

test("DE privacy source is v1.2, review-noindex copy ready, and analytics wording current", () => {
  const privacy = getDePrivacyContent();

  assert.equal(privacy.title, "Datenschutzerklärung");
  assert.equal(privacy.lastUpdated, "Gültig ab: 5. Juni 2026");
  assert.equal(
    privacy.version,
    "Version 1.2 — Präzisierung des Geltungsbereichs sowie Ergänzung der Angaben zum Verantwortlichen und zur Datenschutzbeauftragten",
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

  const security = privacy.sections.find((section) => section.id === "security");
  assert.ok(security);
  assert.match(security.body, /ISO 9001 und ISO\/IEC 27001/);
  assert.match(privacy.versionHistory, /Version 1\.2 — Gültig ab 5\. Juni 2026/);
});

test("DE legal notices source removes response-time promise and uses DE legal links", () => {
  const terms = getDeTermsContent();

  assert.equal(terms.title, "Rechtliche Hinweise");
  assert.equal(terms.lastUpdated, "Gültig ab: 5. Juni 2026");
  assert.equal(terms.version, "Version 1.1");
  assert.equal(terms.sections.length, 12);
  assert.equal(terms.intro.includes("[Datum der Veröffentlichung]"), false);

  const general = terms.sections.find((section) => section.id === "general");
  assert.ok(general);
  assert.match(general.body, /in der Regel über die angegebenen Kontaktdaten/);
  assert.doesNotMatch(general.body, /2 Arbeitstagen/);
  assert.match(general.body, /https:\/\/www\.afm\.hu\/de\/adatvedelem/);
  assert.match(general.body, /Alle nicht ungarischen Sprachfassungen/);
  assert.doesNotMatch(general.body, /englische, deutsche und chinesische Fassung/);

  const licenses = terms.sections.find((section) => section.id === "licenses");
  assert.ok(licenses);
  assert.match(licenses.body, /https:\/\/www\.afm\.hu\/de\/impresszum/);
  assert.match(terms.versionHistory, /Version 1\.1 — Gültig ab 5\. Juni 2026/);
  assert.equal(terms.dataProtection.privacyLinkHref, "/de/adatvedelem");
  assert.equal(terms.dataProtection.privacyLinkText, "Die vollständige Datenschutzerklärung ist hier verfügbar");
});

test("DE impressum source is available as markdown legal content", () => {
  const impressum = getDeImpressumContent();

  assert.equal(impressum.title, "Impressum");
  assert.equal(impressum.lastUpdated, "Letzte Aktualisierung: 5. Juni 2026");
  assert.equal(impressum.sections.length, 10);
  assert.equal(impressum.intro.includes("[Datum der Veröffentlichung]"), false);
  assert.equal(impressum.sections[0]?.title, "1. Unternehmensangaben");
  assert.match(impressum.sections[0]?.body ?? "", /Avenir Facility Management/);
});
