import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";
import { DE_REVIEW_SERVICE_SLUGS, getDeReviewServiceDetailBySlug } from "../lib/services/de-service-details";

test("French review source covers all eight existing service records with complete section parity", async () => {
  assert.ok(existsSync("lib/services/fr-service-details.ts"), "French review service source is missing");
  const fr = await import("../lib/services/fr-service-details");
  assert.deepEqual(fr.FR_REVIEW_SERVICE_SLUGS, DE_REVIEW_SERVICE_SLUGS);
  for (const slug of DE_REVIEW_SERVICE_SLUGS) {
    const source = getDeReviewServiceDetailBySlug(slug)!;
    const translated = fr.getFrReviewServiceDetailBySlug(slug)!;
    assert.ok(translated, slug);
    for (const field of ["name", "shortDesc", "longDesc", "seoTitle", "seoDescription", "valueProposition"] as const) {
      assert.ok(translated[field].trim(), `${slug}.${field}`);
      assert.notEqual(translated[field], source[field]);
    }
    for (const field of ["useCases", "includedItems", "processSteps", "trustItems", "faq", "highlights"] as const) {
      assert.equal(translated[field].length, source[field].length, `${slug}.${field} preserves source coverage`);
      for (let i = 0; i < translated[field].length; i++) {
        const value = translated[field][i];
        const original = source[field][i];
        if (typeof value === "string") {
          assert.notEqual(value, original, `${slug}.${field}.${i} is translated`);
        } else {
          for (const [key, text] of Object.entries(value)) {
            assert.ok(text.trim(), `${slug}.${field}.${i}.${key}`);
            assert.notEqual(text, (original as unknown as Record<string, string>)[key], `${slug}.${field}.${i}.${key} is translated`);
          }
        }
      }
    }
    assert.deepEqual(translated.relatedSlugs, source.relatedSlugs);
    assert.equal(translated.translationReviewRequired, true);
    assert.equal(translated.legalReviewRequired, source.legalReviewRequired);
  }
  assert.equal(fr.getFrReviewServiceDetailBySlug("invented-service"), null);
  assert.ok(fr.FR_REVIEW_SERVICE_PATHS.every((path) => path.locale === "fr"));
  assert.equal(fr.getFrReviewServiceDetailSharedCopy().serviceQuote.close, "Annuler");
  assert.ok(fr.getFrReviewRelatedServicesBySlugs(["objektumorzes", "unknown"]).every((row) => row.name === "Gardiennage sur site"));
});
