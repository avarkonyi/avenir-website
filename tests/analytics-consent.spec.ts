import { expect, test, type Page, type Route } from "@playwright/test";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __avenirGa4Initialized?: boolean;
    __analyticsQaGtagScriptLoaded?: boolean;
  }
}

const BASE_URL = process.env.ANALYTICS_QA_BASE_URL || "http://localhost:3000";
const PRODUCTION_HOSTS = new Set(["www.afm.hu", "afm.hu"]);

const TEST_PII = {
  name: "Analytics QA Person",
  company: "Analytics QA Company",
  email: "analytics.qa@example.test",
  phone: "+36 70 000 0000",
  message: "Analytics QA message body must not reach dataLayer 20260525",
};

const ALLOWED_EVENT_PARAM_KEYS = new Set([
  "event_type",
  "locale",
  "path",
  "selected_service_key",
  "selected_service_label",
]);

type AnalyticsNetwork = {
  gtagScriptRequests: string[];
  collectRequests: string[];
  contactRequests: string[];
};

test.beforeAll(() => {
  const url = new URL(BASE_URL);
  const isProduction = PRODUCTION_HOSTS.has(url.hostname.toLowerCase());
  const allowProduction = process.env.ANALYTICS_QA_ALLOW_PRODUCTION === "1";

  if (isProduction && !allowProduction) {
    throw new Error(
      "Refusing to run analytics QA against production without --allow-production.",
    );
  }
});

test.describe("consent-gated GA4", () => {
  for (const path of [
    "/hu",
    "/en",
    "/hu/szolgaltatasok/objektumorzes",
    "/en/szolgaltatasok/objektumorzes",
  ]) {
    test(`does not load GA4 before consent on ${path}`, async ({ page }) => {
      const analytics = await mockAnalyticsNetwork(page);

      await page.goto(path, { waitUntil: "networkidle" });

      await expect(consentBanner(page)).toBeVisible();
      await page.waitForTimeout(500);
      expect(analytics.gtagScriptRequests).toEqual([]);
      expect(analytics.collectRequests).toEqual([]);
      await expectNoGa4Runtime(page);
    });
  }

  test("rejecting analytics persists and keeps GA4 blocked after reload", async ({
    page,
  }) => {
    const analytics = await mockAnalyticsNetwork(page);

    await page.goto("/hu", { waitUntil: "networkidle" });
    await rejectAnalytics(page);
    await expect(consentBanner(page)).toBeHidden();

    await page.reload({ waitUntil: "networkidle" });

    await expect(consentBanner(page)).toBeHidden();
    await expect
      .poll(() => analytics.gtagScriptRequests.length)
      .toBe(0);
    expect(analytics.collectRequests).toEqual([]);
    await expectNoGa4Runtime(page);
  });

  test("accepting analytics loads direct GA4 and initializes dataLayer", async ({
    page,
  }) => {
    const analytics = await mockAnalyticsNetwork(page);

    await page.goto("/en", { waitUntil: "networkidle" });
    await acceptAnalytics(page);

    await expect
      .poll(() => analytics.gtagScriptRequests.length)
      .toBeGreaterThan(0);

    const measurementId = observedMeasurementId(analytics.gtagScriptRequests);
    const expectedId = process.env.NEXT_PUBLIC_GA4_ID?.trim();
    if (expectedId) expect(measurementId).toBe(expectedId);
    expect(measurementId).toMatch(/^G-[A-Z0-9]+$/);

    await expect
      .poll(() =>
        page.evaluate(() => Boolean(window.__analyticsQaGtagScriptLoaded)),
      )
      .toBe(true);

    const dataLayer = await readDataLayer(page);
    expect(
      dataLayer.some((entry) => Array.isArray(entry) && entry[0] === "js"),
    ).toBe(true);
    expect(
      dataLayer.some(
        (entry) =>
          Array.isArray(entry) &&
          entry[0] === "config" &&
          entry[1] === measurementId,
      ),
    ).toBe(true);
    await expect
      .poll(() => page.evaluate(() => typeof window.gtag))
      .toBe("function");
  });

  test("cookie settings can reopen consent and change the decision", async ({
    page,
  }) => {
    await mockAnalyticsNetwork(page);

    await page.goto("/hu", { waitUntil: "networkidle" });
    await rejectAnalytics(page);
    await page.reload({ waitUntil: "networkidle" });
    await expect(consentBanner(page)).toBeHidden();

    await page.getByRole("button", { name: "Süti beállítások" }).click();
    await expect(consentBanner(page)).toBeVisible();
    await acceptAnalytics(page);

    await expect
      .poll(() =>
        page.evaluate(() =>
          window.localStorage.getItem("avenir_analytics_consent"),
        ),
      )
      .toBe("accepted");
  });

  test("contact success analytics event is emitted without PII or a real API write", async ({
    page,
  }) => {
    await mockAnalyticsNetwork(page);
    const contact = await mockContactApi(page, 200, { ok: true });

    await page.goto("/en", { waitUntil: "networkidle" });
    await acceptAnalytics(page);
    await fillContactForm(page);
    await page.getByRole("button", { name: "Send Request" }).click();

    await expect
      .poll(() => analyticsEvents(page, "contact_submit_success"))
      .toHaveLength(1);

    expect(contact.requests).toHaveLength(1);
    const events = await analyticsEvents(page, "contact_submit_success");
    assertNoPii(events);
    assertAllowedBusinessEventParams(events);
  });

  test("contact error analytics event is emitted without PII or a real API write", async ({
    page,
  }) => {
    await mockAnalyticsNetwork(page);
    const contact = await mockContactApi(page, 500, { ok: false });

    await page.goto("/en", { waitUntil: "networkidle" });
    await acceptAnalytics(page);
    await fillContactForm(page);
    await page.getByRole("button", { name: "Send Request" }).click();

    await expect
      .poll(() => analyticsEvents(page, "contact_submit_error"))
      .toHaveLength(1);

    expect(contact.requests).toHaveLength(1);
    const events = await analyticsEvents(page, "contact_submit_error");
    assertNoPii(events);
    assertAllowedBusinessEventParams(events);
  });

  test("special service selection emits a safe event and shows the warning", async ({
    page,
  }) => {
    await mockAnalyticsNetwork(page);

    await page.goto("/en", { waitUntil: "networkidle" });
    await acceptAnalytics(page);
    await page.getByLabel("Service of interest").selectOption("magannyomozas");

    await expect(page.getByLabel("Special data warning")).toBeVisible();
    await expect
      .poll(() => analyticsEvents(page, "special_service_option_selected"))
      .toHaveLength(1);

    const events = await analyticsEvents(
      page,
      "special_service_option_selected",
    );
    assertNoPii(events);
    assertAllowedBusinessEventParams(events);
  });

  test("phone and email clicks emit safe events without exposing contact values", async ({
    page,
  }) => {
    await mockAnalyticsNetwork(page);

    await page.goto("/en", { waitUntil: "networkidle" });
    await acceptAnalytics(page);
    await preventTelAndMailtoNavigation(page);

    const phoneLink = page.locator('#contact a[href^="tel:"]').first();
    const emailLink = page.locator('#contact a[href^="mailto:"]').first();

    test.skip((await phoneLink.count()) === 0, "No tel: link on tested page.");
    await phoneLink.click();
    await expect.poll(() => analyticsEvents(page, "phone_click")).toHaveLength(1);

    test.skip(
      (await emailLink.count()) === 0,
      "No mailto: link on tested page.",
    );
    await emailLink.click();
    await expect.poll(() => analyticsEvents(page, "email_click")).toHaveLength(1);

    const events = [
      ...(await analyticsEvents(page, "phone_click")),
      ...(await analyticsEvents(page, "email_click")),
    ];
    assertNoPii(events, ["+36 70 316 8218", "info@afm.hu"]);
    assertAllowedBusinessEventParams(events);
  });

  test("CSP allows direct GA4 endpoints without Ads or DoubleClick endpoints", async ({
    page,
  }) => {
    const response = await page.goto("/hu", { waitUntil: "domcontentloaded" });
    const csp = response?.headers()["content-security-policy"] ?? "";

    expect(csp).toContain("googletagmanager.com");
    expect(csp).toContain("google-analytics.com");
    expect(csp).toContain("analytics.google.com");
    expect(csp).not.toMatch(/doubleclick\.net/i);
    expect(csp).not.toMatch(/googleadservices\.com/i);
    expect(csp).not.toMatch(/pagead/i);
    expect(csp).not.toMatch(/floodlight/i);
  });
});

async function mockAnalyticsNetwork(page: Page): Promise<AnalyticsNetwork> {
  const analytics: AnalyticsNetwork = {
    gtagScriptRequests: [],
    collectRequests: [],
    contactRequests: [],
  };

  page.on("request", (request) => {
    const url = request.url();
    if (isGtagScriptUrl(url)) analytics.gtagScriptRequests.push(url);
    if (isAnalyticsCollectUrl(url)) analytics.collectRequests.push(url);
    if (new URL(url).pathname === "/api/contact") analytics.contactRequests.push(url);
  });

  await page.route("**://www.googletagmanager.com/gtag/js**", fulfillGtagScript);
  await page.route("**://*.googletagmanager.com/gtag/js**", fulfillGtagScript);
  await page.route("**://www.google-analytics.com/**", fulfillNoContent);
  await page.route("**://*.google-analytics.com/**", fulfillNoContent);
  await page.route("**://analytics.google.com/**", fulfillNoContent);
  await page.route("**://*.analytics.google.com/**", fulfillNoContent);

  return analytics;
}

async function fulfillGtagScript(route: Route) {
  await route.fulfill({
    status: 200,
    contentType: "application/javascript",
    body: "window.__analyticsQaGtagScriptLoaded = true;",
  });
}

async function fulfillNoContent(route: Route) {
  await route.fulfill({ status: 204, body: "" });
}

async function mockContactApi(
  page: Page,
  status: number,
  body: Record<string, unknown>,
) {
  const requests: string[] = [];

  await page.route("**/api/contact", async (route) => {
    requests.push(route.request().url());
    await route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });

  return { requests };
}

function consentBanner(page: Page) {
  return page.getByText(
    /Analitikai sütiket csak hozzájárulás esetén használunk|We use analytics cookies only with your consent/,
  );
}

async function acceptAnalytics(page: Page) {
  await expect(consentBanner(page)).toBeVisible();
  await page
    .getByRole("button", { name: /^(Accept analytics|Elfogadom az analitikát)$/ })
    .click();
  await expect(consentBanner(page)).toBeHidden();
}

async function rejectAnalytics(page: Page) {
  await expect(consentBanner(page)).toBeVisible();
  await page.getByRole("button", { name: /^(Reject|Elutasítom)$/ }).click();
  await expect(consentBanner(page)).toBeHidden();
}

async function expectNoGa4Runtime(page: Page) {
  const runtime = await page.evaluate(() => ({
    hasGtag: typeof window.gtag === "function",
    initialized: window.__avenirGa4Initialized === true,
    hasDataLayer: Array.isArray(window.dataLayer),
  }));

  expect(runtime).toEqual({
    hasGtag: false,
    initialized: false,
    hasDataLayer: false,
  });
}

function observedMeasurementId(gtagScriptRequests: string[]): string {
  const measurementId = gtagScriptRequests
    .map((url) => new URL(url).searchParams.get("id"))
    .find((id): id is string => Boolean(id));

  if (!measurementId) {
    throw new Error("Expected gtag.js request to include an id parameter.");
  }

  return measurementId;
}

async function readDataLayer(page: Page): Promise<unknown[]> {
  return page.evaluate(() => window.dataLayer ?? []);
}

async function analyticsEvents(page: Page, eventName: string) {
  const dataLayer = await readDataLayer(page);
  return dataLayer
    .filter(
      (entry) =>
        Array.isArray(entry) && entry[0] === "event" && entry[1] === eventName,
    )
    .map((entry) => ({
      raw: entry,
      params:
        Array.isArray(entry) && isRecord(entry[2])
          ? (entry[2] as Record<string, unknown>)
          : {},
    }));
}

async function fillContactForm(page: Page) {
  await page.getByLabel("Full name").fill(TEST_PII.name);
  await page.getByLabel("Company").fill(TEST_PII.company);
  await page.getByLabel("Email address").fill(TEST_PII.email);
  await page.getByLabel("Phone number").fill(TEST_PII.phone);
  await page.getByLabel("Service of interest").selectOption("objektumorzes");
  await page.getByLabel("Message / Requirements").fill(TEST_PII.message);
}

async function preventTelAndMailtoNavigation(page: Page) {
  await page.evaluate(() => {
    document.addEventListener(
      "click",
      (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;

        const anchor = target.closest("a");
        const href = anchor?.getAttribute("href") ?? "";
        if (href.startsWith("tel:") || href.startsWith("mailto:")) {
          event.preventDefault();
        }
      },
      true,
    );
  });
}

function assertNoPii(
  entries: unknown[],
  extraForbiddenValues: string[] = [],
) {
  const serialized = JSON.stringify(entries);
  const forbiddenValues = [
    TEST_PII.name,
    TEST_PII.company,
    TEST_PII.email,
    TEST_PII.phone,
    TEST_PII.message,
    ...extraForbiddenValues,
  ];

  for (const value of forbiddenValues) {
    expect(serialized).not.toContain(value);
  }
}

function assertAllowedBusinessEventParams(
  events: { params: Record<string, unknown> }[],
) {
  for (const event of events) {
    for (const key of Object.keys(event.params)) {
      expect(ALLOWED_EVENT_PARAM_KEYS.has(key)).toBe(true);
    }
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isGtagScriptUrl(url: string): boolean {
  const parsed = new URL(url);
  return (
    parsed.hostname.endsWith("googletagmanager.com") &&
    parsed.pathname === "/gtag/js"
  );
}

function isAnalyticsCollectUrl(url: string): boolean {
  const parsed = new URL(url);
  const host = parsed.hostname;
  const isAnalyticsHost =
    host === "www.google-analytics.com" ||
    host.endsWith(".google-analytics.com") ||
    host === "analytics.google.com" ||
    host.endsWith(".analytics.google.com");

  return isAnalyticsHost && parsed.pathname.includes("/collect");
}
