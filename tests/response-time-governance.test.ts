import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { SERVICE_QUOTE_COPY } from "../components/ServiceQuoteCta";
import { hu } from "../lib/i18n/hu";
import { en } from "../lib/i18n/en";
import { de } from "../lib/i18n/de";
import { zh } from "../lib/i18n/zh";
import { ko } from "../lib/i18n/ko";
import { DE_REVIEW_SERVICE_QUOTE_COPY } from "../lib/services/de-service-shared-copy";

const APPROVED = {
  huContact:
    "Munkaidőben többnyire még aznap visszajelzünk, de legkésőbb a következő munkanapon felvesszük Önnel a kapcsolatot. Az ajánlat elkészítésének ideje az igény összetettségétől függ.",
  enContact:
    "Within business hours we usually reply the same day, and in any case we'll be in touch by the next business day. The time needed to prepare a quote depends on the scope and complexity of your request.",
  deContact:
    "Innerhalb der Geschäftszeiten antworten wir in der Regel noch am selben Tag, spätestens jedoch am nächsten Werktag melden wir uns bei Ihnen. Wie lange die Angebotserstellung dauert, hängt vom Umfang und der Komplexität der Anfrage ab.",
  huTerms:
    "A Szolgáltató a beérkezett megkeresést áttekinti, és legkésőbb a következő munkanapon a megadott elérhetőségek valamelyikén kapcsolatba lép a megkeresővel. Az ajánlat elkészítésének időigénye az igény összetettségétől és a szükséges egyeztetésektől függ.",
  enTerms:
    "The Provider reviews each incoming request and makes contact by the next business day via one of the contact details provided. The time required to prepare a quote depends on the scope and complexity of the request and on any clarification needed.",
  deTerms:
    "Der Dienstleister prüft jede eingegangene Anfrage und nimmt spätestens am nächsten Werktag über eine der angegebenen Kontaktmöglichkeiten Kontakt auf. Die Dauer der Angebotserstellung richtet sich nach dem Umfang und der Komplexität der Anfrage sowie nach dem erforderlichen Abstimmungsbedarf.",
  huService:
    "A megkeresést átnézzük, és legkésőbb a következő munkanapon jelentkezünk a megadott elérhetőségen. Az ajánlat előkészítésének ideje a helyszíntől és az igény összetettségétől függ.",
  enService:
    "We go over your enquiry and get in touch by the next business day using the details you provided. The time needed to prepare a quote depends on the site and the complexity of the request.",
  deService:
    "Wir sehen die Anfrage durch und melden uns spätestens am nächsten Werktag über die angegebenen Kontaktdaten. Wie lange die Angebotserstellung dauert, hängt vom Standort und der Komplexität der Anfrage ab.",
} as const;

const OLD_RESPONSE_TIME_CLAIM =
  /2\s*munkanap|2 business days|2 working days|2-working-day|2 Werktagen|2 Arbeitstagen|2\s*个工作日|2 영업일|within 24 hours|24 órán|guaranteed quote|guaranteed response|quote by the next business day|service start by the next business day/i;

const ROOT = process.cwd();

test("contact helpers use the approved next-business-day contact wording", () => {
  assert.equal(hu.form.nextStepHelper, APPROVED.huContact);
  assert.equal(en.form.nextStepHelper, APPROVED.enContact);
  assert.equal(de.form.nextStepHelper, APPROVED.deContact);
  assert.equal(SERVICE_QUOTE_COPY.hu.nextStepHelper, APPROVED.huContact);
  assert.equal(SERVICE_QUOTE_COPY.en.nextStepHelper, APPROVED.enContact);
  assert.equal(SERVICE_QUOTE_COPY.de.nextStepHelper, APPROVED.deContact);
  assert.equal(DE_REVIEW_SERVICE_QUOTE_COPY.nextStepHelper, APPROVED.deContact);
});

test("contact helper and success copy do not contain legacy fixed response promises", () => {
  for (const [locale, copy] of Object.entries({ hu, en, de, zh, ko })) {
    assert.equal(
      OLD_RESPONSE_TIME_CLAIM.test(copy.form.nextStepHelper),
      false,
      `${locale} helper must not contain legacy response-time wording`,
    );
    assert.equal(
      OLD_RESPONSE_TIME_CLAIM.test(copy.form.success),
      false,
      `${locale} success must not contain legacy response-time wording`,
    );
  }

  for (const [locale, copy] of Object.entries(SERVICE_QUOTE_COPY)) {
    assert.equal(
      OLD_RESPONSE_TIME_CLAIM.test(copy.nextStepHelper),
      false,
      `${locale} service quote helper must not contain legacy response-time wording`,
    );
    assert.equal(
      OLD_RESPONSE_TIME_CLAIM.test(copy.success),
      false,
      `${locale} service quote success must not contain legacy response-time wording`,
    );
  }
});

test("terms contact-form sections use the approved scoped wording", () => {
  const huTerms = findLegalSection(hu.legal.terms.sections, "contact-form");
  const enTerms = findLegalSection(en.legal.terms.sections, "contact-form");
  const deTerms = findLegalSection(de.legal.terms.sections, "contact-form");

  assert.ok(huTerms.includes(APPROVED.huTerms));
  assert.ok(enTerms.includes(APPROVED.enTerms));
  assert.ok(deTerms.includes(APPROVED.deTerms));
  assert.equal(OLD_RESPONSE_TIME_CLAIM.test(huTerms), false);
  assert.equal(OLD_RESPONSE_TIME_CLAIM.test(enTerms), false);
  assert.equal(OLD_RESPONSE_TIME_CLAIM.test(deTerms), false);
});

test("object guarding and reception service process sources use approved wording", () => {
  const objectGuardingSeed = readSource("scripts/seed-pilot-objektumorzes.ts");
  const receptionSeed = readSource("scripts/seed-pilot-portaszolgalat.ts");
  const deServiceDetails = readSource("lib/services/de-service-details.ts");
  const enMatrix = readSource("docs/translations/public_site_translation_matrix_en.csv");
  const dbSyncScript = readSource("scripts/update-response-time-contact-copy.ts");

  for (const source of [objectGuardingSeed, receptionSeed]) {
    assertApprovedHuServiceSource(source);
    assert.equal(OLD_RESPONSE_TIME_CLAIM.test(source), false);
  }

  assert.match(deServiceDetails, new RegExp(escapeRegExp(APPROVED.deService)));
  assert.equal(/2 Arbeitstagen/i.test(deServiceDetails), false);
  assert.match(enMatrix, new RegExp(escapeRegExp(APPROVED.enService)));
  assert.equal(/2 working days/i.test(enMatrix), false);
  assert.match(dbSyncScript, new RegExp(escapeRegExp(APPROVED.huService)));
  assert.match(dbSyncScript, new RegExp(escapeRegExp(APPROVED.enService)));
  assert.match(dbSyncScript, /processStepsHu/);
  assert.match(dbSyncScript, /processStepsEn/);
});

test("public AI grounding and governance docs use the narrowed response-time claim", () => {
  const llmsFull = readSource("public/llms-full.txt");
  const verifiedClaims = readSource("docs/verified_claims.md");
  const copyStrategy = readSource("docs/copy_strategy.md");

  assert.equal(/2-working-day response wording/i.test(llmsFull), false);
  assert.match(llmsFull, /next-business-day contact follow-up/i);

  assert.match(verifiedClaims, /response_time_contact_follow_up/);
  assert.match(verifiedClaims, /Avoid:[^\n]*2 munkanapon belüli visszajelzés/i);

  assert.match(copyStrategy, /next-business-day contact follow-up/i);
  assert.match(copyStrategy, /2-business-day legacy response wording is deprecated/i);
  assert.match(copyStrategy, /Do not\s+reintroduce "2 munkanap \/ 2 business days/i);
});

test("copy guard blocks legacy response-time wording but allows approved wording", async () => {
  const { findCopyGuardFindings } = await import("../scripts/qa-copy-guard.mjs");

  const blockedSamples = [
    "We respond within 2 business days.",
    "Visszajelzés 2 munkanapon belül.",
    "Wir melden uns innerhalb von 2 Werktagen.",
    "We provide a guaranteed quote by the next business day.",
    "We answer within 24 hours.",
  ];

  for (const sample of blockedSamples) {
    const findings = findCopyGuardFindings("components/Example.tsx", sample);
    assert.ok(findings.length > 0, `copy guard must block: ${sample}`);
  }

  assert.deepEqual(
    findCopyGuardFindings("components/Example.tsx", APPROVED.enContact),
    [],
  );
});

function findLegalSection(
  sections: readonly { readonly id: string; readonly body: string }[],
  id: string,
): string {
  const section = sections.find((item) => item.id === id);
  assert.ok(section, `${id} section must exist`);
  return section.body;
}

function readSource(relativePath: string): string {
  return readFileSync(path.join(ROOT, relativePath), "utf8");
}

function assertApprovedHuServiceSource(source: string): void {
  for (const fragment of [
    "A megkeresést átnézzük",
    "legkésőbb a következő munkanapon",
    "jelentkezünk a megadott elérhetőségen",
    "Az ajánlat előkészítésének",
    "ideje a helyszíntől",
    "helyszíntől és az igény összetettségétől függ",
  ]) {
    assert.match(source, new RegExp(escapeRegExp(fragment)));
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
