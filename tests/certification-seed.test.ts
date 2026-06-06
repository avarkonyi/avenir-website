import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

// Source-level guard (no DB access, no seed execution): every certification
// row in scripts/seed.ts must set isPublished: true. The schema default is
// false, so a fresh seed / staging re-seed would otherwise leave certs
// unpublished, silently dropping them from the visible Certifications section
// AND from the hasCredential JSON-LD. Run from the repo root (npm run test).
const seedSrc = readFileSync("scripts/seed.ts", "utf8");

test("certification seed publishes every certificate row", () => {
  const start = seedSrc.indexOf("db.insert(certifications)");
  assert.ok(start !== -1, "certifications insert block not found in seed.ts");
  const end = seedSrc.indexOf("seeded certifications", start);
  assert.ok(end !== -1, "end of certifications insert block not found");
  const block = seedSrc.slice(start, end);

  const certRows = (block.match(/slug:\s*"iso-/g) ?? []).length;
  const publishedRows = (block.match(/isPublished:\s*true/g) ?? []).length;

  assert.ok(certRows >= 2, `expected >=2 certification rows, found ${certRows}`);
  assert.equal(
    publishedRows,
    certRows,
    `every seeded certification must set isPublished: true (rows=${certRows}, published=${publishedRows})`,
  );
});
