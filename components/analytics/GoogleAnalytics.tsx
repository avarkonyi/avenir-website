"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
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
    __avenirGa4ScriptLoaded?: boolean;
  }
}

export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const lastPageViewKey = useRef<string | null>(null);
  const [consent, setConsent] = useState<AnalyticsConsentChoice | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

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
      function gtag() {
        // Match Google's standard gtag bootstrap shape; the real loader reads
        // these Arguments objects from dataLayer.
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer?.push(arguments);
      };

    if (window.__avenirGa4ScriptLoaded) {
      const timeout = window.setTimeout(() => {
        setScriptLoaded(true);
      }, 0);
      return () => {
        window.clearTimeout(timeout);
      };
    }

    const existingScript = document.getElementById(SCRIPT_ID);

    function handleScriptLoad() {
      window.__avenirGa4ScriptLoaded = true;
      setScriptLoaded(true);
    }

    if (existingScript) {
      existingScript.addEventListener("load", handleScriptLoad, { once: true });
      return () => {
        existingScript.removeEventListener("load", handleScriptLoad);
      };
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
      MEASUREMENT_ID,
    )}`;
    script.addEventListener("load", handleScriptLoad, { once: true });
    document.head.appendChild(script);

    return () => {
      script.removeEventListener("load", handleScriptLoad);
    };
  }, [consent]);

  useEffect(() => {
    if (consent !== "accepted") {
      lastPageViewKey.current = null;
      return;
    }

    if (!MEASUREMENT_ID || !scriptLoaded || typeof window.gtag !== "function") {
      return;
    }

    if (!window.__avenirGa4Initialized) {
      window.gtag("js", new Date());
      window.gtag("config", MEASUREMENT_ID, {
        send_page_view: false,
        anonymize_ip: true,
      });
      window.__avenirGa4Initialized = true;
    }

    const timeout = window.setTimeout(() => {
      if (typeof window.gtag !== "function") return;

      const pagePath = `${window.location.pathname}${window.location.search}`;
      const pageViewKey = `${MEASUREMENT_ID}:${pagePath}`;
      if (lastPageViewKey.current === pageViewKey) return;
      lastPageViewKey.current = pageViewKey;

      window.gtag("event", "page_view", {
        send_to: MEASUREMENT_ID,
        page_path: pagePath,
        page_location: window.location.href,
        page_title: document.title,
      });
    }, 0);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [consent, pathname, scriptLoaded, search]);

  return null;
}
