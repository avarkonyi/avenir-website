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
  "service_slug",
  "service_label",
  "form_variant",
]);

type AnalyticsNetwork = {
  gtagScriptRequests: string[];
  gtagScriptResponseStatuses: number[];
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

  test("accepting analytics loads direct GA4 and sends collect requests", async ({
    page,
  }) => {
    const analytics = await mockAnalyticsNetwork(page);

    await page.goto("/hu", { waitUntil: "networkidle" });
    await acceptAnalytics(page);

    await expect
      .poll(() => analytics.gtagScriptRequests.length)
      .toBeGreaterThan(0);

    const measurementId = observedMeasurementId(analytics.gtagScriptRequests);
    const expectedId = process.env.NEXT_PUBLIC_GA4_ID?.trim();
    if (expectedId) expect(measurementId).toBe(expectedId);
    expect(measurementId).toMatch(/^G-[A-Z0-9]+$/);

    expect(
      analytics.gtagScriptResponseStatuses.some((status) => status >= 200 && status < 400),
    ).toBe(true);

    await expect
      .poll(async () => {
        const dataLayer = await readDataLayer(page);
        return (
          hasJsEntry(dataLayer) &&
          hasConfigEntry(dataLayer, measurementId) &&
          hasPageViewEvent(dataLayer, {
            measurementId,
            pagePath: "/hu",
            pageUrlPattern: /\/hu$/,
          })
        );
      })
      .toBe(true);
    expectPageViewEvent(await readDataLayer(page), {
      measurementId,
      pagePath: "/hu",
      pageUrlPattern: /\/hu$/,
    });
    await expect
      .poll(() => page.evaluate(() => typeof window.gtag))
      .toBe("function");

    await expect
      .poll(() => analytics.collectRequests.length)
      .toBeGreaterThan(0);
    expect(analytics.collectRequests.some(isGa4CollectUrl)).toBe(true);

    const collectCountBeforeNavigation = analytics.collectRequests.length;
    await page
      .getByRole("link", { name: /Élőerős objektumőrzés/ })
      .first()
      .click();
    await expect(page).toHaveURL(/\/hu\/szolgaltatasok\/objektumorzes$/);
    await expect
      .poll(() => analytics.collectRequests.length)
      .toBeGreaterThan(collectCountBeforeNavigation);
    expectPageViewEvent(await readDataLayer(page), {
      measurementId,
      pagePath: "/hu/szolgaltatasok/objektumorzes",
      pageUrlPattern: /\/hu\/szolgaltatasok\/objektumorzes$/,
    });
  });

  test("real gtag.js sends collect requests after consent and route changes", async ({
    page,
  }) => {
    const analytics = await mockAnalyticsNetwork(page, {
      mockGtagScript: false,
    });

    await page.goto("/hu", { waitUntil: "networkidle" });
    await acceptAnalytics(page);

    await expect
      .poll(() => analytics.gtagScriptRequests.length)
      .toBeGreaterThan(0);
    await expect
      .poll(() => analytics.collectRequests.filter(isGa4CollectUrl).length)
      .toBeGreaterThan(0);

    const collectCountBeforeNavigation =
      analytics.collectRequests.filter(isGa4CollectUrl).length;
    await page
      .getByRole("link", { name: /Élőerős objektumőrzés/ })
      .first()
      .click();
    await expect(page).toHaveURL(/\/hu\/szolgaltatasok\/objektumorzes$/);
    await expect
      .poll(() => analytics.collectRequests.filter(isGa4CollectUrl).length)
      .toBeGreaterThan(collectCountBeforeNavigation);
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
    await waitForGtagRuntime(page);
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
    await waitForGtagRuntime(page);
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

  test("service quote success funnel emits precise events without PII or a real API write", async ({
    page,
  }) => {
    await mockAnalyticsNetwork(page);
    const contact = await mockContactApi(page, 200, { ok: true });

    await page.goto("/en/szolgaltatasok/objektumorzes", {
      waitUntil: "networkidle",
    });
    await acceptAnalytics(page);
    await waitForGtagRuntime(page);
    await openServiceQuoteForm(page);

    await expect
      .poll(() => analyticsEvents(page, "service_quote_cta_click"))
      .toHaveLength(1);
    await expect
      .poll(() => analyticsEvents(page, "service_quote_form_open"))
      .toHaveLength(1);

    await fillServiceQuoteForm(page);

    await expect
      .poll(() => analyticsEvents(page, "service_quote_form_start"))
      .toHaveLength(1);
    await page
      .locator("#service-quote")
      .getByLabel("Phone")
      .fill(TEST_PII.phone + " 1");
    await expect
      .poll(() => analyticsEvents(page, "service_quote_form_start"))
      .toHaveLength(1);

    await page.locator("#service-quote").getByRole("button", { name: "Send" }).click();

    await expect
      .poll(() => analyticsEvents(page, "service_quote_form_submit_success"))
      .toHaveLength(1);

    expect(contact.requests).toHaveLength(1);
    const events = await serviceQuoteEvents(page);
    assertNoPii(events);
    assertAllowedBusinessEventParams(events);
    assertServiceQuoteEventParams(events, {
      locale: "en",
      serviceSlug: "objektumorzes",
      serviceLabel: "On-site Security Guarding",
      path: "/en/szolgaltatasok/objektumorzes",
    });
  });

  test("service quote error funnel emits precise error event without PII or a real API write", async ({
    page,
  }) => {
    await mockAnalyticsNetwork(page);
    const contact = await mockContactApi(page, 500, { ok: false });

    await page.goto("/en/szolgaltatasok/objektumorzes", {
      waitUntil: "networkidle",
    });
    await acceptAnalytics(page);
    await waitForGtagRuntime(page);
    await openServiceQuoteForm(page);
    await fillServiceQuoteForm(page);
    await page.locator("#service-quote").getByRole("button", { name: "Send" }).click();

    await expect
      .poll(() => analyticsEvents(page, "service_quote_form_submit_error"))
      .toHaveLength(1);

    expect(contact.requests).toHaveLength(1);
    const events = await serviceQuoteEvents(page);
    assertNoPii(events);
    assertAllowedBusinessEventParams(events);
    assertServiceQuoteEventParams(events, {
      locale: "en",
      serviceSlug: "objektumorzes",
      serviceLabel: "On-site Security Guarding",
      path: "/en/szolgaltatasok/objektumorzes",
    });
  });

  test("service quote form_start fires once per open form session", async ({
    page,
  }) => {
    await mockAnalyticsNetwork(page);

    await page.goto("/en/szolgaltatasok/objektumorzes", {
      waitUntil: "networkidle",
    });
    await acceptAnalytics(page);
    await waitForGtagRuntime(page);
    await openServiceQuoteForm(page);

    const quote = page.locator("#service-quote");
    await quote.getByLabel("Name").fill(TEST_PII.name);
    await quote.getByLabel("Email").fill(TEST_PII.email);

    await expect
      .poll(() => analyticsEvents(page, "service_quote_form_start"))
      .toHaveLength(1);

    await quote.getByRole("button", { name: "Cancel" }).click();
    await openServiceQuoteForm(page);
    await quote.getByLabel("Name").fill(`${TEST_PII.name} Second`);

    await expect
      .poll(() => analyticsEvents(page, "service_quote_form_start"))
      .toHaveLength(2);

    const events = await analyticsEvents(page, "service_quote_form_start");
    assertNoPii(events);
    assertAllowedBusinessEventParams(events);
    assertServiceQuoteEventParams(events, {
      locale: "en",
      serviceSlug: "objektumorzes",
      serviceLabel: "On-site Security Guarding",
      path: "/en/szolgaltatasok/objektumorzes",
    });
  });

  test("special service selection emits a safe event and shows the warning", async ({
    page,
  }) => {
    await mockAnalyticsNetwork(page);

    await page.goto("/en", { waitUntil: "networkidle" });
    await acceptAnalytics(page);
    await waitForGtagRuntime(page);
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
    await waitForGtagRuntime(page);
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
    expect(csp).not.toMatch(/fonts\.googleapis\.com/i);
    expect(csp).not.toMatch(/fonts\.gstatic\.com/i);
    expect(csp).not.toMatch(/doubleclick\.net/i);
    expect(csp).not.toMatch(/googleadservices\.com/i);
    expect(csp).not.toMatch(/pagead/i);
    expect(csp).not.toMatch(/floodlight/i);
  });
});

async function mockAnalyticsNetwork(
  page: Page,
  options: { mockGtagScript?: boolean } = {},
): Promise<AnalyticsNetwork> {
  const mockGtagScript = options.mockGtagScript ?? true;
  const analytics: AnalyticsNetwork = {
    gtagScriptRequests: [],
    gtagScriptResponseStatuses: [],
    collectRequests: [],
    contactRequests: [],
  };

  page.on("request", (request) => {
    const url = request.url();
    if (isGtagScriptUrl(url)) analytics.gtagScriptRequests.push(url);
    if (isAnalyticsCollectUrl(url)) analytics.collectRequests.push(url);
    if (new URL(url).pathname === "/api/contact") analytics.contactRequests.push(url);
  });
  page.on("response", (response) => {
    if (isGtagScriptUrl(response.url())) {
      analytics.gtagScriptResponseStatuses.push(response.status());
    }
  });

  if (mockGtagScript) {
    await page.route("**://www.googletagmanager.com/gtag/js**", fulfillGtagScript);
    await page.route("**://*.googletagmanager.com/gtag/js**", fulfillGtagScript);
  }
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
    body: `
      window.__analyticsQaGtagScriptLoaded = true;
      window.dataLayer = window.dataLayer || [];
      const existingDataLayer = window.dataLayer.slice();
      const sendCollect = (args) => {
        if (
          !args ||
          args[0] !== "event" ||
          args[1] !== "page_view" ||
          !args[2]?.send_to
        ) return;
        const params = new URLSearchParams({
          v: "2",
          tid: String(args[2].send_to),
          en: "page_view",
          dl: String(args[2].page_location || window.location.href),
          dp: String(args[2].page_path || window.location.pathname + window.location.search),
        });
        const pixel = new Image();
        pixel.src = "https://www.google-analytics.com/g/collect?" + params.toString();
      };
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
        sendCollect(arguments);
      };
      existingDataLayer.forEach(sendCollect);
    `,
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

async function waitForGtagRuntime(page: Page) {
  await expect
    .poll(() => page.evaluate(() => typeof window.gtag))
    .toBe("function");
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
  return page.evaluate(() => {
    function normalizeEntry(entry: unknown): unknown {
      if (Array.isArray(entry)) return entry;
      if (
        typeof entry === "object" &&
        entry !== null &&
        "length" in entry &&
        Number.isInteger((entry as { length: unknown }).length)
      ) {
        return Array.from(entry as ArrayLike<unknown>);
      }

      return entry;
    }

    return (window.dataLayer ?? []).map(normalizeEntry);
  });
}

async function analyticsEvents(page: Page, eventName: string) {
  const dataLayer = await readDataLayer(page);
  return dataLayer
    .filter((entry) => {
      const parts = dataLayerEntryParts(entry);
      return parts?.[0] === "event" && parts[1] === eventName;
    })
    .map((entry) => ({
      raw: entry,
      params:
        isRecord(dataLayerEntryParts(entry)?.[2])
          ? (dataLayerEntryParts(entry)?.[2] as Record<string, unknown>)
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

async function openServiceQuoteForm(page: Page) {
  await page
    .locator("#service-quote")
    .getByRole("button", { name: "Request a quote" })
    .click();
}

async function fillServiceQuoteForm(page: Page) {
  const quote = page.locator("#service-quote");

  await quote.getByLabel("Name").fill(TEST_PII.name);
  await quote.getByLabel("Email").fill(TEST_PII.email);
  await quote.getByLabel("Phone").fill(TEST_PII.phone);
  await quote.getByLabel("Company (optional)").fill(TEST_PII.company);
  await quote.getByLabel("Message").fill(TEST_PII.message);
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

async function serviceQuoteEvents(page: Page) {
  const eventNames = [
    "service_quote_cta_click",
    "service_quote_form_open",
    "service_quote_form_start",
    "service_quote_form_submit_success",
    "service_quote_form_submit_error",
  ];

  const events = await Promise.all(
    eventNames.map((eventName) => analyticsEvents(page, eventName)),
  );

  return events.flat();
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

function assertServiceQuoteEventParams(
  events: { params: Record<string, unknown> }[],
  expected: {
    locale: string;
    serviceSlug: string;
    serviceLabel: string;
    path: string;
  },
) {
  for (const event of events) {
    expect(event.params).toEqual({
      event_type: "service_quote",
      form_variant: "service_embedded",
      locale: expected.locale,
      path: expected.path,
      service_label: expected.serviceLabel,
      service_slug: expected.serviceSlug,
    });
  }
}

function hasJsEntry(dataLayer: unknown[]): boolean {
  return dataLayer.some((entry) => dataLayerEntryParts(entry)?.[0] === "js");
}

function hasConfigEntry(dataLayer: unknown[], measurementId: string): boolean {
  return dataLayer.some((entry) => {
    const parts = dataLayerEntryParts(entry);
    return (
      parts?.[0] === "config" &&
      parts[1] === measurementId &&
      isRecord(parts[2]) &&
      parts[2].send_page_view === false
    );
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function dataLayerEntryParts(entry: unknown): unknown[] | null {
  if (Array.isArray(entry)) return entry;
  if (!isRecord(entry)) return null;

  const length = entry.length;
  if (!Number.isInteger(length) || typeof length !== "number" || length < 0) {
    return null;
  }

  return Array.from({ length }, (_, index) => entry[String(index)]);
}

function expectPageViewEvent(
  dataLayer: unknown[],
  expected: {
    measurementId: string;
    pagePath: string;
    pageUrlPattern: RegExp;
  },
) {
  const pageView = hasPageViewEvent(dataLayer, expected);

  expect(pageView).toBeTruthy();
}

function hasPageViewEvent(
  dataLayer: unknown[],
  expected: {
    measurementId: string;
    pagePath: string;
    pageUrlPattern: RegExp;
  },
): boolean {
  return dataLayer.some((entry) => {
    const parts = dataLayerEntryParts(entry);
    return (
      parts?.[0] === "event" &&
      parts[1] === "page_view" &&
      isRecord(parts[2]) &&
      parts[2].send_to === expected.measurementId &&
      parts[2].page_path === expected.pagePath &&
      typeof parts[2].page_location === "string" &&
      expected.pageUrlPattern.test(parts[2].page_location) &&
      typeof parts[2].page_title === "string" &&
      parts[2].page_title.length > 0
    );
  });
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

function isGa4CollectUrl(url: string): boolean {
  const parsed = new URL(url);
  const host = parsed.hostname;
  const isAllowedCollectHost =
    host === "www.google-analytics.com" ||
    host.endsWith(".google-analytics.com") ||
    host === "analytics.google.com" ||
    host.endsWith(".analytics.google.com");

  return isAllowedCollectHost && parsed.pathname === "/g/collect";
}
