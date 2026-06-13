import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { TRUST_CENTER_CONTENT } from "../lib/trust-center-content";

function source(path: string): string {
  return readFileSync(path, "utf8");
}

test("Trust Center ISO cards use PDF-verified issuer and standard wording", () => {
  const rendered = JSON.stringify(TRUST_CENTER_CONTENT);

  assert.match(rendered, /MartonCert Rendszertanúsító Kft\./);
  assert.match(rendered, /MSZ EN ISO 9001:2015/);
  assert.match(rendered, /MCert Rendszertanúsító Kft\./);
  assert.match(rendered, /MSZ ISO\/IEC 27001:2023/);
  assert.doesNotMatch(rendered, /ISO\/IEC 27001:2022/);
  assert.doesNotMatch(rendered, /MARTON Szakértő Iroda Kft\./);
});

test("certification seed and guarded updater use PDF-verified values", () => {
  const seed = source("scripts/seed.ts");
  const updater = source("scripts/update-certifications-prod.ts");

  for (const text of [seed, updater]) {
    assert.match(text, /issuer:\s*"MartonCert Rendszertanúsító Kft\."/);
    assert.match(text, /issuer:\s*"MCert Rendszertanúsító Kft\."/);
    assert.match(text, /standardCode:\s*"MSZ EN ISO 9001:2015"/);
    assert.match(text, /standardCode:\s*"MSZ ISO\/IEC 27001:2023"/);
    assert.match(text, /certificateNumber:\s*"843579099"/);
    assert.match(text, /certificateNumber:\s*"988960032"/);
    assert.doesNotMatch(text, /standardCode:\s*"ISO\/IEC 27001:2022"/);
  }
});

test("public legal and AI-search sources no longer use the old ISO 27001 issuer or standard", () => {
  const publicSources = [
    "lib/i18n/hu.ts",
    "lib/i18n/en.ts",
    "lib/i18n/de.ts",
    "lib/i18n/zh.ts",
    "public/llms.txt",
    "public/llms-full.txt",
  ];

  for (const path of publicSources) {
    const text = source(path);
    assert.doesNotMatch(
      text,
      /ISO\/IEC 27001:2022|ISO 27001:2022/,
      `${path} must not use the old ISO 27001 standard wording`,
    );
    assert.doesNotMatch(
      text,
      /MARTON Szakértő Iroda Kft\./,
      `${path} must not use the old generic ISO issuer wording`,
    );
  }
});
