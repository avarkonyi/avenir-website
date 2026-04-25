// Smoke test for the 4-locale routing + translation wiring.
// Each locale's hero.h1a must appear on its dedicated URL with the right
// <html lang>, and the root URL ("/") must rewrite to HU.
//
// Run with the dev server up on localhost:3000 (or pass BASE_URL):
//   node scripts/verify-i18n.mjs
//   BASE_URL=http://localhost:3001 node scripts/verify-i18n.mjs
//
// Exit code is 0 if all checks pass, 1 otherwise — reusable as a CI/pre-commit
// smoke check across later prompts.

const baseUrl = process.env.BASE_URL || "http://localhost:3000";

const cases = [
  { url: "/hu", h1a: "Az épület üzemel.", lang: "hu" },
  { url: "/en", h1a: "Buildings, people,", lang: "en" },
  { url: "/de", h1a: "Gebäude, Menschen,", lang: "de" },
  { url: "/zh", h1a: "建筑、人员、", lang: "zh" },
  { url: "/", h1a: "Az épület üzemel.", lang: "hu" }, // root rewrites to HU
];

let failures = 0;
for (const c of cases) {
  let res;
  let body;
  try {
    res = await fetch(baseUrl + c.url);
    body = await res.text();
  } catch (e) {
    console.log(`${c.url.padEnd(5)}  ERROR  ${e.message}`);
    failures++;
    continue;
  }
  const langMatch = body.match(/<html[^>]*lang="([^"]+)"/);
  const lang = langMatch ? langMatch[1] : "?";
  const found = body.includes(c.h1a);
  const ok = res.status === 200 && lang === c.lang && found;
  console.log(
    `${c.url.padEnd(5)}  Status=${res.status}  lang=${lang.padEnd(2)}  h1a-found=${String(found).padEnd(5)}  [${ok ? "OK" : "FAIL"}]`,
  );
  if (!ok) failures++;
}

console.log("---");
if (failures === 0) {
  console.log("All 5 checks passed.");
  process.exit(0);
} else {
  console.log(`${failures} check(s) failed.`);
  process.exit(1);
}
