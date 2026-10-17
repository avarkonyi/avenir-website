import assert from "node:assert/strict";
import test from "node:test";
import { hu } from "../lib/i18n/hu";
import { en } from "../lib/i18n/en";
import { getTermsContent } from "../lib/legal-content";

test("Hungarian terms rename preserves the inflection and the rest of the governing-law clause", () => {
  const original = hu.legal.terms.sections.find((section) => section.id === "law")!;
  const terms = getTermsContent("hu", hu);
  const law = terms.sections.find((section) => section.id === "law")!;

  assert.equal(law.body, original.body.replace("Felhasználási feltételekre", "Jogi nyilatkozatokra"));
  assert.match(terms.sections.find((section) => section.id === "general")!.body, /A jelen Jogi nyilatkozatok nyelve/);
  assert.doesNotMatch(JSON.stringify(terms), /nyilatkozatokre/);
  assert.equal(hu.legal.terms.sections.find((section) => section.id === "law")!.body, original.body);
});

test("terms renaming leaves a non-Hungarian fallback unchanged", () => {
  assert.equal(getTermsContent("en", en), en.legal.terms);
});
