"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ANALYTICS_CONSENT_EVENT,
  readAnalyticsConsent,
  type AnalyticsConsentChoice,
} from "@/lib/analytics/consent";

const SCRIPT_ID = "avenir-ga4-script";
const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_ID?.trim() ?? "";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __avenirGa4Initialized?: boolean;
  }
}

export function GoogleAnalytics() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<AnalyticsConsentChoice | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setConsent(readAnalyticsConsent());
    });

    function handleConsentChange(event: Event) {
      const detail = (event as CustomEvent<{ choice?: AnalyticsConsentChoice }>).detail;
      setConsent(detail?.choice ?? readAnalyticsConsent());
    }

    window.addEventListener(ANALYTICS_CONSENT_EVENT, handleConsentChange);
    window.addEventListener("storage", handleConsentChange);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener(ANALYTICS_CONSENT_EVENT, handleConsentChange);
      window.removeEventListener("storage", handleConsentChange);
    };
  }, []);

  useEffect(() => {
    if (!MEASUREMENT_ID || consent !== "accepted") return;

    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gtag(...args: unknown[]) {
        window.dataLayer?.push(args);
      };

    if (!window.__avenirGa4Initialized) {
      window.gtag("js", new Date());
      window.__avenirGa4Initialized = true;
    }

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
        MEASUREMENT_ID,
      )}`;
      document.head.appendChild(script);
    }

    window.gtag("config", MEASUREMENT_ID, {
      page_path: pathname,
      anonymize_ip: true,
    });
  }, [consent, pathname]);

  return null;
}
