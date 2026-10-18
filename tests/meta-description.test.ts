import assert from "node:assert/strict";
import test from "node:test";
import { toMetaDescription } from "../lib/meta-description";
import { getTranslation } from "../lib/i18n";
import { getPrivacyContent, getTermsContent } from "../lib/legal-content";
import { RECRUITMENT_PRIVACY_CONTENT } from "../lib/recruitment-privacy-content";
import { getDeImpressumContent } from "../lib/de-legal-content";

test("short text is returned unchanged", () => {
  assert.equal(toMetaDescription("Rövid leírás."), "Rövid leírás.");
});

test("long text ends on a whole sentence when one fits", () => {
  const text =
    "This notice explains how Avenir Facility Management Kft. processes the personal data provided in job applications. Its purpose is to give applicants concise information.";
  assert.equal(
    toMetaDescription(text),
    "This notice explains how Avenir Facility Management Kft. processes the personal data provided in job applications.",
  );
});

test("company-form abbreviations are not treated as sentence ends", () => {
  const text = `Avenir Facility Management Kft. Registered office: ${"x".repeat(40)} ${"y".repeat(60)} ${"z".repeat(60)}`;
  const result = toMetaDescription(text);
  assert.notEqual(result, "Avenir Facility Management Kft.");
  assert.ok(result.endsWith("…"));
});

test("without a sentence end the text is cut on a word boundary with an ellipsis", () => {
  const words = Array.from({ length: 40 }, (_, i) => `szó${i}`).join(" ");
  const result = toMetaDescription(words);
  assert.ok(result.length <= 160);
  assert.ok(result.endsWith("…"));
  assert.ok(words.startsWith(result.slice(0, -1)), "no partial word before the ellipsis");
});

test("legal page descriptions never end mid-word and stay within 160 characters", () => {
  const sources: Array<[string, string]> = [];
  for (const locale of ["hu", "en", "de"]) {
    const t = getTranslation(locale as "hu");
    sources.push([`${locale} privacy`, getPrivacyContent(locale, t).intro]);
    sources.push([`${locale} terms`, getTermsContent(locale, t).intro]);
  }
  for (const [locale, content] of Object.entries(RECRUITMENT_PRIVACY_CONTENT)) {
    sources.push([`${locale} recruitment`, content.intro]);
  }
  sources.push(["de impressum", getDeImpressumContent().sections[0]?.body ?? ""]);

  for (const [label, text] of sources) {
    const result = toMetaDescription(text);
    assert.ok(result.length <= 160, `${label} is ${result.length} characters`);
    assert.equal(result.includes("\n"), false, `${label} contains a newline`);
    assert.match(result, /[.!?…]$/, `${label} must end on a sentence or an ellipsis: ${result}`);
    const body = result.replace(/…$/, "");
    const normalizedSource = text.split(/\n+/).map((line) => line.trim()).filter(Boolean).join("; ").replace(/\s+/g, " ");
    const next = normalizedSource.charAt(body.length);
    assert.ok(next === "" || /[\s;,.]/.test(next), `${label} cut mid-word: ${result}`);
  }
});
