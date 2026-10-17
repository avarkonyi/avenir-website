import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
const directory = process.argv[2] || 'docs/audits/2026-10-17/local';
const { inventory, edges } = JSON.parse(await readFile(`${directory}/inventory.json`, 'utf8'));
const byPath = new Map(inventory.map(row => [row.path, row]));
const failures = [];
const checks = [];
const check = (label, fn) => { try { fn(); checks.push(label); } catch (error) { failures.push({ label, error: error.message }); } };
for (const locale of ['hu', 'en', 'de', 'zh', 'ko', 'fr']) {
  check(`${locale}: homepage and eight services render localized HTML`, () => {
    const home = byPath.get(`/${locale}`);
    assert.equal(home?.status, 200);
    assert.equal(home.lang, locale);
    const pages = inventory.filter(row => row.type === 'service' && row.locale === locale && row.status === 200);
    assert.equal(pages.length, 8);
    for (const row of [home, ...pages]) {
      assert.equal(row.h1.length, 1, row.path);
      assert.ok(row.title && row.description && row.mainText.length > 500, row.path);
      assert.equal(row.canonical, `https://www.afm.hu${row.path}`);
      assert.equal(row.lang, locale);
      if (['hu', 'en'].includes(locale)) {
        assert.equal(row.sitemap, true);
        for (const alternate of row.alternates) {
          const target = byPath.get(new URL(alternate.href).pathname);
          assert.equal(target?.status, 200);
          assert.ok(target.alternates.some(a => a.href === row.canonical));
        }
      } else {
        assert.equal(row.sitemap, false);
        assert.equal(row.alternates.length, 0);
        assert.ok(row.robots.some(r => /noindex/.test(r.content)));
      }
      if (row.type === 'service') {
        const schemas = row.jsonLd.flatMap(item => Array.isArray(item) ? item : item['@graph'] ?? [item]);
        assert.ok(schemas.some(s => s['@type'] === 'Service'), row.path);
        assert.ok(schemas.some(s => s['@type'] === 'BreadcrumbList'), row.path);
        const faq = schemas.find(s => s['@type'] === 'FAQPage');
        assert.ok(faq?.mainEntity?.length, row.path);
        for (const question of faq.mainEntity) assert.ok(row.mainText.includes(question.name), row.path);
      }
    }
  });
}
check('all crawled internal destinations return 200 or an intentional redirect', () => {
  for (const edge of edges) {
    const target = byPath.get(edge.to);
    assert.ok(target, `uncrawled ${edge.to}`);
    assert.ok([200,301,302,307,308].includes(target.status), `${edge.from} -> ${edge.to}: ${target.status}`);
  }
});
check('all sitemap entries are canonical HU/EN pages returning 200', () => {
  for (const row of inventory.filter(r => r.sitemap)) {
    assert.equal(row.status, 200, row.path);
    assert.ok(['hu','en'].includes(row.locale));
    assert.equal(row.canonical, `https://www.afm.hu${row.path}`);
  }
});
check('preview HTTP responses carry noindex', () => {
  for (const row of inventory.filter(r => r.status === 200 && ['hu','en','de','zh','ko','fr'].includes(r.locale))) {
    assert.match(row.xRobotsTag ?? '', /noindex/);
  }
});
check('unknown pages remain 404', () => {
  assert.equal(byPath.get('/hu/does-not-exist-seo-audit')?.status, 404);
  assert.equal(byPath.get('/hu/szolgaltatasok/does-not-exist-seo-audit')?.status, 404);
});
const result = { checkedAt: new Date().toISOString(), observations: inventory.length, checks, failures };
await writeFile(`${directory}/verification.json`, JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exitCode = 1;
