import assert from "node:assert/strict";
import test from "node:test";
import {
  ContactPayloadSchema,
  normalizeContactService,
} from "../lib/contact-schema";

const validPayload = {
  name: "Teszt Elek",
  company: "",
  email: "teszt@example.com",
  phone: "",
  service: "objektumorzes",
  message: "Ajánlatkérés teszt üzenet.",
  locale: "hu",
  _website: "",
};

test("contact schema accepts a valid minimal payload", () => {
  const result = ContactPayloadSchema.safeParse(validPayload);

  assert.equal(result.success, true);
  if (!result.success) return;
  assert.equal(result.data.name, "Teszt Elek");
  assert.equal(result.data.service, "objektumorzes");
});

test("contact schema rejects invalid email addresses", () => {
  const result = ContactPayloadSchema.safeParse({
    ...validPayload,
    email: "not-an-email",
  });

  assert.equal(result.success, false);
  if (result.success) return;
  assert.equal(result.error.issues[0]?.message, "emailInvalid");
});

test("contact schema rejects empty required fields", () => {
  const result = ContactPayloadSchema.safeParse({
    ...validPayload,
    name: "",
    email: "",
  });

  assert.equal(result.success, false);
  if (result.success) return;
  const messages = result.error.issues.map((issue) => issue.message);
  assert.ok(messages.includes("nameRequired"));
  assert.ok(messages.includes("emailRequired"));
});

test("contact schema rejects messages over the configured length limit", () => {
  const result = ContactPayloadSchema.safeParse({
    ...validPayload,
    message: "a".repeat(4001),
  });

  assert.equal(result.success, false);
});

test("contact schema accepts honeypot content so the route can return silent success", () => {
  const result = ContactPayloadSchema.safeParse({
    ...validPayload,
    _website: "bot-filled-value",
  });

  assert.equal(result.success, true);
  if (!result.success) return;
  assert.equal(result.data._website, "bot-filled-value");
});

test("contact service normalization keeps only canonical, legacy, and special service keys", () => {
  assert.equal(normalizeContactService("security"), "objektumorzes");
  assert.equal(normalizeContactService("objektumorzes"), "objektumorzes");
  assert.equal(normalizeContactService("magannyomozas"), "magannyomozas");
  assert.equal(normalizeContactService("unknown-service"), undefined);
  assert.equal(normalizeContactService(""), undefined);
});

test("unknown service values are stripped before validation succeeds", () => {
  const result = ContactPayloadSchema.safeParse({
    ...validPayload,
    service: "unknown-service",
  });

  assert.equal(result.success, true);
  if (!result.success) return;
  assert.equal(result.data.service, undefined);
});
