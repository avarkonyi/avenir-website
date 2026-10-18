import assert from "node:assert/strict";
import test from "node:test";
import { getRenderableServicePaths, getReviewServiceDetail, getReviewServiceSharedCopy } from "../lib/services/review-services";
import { DE_REVIEW_SERVICE_SLUGS, getDeReviewServiceDetailBySlug } from "../lib/services/de-service-details";

test("review translations follow the CMS publication gate", () => {
  const paths = getRenderableServicePaths([{ locale: "hu", slug: "objektumorzes" }]);
  assert.deepEqual(paths.map(p => p.locale).sort(), ["de", "fr", "hu", "ko", "zh"]);
  assert.equal(getRenderableServicePaths([]).length, 0);
  assert.equal(getRenderableServicePaths([{ locale: "zh", slug: "objektumorzes" }]).length, 0);
  assert.equal(paths.some(p => p.slug === "hard-fm"), false);
});

test("review service copy exists only for known canonical slugs and has local form labels", () => {
  for (const locale of ["de", "fr", "ko", "zh"]) {
    assert.ok(getReviewServiceDetail(locale, "objektumorzes")?.longDesc);
    assert.equal(getReviewServiceDetail(locale, "security"), null);
    assert.equal(getReviewServiceDetail(locale, "unknown"), null);
    assert.ok(getReviewServiceSharedCopy(locale)?.serviceQuote.name);
    if (locale !== "de") assert.notEqual(getReviewServiceSharedCopy(locale)?.serviceQuote.name, "Name");
  }
  assert.equal(getReviewServiceDetail("en", "objektumorzes"), null);
});

test("Korean and Chinese drafts preserve source sections, paragraphs and review constraints", () => {
  for (const locale of ["ko", "zh"]) {
    for (const slug of DE_REVIEW_SERVICE_SLUGS) {
      const source = getDeReviewServiceDetailBySlug(slug)!;
      const translated = getReviewServiceDetail(locale, slug)!;
      for (const field of ["useCases", "includedItems", "processSteps", "trustItems", "faq", "highlights"] as const) {
        const expectedLength = source[field].length;
        assert.equal(translated[field].length, expectedLength, `${locale}/${slug}.${field}`);
      }
      assert.equal(translated.longDesc.split("\n\n").length, source.longDesc.split("\n\n").length);
      assert.match(translated.longDesc, locale === "ko" ? /[가-힣]/ : /[\u4e00-\u9fff]/);
      assert.deepEqual(translated.relatedSlugs, source.relatedSlugs);
      assert.equal(translated.legalReviewRequired, source.legalReviewRequired);
      const expectedReviewKeyCount = source.legalReviewRequiredKeys.length;
      assert.equal(translated.legalReviewRequiredKeys.length, expectedReviewKeyCount);
    }
  }
});
