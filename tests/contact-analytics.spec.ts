import { expect, test, type Page } from "@playwright/test";
import { build } from "esbuild";

// Render the real component without starting Next, loading env files or connecting
// to a database. Every browser request is fulfilled locally or aborted.
let bundle: string;
test.beforeAll(async () => {
  const result = await build({
    stdin: {
      contents: `
        import { createRoot } from "react-dom/client";
        import { Contact } from "./components/Contact";
        import { TrackedServiceCardLink } from "./components/analytics/TrackedServiceCardLink";
        import { TrackedServiceCtaLink } from "./components/analytics/TrackedServiceCtaLink";
        import { en } from "./lib/i18n/en";
        import { getContactFormCopy } from "./lib/locale-ui-helpers";
        createRoot(document.getElementById("root")).render(<>
          <TrackedServiceCardLink href="#card" locale="en" serviceSlug="hard-fm" serviceLabel="Hard FM">Public service card</TrackedServiceCardLink>
          <TrackedServiceCtaLink href="#cta" locale="en" serviceSlug="hard-fm" serviceLabel="Hard FM">Public service CTA</TrackedServiceCtaLink>
          <Contact locale="en" t={{ ...en, form: getContactFormCopy(en.form) }} serviceOptions={[
            { slug: "hard-fm", label: "Hard FM" }, { slug: "soft-fm", label: "Soft FM" }
          ]} />
        </>);
      `,
      resolveDir: process.cwd(),
      loader: "tsx",
    },
    bundle: true,
    write: false,
    platform: "browser",
    jsx: "automatic",
    define: { "process.env": '{"NODE_ENV":"test"}' },
  });
  bundle = result.outputFiles[0].text;
});

async function mount(page: Page, accepted: boolean) {
  const contactPayloads: Record<string, unknown>[] = [];
  await page.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.origin === "https://contact.test" && url.pathname === "/api/contact") {
      contactPayloads.push(request.postDataJSON());
      return route.fulfill({ json: { ok: true } });
    }
    if (url.origin === "https://contact.test" && request.isNavigationRequest()) {
      return route.fulfill({ contentType: "text/html", body: '<!doctype html><div id="root"></div>' });
    }
    return route.abort();
  });
  await page.goto("https://contact.test/en?service=hard-fm");
  await page.evaluate((accepted) => {
    localStorage.setItem("avenir_analytics_consent", accepted ? "accepted" : "rejected");
    window.dataLayer = [];
    window.gtag = (...args: unknown[]) => { window.dataLayer?.push(args); };
  }, accepted);
  await page.addScriptTag({ content: bundle });
  await expect(page.locator("#contact-service")).toHaveValue("hard-fm");
  return contactPayloads;
}

async function submit(page: Page) {
  await page.locator("#contact-name").fill("Private Example");
  await page.locator("#contact-email").fill("private@example.test");
  await page.locator("#contact-company").fill("Private Company");
  await page.locator("#contact-phone").fill("+36 70 000 0000");
  await page.locator("#contact-message").fill("Private message body");
  await page.locator("#contact-service").selectOption("soft-fm");
  await page.getByRole("button", { name: "Send request", exact: true }).click();
}

test("homepage success keeps every entered form value out of analytics while preserving the contact payload", async ({ page }) => {
  const payloads = await mount(page, true);
  await submit(page);
  await expect.poll(() => payloads.length).toBe(1);
  expect(payloads[0]).toMatchObject({
    name: "Private Example", email: "private@example.test", company: "Private Company",
    phone: "+36 70 000 0000", message: "Private message body", service: "soft-fm", locale: "en",
  });
  await expect.poll(() => page.evaluate(() => window.dataLayer)).toEqual([
    ["event", "contact_submit_success", { locale: "en", path: "/en" }],
  ]);
});

test("homepage submission remains unmeasured without analytics consent", async ({ page }) => {
  const payloads = await mount(page, false);
  await submit(page);
  await expect.poll(() => payloads.length).toBe(1);
  expect(await page.evaluate(() => window.dataLayer)).toEqual([]);
});

test("public service card and CTA retain page-derived service analytics", async ({ page }) => {
  const payloads = await mount(page, true);
  await page.getByRole("link", { name: "Hard FM", exact: true }).click();
  await page.getByRole("link", { name: "Public service CTA", exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.dataLayer)).toEqual([
    ["event", "service_cta_click", { locale: "en", path: "/en", selected_service_key: "hard-fm", selected_service_label: "Hard FM" }],
    ["event", "service_cta_click", { locale: "en", path: "/en", selected_service_key: "hard-fm", selected_service_label: "Hard FM" }],
  ]);
  expect(payloads).toEqual([]);
});
