import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import robots from "../app/robots";

test("each search bot can crawl public HTML/assets but not admin/API", () => {
  const previous = process.env.VERCEL_ENV;
  process.env.VERCEL_ENV = "production";
  try {
    const result = robots();
    const groups = Array.isArray(result.rules) ? result.rules : [result.rules];
    for (const bot of ["Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "GPTBot"]) {
      const explicit = groups.filter(g => [g.userAgent].flat().includes(bot));
      const matched = explicit.length ? explicit : groups.filter(g => [g.userAgent].flat().includes("*"));
      const allowed = (path: string) => {
        const rules = matched.flatMap(g => [
          ...[g.allow ?? []].flat().map(p => ({ p, allow: true })),
          ...[g.disallow ?? []].flat().map(p => ({ p, allow: false })),
        ]).filter(r => path.startsWith(r.p)).sort((a,b) => b.p.length-a.p.length || Number(b.allow)-Number(a.allow));
        return rules[0]?.allow ?? true;
      };
      for (const path of ["/hu", "/en/szolgaltatasok/objektumorzes", "/_next/static/app.js", "/uploads/logo.svg"]) assert.equal(allowed(path), true, `${bot}: ${path}`);
      for (const path of ["/admin", "/admin/login", "/api/contact", "/api/auth/session"]) assert.equal(allowed(path), false, `${bot}: ${path}`);
    }
    assert.equal(result.sitemap, "https://www.afm.hu/sitemap.xml");
  } finally { if (previous === undefined) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV = previous; }
});

test("preview robots remain closed", () => {
  const previous = process.env.VERCEL_ENV;
  process.env.VERCEL_ENV = "preview";
  try { assert.deepEqual(robots(), { rules: [{ userAgent: "*", disallow: "/" }] }); }
  finally { if (previous === undefined) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV = previous; }
});

test("24/7 dispatch is not asserted as business opening hours", () => {
  const source = readFileSync("app/[locale]/layout.tsx", "utf8");
  assert.equal(source.includes("openingHoursSpecification:"), false);
});

test("company schema uses a supported LocalBusiness type", () => {
  const source = readFileSync("app/[locale]/layout.tsx", "utf8");
  assert.ok(source.includes('"@type": "LocalBusiness"'));
  assert.equal(source.includes('["ProfessionalService", "SecurityService"]'), false);
});

test("service indexing remains release-gated even when partial CMS translations are filled", async () => {
  const { isIndexableServiceLocale, indexableServiceLocales } = await import("../lib/services/publication");
  assert.deepEqual(indexableServiceLocales(["hu", "en", "de", "zh", "ko", "fr"]), ["hu", "en"]);
  for (const locale of ["de", "zh", "ko", "fr"]) assert.equal(isIndexableServiceLocale(locale), false);
});

test("sitemap preserves real service edit dates and omits unverified static dates", async () => {
  const { buildPublicSitemap } = await import("../lib/public-sitemap");
  const updatedAt = new Date("2026-10-16T12:30:00Z");
  const entries = buildPublicSitemap([
    { locale: "hu", slug: "objektumorzes", updatedAt },
    { locale: "en", slug: "objektumorzes", updatedAt },
    { locale: "de", slug: "objektumorzes", updatedAt },
  ], []);
  const service = entries.find(e => e.url.endsWith("/en/szolgaltatasok/objektumorzes"));
  assert.equal(service?.lastModified, updatedAt);
  assert.deepEqual(Object.keys(service?.alternates?.languages ?? {}), ["hu", "en", "x-default"]);
  assert.equal(entries.some(e => /\/(de|zh|ko|fr)(\/|$)/.test(new URL(e.url).pathname)), false);
  assert.equal(entries.find(e => e.url.endsWith("/hu"))?.lastModified, undefined);
  const removed = buildPublicSitemap([], []);
  assert.equal(removed.some(e => e.url.includes("/szolgaltatasok/")), false);
});

test("news invalidation covers translated indexes and old/new detail slugs", async () => {
  const { publicNewsRevalidationPaths } = await import("../lib/public-content-revalidation");
  const paths = publicNewsRevalidationPaths(["old-slug", "new-slug", "old-slug", null]);
  for (const locale of ["hu", "en", "de"]) {
    for (const suffix of ["", "/hirek", "/hirek/old-slug", "/hirek/new-slug"]) assert.ok(paths.includes(`/${locale}${suffix}`));
  }
  assert.ok(paths.includes("/sitemap.xml"));
  assert.equal(paths.length, new Set(paths).size);
  assert.equal(paths.some(p => p.startsWith("/ko/hirek")), false);
});
