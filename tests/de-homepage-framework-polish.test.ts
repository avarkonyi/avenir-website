import assert from "node:assert/strict";
import test from "node:test";
import { de } from "../lib/i18n/de";
import { en } from "../lib/i18n/en";
import { ko } from "../lib/i18n/ko";
import { zh } from "../lib/i18n/zh";
import {
  getContactPrivacyHref,
  getFooterLegalLinks,
  getServiceCardDetailLabel,
  getVisibleNavSectionKeys,
} from "../lib/locale-ui-helpers";
import { DE_REVIEW_SERVICE_QUOTE_COPY } from "../lib/services/de-service-shared-copy";

// Targeted string/route behaviour tests for the DE homepage/framework
// polish pass. Intentionally NOT a full-page snapshot — each assertion
// guards one concrete decision so the suite stays robust to layout edits.

test("DE value pillars use the operative triad, not generic adjectives", () => {
  assert.deepEqual(
    de.values.map((v) => v.t),
    [
      "Transparente Kontrolle",
      "Professionelle Präsenz",
      "Reaktion und Verantwortung",
    ],
  );
  for (const banned of ["Zuverlässigkeit", "Expertise", "Flexibilität"]) {
    assert.ok(
      !de.values.some((v) => v.t === banned),
      `pillar title should not be "${banned}"`,
    );
  }
  // No "tailored for every need" register (forbidden vague phrasing).
  const bodies = de.values.map((v) => v.d).join(" ");
  assert.ok(!bodies.includes("Maßgeschneiderte"));
  assert.ok(!bodies.includes("für jeden"));
});

test("DE framework uses 'Dienstleistungen' terminology consistently", () => {
  assert.equal(de.nav.services, "Dienstleistungen");
  assert.equal(de.servicesTitle, "Unsere Dienstleistungen");
  assert.equal(de.hero.cta1, "Unsere Dienstleistungen");
  assert.equal(de.form.service, "Gewünschte Dienstleistung");
});

test("DE hero eyebrow reflects security + FM, not the gated audit layer", () => {
  assert.ok(de.hero.tag.includes("FACILITY MANAGEMENT"));
  assert.ok(!de.hero.tag.includes("AUDIT"));
});

test("DE stat/trust labels are German and proof-safe", () => {
  assert.equal(de.stats[1]?.l, "Geschulte Mitarbeitende");
  assert.equal(de.stats[2]?.l, "Hohe Bonitätsbewertung (D&B)");
  assert.equal(de.stats[3]?.l, "Leitstellenbereitschaft");
  const labels: string[] = de.stats.map((s) => s.l);
  assert.ok(!labels.includes("D&B High Creditworthy 2026"));
  assert.ok(!labels.includes("Dispatcher-Bereitschaft"));
});

test("DE service card detail link label is 'Details'", () => {
  assert.equal(getServiceCardDetailLabel("de"), "Details");
  assert.notEqual(getServiceCardDetailLabel("de"), "Részletek");
});

test("EN service card detail link label is 'Details' while HU remains Hungarian", () => {
  assert.equal(getServiceCardDetailLabel("en"), "Details");
  assert.notEqual(getServiceCardDetailLabel("en"), "Részletek");
  assert.equal(getServiceCardDetailLabel("hu"), "Részletek");
});

test("ZH homepage pillars use the current operational triad", () => {
  assert.deepEqual(
    zh.values.map((v) => v.t),
    ["透明管控", "专业现场支持", "响应与责任"],
  );
  for (const banned of ["可靠性", "专业性", "灵活性"]) {
    assert.ok(!zh.values.some((v) => v.t === banned));
  }
});

test("ZH and KO D&B labels are localized and proof-safe", () => {
  assert.equal(zh.stats[2]?.l, "D&B 高信用评级");
  assert.equal(ko.stats[2]?.l, "D&B 높은 신용도 평가");
  const zhLabels: string[] = zh.stats.map((s) => s.l);
  const koLabels: string[] = ko.stats.map((s) => s.l);
  assert.ok(!zhLabels.includes("D&B High Creditworthy 2026"));
  assert.ok(!koLabels.includes("D&B High Creditworthy 2026"));
});

test("KO career fallback labels are localized instead of English DB labels", () => {
  assert.equal(ko.careerFallbacks?.titles["Security Guard"], "보안요원");
  assert.equal(ko.careerFallbacks?.titles["Cleaning Team Leader"], "청소팀 리더");
  assert.equal(ko.careerFallbacks?.types["Full-time"], "풀타임");
  assert.equal(ko.careerFallbacks?.locations["Budapest, regional"], "부다페스트 및 지역 현장");
});

test("HU, EN and DE nav include news while ZH/KO keep it closed", () => {
  assert.ok(getVisibleNavSectionKeys("de").includes("news"));
  assert.ok(getVisibleNavSectionKeys("en").includes("news"));
  assert.ok(getVisibleNavSectionKeys("hu").includes("news"));
  assert.ok(!getVisibleNavSectionKeys("zh").includes("news"));
  assert.ok(!getVisibleNavSectionKeys("ko").includes("news"));
});

test("DE footer legal links target review-mode DE routes with DE labels", () => {
  assert.deepEqual(getFooterLegalLinks("de", de.footer), [
    { href: "/de/adatvedelem", label: "Datenschutzerklärung" },
    { href: "/de/aszf", label: "Rechtliche Hinweise" },
    { href: "/de/impresszum", label: "Impressum" },
  ]);
  assert.equal(getContactPrivacyHref("de"), "/de/adatvedelem");
});

test("DE service quote CTA copy is German and uses 'Angebot anfordern'", () => {
  assert.equal(DE_REVIEW_SERVICE_QUOTE_COPY.button, "Angebot anfordern");
  assert.equal(DE_REVIEW_SERVICE_QUOTE_COPY.title, "Angebot anfordern");
  assert.notEqual(DE_REVIEW_SERVICE_QUOTE_COPY.button, "Angebot anfragen");
  assert.equal(DE_REVIEW_SERVICE_QUOTE_COPY.send, "Senden");
  assert.equal(DE_REVIEW_SERVICE_QUOTE_COPY.close, "Abbrechen");
  assert.equal(DE_REVIEW_SERVICE_QUOTE_COPY.company, "Unternehmen (optional)");
  assert.equal(DE_REVIEW_SERVICE_QUOTE_COPY.message, "Nachricht");
  assert.equal(
    DE_REVIEW_SERVICE_QUOTE_COPY.messagePlaceholder,
    "Beschreiben Sie kurz, wobei wir Sie unterstützen können.",
  );
});

test("DE polish does not alter EN/HU labels", () => {
  // EN credit-rating stat label is unchanged (proof we did not touch EN).
  assert.ok(en.stats.some((s) => s.l === "D&B High Creditworthy 2026"));
  // HU service card detail label unchanged.
  assert.equal(getServiceCardDetailLabel("hu"), "Részletek");
});
