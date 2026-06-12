import assert from "node:assert/strict";
import test from "node:test";
import { RECRUITMENT_PRIVACY_CONTENT } from "../lib/recruitment-privacy-content";
import {
  RECRUITMENT_PRIVACY_LOCALES,
  RECRUITMENT_PRIVACY_SLUGS,
  buildRecruitmentPrivacyMetadata,
  recruitmentPrivacyAlternateLanguages,
  recruitmentPrivacyPath,
  recruitmentPrivacyUrl,
} from "../lib/recruitment-privacy-routes";
import { getCareerPrivacyNotice } from "../lib/locale-ui-helpers";

test("recruitment privacy routes use the PL-091 Option B locale-specific slug pair", () => {
  assert.deepEqual([...RECRUITMENT_PRIVACY_LOCALES], ["hu", "en"]);
  assert.equal(RECRUITMENT_PRIVACY_SLUGS.hu, "palyazoi-adatkezeles");
  assert.equal(RECRUITMENT_PRIVACY_SLUGS.en, "recruitment-privacy");
  assert.equal(recruitmentPrivacyPath("hu"), "/hu/palyazoi-adatkezeles");
  assert.equal(recruitmentPrivacyPath("en"), "/en/recruitment-privacy");

  const alternates = recruitmentPrivacyAlternateLanguages();
  assert.equal(alternates.hu, recruitmentPrivacyUrl("hu"));
  assert.equal(alternates.en, recruitmentPrivacyUrl("en"));
  assert.equal(alternates["x-default"], recruitmentPrivacyUrl("hu"));
});

test("recruitment privacy content carries the v3 decisions with no leftover review brackets", () => {
  for (const locale of ["hu", "en"] as const) {
    const content = RECRUITMENT_PRIVACY_CONTENT[locale];
    const fullText = [
      content.title,
      content.intro,
      ...content.sections.map((s) => `${s.title}\n${s.body}`),
      content.versionHistory,
    ].join("\n");

    assert.equal(content.sections.length, 12, `${locale} must have 12 sections`);
    // no unresolved draft placeholders may reach the public page
    assert.equal(
      fullText.includes("[DPO/legal review"),
      false,
      `${locale} must not contain draft review brackets`,
    );
    // no response-time promise in legal copy either
    assert.equal(/2\s*munkanap|2 business days/i.test(fullText), false);
    // v3 decisions present: consent-based 1-year talent pool + MS365 processor
    assert.ok(/Microsoft 365/.test(fullText), `${locale} names the processor`);
    assert.ok(/1\s*(év|year)/.test(fullText), `${locale} states the 1-year consent retention`);
    // fixed legal anchors from the existing privacy style
    assert.ok(fullText.includes("dpo@afm.hu"));
    assert.ok(fullText.includes("NAIH"));
    assert.ok(fullText.includes("Csegény") || fullText.includes("Fanni Csegény"));
  }

  // HU and EN section structure stays in sync (same ids, same order)
  assert.deepEqual(
    RECRUITMENT_PRIVACY_CONTENT.hu.sections.map((s) => s.id),
    RECRUITMENT_PRIVACY_CONTENT.en.sections.map((s) => s.id),
  );
});

test("recruitment privacy metadata is canonical, indexable and cross-linked", () => {
  for (const locale of ["hu", "en"] as const) {
    const metadata = buildRecruitmentPrivacyMetadata(locale);

    assert.equal(metadata.alternates?.canonical, recruitmentPrivacyUrl(locale));
    assert.deepEqual(metadata.alternates?.languages, {
      hu: "https://www.afm.hu/hu/palyazoi-adatkezeles",
      en: "https://www.afm.hu/en/recruitment-privacy",
      "x-default": "https://www.afm.hu/hu/palyazoi-adatkezeles",
    });
    assert.deepEqual(metadata.robots, { index: true, follow: true });
  }
});

test("career privacy microcopy links the right notice per locale and is omitted for zh/ko", () => {
  const hu = getCareerPrivacyNotice("hu");
  assert.ok(hu);
  assert.equal(hu.href, "/hu/palyazoi-adatkezeles");
  assert.ok(hu.linkLabel.includes("pályázói adatkezelési tájékoztató"));

  const en = getCareerPrivacyNotice("en");
  assert.ok(en);
  assert.equal(en.href, "/en/recruitment-privacy");
  assert.equal(en.linkLabel, "recruitment privacy notice");

  // DE shows the approved German sentence but links the EN page (no
  // reviewed DE notice exists)
  const de = getCareerPrivacyNotice("de");
  assert.ok(de);
  assert.equal(de.href, "/en/recruitment-privacy");
  assert.equal(de.linkLabel, "Datenschutzhinweise für Bewerbungen");

  assert.equal(getCareerPrivacyNotice("zh"), null);
  assert.equal(getCareerPrivacyNotice("ko"), null);
});
