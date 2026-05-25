"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics/events";

export function TrackedServiceCardLink({
  href,
  locale,
  serviceSlug,
  serviceLabel,
  children,
}: {
  href: string;
  locale: string;
  serviceSlug: string;
  serviceLabel: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="service-card"
      aria-label={`${serviceLabel} részletei`}
      onClick={() =>
        trackAnalyticsEvent("service_cta_click", {
          locale,
          selected_service_key: serviceSlug,
          selected_service_label: serviceLabel,
        })
      }
      style={{ display: "block", cursor: "pointer" }}
    >
      {children}
    </Link>
  );
}
