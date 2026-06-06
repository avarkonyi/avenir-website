import assert from "node:assert/strict";
import test from "node:test";
import {
  NEWS_INDEXABLE_LOCALES,
  NEWS_PUBLIC_LOCALES,
  isIndexableNewsLocale,
  isPublicNewsLocale,
  newsAlternateLanguages,
  newsDetailHref,
  newsIndexPath,
} from "../lib/news-routing";

test("news routes are public only for HU, EN and DE", () => {
  assert.deepEqual([...NEWS_PUBLIC_LOCALES], ["hu", "en", "de"]);
  assert.equal(isPublicNewsLocale("hu"), true);
  assert.equal(isPublicNewsLocale("en"), true);
  assert.equal(isPublicNewsLocale("de"), true);
  assert.equal(isPublicNewsLocale("zh"), false);
  assert.equal(isPublicNewsLocale("ko"), false);
});

test("only HU and EN news are indexable", () => {
  assert.deepEqual([...NEWS_INDEXABLE_LOCALES], ["hu", "en"]);
  assert.equal(isIndexableNewsLocale("hu"), true);
  assert.equal(isIndexableNewsLocale("en"), true);
  assert.equal(isIndexableNewsLocale("de"), false);
});

test("news route helpers keep the Hungarian URL segment across locales", () => {
  const slug = "megujult-az-avenir-weboldala-es-arculata";

  assert.equal(newsIndexPath("hu"), "/hu/hirek");
  assert.equal(newsIndexPath("en"), "/en/hirek");
  assert.equal(newsIndexPath("de"), "/de/hirek");
  assert.equal(
    newsDetailHref("en", slug),
    "/en/hirek/megujult-az-avenir-weboldala-es-arculata",
  );
});

test("news hreflang alternates exclude DE review and closed ZH/KO routes", () => {
  assert.deepEqual(
    newsAlternateLanguages("megujult-az-avenir-weboldala-es-arculata", [
      "hu",
      "en",
      "de",
    ]),
    {
      hu: "https://www.afm.hu/hu/hirek/megujult-az-avenir-weboldala-es-arculata",
      en: "https://www.afm.hu/en/hirek/megujult-az-avenir-weboldala-es-arculata",
      "x-default":
        "https://www.afm.hu/hu/hirek/megujult-az-avenir-weboldala-es-arculata",
    },
  );
});
