"use client";

import { hasAnalyticsConsent } from "./consent";
import { analyticsUrl } from "./runtime";
import { isAhrefsAnalyticsEnabled } from "./ahrefs-config";

export const AHREFS_SCRIPT_ID = "avenir-ahrefs-script";
export const AHREFS_SCRIPT_URL = "https://analytics.ahrefs.com/analytics.js";
// Public installation identifier supplied by the site owner, not an API secret.
export const AHREFS_DATA_KEY = "EjQ2we/Yn4waOfJdy1c5Yg";

declare global {
  interface Window {
    AhrefsAnalytics?: { sendEvent: (name: string) => void };
  }
}

export function isSafeAhrefsReferrer(referrer: string): boolean {
  if (!referrer) return true;
  try {
    const url = new URL(referrer);
    return /^https?:$/.test(url.protocol) &&
      !url.search && !url.hash && !url.username && !url.password;
  } catch {
    return false;
  }
}

function canMeasure(): boolean {
  return isAhrefsAnalyticsEnabled() && hasAnalyticsConsent() &&
    /^\/(hu|en|de|zh|ko|fr)(\/|$)/.test(window.location.pathname) &&
    isSafeAhrefsReferrer(document.referrer);
}

function getScript(): HTMLScriptElement | null {
  return document.querySelector<HTMLScriptElement>(`#${AHREFS_SCRIPT_ID}`);
}

function suspend(script: HTMLScriptElement): void {
  // The official tag reads these attributes on every send. Removing the key
  // blocks measurement even when its JavaScript has already executed.
  script.removeAttribute("data-key");
  script.setAttribute("data-page-location", "http://localhost/");
}

export function disableAhrefsAnalytics(): void {
  const script = getScript();
  if (!script) return;
  suspend(script);
  delete script.dataset.lastPage;
}

export function syncAhrefsAnalytics(): void {
  if (!canMeasure()) {
    disableAhrefsAnalytics();
    return;
  }

  let script = getScript();
  if (!script) {
    script = document.createElement("script");
    script.id = AHREFS_SCRIPT_ID;
    script.async = true;
    script.src = AHREFS_SCRIPT_URL;
    script.setAttribute("data-key", AHREFS_DATA_KEY);
    script.setAttribute("data-page-location", analyticsUrl(window.location.href));
    // App Router pageviews are sent explicitly, with query/fragment stripped.
    script.setAttribute("data-no-pageview-auto", "");
    const pendingScript = script;
    script.addEventListener("load", () => {
      pendingScript.dataset.loaded = "true";
      syncAhrefsAnalytics();
    }, { once: true });
    script.addEventListener("error", () => {
      pendingScript.remove();
    }, { once: true });
    document.head.appendChild(script);
  }

  const page = analyticsUrl(window.location.href);
  script.setAttribute("data-key", AHREFS_DATA_KEY);
  script.setAttribute("data-page-location", page);
  if (script.dataset.loaded !== "true" || script.dataset.lastPage === page) return;
  if (typeof window.AhrefsAnalytics?.sendEvent !== "function") return;

  try {
    window.AhrefsAnalytics.sendEvent("pageview");
    script.dataset.lastPage = page;
  } catch {
    // Analytics is optional and must never break navigation or forms.
    disableAhrefsAnalytics();
  }
}

export function suppressAhrefsAutomaticInteraction(): void {
  const script = getScript();
  if (!script) return;
  // Ahrefs also installs link/form listeners. Suspend only its own tag during
  // those events; do not cancel the event or interfere with GA4/site handlers.
  suspend(script);
  // A microtask can run between native capture and target listeners. Keep
  // the tag suspended until the entire event dispatch has finished.
  setTimeout(() => {
    if (!canMeasure()) return;
    script.setAttribute("data-page-location", analyticsUrl(window.location.href));
    script.setAttribute("data-key", AHREFS_DATA_KEY);
  }, 0);
}
