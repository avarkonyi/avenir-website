import assert from "node:assert/strict";
import test from "node:test";
import { applyApprovedProcessCopy } from "../lib/services/approved-process-copy";

const oldHu = "A helyszíni bejárás és az alapvető kockázati áttekintés jellemzően 1–3 munkanapon belül megszervezhető.";
const oldEn = "An on-site visit and basic risk overview can typically be organised within 1–3 working days.";

test("approved site-visit copy replaces only the known HU/EN legacy promise without mutating CMS data", () => {
  for (const [locale, body, approved] of [
    ["hu", oldHu, "A helyszíni bejárás és az alapvető kockázati áttekintés időpontját az első egyeztetésen közösen rögzítjük."],
    ["en", oldEn, "We agree the timing of the on-site visit and basic risk overview together during the initial consultation."],
  ]) {
    const steps = [{ title: "Site visit", body }, { title: "Other", body: "Keep this CMS text." }];
    const result = applyApprovedProcessCopy("objektumorzes", locale, steps);
    assert.equal(result[0].body, approved);
    assert.equal(result[1], steps[1]);
    assert.equal(steps[0].body, body);
    assert.deepEqual(applyApprovedProcessCopy("objektumorzes", locale, result), result);
    assert.deepEqual(applyApprovedProcessCopy("soft-fm", locale, steps), steps);
    assert.deepEqual(applyApprovedProcessCopy("objektumorzes", "fr", steps), steps);
  }
});
