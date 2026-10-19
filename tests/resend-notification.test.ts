import assert from "node:assert/strict";
import test, { type TestContext } from "node:test";
import { Resend } from "resend";
import { sendContactNotification } from "../lib/resend";

const payload = { name: "Private Example", email: "private@example.test", message: "Private message body", locale: "en" as const, _website: "" };
const content = { subject: "Private subject", text: payload.message, html: "<p>Private message body</p>" };
const dummyEnv = {
  NODE_ENV: "test" as const,
  VERCEL_ENV: "production", RESEND_API_KEY: "synthetic-private-api-key",
  RESEND_FROM_EMAIL: "notify@sender.test", RESEND_NOTIFY_TO: "inbox@example.test",
};

function isolate(t: TestContext, env: NodeJS.ProcessEnv = dummyEnv) {
  const originalEnv = process.env;
  process.env = { ...env };
  t.after(() => { process.env = originalEnv; });
  const logs: unknown[][] = [];
  t.mock.method(console, "warn", (...args: unknown[]) => { logs.push(args); });
  t.mock.method(console, "error", (...args: unknown[]) => { logs.push(args); });
  const fetchMock = t.mock.method(globalThis, "fetch", async () => Response.json({ id: "synthetic-email-id" }));
  return { logs, fetchMock };
}

test("notification provider errors retain fail-soft results and log no provider content", async (t) => {
  const { logs, fetchMock } = isolate(t);
  fetchMock.mock.mockImplementation(async () => Response.json({
    name: "validation_error", statusCode: 422,
    message: `${payload.email}: ${payload.message} ${dummyEnv.RESEND_API_KEY}`,
    unknownField: { payload, authorization: dummyEnv.RESEND_API_KEY },
  }, { status: 422 }));
  assert.deepEqual(await sendContactNotification(payload, content), { sent: false, reason: "api-error" });
  assert.equal(fetchMock.mock.callCount(), 1);
  assert.deepEqual(logs, [["[resend] api-error"]]);
});

test("notification exceptions cannot put names, messages, causes or secrets into logs", async (t) => {
  const { logs, fetchMock } = isolate(t);
  const privateDetail = `${payload.email} ${payload.message} ${dummyEnv.RESEND_API_KEY}`;
  t.mock.method(Resend.prototype, "post", async () => {
    throw Object.assign(new Error(privateDetail, { cause: privateDetail }), { name: privateDetail });
  });
  assert.deepEqual(await sendContactNotification(payload, content), { sent: false, reason: "exception" });
  assert.equal(fetchMock.mock.callCount(), 0);
  assert.deepEqual(logs, [["[resend] exception"]]);
});

test("production sandbox block does not log a sender value", async (t) => {
  const { logs, fetchMock } = isolate(t, { ...dummyEnv, RESEND_FROM_EMAIL: "private-sender@resend.dev" });
  assert.deepEqual(await sendContactNotification(payload, content), { sent: false, reason: "production-sandbox-blocked" });
  assert.equal(fetchMock.mock.callCount(), 0);
  assert.deepEqual(logs, [["[resend] BLOCKED — production cannot use sandbox sender"]]);
});

test("successful notifications preserve recipient, reply-to and contents without log output", async (t) => {
  const { logs, fetchMock } = isolate(t);
  assert.deepEqual(await sendContactNotification(payload, content), { sent: true, id: "synthetic-email-id" });
  const [, options] = fetchMock.mock.calls[0].arguments as unknown as [string, RequestInit];
  assert.deepEqual(JSON.parse(String(options.body)), {
    from: dummyEnv.RESEND_FROM_EMAIL, to: dummyEnv.RESEND_NOTIFY_TO, reply_to: payload.email, ...content,
  });
  assert.deepEqual(logs, []);
});

test("missing notification configuration still skips without a request", async (t) => {
  const { fetchMock } = isolate(t, { ...dummyEnv, RESEND_API_KEY: undefined });
  assert.deepEqual(await sendContactNotification(payload, content), { sent: false, reason: "missing-config" });
  assert.equal(fetchMock.mock.callCount(), 0);
});
