import assert from "node:assert/strict";
import test from "node:test";
import { hu } from "../lib/i18n/hu";
import { en } from "../lib/i18n/en";
import { getTermsContent, withLegalContent } from "../lib/legal-content";
import { getTranslation } from "../lib/i18n";
import { RECRUITMENT_PRIVACY_CONTENT } from "../lib/recruitment-privacy-content";

test("Hungarian terms rename preserves the inflection and the rest of the governing-law clause", () => {
  const original = hu.legal.terms.sections.find((section) => section.id === "law")!;
  const terms = getTermsContent("hu", hu);
  const law = terms.sections.find((section) => section.id === "law")!;

  assert.equal(law.body, original.body.replace("Felhasználási feltételekre", "Jogi nyilatkozatokra"));
  assert.match(terms.sections.find((section) => section.id === "general")!.body, /A jelen Jogi nyilatkozatok nyelve/);
  assert.doesNotMatch(JSON.stringify(terms), /nyilatkozatokre/);
  assert.equal(hu.legal.terms.sections.find((section) => section.id === "law")!.body, original.body);
});

test("English legal statements expose the current HU v1.1 meaning through both content paths", () => {
  const terms = getTermsContent("en", en);
  assert.deepEqual(withLegalContent("en", en).legal.terms, terms);
  assert.deepEqual(getTranslation("en").legal.terms, terms);
  assert.deepEqual(getTermsContent("en", getTranslation("en")), terms);
  assert.equal(terms.title, "Legal Statements");
  assert.equal(terms.lastUpdated, "Effective: 6 May 2026");
  assert.match(terms.version, /1\.1.*title clarification/);
  assert.match(terms.intro, /not a set of general terms and conditions/);
  assert.match(terms.intro, /contact and quote-request process/);
  const general = terms.sections.find((section) => section.id === "general")!;
  assert.equal(general.title, "1. General Provisions and Scope");
  assert.match(general.body, /6:2–6:8.*Act V of 2013/);
  assert.match(general.body, /Act CVIII of 2001/);
  assert.match(general.body, /Hungarian text prevails/);
  assert.match(terms.dataProtection.body, /do not replace the Privacy Policy/);
  assert.match(terms.versionHistory, /6 May 2026.*DPO/);
  assert.doesNotMatch(JSON.stringify(terms), /Terms of Use|unilaterally|By using the website, you accept|in accordance with GDPR/);
  assert.equal(en.footer.terms, terms.title);
  assert.equal(en.form.specialDataWarningLink, "Legal Statements, section 4");
});

test("rendered HU, EN and DE statements refer only to existing translated legal versions", () => {
  for (const locale of ["hu", "en", "de"]) {
    const terms = getTranslation(locale).legal.terms;
    const general = terms.sections.find((section) => section.id === "general")!;
    assert.doesNotMatch(general.body, /kínai|Chinese|chinesische|koreai|Korean|koreanische|francia|French|französische/);
  }
});

test("Hungarian publication dates use correct case endings in version histories", () => {
  const privacy = getTranslation("hu").legal.privacy;
  assert.match(privacy.versionHistory, /2026\. június 13-tól/);
  assert.match(privacy.versionHistory, /2026\. június 1-jétől/);
  assert.match(RECRUITMENT_PRIVACY_CONTENT.hu.versionHistory, /2026\. június 12-től/);
});
