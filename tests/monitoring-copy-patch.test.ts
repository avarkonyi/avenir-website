import assert from "node:assert/strict";
import test from "node:test";
import { planMonitoringCopyPatch } from "../scripts/monitoring-copy-patch";

const oldHuLead = "Az Avenir 24/7 diszpécseri háttérrel kezeli a csatlakoztatott helyszínekről érkező riasztási, behatolásjelzési és kamerajelzéseket";
const oldEnLead = "Avenir operates 24/7 monitoring of intrusion, alarm and CCTV signals from connected sites";
const oldHuLong = "A téves jelzések naplózhatók és elemezhetők";
const oldEnLong = "False alarms are logged and analysed";
const oldHuVerification = "A téves jelzések naplózhatók és visszanézhetők";
const oldEnVerification = "False alarms are logged and reviewed";
const oldHuRecording = "A jelzések időbélyegzett eseménynaplóban rögzíthetők:";
const oldEnRecording = "Signals can be recorded in a timestamped operations log:";

function fixture() {
  const faqHu = Array.from({ length: 12 }, (_, index) => ({
    q: `Untouched HU question ${index}`,
    a: `Untouched HU answer ${index}`,
  }));
  const faqEn = Array.from({ length: 12 }, (_, index) => ({
    q: `Untouched EN question ${index}`,
    a: `Untouched EN answer ${index}`,
  }));
  faqHu[3] = {
    q: "Hogyan történik a riasztás ellenőrzése az eszkaláció előtt?",
    a: `Verification context. ${oldHuVerification}; keep escalation context.`,
  };
  faqEn[3] = {
    q: "How is an alarm verified before escalation?",
    a: `Verification context. ${oldEnVerification}; keep escalation context.`,
  };
  faqHu[8] = {
    q: "Hogyan dokumentálhatók a riasztási jelzések és események?",
    a: `${oldHuRecording} keep site and contractual detail.`,
  };
  faqEn[8] = {
    q: "How can alarm signals and events be documented?",
    a: `${oldEnRecording} keep site and contractual detail.`,
  };
  return {
    id: 6,
    slug: "tavfelugyelet-vonuloszolgalat",
    valuePropositionHu: `${oldHuLead}; keep HU lead continuation.`,
    valuePropositionEn: `${oldEnLead}, keep EN lead continuation.`,
    longDescHu: `Opening HU context. ${oldHuLong}; keep HU detail.\n\nKeep second paragraph.`,
    longDescEn: `Opening EN context. ${oldEnLong}; keep EN detail.\n\nKeep second paragraph.`,
    faqHu,
    faqEn,
    nameHu: "Unchanged service name",
    trustItemsHu: [{ title: "Keep", body: "Keep this trust claim." }],
    isPublished: true,
    updatedAt: "2026-10-18T00:00:00Z",
  };
}

test("monitoring patch changes eight fragments in only six columns without mutating the source", () => {
  const row = fixture();
  const original = structuredClone(row);
  const plan = planMonitoringCopyPatch(row);
  assert.equal(plan.status, "apply");
  assert.equal(plan.fragments.length, 8);
  assert.ok(plan.fragments.every((fragment) => fragment.state === "replace"));
  assert.deepEqual(Object.keys(plan.values).sort(), [
    "faqEn", "faqHu", "longDescEn", "longDescHu", "valuePropositionEn", "valuePropositionHu",
  ]);
  assert.deepEqual(row, original);
  const updated = { ...row, ...plan.values };
  assert.match(updated.valuePropositionHu, /^Az Avenir saját felügyeleti központja 24\/7 fogadja és kezeli/);
  assert.match(updated.valuePropositionEn, /^Avenir’s own monitoring centre receives and handles/);
  assert.ok(updated.valuePropositionHu.endsWith("; keep HU lead continuation."));
  assert.ok(updated.valuePropositionEn.endsWith(", keep EN lead continuation."));
  assert.equal(updated.longDescHu, original.longDescHu.replace(oldHuLong, "A téves jelzéseket naplózzuk, és azok elemezhetők"));
  assert.equal(updated.longDescEn, original.longDescEn.replace(oldEnLong, "False alarms are logged and can be analysed"));
  for (const field of ["faqHu", "faqEn"] as const) {
    assert.deepEqual(updated[field].map((item) => item.q), original[field].map((item) => item.q));
    for (let index = 0; index < row[field].length; index += 1) {
      if (index !== 3 && index !== 8) assert.deepEqual(updated[field][index], original[field][index]);
    }
    assert.ok(updated[field][3].a.endsWith("; keep escalation context."));
    assert.ok(updated[field][8].a.endsWith(" keep site and contractual detail."));
  }
  assert.equal(updated.nameHu, original.nameHu);
  assert.deepEqual(updated.trustItemsHu, original.trustItemsHu);
  assert.equal(updated.isPublished, original.isPublished);
  assert.equal(updated.updatedAt, original.updatedAt);
});

test("monitoring patch is a no-op when all eight replacements are already applied", () => {
  const row = fixture();
  const first = planMonitoringCopyPatch(row);
  const second = planMonitoringCopyPatch({ ...row, ...first.values });
  assert.equal(second.status, "already-applied");
  assert.deepEqual(second.values, {});
  assert.equal(second.fragments.length, 8);
  assert.ok(second.fragments.every((fragment) => fragment.state === "already-applied"));
});

test("monitoring patch refuses any other row identity or legacy slug", () => {
  for (const change of [{ id: 7 }, { slug: "technical" }, { slug: "objektumorzes" }]) {
    assert.throws(() => planMonitoringCopyPatch({ ...fixture(), ...change }), /target identity/);
  }
});

test("monitoring patch refuses missing rows, missing fields and null fields", () => {
  for (const value of [null, undefined, [], {}]) {
    assert.throws(() => planMonitoringCopyPatch(value), /row|target identity/);
  }
  for (const field of ["valuePropositionHu", "valuePropositionEn", "longDescHu", "longDescEn", "faqHu", "faqEn"]) {
    for (const value of [null, undefined]) {
      assert.throws(() => planMonitoringCopyPatch({ ...fixture(), [field]: value }), /expected/);
    }
  }
});

test("monitoring patch refuses malformed FAQ elements, including untouched elements", () => {
  const row = fixture();
  assert.throws(() => planMonitoringCopyPatch({ ...row, faqHu: [null, ...row.faqHu.slice(1)] }), /expected/);
  assert.throws(() => planMonitoringCopyPatch({ ...row, faqEn: [{ q: "Question", a: 42 }, ...row.faqEn.slice(1)] }), /expected/);
});

test("monitoring patch refuses a question moved away from its approved index", () => {
  const row = fixture();
  [row.faqHu[2], row.faqHu[3]] = [row.faqHu[3], row.faqHu[2]];
  assert.throws(() => planMonitoringCopyPatch(row), /question|index/);
});

test("monitoring patch refuses duplicate target FAQ questions", () => {
  for (const field of ["faqHu", "faqEn"] as const) {
    for (const index of [3, 8]) {
      const row = fixture();
      row[field][11] = { ...row[field][index] };
      assert.throws(() => planMonitoringCopyPatch(row), /unique question/);
    }
  }
});

test("monitoring patch refuses absent or repeated legacy fragments", () => {
  const row = fixture();
  assert.throws(() => planMonitoringCopyPatch({ ...row, longDescHu: "An editor replaced this paragraph." }), /fragment/);
  assert.throws(() => planMonitoringCopyPatch({ ...row, longDescEn: `${row.longDescEn} ${oldEnLong}` }), /fragment/);
  row.faqHu[8].a += ` ${oldHuRecording}`;
  assert.throws(() => planMonitoringCopyPatch(row), /fragment/);
});

test("monitoring patch refuses both old and new wording in the same target text", () => {
  const row = fixture();
  row.longDescEn += " False alarms are logged and can be analysed";
  assert.throws(() => planMonitoringCopyPatch(row), /fragment/);
});

test("monitoring patch refuses repeated already-applied wording", () => {
  const row = fixture();
  const plan = planMonitoringCopyPatch(row);
  const updated = { ...row, ...plan.values };
  updated.longDescEn += " False alarms are logged and can be analysed";
  assert.throws(() => planMonitoringCopyPatch(updated), /fragment/);
});

test("monitoring patch refuses partial application instead of finishing it implicitly", () => {
  const row = fixture();
  const plan = planMonitoringCopyPatch(row);
  assert.throws(() => planMonitoringCopyPatch({ ...row, valuePropositionHu: plan.values.valuePropositionHu }), /partially applied/);
});

test("monitoring patch snapshots full original column values independently for compare-and-set", () => {
  const row = fixture();
  const plan = planMonitoringCopyPatch(row);
  assert.deepEqual(Object.keys(plan.before).sort(), [
    "faqEn", "faqHu", "id", "longDescEn", "longDescHu", "slug", "valuePropositionEn", "valuePropositionHu",
  ]);
  const originalAnswer = row.faqHu[0].a;
  row.faqHu[0].a = "Later unrelated edit";
  assert.equal(plan.before.faqHu[0].a, originalAnswer);
  assert.equal(plan.values.faqHu?.[0].a, originalAnswer);
});
