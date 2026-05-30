"use client";

import { hasAnalyticsConsent } from "./consent";

export type AnalyticsEventName =
  | "contact_submit_success"
  | "contact_submit_error"
  | "phone_click"
  | "email_click"
  | "service_cta_click"
  | "service_quote_cta_click"
  | "service_quote_form_open"
  | "service_quote_form_start"
  | "service_quote_form_submit_success"
  | "service_quote_form_submit_error"
  | "special_service_option_selected";

export type AnalyticsEventParams = {
  locale?: string;
  path?: string;
  selected_service_key?: string;
  selected_service_label?: string;
  service_slug?: string;
  service_label?: string;
  form_variant?: "service_embedded";
  event_type?: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackAnalyticsEvent(
  eventName: AnalyticsEventName,
  params: AnalyticsEventParams = {},
): void {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;
  if (typeof window.gtag !== "function") return;

  window.gtag("event", eventName, sanitizeParams(params));
}

function sanitizeParams(params: AnalyticsEventParams): AnalyticsEventParams {
  const path = params.path ?? window.location.pathname;

  return {
    ...(params.locale ? { locale: params.locale } : {}),
    path,
    ...(params.selected_service_key
      ? { selected_service_key: params.selected_service_key }
      : {}),
    ...(params.selected_service_label
      ? { selected_service_label: params.selected_service_label }
      : {}),
    ...(params.service_slug ? { service_slug: params.service_slug } : {}),
    ...(params.service_label ? { service_label: params.service_label } : {}),
    ...(params.form_variant ? { form_variant: params.form_variant } : {}),
    ...(params.event_type ? { event_type: params.event_type } : {}),
  };
}
