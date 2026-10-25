import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test, { afterEach } from "node:test";
import {
  AHREFS_DATA_KEY,
  AHREFS_SCRIPT_ID,
  disableAhrefsAnalytics,
  isSafeAhrefsReferrer,
  suppressAhrefsAutomaticInteraction,
  syncAhrefsAnalytics,
} from "../lib/analytics/ahrefs";

const originalWindow = globalThis.window;
const originalDocument = globalThis.document;
const originalFlag = process.env.NEXT_PUBLIC_AHREFS_ENABLED;

afterEach(() => {
  Object.defineProperty(globalThis, "window", { configurable: true, value: originalWindow });
  Object.defineProperty(globalThis, "document", { configurable: true, value: originalDocument });
  if (originalFlag === undefined) delete process.env.NEXT_PUBLIC_AHREFS_ENABLED;
  else process.env.NEXT_PUBLIC_AHREFS_ENABLED = originalFlag;
});

function fixture(choice: string | null = null, referrer = "") {
  process.env.NEXT_PUBLIC_AHREFS_ENABLED = "1";
  let consent = choice;
  const scripts: FakeScript[] = [];
  const calls: string[] = [];
  class FakeScript extends EventTarget {
    id = "";
    src = "";
    async = false;
    dataset: Record<string, string> = {};
    attributes = new Map<string, string>();
    setAttribute(key: string, value: string) { this.attributes.set(key, value); }
    removeAttribute(key: string) { this.attributes.delete(key); }
    getAttribute(key: string) { return this.attributes.get(key) ?? null; }
    remove() { scripts.splice(scripts.indexOf(this), 1); }
  }
  const location = { href: "https://www.afm.hu/hu?email=private@example.test#secret", pathname: "/hu" };
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { location, localStorage: { getItem: (key: string) => key === "avenir_analytics_consent" && consent === "accepted" ? "accepted:v2" : consent }, AhrefsAnalytics: { sendEvent: (name: string) => calls.push(name) } },
  });
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: {
      referrer,
      createElement: () => new FakeScript(),
      querySelector: () => scripts[0] ?? null,
      head: { appendChild: (script: FakeScript) => scripts.push(script) },
    },
  });
  return { scripts, calls, location, setConsent: (value: string | null) => { consent = value; } };
}

test("Ahrefs is integrated through a client consent gate, not a server-rendered head tag", () => {
  const layout = readFileSync("app/[locale]/layout.tsx", "utf8");
  assert.match(layout, /<AhrefsAnalytics\s*\/>/);
  assert.doesNotMatch(layout, /<script[^>]*analytics\.ahrefs\.com/);
  assert.ok(existsSync("components/analytics/AhrefsAnalytics.tsx"));
});

test("Ahrefs is disabled by default even when analytics was accepted", () => {
  const state = fixture("accepted");
  delete process.env.NEXT_PUBLIC_AHREFS_ENABLED;
  syncAhrefsAnalytics();
  assert.equal(state.scripts.length, 0);
  assert.deepEqual(state.calls, []);
});

test("Ahrefs CSP permits only its exact script and collection origin", () => {
  const config = readFileSync("next.config.ts", "utf8");
  assert.equal((config.match(/"https:\/\/analytics\.ahrefs\.com"/g) ?? []).length, 2);
  assert.doesNotMatch(config, /\*\.ahrefs\.com|fonts\.googleapis\.com|doubleclick\.net/);
});

test("Ahrefs makes no script or measurement before consent and after rejection", () => {
  const state = fixture();
  syncAhrefsAnalytics();
  state.setConsent("rejected");
  syncAhrefsAnalytics();
  assert.equal(state.scripts.length, 0);
  assert.deepEqual(state.calls, []);
});

test("Ahrefs loads once, waits for load, sanitizes the page URL and deduplicates pageviews", () => {
  const state = fixture("accepted");
  syncAhrefsAnalytics();
  syncAhrefsAnalytics();
  assert.equal(state.scripts.length, 1);
  const script = state.scripts[0];
  assert.equal(script.id, AHREFS_SCRIPT_ID);
  assert.equal(script.async, true);
  assert.equal(script.getAttribute("data-key"), AHREFS_DATA_KEY);
  assert.equal(script.getAttribute("data-no-pageview-auto"), "");
  assert.equal(script.getAttribute("data-page-location"), "https://www.afm.hu/hu");
  assert.deepEqual(state.calls, []);
  script.dispatchEvent(new Event("load"));
  syncAhrefsAnalytics();
  assert.deepEqual(state.calls, ["pageview"]);
  state.location.href = "https://www.afm.hu/hu/szolgaltatasok/objektumorzes?name=private#secret";
  state.location.pathname = "/hu/szolgaltatasok/objektumorzes";
  syncAhrefsAnalytics();
  assert.deepEqual(state.calls, ["pageview", "pageview"]);
  assert.equal(script.getAttribute("data-page-location"), "https://www.afm.hu/hu/szolgaltatasok/objektumorzes");
});

test("withdrawal blocks pending loads and reacceptance reuses a single tag", () => {
  const state = fixture("accepted");
  syncAhrefsAnalytics();
  state.setConsent("rejected");
  syncAhrefsAnalytics();
  const script = state.scripts[0];
  assert.equal(script.getAttribute("data-key"), null);
  script.dispatchEvent(new Event("load"));
  assert.deepEqual(state.calls, []);
  state.setConsent("accepted");
  syncAhrefsAnalytics();
  assert.equal(state.scripts.length, 1);
  assert.deepEqual(state.calls, ["pageview"]);
  disableAhrefsAnalytics();
  assert.equal(script.getAttribute("data-key"), null);
});

test("automatic interactions are suspended without restoring a withdrawn consent", async () => {
  const state = fixture("accepted");
  syncAhrefsAnalytics();
  const script = state.scripts[0];
  script.dispatchEvent(new Event("load"));
  suppressAhrefsAutomaticInteraction();
  assert.equal(script.getAttribute("data-key"), null);
  await Promise.resolve();
  assert.equal(script.getAttribute("data-key"), null, "native event listeners run after capture-phase microtasks");
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(script.getAttribute("data-key"), AHREFS_DATA_KEY);
  suppressAhrefsAutomaticInteraction();
  state.setConsent("rejected");
  syncAhrefsAnalytics();
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(script.getAttribute("data-key"), null);
  assert.deepEqual(state.calls, ["pageview"]);
});

test("Ahrefs skips referrers containing query/fragment credentials and private routes", () => {
  for (const referrer of ["https://example.test/?email=private@example.test", "https://example.test/#secret", "https://user:password@example.test/", "invalid"]) {
    assert.equal(isSafeAhrefsReferrer(referrer), false);
    const state = fixture("accepted", referrer);
    syncAhrefsAnalytics();
    assert.equal(state.scripts.length, 0);
  }
  assert.equal(isSafeAhrefsReferrer(""), true);
  assert.equal(isSafeAhrefsReferrer("https://www.google.com/"), true);
  const state = fixture("accepted");
  state.location.pathname = "/admin";
  syncAhrefsAnalytics();
  assert.equal(state.scripts.length, 0);
});

test("a script network failure is optional and can be retried", () => {
  const state = fixture("accepted");
  syncAhrefsAnalytics();
  state.scripts[0].dispatchEvent(new Event("error"));
  assert.equal(state.scripts.length, 0);
  assert.doesNotThrow(syncAhrefsAnalytics);
  assert.equal(state.scripts.length, 1);
});
