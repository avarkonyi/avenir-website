import assert from "node:assert/strict";
import test from "node:test";
import { LOCALES } from "../lib/locales";
import { getRuntimeErrorCopy, getRecoveryLocale } from "../lib/runtime-error-copy";
import UnknownLocalePath from "../app/[locale]/[...unmatched]/page";
import { getLocaleAccessibility } from "../lib/locale-accessibility";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PathParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import LocaleError from "../app/[locale]/error";
import LocaleNotFound from "../app/[locale]/not-found";
import { getNotFoundCopy } from "../lib/not-found-copy";
import { getContactPrivacyHref } from "../lib/locale-ui-helpers";

test("error recovery retains every supported locale and rejects invalid params", () => {
  const titles = new Set<string>();
  for (const locale of LOCALES) {
    assert.equal(getRecoveryLocale(locale), locale);
    const copy = getRuntimeErrorCopy(locale);
    for (const value of Object.values(copy)) assert.ok(value.trim());
    titles.add(copy.title);
  }
  assert.equal(titles.size, LOCALES.length);
  for (const invalid of [undefined, "xx", ["fr"], "../en"]) assert.equal(getRecoveryLocale(invalid), "hu");
});

test("unmatched localized route invokes Next's real 404 boundary", () => {
  assert.throws(() => UnknownLocalePath(), (error: unknown) =>
    error instanceof Error && "digest" in error && error.digest === "NEXT_HTTP_ERROR_FALLBACK;404");
});

test("article breadcrumb labels vary with the three open article locales", () => {
  assert.equal(new Set(["hu", "en", "de"].map(locale => getLocaleAccessibility(locale).breadcrumb)).size, 3);
});

test("rendered runtime error and 404 read locale params and retain recovery destinations", () => {
  for (const locale of LOCALES) {
    const render = (child: React.ReactNode) => renderToStaticMarkup(createElement(PathParamsContext.Provider, { value: { locale } }, child));
    const error = render(createElement(LocaleError, { error: new Error("test"), reset: () => {} }));
    const missing = render(createElement(LocaleNotFound));
    assert.ok(error.includes(getRuntimeErrorCopy(locale).title));
    assert.ok(error.includes(getRuntimeErrorCopy(locale).retry));
    assert.ok(error.includes(`href="/${locale}"`));
    assert.ok(missing.includes(getNotFoundCopy(locale).title));
    assert.ok(missing.includes(`href="/${locale}#contact"`));
    assert.ok(missing.includes(`href="${getContactPrivacyHref(locale)}"`));
    assert.equal((missing.match(/<h1\b/g) ?? []).length, 1);
  }
});
