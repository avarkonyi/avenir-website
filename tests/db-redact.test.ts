import assert from "node:assert/strict";
import test from "node:test";
import { DrizzleQueryError } from "drizzle-orm";
import { sanitizeDbErrorMessage } from "../lib/db/redact";

test("failed-query messages never carry bound parameter values into logs", () => {
  const values = ["Teszt Elek", "Teszt Kft.", "teszt@example.hu", "+36 30 123 4567", "Bizalmas üzenet", "hu"];
  const error = new DrizzleQueryError(
    'insert into "messages" ("name", "company", "email", "phone", "message", "locale") values ($1, $2, $3, $4, $5, $6)',
    values,
    new Error("fetch failed"),
  );

  const logged = sanitizeDbErrorMessage(error);

  assert.match(logged, /^Failed query: insert into "messages"/);
  assert.match(logged, /params: \[redacted\]$/);
  for (const value of values) {
    assert.equal(logged.includes(value), false, `logged message leaked "${value}"`);
  }
});

test("multi-line parameter values are removed entirely", () => {
  const error = new DrizzleQueryError('update "messages" set "reply_body" = $1', ["első sor\nmásodik sor"]);
  assert.equal(sanitizeDbErrorMessage(error).includes("sor"), false);
});

test("URL redaction still applies to messages without a params line", () => {
  assert.equal(
    sanitizeDbErrorMessage(new Error("connect to postgres://user:secret@host/db failed")),
    "connect to postgres://[redacted] failed",
  );
});
