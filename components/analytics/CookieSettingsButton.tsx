"use client";

import { openAnalyticsConsentSettings } from "@/lib/analytics/consent";
import { getAnalyticsConsentCopy } from "@/lib/analytics/consent-copy";

export function CookieSettingsButton({ locale }: { locale: string }) {
  const label = getAnalyticsConsentCopy(locale).settings;

  return (
    <button
      type="button"
      className="footer-link cookie-settings-button"
      onClick={openAnalyticsConsentSettings}
    >
      {label}
    </button>
  );
}
