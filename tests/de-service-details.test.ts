import assert from "node:assert/strict";
import test from "node:test";
import {
  DE_REVIEW_LEGAL_REVIEW_REQUIRED_ROWS,
  DE_REVIEW_SERVICE_PATHS,
  getDeReviewRelatedServicesBySlugs,
  getDeReviewServiceDetailBySlug,
  getDeReviewServiceDetailSharedCopy,
  isDeReviewServicePath,
} from "../lib/services/de-service-details";

const CANONICAL_SERVICE_SLUGS = [
  "objektumorzes",
  "portaszolgalat",
  "mystery-shopping-helyszini-audit",
  "rendezvenybiztositas",
  "biztonsagtechnika",
  "tavfelugyelet-vonuloszolgalat",
  "hard-fm",
  "soft-fm",
] as const;

test("DE review service source exposes exactly the 8 canonical service paths", () => {
  assert.deepEqual(
    DE_REVIEW_SERVICE_PATHS.map((path) => path.slug).sort(),
    [...CANONICAL_SERVICE_SLUGS].sort(),
  );
  assert.equal(DE_REVIEW_SERVICE_PATHS.every((path) => path.locale === "de"), true);

  for (const slug of CANONICAL_SERVICE_SLUGS) {
    assert.equal(isDeReviewServicePath("de", slug), true);
    assert.ok(getDeReviewServiceDetailBySlug(slug));
  }

  assert.equal(isDeReviewServicePath("hu", "objektumorzes"), false);
  assert.equal(getDeReviewServiceDetailBySlug("security"), null);
});

test("DE review service source keeps review metadata and has no DE-only legal additions", () => {
  assert.equal(DE_REVIEW_LEGAL_REVIEW_REQUIRED_ROWS.length, 20);
  assert.equal(
    DE_REVIEW_LEGAL_REVIEW_REQUIRED_ROWS.some((row) => row.key.includes("DE_ONLY")),
    false,
  );

  // The authoritative HU Security Technology page has 9 FAQs and no
  // DSGVO-compliance clause; German must not add legal content (DES-003/004).
  const detail = getDeReviewServiceDetailBySlug("biztonsagtechnika");
  assert.ok(detail);
  assert.equal(detail.name, "Sicherheitstechnik");
  assert.equal(detail.faq.length, 9);
  assert.equal(
    detail.faq.some((entry) =>
      entry.q.includes("Interessenabwägung für eine Videoüberwachung") ||
      entry.q.includes("Kameraaufnahmen gespeichert werden"),
    ),
    false,
  );
  assert.equal(detail.longDesc.includes("im Einklang mit den Grundsätzen der DSGVO"), false);
  assert.equal(detail.legalReviewRequiredKeys.some((key) => key.includes("DE_ONLY")), false);
});

test("DE review service source exposes shared UI copy and related cards", () => {
  const shared = getDeReviewServiceDetailSharedCopy();
  assert.equal(shared.serviceDetail.useCasesTitle, "Für wen geeignet");
  assert.equal(shared.serviceQuote.button, "Angebot anfordern");

  const related = getDeReviewRelatedServicesBySlugs(
    getDeReviewServiceDetailBySlug("objektumorzes")?.relatedSlugs ?? [],
  );
  assert.equal(related.length, 5);
  assert.equal(related[0]?.slug, "portaszolgalat");
  assert.equal(related[0]?.name, "Empfangs- und Pförtnerdienst");
  assert.match(related[0]?.shortDesc ?? "", /Pförtnerdienst mit Zutrittskontrolle/);
});
