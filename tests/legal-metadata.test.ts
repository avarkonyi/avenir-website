import assert from "node:assert/strict";
import test from "node:test";

async function legalPages() {
  // Page imports initialize the Footer's DB client; metadata itself makes no
  // DB calls. Use a deliberately non-routable local target, never live secrets.
  const previous = process.env.DATABASE_URL;
  process.env.DATABASE_URL = "postgresql://test:test@localhost:1/metadata_test";
  try {
    return await Promise.all([
      import("../app/[locale]/adatvedelem/page"),
      import("../app/[locale]/aszf/page"),
      import("../app/[locale]/impresszum/page"),
    ]);
  } finally {
    if (previous === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = previous;
  }
}

test("DE review legal metadata has canonical and noindex without HU/EN hreflang", async () => {
  for (const page of await legalPages()) {
    const metadata = await page.generateMetadata({ params: Promise.resolve({ locale: "de" }) });
    assert.deepEqual(metadata.robots, { index: false, follow: true });
    assert.match(String(metadata.alternates?.canonical), /^https:\/\/www\.afm\.hu\/de\//);
    assert.equal(metadata.alternates?.languages, undefined);
  }
});

test("HU and EN legal metadata retain reciprocal indexable alternates", async () => {
  for (const page of await legalPages()) {
    for (const locale of ["hu", "en"]) {
      const metadata = await page.generateMetadata({ params: Promise.resolve({ locale }) });
      assert.deepEqual(metadata.robots, { index: true, follow: true });
      assert.deepEqual(Object.keys(metadata.alternates?.languages ?? {}).sort(), ["en", "hu", "x-default"]);
      assert.match(String(metadata.alternates?.canonical), new RegExp(`^https://www\\.afm\\.hu/${locale}/`));
    }
  }
});

test("English imprint metadata identifies the company registration in English", async () => {
  const [, , imprint] = await legalPages();
  const metadata = await imprint.generateMetadata({ params: Promise.resolve({ locale: "en" }) });
  assert.match(metadata.description ?? "", /Company registration number: 01-09-328046/);
  assert.doesNotMatch(metadata.description ?? "", /Cégjegyzékszám/);
  assert.equal(metadata.openGraph?.description, metadata.description);
});
