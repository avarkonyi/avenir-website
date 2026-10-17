import assert from "node:assert/strict";
import { chromium } from "@playwright/test";

// GET-only local QA. External requests and all writes are blocked.
const base = new URL(process.argv[2] ?? "http://localhost:3102");
assert.ok(["localhost", "127.0.0.1"].includes(base.hostname), "Local preview required");
const titles = {
  hu: "Az oldal nem található", en: "Page not found", de: "Seite nicht gefunden",
  fr: "Page introuvable", ko: "페이지를 찾을 수 없습니다", zh: "页面未找到",
};
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  const context = await browser.newContext({ baseURL: base.origin });
  await context.route("**/*", route => {
    const request = route.request();
    return new URL(request.url()).origin === base.origin && ["GET", "HEAD"].includes(request.method())
      ? route.continue() : route.abort();
  });
  const page = await context.newPage();
  for (const [locale, title] of Object.entries(titles)) {
    const response = await page.goto(`/${locale}/audit-unknown-path`, { waitUntil: "networkidle" });
    assert.equal(response.status(), 404, locale);
    assert.equal(await page.locator("html").getAttribute("lang"), locale);
    assert.deepEqual(await page.locator("h1").allTextContents(), [title]);
    assert.ok((await page.locator('meta[name="robots"]').all()).length > 0);
    assert.match((await page.locator('meta[name="robots"]').evaluateAll(nodes => nodes.map(n => n.content).join(" "))), /noindex/);
    assert.ok(await page.locator(`a[href="/${locale}"]`).count());
    results.push({ route: `/${locale}/audit-unknown-path`, status: 404, lang: locale, h1: title });
  }
  for (const locale of ["hu", "en", "de"]) {
    const response = await page.goto(`/${locale}/aszf`, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(await page.locator("section#data-protection").count(), 1);
    assert.equal(await page.locator('section#data-protection a[href="mailto:dpo@afm.hu"]').count(), 1);
    assert.match(await page.locator("main").innerText(), /1\.1/);
    const headings = await page.locator("main h2").allTextContents();
    assert.equal(headings.filter(value => /^\d+\./.test(value.trim())).length, 14);
    results.push({ route: `/${locale}/aszf`, status: 200, numberedSections: 14 });
  }
  for (const locale of Object.keys(titles)) {
    const response = await page.goto(`/${locale}`, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.flatMap(node => {
      const value = JSON.parse(node.textContent);
      return Array.isArray(value) ? value : [value];
    }));
    const organization = schemas.find(value => value["@type"] === "Organization");
    const business = schemas.find(value => value["@type"] === "LocalBusiness");
    const catalog = schemas.find(value => value["@type"] === "ItemList");
    assert.ok(organization && business && catalog, locale);
    assert.equal("openingHoursSpecification" in business, false);
    if (locale !== "hu") {
      assert.doesNotMatch(JSON.stringify([organization.description, business.knowsAbout, catalog.name]), /Magyar vagyonvédelmi|Avenir szolgáltatások|diszpécseri/);
    }
    if (["de", "fr", "ko", "zh"].includes(locale)) {
      assert.match(await page.locator('meta[name="robots"]').getAttribute("content"), /noindex/);
    }
    results.push({ route: `/${locale}`, status: 200, schemaLocalized: true });
  }
  console.log(JSON.stringify({ checks: results.length, results }, null, 2));
} finally {
  await browser.close();
}
