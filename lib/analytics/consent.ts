"use client";

export const ANALYTICS_CONSENT_KEY = "avenir_analytics_consent";
export const ANALYTICS_CONSENT_EVENT = "avenir:analytics-consent-change";
export const ANALYTICS_SETTINGS_EVENT = "avenir:analytics-consent-settings";

export type AnalyticsConsentChoice = "accepted" | "rejected";

export function readAnalyticsConsent(): AnalyticsConsentChoice | null {
  if (typeof window === "undefined") return null;

  const value = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
  return value === "accepted" || value === "rejected" ? value : null;
}

export function hasAnalyticsConsent(): boolean {
  return readAnalyticsConsent() === "accepted";
}

export function writeAnalyticsConsent(choice: AnalyticsConsentChoice): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(ANALYTICS_CONSENT_KEY, choice);
  window.dispatchEvent(
    new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: { choice } }),
  );
}

export function openAnalyticsConsentSettings(): void {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new Event(ANALYTICS_SETTINGS_EVENT));
}
