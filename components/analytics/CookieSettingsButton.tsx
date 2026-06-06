"use client";

import { openAnalyticsConsentSettings } from "@/lib/analytics/consent";

export function CookieSettingsButton({ locale }: { locale: string }) {
  const label =
    locale === "hu"
      ? "Süti beállítások"
      : locale === "de"
        ? "Cookie-Einstellungen"
        : "Cookie settings";

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
