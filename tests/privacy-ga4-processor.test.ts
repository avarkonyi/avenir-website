import assert from "node:assert/strict";
import test from "node:test";
import { CURRENT_PRIVACY_CONTENT } from "../lib/current-privacy-content";
import { getDePrivacyContent } from "../lib/de-legal-content";

type PrivacyContent = NonNullable<
  (typeof CURRENT_PRIVACY_CONTENT)[keyof typeof CURRENT_PRIVACY_CONTENT]
>;

const EXPECTED_PII_EXCLUSIONS = [
  /name|név|Namen/i,
  /email|e-mail|E-Mail/i,
  /phone|telefon|Telefon/i,
  /company|cégnév|Unternehmensnamen/i,
  /message|üzenet|Nachrichtentexte/i,
  /free-text|szabad szöveges|frei eingegebenen/i,
] as const;

test("HU privacy v1.3 names Google Analytics 4 as a processor and transfer scenario", () => {
  const privacy = CURRENT_PRIVACY_CONTENT.hu;
  assert.ok(privacy);

  assert.equal(privacy.lastUpdated, "Hatályos: 2026. június 13.");
  assert.equal(
    privacy.version,
    "1.3 verzió - Google Analytics adatfeldolgozói pontosítás",
  );

  assertSectionContainsGa4Processor(privacy, "processors", [
    /Google Ireland Limited \/ Google LLC/,
    /Google Analytics 4 \(GA4\)/,
    /hozzájáruláson alapuló, összesített elemzése/,
    /online azonosítók/i,
    /GDPR 6\. cikk \(1\) a\)/,
  ]);
  assertSectionContains(privacy, "third-country-transfers", [
    /Google Analytics használata során/,
    /Data Privacy Framework/,
    /általános szerződési feltételek \(SCC\)/,
  ]);
  assertCookiesRemainPrivacyFirst(privacy);
});

test("EN privacy v1.3 names Google Analytics 4 as a processor and transfer scenario", () => {
  const privacy = CURRENT_PRIVACY_CONTENT.en;
  assert.ok(privacy);

  assert.equal(privacy.lastUpdated, "Effective: 13 June 2026");
  assert.equal(
    privacy.version,
    "Version 1.3 - Google Analytics processor clarification",
  );

  assertSectionContainsGa4Processor(privacy, "processors", [
    /Google Ireland Limited \/ Google LLC/,
    /Google Analytics 4 \(GA4\)/,
    /consent-based aggregated analysis/i,
    /online identifiers/i,
    /GDPR Article 6\(1\)\(a\)/,
  ]);
  assertSectionContains(privacy, "third-country-transfers", [
    /When Google Analytics is used/,
    /Data Privacy Framework/,
    /Standard Contractual Clauses/,
  ]);
  assertCookiesRemainPrivacyFirst(privacy);
});

test("DE privacy v1.3 names Google Analytics 4 as a processor and transfer scenario", () => {
  const privacy = getDePrivacyContent();

  assert.equal(privacy.lastUpdated, "Gültig ab: 13. Juni 2026");
  assert.equal(
    privacy.version,
    "Version 1.3 — Klarstellung zu Google Analytics als Auftragsverarbeiter",
  );

  assertSectionContainsGa4Processor(privacy, "processors", [
    /Google Ireland Limited \/ Google LLC/,
    /Google Analytics 4 \(GA4\)/,
    /einwilligungsbasierte, aggregierte Analyse/i,
    /Online-Kennungen/,
    /Art\. 6 Abs\. 1 lit\. a DSGVO/,
  ]);
  assertSectionContains(privacy, "third-country", [
    /Bei der Nutzung von Google Analytics/,
    /Data Privacy Framework/,
    /Standardvertragsklauseln/,
  ]);
  assertCookiesRemainPrivacyFirst(privacy);
});

function assertSectionContainsGa4Processor(
  privacy: PrivacyContent,
  sectionId: string,
  patterns: readonly RegExp[],
) {
  const section = assertSectionContains(privacy, sectionId, patterns);
  for (const pattern of EXPECTED_PII_EXCLUSIONS) {
    assert.match(section.body, pattern);
  }
}

function assertSectionContains(
  privacy: PrivacyContent,
  sectionId: string,
  patterns: readonly RegExp[],
) {
  const section = privacy.sections.find((item) => item.id === sectionId);
  assert.ok(section, `Missing ${sectionId} section`);
  for (const pattern of patterns) {
    assert.match(section.body, pattern);
  }
  return section;
}

function assertCookiesRemainPrivacyFirst(privacy: PrivacyContent) {
  const cookies = privacy.sections.find((item) => item.id === "cookies");
  assert.ok(cookies, "Missing cookies section");

  assert.match(cookies.body, /Google Analytics 4 \(GA4\)/);
  assert.match(cookies.body, /Google Tag Manager/i);
  assert.match(cookies.body, /LinkedIn Insight Tag/i);
  assert.match(cookies.body, /marketing/i);
  assert.doesNotMatch(cookies.body, /Google Ads|remarketing|DoubleClick|Floodlight/i);
}
