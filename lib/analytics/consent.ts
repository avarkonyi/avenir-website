"use client";

import { applyAnalyticsConsent } from "./runtime";
import { isAhrefsAnalyticsEnabled } from "./ahrefs-config";

export const ANALYTICS_CONSENT_KEY = "avenir_analytics_consent";
export const AHREFS_ANALYTICS_CONSENT_KEY = "avenir_analytics_consent_v2";
export const ANALYTICS_CONSENT_EVENT = "avenir:analytics-consent-change";
export const ANALYTICS_SETTINGS_EVENT = "avenir:analytics-consent-settings";

export type AnalyticsConsentChoice = "accepted" | "rejected";

export function analyticsConsentKey(): string {
  return isAhrefsAnalyticsEnabled() ? AHREFS_ANALYTICS_CONSENT_KEY : ANALYTICS_CONSENT_KEY;
}

export function readAnalyticsConsent(): AnalyticsConsentChoice | null {
  if (typeof window === "undefined") return null;

  if (window.__avenirAnalyticsStorageFailed) return null;
  try {
    const value = window.localStorage.getItem(analyticsConsentKey());
    if (value === "accepted" || value === "rejected") return value;
    // A GA4-only acceptance must not authorize a new provider. Preserve a
    // previous rejection without asking the visitor to reject again.
    return window.localStorage.getItem(ANALYTICS_CONSENT_KEY) === "rejected" ? "rejected" : null;
  } catch {
    applyAnalyticsConsent(false);
    return null;
  }
}

export function hasAnalyticsConsent(): boolean {
  return readAnalyticsConsent() === "accepted";
}

export function writeAnalyticsConsent(choice: AnalyticsConsentChoice): AnalyticsConsentChoice | null {
  if (typeof window === "undefined") return null;

  // Withdrawal takes effect in this call, before React effects or queued sends.
  if (choice === "rejected") applyAnalyticsConsent(false);
  try {
    window.localStorage.setItem(analyticsConsentKey(), choice);
    window.__avenirAnalyticsStorageFailed = false;
  } catch {
    // A stale persisted acceptance must not override a failed withdrawal.
    window.__avenirAnalyticsStorageFailed = true;
  }
  const effectiveChoice = readAnalyticsConsent();
  applyAnalyticsConsent(effectiveChoice === "accepted");
  window.dispatchEvent(
    new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: { choice: effectiveChoice } }),
  );
  return effectiveChoice;
}

export function openAnalyticsConsentSettings(): void {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new Event(ANALYTICS_SETTINGS_EVENT));
}
