import assert from "node:assert/strict";
import test from "node:test";
import { databaseErrorDiagnostic } from "../lib/db/error-diagnostic";

test("build diagnostics recover a wrapped Postgres schema error without logging query data", () => {
  const cause = Object.assign(new Error("private database detail"), { code: "42703" });
  const wrapped = new Error("query with sensitive params", { cause });
  assert.equal(databaseErrorDiagnostic(wrapped), "42703: undefined column");
});

test("build diagnostics distinguish connection and authentication failures", () => {
  assert.equal(databaseErrorDiagnostic({ cause: { code: "ENOTFOUND" } }), "ENOTFOUND: DNS lookup failed");
  assert.equal(databaseErrorDiagnostic({ code: "28P01" }), "28P01: database authentication failed");
});

test("unknown cause data is never copied to diagnostics", () => {
  assert.equal(databaseErrorDiagnostic({ code: "password=secret", message: "private" }), "unclassified database failure");
  assert.equal(databaseErrorDiagnostic("private failure"), "unclassified database failure");
});

test("cyclic and deeply nested causes terminate without exposing arbitrary values", () => {
  const cycle: { cause?: unknown } = {};
  cycle.cause = cycle;
  assert.equal(databaseErrorDiagnostic(cycle), "unclassified database failure");
  let nested: unknown = { code: "42P01" };
  for (let i = 0; i < 10; i++) nested = { cause: nested };
  assert.equal(databaseErrorDiagnostic(nested), "unclassified database failure");
});
