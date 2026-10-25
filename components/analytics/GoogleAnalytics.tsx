"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ANALYTICS_CONSENT_EVENT,
  ANALYTICS_CONSENT_KEY,
  AHREFS_ANALYTICS_CONSENT_KEY,
  hasAnalyticsConsent,
  readAnalyticsConsent,
  type AnalyticsConsentChoice,
} from "@/lib/analytics/consent";
import { applyAnalyticsConsent, analyticsPageFields, GA4_MEASUREMENT_ID as MEASUREMENT_ID } from "@/lib/analytics/runtime";

const SCRIPT_ID = "avenir-ga4-script";

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
    applyAnalyticsConsent(hasAnalyticsConsent());
    const frame = window.requestAnimationFrame(() => {
      setConsent(readAnalyticsConsent());
    });

    function handleConsentChange(event: Event) {
      if (event instanceof StorageEvent && event.key !== null &&
        ![ANALYTICS_CONSENT_KEY, AHREFS_ANALYTICS_CONSENT_KEY].includes(event.key)) return;
      const choice = readAnalyticsConsent();
      applyAnalyticsConsent(choice === "accepted");
      setConsent(choice);
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
    if (!MEASUREMENT_ID || consent !== "accepted" || !hasAnalyticsConsent()) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gtag() {
        // Match Google's standard gtag bootstrap shape; the real loader reads
        // these Arguments objects from dataLayer.
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer?.push(arguments);
      };

    window.gtag("consent", "update", { analytics_storage: "granted" });

    if (window.__avenirGa4ScriptLoaded) {
      const timeout = window.setTimeout(() => {
        setScriptLoaded(true);
      }, 0);
      return () => {
        window.clearTimeout(timeout);
      };
    }

    // The loader belongs to the document, not to one consent effect. Its load
    // marker must survive withdrawal and Strict Mode cleanup while in flight.
    if (!window.__avenirGa4LoadPromise) {
      window.__avenirGa4LoadPromise = new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
        script.addEventListener("load", () => {
          window.__avenirGa4ScriptLoaded = true;
          resolve();
        }, { once: true });
        script.addEventListener("error", () => {
          script.remove();
          window.__avenirGa4LoadPromise = undefined;
          reject(new Error("Analytics script unavailable"));
        }, { once: true });
        document.head.appendChild(script);
      });
    }
    let active = true;
    window.__avenirGa4LoadPromise.then(() => {
      if (active && hasAnalyticsConsent()) setScriptLoaded(true);
    }).catch(() => { /* A later acceptance can retry a failed load. */ });
    return () => { active = false; };
  }, [consent]);

  useEffect(() => {
    if (consent !== "accepted" || !hasAnalyticsConsent()) {
      lastPageViewKey.current = null;
      return;
    }

    if (!MEASUREMENT_ID || !scriptLoaded || typeof window.gtag !== "function") {
      return;
    }

    const fields = analyticsPageFields();
    window.gtag("set", fields);
    if (!window.__avenirGa4Initialized) {
      window.gtag("js", new Date());
      window.gtag("config", MEASUREMENT_ID, {
        send_page_view: false,
        anonymize_ip: true,
        ...fields,
      });
      window.__avenirGa4Initialized = true;
    }

    const timeout = window.setTimeout(() => {
      if (!hasAnalyticsConsent() || typeof window.gtag !== "function") return;

      const fields = analyticsPageFields();
      const pagePath = fields.page_path;
      const pageViewKey = `${MEASUREMENT_ID}:${pagePath}`;
      if (lastPageViewKey.current === pageViewKey) return;
      lastPageViewKey.current = pageViewKey;

      window.gtag("event", "page_view", {
        send_to: MEASUREMENT_ID,
        ...fields,
        page_title: document.title,
      });
    }, 0);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [consent, pathname, scriptLoaded, search]);

  return null;
}
