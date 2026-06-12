import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { References } from "../components/References";
import {
  APPROVED_HOMEPAGE_REFERENCES,
  getApprovedHomepageReferences,
  getReferenceSectionCopy,
  getReferenceServiceChips,
  shouldRenderHomepageReferences,
} from "../lib/references";
import { hu } from "../lib/i18n/hu";

test("AutoWallis Pest is the only approved source reference and uses the supplied asset", () => {
  assert.equal(APPROVED_HOMEPAGE_REFERENCES.length, 1);
  const [reference] = APPROVED_HOMEPAGE_REFERENCES;

  assert.equal(reference.key, "autowallis-pest");
  assert.equal(reference.displayName, "AutoWallis Pest");
  assert.equal(reference.legalEntity, "Wallis Motor Pest Kft.");
  assert.equal(reference.logoPath, "/references/autowallis-pest.png");
  assert.equal(reference.approved, true);
  assert.equal(reference.usageApproved, true);
  assert.deepEqual(reference.services, ["objektumorzes", "portaszolgalat"]);

  assert.equal(
    existsSync(path.join(process.cwd(), "public", "references", "autowallis-pest.png")),
    true,
  );
});

test("reference section renders only for HU/EN/DE and stays hidden for partial locales", () => {
  assert.equal(shouldRenderHomepageReferences("hu"), true);
  assert.equal(shouldRenderHomepageReferences("en"), true);
  assert.equal(shouldRenderHomepageReferences("de"), true);
  assert.equal(shouldRenderHomepageReferences("zh"), false);
  assert.equal(shouldRenderHomepageReferences("ko"), false);

  assert.equal(getApprovedHomepageReferences("hu").length, 1);
  assert.equal(getApprovedHomepageReferences("zh").length, 0);
});

test("reference service chips are locale-specific and limited to the approved services", () => {
  assert.deepEqual(getReferenceServiceChips("hu", ["objektumorzes", "portaszolgalat"]), [
    "Objektumőrzés",
    "Recepciós és portaszolgálat",
  ]);
  assert.deepEqual(getReferenceServiceChips("en", ["objektumorzes", "portaszolgalat"]), [
    "On-site Security Guarding",
    "Reception and Gatehouse Services",
  ]);
  assert.deepEqual(getReferenceServiceChips("de", ["objektumorzes", "portaszolgalat"]), [
    "Objektschutz vor Ort",
    "Empfangs- und Pförtnerdienst",
  ]);
});

test("reference section copy uses approved neutral wording", () => {
  assert.deepEqual(getReferenceSectionCopy("hu"), {
    title: "Referenciák",
    intro: "Jóváhagyott ügyfélmegjelenések.",
  });
  assert.deepEqual(getReferenceSectionCopy("en"), {
    title: "References",
    intro: "Approved client references.",
  });
  assert.deepEqual(getReferenceSectionCopy("de"), {
    title: "Referenzen",
    intro: "Freigegebene Kundenreferenzen.",
  });
});

test("References renders the AutoWallis card without testimonial or outcome claims", async () => {
  const html = renderToStaticMarkup(await References({ t: hu, locale: "hu" }));

  assert.ok(html.includes("Referenciák"));
  assert.ok(html.includes("Jóváhagyott ügyfélmegjelenések."));
  assert.ok(html.includes("/references/autowallis-pest.png"));
  assert.ok(html.includes("AutoWallis Pest logó"));
  assert.ok(html.includes("AutoWallis Pest"));
  assert.ok(html.includes("Wallis Motor Pest Kft."));
  assert.ok(html.includes("Objektumőrzés"));
  assert.ok(html.includes("Recepciós és portaszolgálat"));

  for (const forbidden of [
    "testimonial",
    "case study",
    "trusted by",
    "official partner",
    "incident-free",
    "best-in-class",
    "recommends Avenir",
  ]) {
    assert.equal(html.toLowerCase().includes(forbidden), false);
  }
});

test("References renders locale service chips and hides partial locales", async () => {
  const enHtml = renderToStaticMarkup(await References({ t: hu, locale: "en" }));
  assert.ok(enHtml.includes("On-site Security Guarding"));
  assert.ok(enHtml.includes("Reception and Gatehouse Services"));
  assert.ok(enHtml.includes("AutoWallis Pest logo"));

  const deHtml = renderToStaticMarkup(await References({ t: hu, locale: "de" }));
  assert.ok(deHtml.includes("Objektschutz vor Ort"));
  assert.ok(deHtml.includes("Empfangs- und Pförtnerdienst"));
  assert.ok(deHtml.includes("Logo von AutoWallis Pest"));

  assert.equal(await References({ t: hu, locale: "zh" }), null);
  assert.equal(await References({ t: hu, locale: "ko" }), null);
});
