import assert from "node:assert/strict";
import test from "node:test";
import { isValidElement, type ReactNode } from "react";

function elements(node: ReactNode): Array<{ type: unknown; props: Record<string, unknown> }> {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (!isValidElement<{ children?: ReactNode }>(node)) return [];
  return [node, ...elements(node.props.children)];
}

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
    assert.deepEqual(metadata.robots, { index: false, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 });
    assert.match(String(metadata.alternates?.canonical), /^https:\/\/www\.afm\.hu\/de\//);
    assert.equal(metadata.alternates?.languages, undefined);
  }
});

test("HU and EN legal metadata retain reciprocal indexable alternates", async () => {
  for (const page of await legalPages()) {
    for (const locale of ["hu", "en"]) {
      const metadata = await page.generateMetadata({ params: Promise.resolve({ locale }) });
      assert.deepEqual(metadata.robots, { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 });
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

test("DE legal page includes the structured DPO section and clickable contacts", async () => {
  const [, terms] = await legalPages();
  const tree = elements(await terms.default({ params: Promise.resolve({ locale: "de" }) }));
  const block = tree.find((element) => element.type === "section" && element.props.id === "data-protection");
  assert.ok(block, "The German page must render section 14, not only load its content");
  const content = elements(block.props.children as ReactNode);
  assert.ok(content.some((element) => element.type === "h2" && element.props.children === "14. Datenschutz"));
  assert.ok(content.some((element) => element.props.children === "Fanni Csegény"));
  for (const href of ["mailto:dpo@afm.hu", "tel:+36706226242", "/de/adatvedelem"]) {
    assert.ok(content.some((element) => element.props.href === href), `Missing DPO/privacy link ${href}`);
  }
});
