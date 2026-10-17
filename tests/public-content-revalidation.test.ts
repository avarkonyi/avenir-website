import assert from "node:assert/strict";
import test from "node:test";
import * as invalidation from "../lib/public-content-revalidation";

test("shared CMS invalidation refreshes every locale layout and descendant page", () => {
  const calls: Array<[string, ("layout" | "page")?]> = [];
  assert.equal(typeof invalidation.revalidatePublicContent, "function");
  invalidation.revalidatePublicContent((path, type) => calls.push([path, type]));

  // Next's dynamic layout invalidation also refreshes nested service pages:
  // their shared schema, footer and related links must not retain removed rows.
  assert.ok(calls.some(([path, type]) => path === "/[locale]" && type === "layout"));
  assert.equal(calls.some(([path]) => path.startsWith("/admin")), false);
});

test("service publication invalidation also refreshes the sitemap", () => {
  const calls: Array<[string, ("layout" | "page")?]> = [];
  assert.equal(typeof invalidation.revalidatePublicContent, "function");
  invalidation.revalidatePublicContent((path, type) => calls.push([path, type]), { sitemap: true });
  assert.ok(calls.some(([path, type]) => path === "/[locale]" && type === "layout"));
  assert.ok(calls.some(([path]) => path === "/sitemap.xml"));
});
