"use client";

export const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_ID?.trim() ?? "";

declare global {
  interface Window {
    [key: `ga-disable-${string}`]: boolean | undefined;
    __avenirAnalyticsStorageFailed?: boolean;
    __avenirGa4LoadPromise?: Promise<void>;
  }
}

// This does not unload executed JavaScript. Google's opt-out flag blocks its
// measurement and cookie writes, including callbacks scheduled by the tag.
export function applyAnalyticsConsent(accepted: boolean): void {
  if (typeof window === "undefined" || !GA4_MEASUREMENT_ID) return;
  const wasDisabled = window[`ga-disable-${GA4_MEASUREMENT_ID}`];
  window[`ga-disable-${GA4_MEASUREMENT_ID}`] = !accepted;
  if (!accepted) clearAnalyticsCookies();
  // Never create a runtime or queue before the first opt-in.
  if (typeof window.gtag === "function" && wasDisabled !== !accepted) {
    window.gtag("consent", "update", { analytics_storage: accepted ? "granted" : "denied" });
  }
}

function clearAnalyticsCookies(): void {
  if (typeof document === "undefined") return;
  const names = ["_ga", `_ga_${GA4_MEASUREMENT_ID.replace(/^G-/, "")}`];
  const host = window.location.hostname;
  const domains = [""];
  if (host) {
    domains.push(host);
    const labels = host.split(".");
    for (let index = 1; index < labels.length - 1; index++) domains.push(labels.slice(index).join("."));
  }
  const paths = new Set(["/"]);
  const segments = window.location.pathname.split("/").filter(Boolean);
  for (let index = 1; index <= segments.length; index++) {
    const path = `/${segments.slice(0, index).join("/")}`;
    paths.add(path);
    paths.add(`${path}/`);
  }
  for (const name of names) {
    for (const domain of domains) {
      for (const path of paths) {
        document.cookie = `${name}=; Max-Age=0; path=${path}${domain ? `; domain=${domain}` : ""}`;
      }
    }
  }
}

export function analyticsPath(value: string): string {
  try {
    return new URL(value, "https://analytics.invalid").pathname;
  } catch {
    return "/";
  }
}

export function analyticsUrl(value: string): string {
  try {
    const url = new URL(value);
    return /^https?:$/.test(url.protocol) ? `${url.origin}${url.pathname}` : "";
  } catch {
    return "";
  }
}

export function analyticsPageFields() {
  return {
    page_path: analyticsPath(window.location.pathname),
    page_location: analyticsUrl(window.location.href),
    page_referrer: analyticsUrl(document.referrer),
  };
}
