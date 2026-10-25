import assert from "node:assert/strict";
import test, { afterEach } from "node:test";
import { getTranslation } from "../lib/i18n";
import { getPrivacyContent } from "../lib/legal-content";
import { CURRENT_PRIVACY_CONTENT } from "../lib/current-privacy-content";
import { getDePrivacyContent } from "../lib/de-legal-content";
import { readAnalyticsConsent } from "../lib/analytics/consent";

const originalFlag = process.env.NEXT_PUBLIC_AHREFS_ENABLED;
const originalWindow = globalThis.window;
afterEach(() => {
  if (originalFlag === undefined) delete process.env.NEXT_PUBLIC_AHREFS_ENABLED;
  else process.env.NEXT_PUBLIC_AHREFS_ENABLED = originalFlag;
  Object.defineProperty(globalThis, "window", { configurable: true, value: originalWindow });
});

function storedConsent(values: Record<string, string>) {
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage: { getItem: (key: string) => values[key] ?? null } },
  });
}

test("Ahrefs activation cannot reuse GA4-only acceptance but preserves legacy rejection", () => {
  process.env.NEXT_PUBLIC_AHREFS_ENABLED = "1";
  storedConsent({ avenir_analytics_consent: "accepted" });
  assert.equal(readAnalyticsConsent(), null);
  storedConsent({ avenir_analytics_consent: "rejected" });
  assert.equal(readAnalyticsConsent(), "rejected");
  storedConsent({ avenir_analytics_consent_v2: "accepted" });
  assert.equal(readAnalyticsConsent(), "accepted");
});

test("inactive Ahrefs leaves existing GA4 consent valid", () => {
  delete process.env.NEXT_PUBLIC_AHREFS_ENABLED;
  storedConsent({ avenir_analytics_consent: "accepted" });
  assert.equal(readAnalyticsConsent(), "accepted");
});

test("enabled privacy notices identify consent-gated Ahrefs without the inactive assertion", () => {
  process.env.NEXT_PUBLIC_AHREFS_ENABLED = "1";
  for (const locale of ["hu", "en", "de"] as const) {
    const content = getPrivacyContent(locale, getTranslation(locale));
    const cookies = content.sections.find((section) => section.id === "cookies")!.body;
    assert.match(cookies, /Ahrefs/);
    assert.doesNotMatch(cookies, /jelenleg inaktív|currently inactive|derzeit jedoch inaktiv/);
    assert.match(cookies, /GA4/);
  }
});

test("published HU EN DE notices identify Ahrefs as inactive and preserve unrelated legal text", () => {
  delete process.env.NEXT_PUBLIC_AHREFS_ENABLED;
  for (const locale of ["hu", "en", "de"] as const) {
    const before = locale === "de" ? getDePrivacyContent() : CURRENT_PRIVACY_CONTENT[locale]!;
    const after = getPrivacyContent(locale, getTranslation(locale));
    assert.match(after.version ?? "", /1\.4/);
    assert.match(after.lastUpdated, /25|25\./);
    assert.equal(after.sections.length, before.sections.length);
    for (const sectionId of ["processors", "cookies", locale === "de" ? "third-country" : "third-country-transfers"]) {
      const body = after.sections.find((section) => section.id === sectionId)?.body ?? "";
      assert.match(body, /Ahrefs/);
    }
    const processors = after.sections.find((section) => section.id === "processors")!.body;
    assert.match(processors, /Ahrefs Pte\. Ltd\./);
    assert.match(processors, /201227417H/);
    assert.match(processors, /Singapore 048581/);
    const cookies = after.sections.find((section) => section.id === "cookies")!.body;
    assert.match(cookies, /inaktív|inactive|inaktiv/);
    assert.match(cookies, /SCC/);
    assert.doesNotMatch(cookies, /GDPR.compliant|garantált|garantiert/);
    for (const section of before.sections) {
      if (["processors", "cookies", "third-country", "third-country-transfers", "rights", "data-subject-rights"].includes(section.id)) continue;
      assert.deepEqual(after.sections.find((item) => item.id === section.id), section);
    }
  }
});
