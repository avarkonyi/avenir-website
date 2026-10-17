import assert from "node:assert/strict";
import test from "node:test";
import { hasAllowedAdminSession } from "../lib/admin/session-policy";

const allowed = ["admin@example.test"];

test("admin admission rejects absent, error-shaped and malformed sessions", () => {
  for (const session of [null, undefined, false, {}, { error: "Configuration" },
    { user: null }, { user: {} }, { user: { email: "" } },
    { user: { email: 1 } }, { user: { email: ["admin@example.test"] } }]) {
    assert.equal(hasAllowedAdminSession(session, allowed), false);
  }
});

test("admin admission rejects a real session outside the allowlist", () => {
  assert.equal(hasAllowedAdminSession({ user: { email: "other@example.test" } }, allowed), false);
});

test("admin admission preserves case-insensitive allowed sessions", () => {
  assert.equal(hasAllowedAdminSession({ user: { email: "ADMIN@example.test" } }, allowed), true);
  assert.equal(hasAllowedAdminSession({ user: { email: " admin@example.test " } }, allowed), true);
});
