import assert from "node:assert/strict";
import test from "node:test";
import { getTranslation, LOCALES } from "../lib/i18n";
import { getContactPrivacyHref, getFooterLegalLinks, getServiceCardDetailLabel } from "../lib/locale-ui-helpers";
import { META_DESCRIPTIONS, OG_LOCALE_MAP } from "../lib/seo-data";
import { getReadyServiceDetailHref } from "../lib/service-detail-links";
import { ContactPayloadSchema } from "../lib/contact-schema";
import { localizeHomepageService, localizeCareerField, localizeCertificationText } from "../lib/homepage-content";
import { getAnalyticsConsentCopy } from "../lib/analytics/consent-copy";
import { getLocaleAccessibility } from "../lib/locale-accessibility";
import { getUtilityLocaleHref } from "../lib/locale-navigation";
import { fr } from "../lib/i18n/fr";
import { ko } from "../lib/i18n/ko";
import { renderReplyEmail } from "../lib/email-templates/reply";
import { getNotFoundCopy } from "../lib/not-found-copy";
import { readFileSync } from "node:fs";

test("French homepage is registered with French copy and metadata", () => {
  assert.ok((LOCALES as readonly string[]).includes("fr"));
  const t = getTranslation("fr");
  assert.equal(t.nav.home, "Accueil");
  assert.equal(t.form.errors.emailRequired, "Veuillez saisir votre adresse e-mail.");
  assert.equal(t.services.length, 8);
  assert.equal((OG_LOCALE_MAP as Record<string, string>).fr, "fr_FR");
  assert.match((META_DESCRIPTIONS as Record<string, string>).fr, /Hongrie/);
});

test("French contact requests pass the same server-side validation as other locales", () => {
  assert.equal(ContactPayloadSchema.safeParse({ name: "Marie Test", email: "marie@example.com", locale: "fr", _website: "" }).success, true);
});

test("French legal links identify their English destination and do not expose French service details", () => {
  const t = getTranslation("fr");
  assert.equal(getContactPrivacyHref("fr"), "/en/adatvedelem");
  for (const link of getFooterLegalLinks("fr", t.footer)) {
    assert.match(link.href, /^\/en\//);
    assert.match(link.label, /anglais/);
  }
  assert.equal(getReadyServiceDetailHref({ locale: "fr", slug: "objektumorzes", readyServiceDetailPaths: [{ locale: "en", slug: "objektumorzes" }] }), null);
});

test("Chinese and Korean detail labels and English legal links use the current UI language", () => {
  assert.equal(getServiceCardDetailLabel("zh"), "详情");
  assert.equal(getServiceCardDetailLabel("ko"), "자세히 보기");
  assert.match(getFooterLegalLinks("zh", getTranslation("zh").footer)[0].label, /英文/);
});

test("source overlays translate real services and never leak unknown Hungarian records", () => {
  const untranslated = { name: "Magyar szolgáltatás", shortDesc: "Magyar leírás" };
  for (const locale of ["fr", "ko"]) {
    for (const slug of ["objektumorzes", "portaszolgalat", "biztonsagtechnika", "tavfelugyelet-vonuloszolgalat", "mystery-shopping-helyszini-audit", "rendezvenybiztositas", "hard-fm", "soft-fm"]) {
      const result = localizeHomepageService(locale, slug, untranslated);
      assert.ok(result.name.length && result.shortDesc.length);
      assert.notEqual(result.name, untranslated.name);
    }
    assert.deepEqual(localizeHomepageService(locale, "unknown", untranslated), { name: "", shortDesc: "" });
  }
  assert.equal(localizeHomepageService("en", "unknown", { name: null, shortDesc: null }).name, "");
  assert.equal(localizeHomepageService("de", "objektumorzes", { name: null, shortDesc: null }).name, "Objektschutz vor Ort");
});

test("French and Korean career overlays cover known positions and omit unknown text", () => {
  for (const [locale, translation] of [["fr", fr], ["ko", ko]] as const) {
    for (const title of ["Security Guard", "Cleaning Team Leader", "Facility Management Engineer", "Reception Manager"]) {
      const result = localizeCareerField(locale, title, translation.careerFallbacks.titles);
      assert.ok(result);
      assert.notEqual(result, title);
    }
    assert.equal(localizeCareerField(locale, "Untranslated new job", translation.careerFallbacks.titles), null);
    assert.equal(localizeCertificationText(locale, "English scope text"), null);
  }
});

for (const [locale, translation, nationwide, budapest] of [
  ["fr", fr, "Budapest / dans toute la Hongrie", "Budapest"],
  ["ko", ko, "부다페스트 / 헝가리 전역", "부다페스트"],
] as const) {
  test(`${locale} career locations preserve nationwide meaning for current and legacy CMS keys`, () => {
    const locations = translation.careerFallbacks.locations;
    assert.equal(localizeCareerField(locale, "Budapest / nationwide", locations), nationwide);
    assert.equal(localizeCareerField(locale, "Budapest, regional", locations), nationwide);
    assert.equal(localizeCareerField(locale, "Budapest", locations), budapest);
    assert.equal(localizeCareerField(locale, "Untranslated new location", locations), null);
  });
}

test("consent and accessibility controls are localized in every supported language", () => {
  assert.equal(getAnalyticsConsentCopy("fr").reject, "Refuser");
  assert.equal(getAnalyticsConsentCopy("zh").settings, "Cookie 设置");
  assert.equal(getAnalyticsConsentCopy("ko").accept, "분석 동의");
  for (const locale of ["de", "zh", "ko", "fr"]) {
    assert.notEqual(getLocaleAccessibility(locale).skip, "Skip to content");
    assert.notEqual(getLocaleAccessibility(locale).menu, "Toggle menu");
  }
});

test("responsible disclosure language switching maps the translated slug and avoids closed locales", () => {
  assert.equal(getUtilityLocaleHref("/hu/felelos-hibabejelentes", "en"), "/en/responsible-disclosure");
  assert.equal(getUtilityLocaleHref("/en/responsible-disclosure", "hu", "#scope"), "/hu/felelos-hibabejelentes#scope");
  assert.equal(getUtilityLocaleHref("/en/responsible-disclosure", "fr"), "/fr");
  assert.equal(getUtilityLocaleHref("/hu/palyazoi-adatkezeles", "en"), "/en/recruitment-privacy");
  assert.equal(getUtilityLocaleHref("/fr", "hu"), null);
});

test("reply email chrome supports French and Korean without translating the human reply", () => {
  for (const [locale, greeting] of [["fr", "Bonjour"], ["ko", "안녕하세요"]]) {
    const reply = renderReplyEmail({ locale, recipientName: "Test", body: "Human-composed reply", originalMessage: "Original user message", originalCreatedAt: new Date("2026-10-17T10:00:00Z"), subject: "Reply" });
    assert.match(reply.html, new RegExp(`lang="${locale}"`));
    assert.ok(reply.text.includes(greeting));
    assert.ok(reply.text.includes("Human-composed reply"));
    assert.ok(reply.text.includes("Original user message"));
    assert.ok(!reply.text.includes("Tisztelt"));
  }
});

test("verified ISO certification prose has source translations while unknown certificates stay omitted", () => {
  assert.equal(localizeCertificationText("fr", "Comprehensive security services", "iso-9001", "scope"), "Services de sécurité complets");
  assert.equal(localizeCertificationText("ko", "Comprehensive security services", "iso-27001", "scope"), "종합 보안 서비스");
  assert.equal(localizeCertificationText("fr", "Unknown source", "unknown", "description"), null);
  for (const locale of ["fr", "ko"]) {
    for (const slug of ["iso-9001", "iso-27001"]) {
      const description = localizeCertificationText(locale, "Published source", slug, "description");
      assert.ok(description);
      assert.doesNotMatch(description, /MartonCert|MCert|MARTON|Rendszertanúsító/);
    }
  }
});

test("404 recovery includes every registered locale and provides translated page copy", () => {
  for (const file of ["app/not-found.tsx", "app/[locale]/not-found.tsx"]) {
    assert.match(readFileSync(file, "utf8"), /LOCALES\.map/);
  }
  assert.equal(getNotFoundCopy("fr").title, "Page introuvable");
  assert.equal(getNotFoundCopy("ko").home, "홈으로 돌아가기");
  assert.match(getNotFoundCopy("zh").privacy, /英文/);
});
