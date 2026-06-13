import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  TRUST_CENTER_CONTENT,
  TRUST_CENTER_LOCALES,
  TRUST_CENTER_SLUGS,
  buildTrustCenterMetadata,
  getTrustCenterContent,
  trustCenterAlternateLanguages,
  trustCenterPath,
  trustCenterUrl,
} from "../lib/trust-center-content";

const FORBIDDEN_PUBLIC_COPY = [
  "D&B High Creditworthy 2026",
  "D&B magas hitelképességi minősítés",
  "Professional liability insurance",
  "Szakmai felelősségbiztosítás",
  "DPA",
  "SCC",
  "LIA",
  "signed consent",
  "aláírt referencia-hozzájárulás",
  "raw insurance policy",
  "official BMW partner",
  "incident-free",
  "testimonial",
  "case study",
];

function source(relativePath: string): string {
  const fullPath = path.join(process.cwd(), relativePath);
  assert.equal(existsSync(fullPath), true, `${relativePath} should exist`);
  return readFileSync(fullPath, "utf8");
}

test("Trust Center route model exposes only the HU/EN approved slug pair", () => {
  assert.deepEqual([...TRUST_CENTER_LOCALES], ["hu", "en"]);
  assert.deepEqual(TRUST_CENTER_SLUGS, {
    hu: "megfelelosegi-kozpont",
    en: "trust-center",
  });

  assert.equal(trustCenterPath("hu"), "/hu/megfelelosegi-kozpont");
  assert.equal(trustCenterPath("en"), "/en/trust-center");
  assert.equal(trustCenterUrl("hu"), "https://www.afm.hu/hu/megfelelosegi-kozpont");
  assert.equal(trustCenterUrl("en"), "https://www.afm.hu/en/trust-center");

  assert.deepEqual(trustCenterAlternateLanguages(), {
    hu: "https://www.afm.hu/hu/megfelelosegi-kozpont",
    en: "https://www.afm.hu/en/trust-center",
    "x-default": "https://www.afm.hu/hu/megfelelosegi-kozpont",
  });
});

test("Trust Center content includes only approved MVP sections and omits pending proof cards", () => {
  assert.equal(TRUST_CENTER_CONTENT.hu.title, "Megfelelőségi központ");
  assert.equal(TRUST_CENTER_CONTENT.en.title, "Trust Center");

  for (const locale of TRUST_CENTER_LOCALES) {
    const content = getTrustCenterContent(locale);
    const renderedText = [
      content.title,
      content.intro,
      content.supportNote,
      ...content.sections.flatMap((section) => [
        section.heading,
        section.body ?? "",
        ...(section.items?.flatMap((item) => [
          item.title,
          item.body ?? "",
          ...(item.meta ?? []),
          ...(item.links?.map((link) => `${link.label} ${link.href}`) ?? []),
        ]) ?? []),
        ...(section.links?.map((link) => `${link.label} ${link.href}`) ?? []),
      ]),
    ].join("\n");

    assert.ok(renderedText.includes(locale === "hu" ? "ISO 9001:2015" : "ISO 9001:2015"));
    assert.ok(renderedText.includes(locale === "hu" ? "ISO/IEC 27001:2022" : "ISO/IEC 27001:2022"));
    assert.ok(renderedText.includes("/certifications/iso-9001-marton-843579099.pdf"));
    assert.ok(renderedText.includes("/certifications/iso-27001-marton-988960032.pdf"));
    assert.ok(renderedText.includes(locale === "hu" ? "AutoWallis Pest" : "AutoWallis Pest"));
    assert.ok(renderedText.includes(locale === "hu" ? "Wallis Motor Pest Kft." : "Wallis Motor Pest Kft."));
    assert.ok(renderedText.includes(locale === "hu" ? "security.txt" : "security.txt"));

    for (const forbidden of FORBIDDEN_PUBLIC_COPY) {
      assert.equal(
        renderedText.includes(forbidden),
        false,
        `${locale} Trust Center must not expose forbidden or pending proof copy: ${forbidden}`,
      );
    }
  }
});

test("Trust Center route files guard wrong locale and slug variants", () => {
  const huRoute = source("app/[locale]/megfelelosegi-kozpont/page.tsx");
  const enRoute = source("app/[locale]/trust-center/page.tsx");

  assert.match(huRoute, /locale !== "hu"/);
  assert.match(enRoute, /locale !== "en"/);

  assert.equal(existsSync(path.join(process.cwd(), "app/[locale]/de/trust-center/page.tsx")), false);
  assert.equal(existsSync(path.join(process.cwd(), "app/[locale]/zh/trust-center/page.tsx")), false);
  assert.equal(existsSync(path.join(process.cwd(), "app/[locale]/ko/trust-center/page.tsx")), false);
});

test("Trust Center metadata is indexable and canonical for HU/EN only", () => {
  const hu = buildTrustCenterMetadata("hu");
  assert.equal(hu.title, "Megfelelőségi központ | Avenir Facility Management Kft.");
  assert.equal(hu.alternates?.canonical, trustCenterUrl("hu"));
  assert.deepEqual(hu.alternates?.languages, trustCenterAlternateLanguages());
  assert.deepEqual(hu.robots, { index: true, follow: true });

  const en = buildTrustCenterMetadata("en");
  assert.equal(en.title, "Trust Center | Avenir Facility Management Kft.");
  assert.equal(en.alternates?.canonical, trustCenterUrl("en"));
  assert.deepEqual(en.alternates?.languages, trustCenterAlternateLanguages());
  assert.deepEqual(en.robots, { index: true, follow: true });
});

test("Nav maps Trust Center language switcher to the approved HU/EN slug pair", () => {
  const nav = source("components/Nav.tsx");

  assert.match(nav, /TRUST_CENTER_SLUGS/);
  assert.match(nav, /isTrustCenterPage/);
  assert.match(nav, /TRUST_CENTER_SLUGS\[newLocale\]/);
  assert.match(nav, /isTrustCenterPage[\s\S]*\? FULL_CONTENT_LOCALES/);
});

test("Nav imports only Trust Center route helpers, not the full page copy", () => {
  const nav = source("components/Nav.tsx");

  assert.match(nav, /@\/lib\/trust-center-routes/);
  assert.doesNotMatch(nav, /@\/lib\/trust-center-content/);
});
