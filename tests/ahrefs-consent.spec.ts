import { expect, test, type BrowserContext, type Page, type Route } from "@playwright/test";

const TARGET = new URL(process.env.ANALYTICS_QA_BASE_URL || "http://localhost:3000");
const LOCAL = ["localhost", "127.0.0.1"].includes(TARGET.hostname);
// The real vendor ignores localhost. Serve the local build through a virtual
// HTTPS origin in Playwright instead of modifying the vendor's JavaScript.
const ORIGIN = LOCAL ? "https://ahrefs-qa.example.test" : TARGET.origin;
const SCRIPT = "https://analytics.ahrefs.com/analytics.js";
const KEY = "EjQ2we/Yn4waOfJdy1c5Yg";
const SCRIPT_ID = "avenir-ahrefs-script";
const ENABLED = process.env.NEXT_PUBLIC_AHREFS_ENABLED === "1";
const closingContexts = new WeakSet<BrowserContext>();

test.beforeAll(() => {
  if (["afm.hu", "www.afm.hu"].includes(TARGET.hostname) && process.env.ANALYTICS_QA_ALLOW_PRODUCTION !== "1") {
    throw new Error("Production analytics QA requires explicit --allow-production.");
  }
});

test.afterEach(async ({ context }) => {
  // Keep collection/contact interception installed until every page is closed,
  // including when a delayed real script completes after an assertion fails.
  closingContexts.add(context);
  await context.close();
});

async function network(context: BrowserContext, realScript = false) {
  const scripts: string[] = [];
  const events: Record<string, unknown>[] = [];
  let contactCalls = 0;
  await context.addInitScript(() => {
    // Official vendor opt-in for automation; never part of application code.
    (window as unknown as Record<string, unknown>).__web_analytics = true;
  });
  async function respond(route: Route) {
    const request = route.request();
    const url = new URL(request.url());
    if (url.hostname === "analytics.ahrefs.com") {
      if (url.pathname === "/analytics.js") {
        scripts.push(url.href);
        if (realScript) return route.fulfill({ response: await route.fetch() });
        return route.fulfill({ contentType: "application/javascript", body: `
          const script = document.currentScript;
          window.AhrefsAnalytics = { sendEvent(name) {
            if (!script.getAttribute('data-key')) return;
            fetch('https://analytics.ahrefs.com/api/event', {
              method: 'POST', body: JSON.stringify({ n: name, k: script.getAttribute('data-key'), u: script.getAttribute('data-page-location') })
            });
          } };
        ` });
      }
      if (url.pathname !== "/api/event") throw new Error("Unexpected Ahrefs telemetry endpoint");
      events.push(JSON.parse(request.postData() || "{}"));
      return route.fulfill({ status: 204, headers: { "access-control-allow-origin": "*" } });
    }
    if (url.hostname.includes("googletagmanager.com")) {
      return route.fulfill({ contentType: "application/javascript", body: "/* GA4 mocked: Ahrefs-only QA */" });
    }
    if (url.hostname.includes("google-analytics.com") || url.hostname.includes("analytics.google.com")) return route.abort();
    if (url.pathname === "/api/contact") {
      contactCalls++;
      return route.fulfill({ status: 200, contentType: "application/json", body: '{"success":true}' });
    }
    if (request.method() !== "GET") return route.abort();
    if (LOCAL && url.origin === ORIGIN) {
      // Next may cancel speculative prefetches while their proxy fetch is in
      // flight. Only user-requested documents/navigation need this fixture.
      if (request.headers()["next-router-prefetch"] === "1") return route.abort();
      return route.fulfill({ response: await route.fetch({ url: new URL(url.pathname + url.search, TARGET).href }) });
    }
    return route.continue();
  }
  await context.route("**/*", (route) => respond(route).catch((error: unknown) => {
    if (!closingContexts.has(context)) throw error;
  }));
  return { scripts, events, contactCalls: () => contactCalls };
}

async function choose(page: Page, accepted: boolean, en = false) {
  const name = en ? (accepted ? "Accept analytics" : "Reject") : (accepted ? "Elfogadom az analitikát" : "Elutasítom");
  await page.getByRole("button", { name, exact: true }).click();
}

for (const locale of ["hu", "en"]) {
  test(`Ahrefs stays absent before consent and rejected reload on /${locale}`, async ({ page, context }) => {
    const calls = await network(context);
    await page.goto(`${ORIGIN}/${locale}`, { waitUntil: "networkidle" });
    await expect(page.getByRole("button", { name: locale === "hu" ? "Elfogadom az analitikát" : "Accept analytics", exact: true })).toBeVisible();
    expect(calls.scripts).toEqual([]);
    expect(calls.events).toEqual([]);
    await choose(page, false, locale === "en");
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.locator(`#${SCRIPT_ID}`)).toHaveCount(0);
    expect(calls.scripts).toEqual([]);
    expect(calls.events).toEqual([]);
  });
}

test("inactive release never loads Ahrefs even after acceptance and a reload", async ({ page, context }) => {
  test.skip(ENABLED, "The activation-enabled QA build is covered by the enabled-path tests.");
  const calls = await network(context);
  await page.goto(`${ORIGIN}/hu`, { waitUntil: "networkidle" });
  await choose(page, true);
  await expect(page.locator(`#${SCRIPT_ID}`)).toHaveCount(0);
  await page.reload({ waitUntil: "networkidle" });
  await expect(page.locator(`#${SCRIPT_ID}`)).toHaveCount(0);
  expect(calls.scripts).toEqual([]);
  expect(calls.events).toEqual([]);
});

for (const legacyChoice of ["accepted", "rejected"]) {
  test(`activation respects legacy ${legacyChoice} without silently adding Ahrefs`, async ({ page, context }) => {
    test.skip(!ENABLED, "Consent migration applies only when Ahrefs is enabled.");
    const calls = await network(context);
    await context.addInitScript((choice) => {
      localStorage.setItem("avenir_analytics_consent", choice);
    }, legacyChoice);
    await page.goto(`${ORIGIN}/hu`, { waitUntil: "networkidle" });
    const accept = page.getByRole("button", { name: "Elfogadom az analitikát", exact: true });
    if (legacyChoice === "accepted") {
      await expect(accept).toBeVisible();
      expect(calls.scripts).toEqual([]);
      expect(calls.events).toEqual([]);
      await accept.click();
      await expect.poll(() => calls.events.length).toBe(1);
    } else {
      await expect(accept).not.toBeVisible();
      expect(calls.scripts).toEqual([]);
      expect(calls.events).toEqual([]);
    }
  });
}

test("acceptance inserts one async head tag, sanitized pageview, withdrawal and reacceptance", async ({ page, context }) => {
  test.skip(!ENABLED, "SCC activation gate is closed; run an intercepted local build with NEXT_PUBLIC_AHREFS_ENABLED=1 to test activation.");
  const calls = await network(context);
  const response = await page.goto(`${ORIGIN}/hu?email=private@example.test#secret`);
  const csp = response?.headers()["content-security-policy"] ?? "";
  expect(csp).toContain("https://analytics.ahrefs.com");
  expect(csp).not.toMatch(/fonts\.googleapis|doubleclick|googleadservices|floodlight/);
  await choose(page, true);
  await expect.poll(() => calls.events.length).toBe(1);
  const script = page.locator(`head > script#${SCRIPT_ID}`);
  await expect(script).toHaveAttribute("data-key", KEY);
  await expect(script).toHaveAttribute("async", "");
  expect(calls.scripts).toEqual([SCRIPT]);
  expect(calls.events[0]).toMatchObject({ n: "pageview", k: KEY, u: `${ORIGIN}/hu` });
  expect(JSON.stringify(calls.events)).not.toContain("private@example.test");
  await page.getByRole("button", { name: "Süti beállítások", exact: true }).click();
  await choose(page, false);
  await expect(script).not.toHaveAttribute("data-key", KEY);
  await page.getByRole("button", { name: "Süti beállítások", exact: true }).click();
  await choose(page, true);
  await expect.poll(() => calls.events.length).toBe(2);
  expect(calls.scripts).toHaveLength(1);
});

test("cross-tab rejection disables Ahrefs without another measurement", async ({ page, context }) => {
  test.skip(!ENABLED, "SCC activation gate is closed.");
  const calls = await network(context);
  await page.goto(`${ORIGIN}/hu`);
  await choose(page, true);
  await expect.poll(() => calls.events.length).toBe(1);
  const other = await context.newPage();
  await other.goto(`${ORIGIN}/hu`);
  await expect.poll(() => calls.events.length).toBe(2);
  await other.getByRole("button", { name: "Süti beállítások", exact: true }).click();
  await choose(other, false);
  await expect(page.locator(`#${SCRIPT_ID}`)).not.toHaveAttribute("data-key", KEY);
  expect(calls.events).toHaveLength(2);
});

test("storage failure and query-bearing referrers keep Ahrefs blocked", async ({ page, context }) => {
  const calls = await network(context);
  await page.goto(`${ORIGIN}/hu`, { referer: "https://example.test/?email=private@example.test" });
  await choose(page, true);
  await expect(page.locator(`#${SCRIPT_ID}`)).toHaveCount(0);
  await page.evaluate(() => localStorage.clear());
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error("Storage unavailable"); };
    Storage.prototype.setItem = () => { throw new Error("Storage unavailable"); };
  });
  await page.goto(`${ORIGIN}/en`);
  await choose(page, true, true);
  await expect(page.getByRole("button", { name: "Accept analytics", exact: true })).toBeVisible();
  expect(calls.scripts).toEqual([]);
  expect(calls.events).toEqual([]);
});

test("real Ahrefs script attempts pageview collection and SPA pageview without link/form PII", async ({ page, context }) => {
  test.skip(!ENABLED, "SCC activation gate is closed; do not send real production measurement.");
  const calls = await network(context, true);
  await page.goto(`${ORIGIN}/hu?email=private@example.test#secret`);
  await choose(page, true);
  await expect.poll(() => calls.events.length).toBe(1);
  expect(calls.events[0]).toMatchObject({ n: "pageview", k: KEY, u: `${ORIGIN}/hu` });

  // A real link activation would leak the current query through vendor auto
  // click tracking without our capture-phase suppression. Default navigation
  // is intentionally not cancelled by the application or the test.
  await page.evaluate(() => {
    const link = document.createElement("a");
    link.href = "#ahrefs-qa";
    link.textContent = "Ahrefs QA anchor";
    document.body.appendChild(link);
  });
  await page.getByRole("link", { name: "Ahrefs QA anchor", exact: true }).click();
  await page.waitForTimeout(200);
  expect(calls.events).toHaveLength(1);

  const contact = page.locator("#contact form");
  await contact.locator('input[name="name"]').fill("Ahrefs QA Person");
  await contact.locator('input[name="organization"]').fill("Ahrefs QA Company");
  await contact.locator('input[name="email"]').fill("ahrefs.qa@example.test");
  await contact.locator('input[name="tel"]').fill("+36 70 000 0000");
  await contact.locator('textarea[name="message"]').fill("Ahrefs QA private message must never reach analytics");
  const privacy = contact.locator('input[type="checkbox"]');
  if (await privacy.count()) await privacy.check();
  await contact.locator('button[type="submit"]').click();
  await expect.poll(calls.contactCalls).toBe(1);
  expect(calls.events).toHaveLength(1);

  await page.locator('a[href="/hu/szolgaltatasok/objektumorzes"]').first().click();
  await expect(page).toHaveURL(`${ORIGIN}/hu/szolgaltatasok/objektumorzes`);
  await expect.poll(() => calls.events.length).toBe(2);
  expect(calls.events[1]).toMatchObject({ n: "pageview", u: `${ORIGIN}/hu/szolgaltatasok/objektumorzes` });
  expect(calls.scripts).toHaveLength(1);
  expect(calls.events.every((event) => event.n === "pageview")).toBe(true);
  await page.getByRole("button", { name: "Süti beállítások", exact: true }).click();
  await choose(page, false);
  await page.locator('a[href="/hu"]').first().click();
  await expect(page).toHaveURL((url) => url.origin === ORIGIN && url.pathname === "/hu");
  await page.waitForTimeout(200);
  expect(calls.events).toHaveLength(2);
  const payload = JSON.stringify(calls.events);
  for (const pii of ["private@example.test", "Ahrefs QA Person", "Ahrefs QA Company", "+36 70 000 0000", "ahrefs.qa@example.test", "Ahrefs QA private message", "#secret", "#ahrefs-qa"]) {
    expect(payload).not.toContain(pii);
  }
});
