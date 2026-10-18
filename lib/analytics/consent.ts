"use client";

import { applyAnalyticsConsent } from "./runtime";

export const ANALYTICS_CONSENT_KEY = "avenir_analytics_consent";
export const ANALYTICS_CONSENT_EVENT = "avenir:analytics-consent-change";
export const ANALYTICS_SETTINGS_EVENT = "avenir:analytics-consent-settings";

export type AnalyticsConsentChoice = "accepted" | "rejected";

export function readAnalyticsConsent(): AnalyticsConsentChoice | null {
  if (typeof window === "undefined") return null;

  if (window.__avenirAnalyticsStorageFailed) return null;
  try {
    const value = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
    return value === "accepted" || value === "rejected" ? value : null;
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
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, choice);
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
