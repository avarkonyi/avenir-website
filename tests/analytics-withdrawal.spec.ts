import { expect, test, type Page } from "@playwright/test";

const KEY = "avenir_analytics_consent";
const ID = "G-AUDITTEST";
const scriptBody = `window.__analyticsQaGtagScriptLoaded = true;`;

test.beforeEach(async ({ context, baseURL }) => {
  if (!baseURL || !["localhost", "127.0.0.1"].includes(new URL(baseURL).hostname)) {
    throw new Error("Withdrawal regression tests require a local server with dummy G-AUDITTEST ID.");
  }
  await context.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === "www.googletagmanager.com" && url.pathname === "/gtag/js") {
      expect(url.searchParams.get("id")).toBe(ID);
      return route.fulfill({ contentType: "application/javascript", body: scriptBody });
    }
    if (url.origin !== new URL(baseURL).origin || route.request().method() !== "GET") return route.abort();
    return route.continue();
  });
});

async function choose(page: Page, accepted: boolean) {
  const button = page.getByRole("button", { name: accepted ? "Elfogadom az analitikát" : "Elutasítom", exact: true });
  if (!await button.isVisible()) await page.getByRole("button", { name: "Süti beállítások", exact: true }).click();
  await button.click();
}

async function pageViews(page: Page) {
  return page.evaluate(() => (window.dataLayer ?? []).map((entry) => Array.from(entry as ArrayLike<unknown>)).filter((entry) => entry[0] === "event" && entry[1] === "page_view"));
}

test("withdrawal disables an already loaded tag synchronously, removes owned cookies and allows reaccept", async ({ page, context }) => {
  await page.goto("/hu");
  await choose(page, true);
  await expect.poll(() => pageViews(page)).toHaveLength(1);
  await context.addCookies([
    { name: "_ga", value: "test", url: page.url() },
    { name: "_ga_AUDITTEST", value: "test", url: page.url() },
    { name: "_ga_OTHER", value: "keep", url: page.url() },
    { name: "unrelated", value: "keep", url: page.url() },
  ]);
  await page.getByRole("button", { name: "Süti beállítások", exact: true }).click();
  const disabled = await page.getByRole("button", { name: "Elutasítom", exact: true }).evaluate((button) => {
    (button as HTMLButtonElement).click();
    return (window as unknown as Record<string, unknown>)["ga-disable-G-AUDITTEST"];
  });
  expect(disabled).toBe(true);
  const cookies = await context.cookies();
  expect(cookies.map((cookie) => cookie.name)).not.toContain("_ga");
  expect(cookies.map((cookie) => cookie.name)).not.toContain("_ga_AUDITTEST");
  expect(cookies.map((cookie) => cookie.name)).toEqual(expect.arrayContaining(["_ga_OTHER", "unrelated"]));
  await expect.poll(() => pageViews(page)).toHaveLength(1);
  await choose(page, true);
  await expect.poll(() => pageViews(page)).toHaveLength(2);
  expect(await page.locator("#avenir-ga4-script").count()).toBe(1);
  await choose(page, false);
  await page.reload();
  await expect.poll(() => page.evaluate(() => typeof window.gtag)).toBe("undefined");
});

test("pending script completion after rejection stays blocked and reaccept uses the single loader", async ({ page }) => {
  let release!: () => void;
  const delayed = new Promise<void>((resolve) => { release = resolve; });
  await page.route("https://www.googletagmanager.com/gtag/js?*", async (route) => {
    await delayed;
    await route.fulfill({ contentType: "application/javascript", body: scriptBody });
  });
  await page.goto("/hu");
  await choose(page, true);
  await expect(page.locator("#avenir-ga4-script")).toHaveCount(1);
  await choose(page, false);
  release();
  await expect.poll(() => page.evaluate(() => window.__avenirGa4ScriptLoaded)).toBe(true);
  expect(await pageViews(page)).toHaveLength(0);
  await choose(page, true);
  await expect.poll(() => pageViews(page)).toHaveLength(1);
  await expect(page.locator("#avenir-ga4-script")).toHaveCount(1);
});

test("cross-tab storage withdrawal disables the runtime immediately", async ({ page }) => {
  await page.goto("/hu");
  await choose(page, true);
  await expect.poll(() => pageViews(page)).toHaveLength(1);
  const disabled = await page.evaluate((key) => {
    localStorage.setItem(key, "rejected");
    window.dispatchEvent(new StorageEvent("storage", { key, newValue: "rejected", storageArea: localStorage }));
    return (window as unknown as Record<string, unknown>)["ga-disable-G-AUDITTEST"];
  }, KEY);
  expect(disabled).toBe(true);
});

test("storage failure blocks analytics without breaking consent controls", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error("Storage unavailable"); };
    Storage.prototype.setItem = () => { throw new Error("Storage unavailable"); };
  });
  await page.goto("/hu");
  await choose(page, true);
  await expect(page.getByRole("button", { name: "Elfogadom az analitikát", exact: true })).toBeVisible();
  expect(errors).toEqual([]);
  expect(await page.locator("#avenir-ga4-script").count()).toBe(0);
  expect(await page.evaluate(() => typeof window.gtag)).toBe("undefined");
});

test("another tab withdrawing consent stops an accepted tab", async ({ page, context }) => {
  await page.goto("/hu");
  await choose(page, true);
  await expect.poll(() => pageViews(page)).toHaveLength(1);
  const second = await context.newPage();
  await second.goto("/hu");
  await choose(second, false);
  await expect.poll(() => page.evaluate(() => window["ga-disable-G-AUDITTEST"])).toBe(true);
  await expect.poll(() => pageViews(page)).toHaveLength(1);
});

test("a failed withdrawal storage write cannot revive a stale persisted acceptance", async ({ page }) => {
  await page.goto("/hu");
  await choose(page, true);
  await expect.poll(() => pageViews(page)).toHaveLength(1);
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new Error("Write blocked"); }; });
  await choose(page, false);
  expect(await page.evaluate(() => localStorage.getItem("avenir_analytics_consent"))).toBe("accepted");
  expect(await page.evaluate(() => window["ga-disable-G-AUDITTEST"])).toBe(true);
  await choose(page, true);
  expect(await pageViews(page)).toHaveLength(1);
});

test("before first consent no tag, queue or GA runtime exists", async ({ page }) => {
  await page.goto("/hu");
  await expect(page.getByRole("button", { name: "Elfogadom az analitikát", exact: true })).toBeVisible();
  expect(await page.evaluate(() => ({ gtag: typeof window.gtag, dataLayer: typeof window.dataLayer }))).toEqual({ gtag: "undefined", dataLayer: "undefined" });
  await expect(page.locator("#avenir-ga4-script")).toHaveCount(0);
});

test("a queued page view rechecks consent at its actual send time", async ({ page }) => {
  await page.addInitScript(() => {
    const original = window.setTimeout;
    let interrupted = false;
    window.setTimeout = ((callback: TimerHandler, delay?: number, ...args: unknown[]) => {
      if (delay === 0 && window.__avenirGa4Initialized && !interrupted && typeof callback === "function") {
        interrupted = true;
        return original(() => {
          localStorage.setItem("avenir_analytics_consent", "rejected");
          callback(...args);
        }, delay);
      }
      return original(callback, delay, ...args);
    }) as typeof window.setTimeout;
  });
  await page.goto("/hu");
  await choose(page, true);
  await expect.poll(() => page.evaluate(() => localStorage.getItem("avenir_analytics_consent"))).toBe("rejected");
  expect(await pageViews(page)).toHaveLength(0);
});

test("page views and config globals strip queries and fragments from URLs", async ({ page }) => {
  await page.goto("/hu?email=private@example.test#secret", { referer: "https://example.test/source?email=private@example.test#secret" });
  await choose(page, true);
  await expect.poll(() => pageViews(page)).toHaveLength(1);
  const entries = await page.evaluate(() => (window.dataLayer ?? []).map((entry) => Array.from(entry as ArrayLike<unknown>)));
  expect(JSON.stringify(entries)).not.toContain("private@example.test");
  expect(JSON.stringify(entries)).not.toContain("#secret");
  expect(entries.find((entry) => entry[0] === "config")?.[2]).toMatchObject({ page_path: "/hu", page_referrer: "https://example.test/source" });
  expect(entries.find((entry) => entry[0] === "set")?.[1]).toMatchObject({ page_path: "/hu", page_referrer: "https://example.test/source" });
});
