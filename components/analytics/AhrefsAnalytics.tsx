"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ANALYTICS_CONSENT_EVENT,
  ANALYTICS_CONSENT_KEY,
  AHREFS_ANALYTICS_CONSENT_KEY,
} from "@/lib/analytics/consent";
import {
  disableAhrefsAnalytics,
  suppressAhrefsAutomaticInteraction,
  syncAhrefsAnalytics,
} from "@/lib/analytics/ahrefs";

export function AhrefsAnalytics() {
  const pathname = usePathname();
  const search = useSearchParams().toString();

  useEffect(() => {
    function onConsentChange(event: Event) {
      if (event instanceof StorageEvent && event.key !== null &&
        ![ANALYTICS_CONSENT_KEY, AHREFS_ANALYTICS_CONSENT_KEY].includes(event.key)) return;
      syncAhrefsAnalytics();
    }

    window.addEventListener(ANALYTICS_CONSENT_EVENT, onConsentChange);
    window.addEventListener("storage", onConsentChange);
    const interactions = ["click", "auxclick", "submit"] as const;
    for (const type of interactions) {
      document.addEventListener(type, suppressAhrefsAutomaticInteraction, true);
    }
    return () => {
      window.removeEventListener(ANALYTICS_CONSENT_EVENT, onConsentChange);
      window.removeEventListener("storage", onConsentChange);
      for (const type of interactions) {
        document.removeEventListener(type, suppressAhrefsAutomaticInteraction, true);
      }
      disableAhrefsAnalytics();
    };
  }, []);

  useEffect(() => {
    syncAhrefsAnalytics();
  }, [pathname, search]);

  return null;
}
