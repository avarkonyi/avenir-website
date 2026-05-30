import assert from "node:assert/strict";
import test, { afterEach } from "node:test";
import { ANALYTICS_CONSENT_KEY } from "../lib/analytics/consent";
import { trackAnalyticsEvent } from "../lib/analytics/events";

type GtagCall = [string, string, Record<string, unknown>];

const originalWindow = globalThis.window;

afterEach(() => {
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: originalWindow,
  });
});

test("analytics events are ignored before consent", () => {
  const calls = installFakeWindow("rejected");

  trackAnalyticsEvent("contact_submit_success", {
    locale: "hu",
    path: "/hu",
  });

  assert.deepEqual(calls, []);
});

test("analytics event helper forwards only approved non-PII parameters", () => {
  const calls = installFakeWindow("accepted");

  trackAnalyticsEvent("contact_submit_success", {
    locale: "en",
    path: "/en",
    selected_service_key: "objektumorzes",
    selected_service_label: "On-site Security Guarding",
    event_type: "form_submit",
    name: "Sensitive Name",
    email: "sensitive@example.com",
    phone: "+36 70 000 0000",
    company: "Sensitive Company",
    message: "Sensitive message body",
  } as never);

  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], "event");
  assert.equal(calls[0][1], "contact_submit_success");
  assert.deepEqual(calls[0][2], {
    locale: "en",
    path: "/en",
    selected_service_key: "objektumorzes",
    selected_service_label: "On-site Security Guarding",
    event_type: "form_submit",
  });

  const serialized = JSON.stringify(calls);
  assert.equal(serialized.includes("Sensitive Name"), false);
  assert.equal(serialized.includes("sensitive@example.com"), false);
  assert.equal(serialized.includes("+36 70 000 0000"), false);
  assert.equal(serialized.includes("Sensitive Company"), false);
  assert.equal(serialized.includes("Sensitive message body"), false);
});

test("analytics event helper falls back to the current path without adding free text", () => {
  const calls = installFakeWindow("accepted", "/hu/szolgaltatasok/hard-fm");

  trackAnalyticsEvent("service_cta_click", {
    locale: "hu",
  });

  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0][2], {
    locale: "hu",
    path: "/hu/szolgaltatasok/hard-fm",
  });
});

test("analytics event helper forwards only approved embedded quote parameters", () => {
  const calls = installFakeWindow("accepted", "/en/szolgaltatasok/soft-fm");

  trackAnalyticsEvent("service_quote_form_submit_success", {
    locale: "en",
    service_slug: "soft-fm",
    service_label: "Soft FM",
    form_variant: "service_embedded",
    name: "Sensitive Name",
    email: "sensitive@example.com",
    phone: "+36 70 000 0000",
    company: "Sensitive Company",
    message: "Sensitive message body",
  } as never);

  assert.equal(calls.length, 1);
  assert.equal(calls[0][1], "service_quote_form_submit_success");
  assert.deepEqual(calls[0][2], {
    locale: "en",
    path: "/en/szolgaltatasok/soft-fm",
    service_slug: "soft-fm",
    service_label: "Soft FM",
    form_variant: "service_embedded",
  });

  const serialized = JSON.stringify(calls);
  assert.equal(serialized.includes("Sensitive Name"), false);
  assert.equal(serialized.includes("sensitive@example.com"), false);
  assert.equal(serialized.includes("+36 70 000 0000"), false);
  assert.equal(serialized.includes("Sensitive Company"), false);
  assert.equal(serialized.includes("Sensitive message body"), false);
});

function installFakeWindow(
  consent: "accepted" | "rejected",
  pathname = "/hu",
): GtagCall[] {
  const calls: GtagCall[] = [];
  const storage = new Map<string, string>([[ANALYTICS_CONSENT_KEY, consent]]);

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      localStorage: {
        getItem(key: string) {
          return storage.get(key) ?? null;
        },
      },
      location: { pathname },
      gtag(...args: GtagCall) {
        calls.push(args);
      },
    },
  });

  return calls;
}
