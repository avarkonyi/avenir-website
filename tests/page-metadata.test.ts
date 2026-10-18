import assert from "node:assert/strict";
import test from "node:test";
import { buildPageMetadata, defaultOgImageUrl } from "../lib/page-metadata";
import { SEO_DATA } from "../lib/seo-data";
import { buildTrustCenterMetadata } from "../lib/trust-center-content";
import { buildRecruitmentPrivacyMetadata } from "../lib/recruitment-privacy-routes";

const base = {
  title: "Adatkezelési tájékoztató — Avenir Facility Management Kft.",
  description: "Leírás.",
  url: "https://www.afm.hu/hu/adatvedelem",
};

test("every page gets its own complete OG and Twitter block with an image", () => {
  const meta = buildPageMetadata({ ...base, locale: "hu", index: true, type: "article" });
  const og = meta.openGraph as Record<string, unknown>;
  assert.equal(og.siteName, SEO_DATA.name);
  assert.equal(og.locale, "hu_HU");
  assert.equal(og.title, base.title);
  assert.equal(og.url, base.url);
  assert.deepEqual((og.images as Array<{ url: string }>)[0].url, defaultOgImageUrl("hu"));
  const twitter = meta.twitter as Record<string, unknown>;
  assert.equal(twitter.card, "summary_large_image");
  assert.equal(twitter.title, base.title, "twitter:title must be the page title, not the homepage title");
  assert.deepEqual(twitter.images, [defaultOgImageUrl("hu")]);
});

test("a page-specific image replaces the locale default", () => {
  const meta = buildPageMetadata({ ...base, locale: "en", index: true, image: "https://www.afm.hu/uploads/x.jpg" });
  assert.deepEqual((meta.twitter as Record<string, unknown>).images, ["https://www.afm.hu/uploads/x.jpg"]);
});

test("robots keep large image previews and hreflang is emitted only for indexable pages", () => {
  const languages = { hu: "https://www.afm.hu/hu/aszf", en: "https://www.afm.hu/en/aszf" };
  const indexed = buildPageMetadata({ ...base, locale: "hu", index: true, languages });
  assert.deepEqual(indexed.robots, {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  });
  assert.deepEqual(indexed.alternates?.languages, languages);

  const review = buildPageMetadata({ ...base, locale: "de", index: false, languages });
  assert.equal((review.robots as { index: boolean }).index, false);
  assert.equal(review.alternates?.languages, undefined);
  assert.equal(review.alternates?.canonical, base.url);
});

test("trust center and recruitment notices use the shared helper", () => {
  for (const meta of [buildTrustCenterMetadata("en"), buildRecruitmentPrivacyMetadata("hu")]) {
    assert.ok((meta.openGraph as { images?: unknown[] }).images?.length, "OG image present");
    assert.equal((meta.twitter as { card?: string }).card, "summary_large_image");
  }
});
