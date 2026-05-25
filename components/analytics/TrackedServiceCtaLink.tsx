"use client";

import Link from "next/link";
import { type CSSProperties, type ReactNode } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics/events";

export function TrackedServiceCtaLink({
  href,
  locale,
  serviceSlug,
  serviceLabel,
  className,
  style,
  children,
}: {
  href: string;
  locale: string;
  serviceSlug: string;
  serviceLabel: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      style={style}
      onClick={() =>
        trackAnalyticsEvent("service_cta_click", {
          locale,
          selected_service_key: serviceSlug,
          selected_service_label: serviceLabel,
        })
      }
    >
      {children}
    </Link>
  );
}
