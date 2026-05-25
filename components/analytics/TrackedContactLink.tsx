"use client";

import { type CSSProperties, type ReactNode } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics/events";

export function TrackedContactLink({
  href,
  locale,
  eventName,
  className,
  title,
  style,
  children,
}: {
  href: string;
  locale: string;
  eventName?: "phone_click" | "email_click";
  className?: string;
  title?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      title={title}
      style={style}
      onClick={() => {
        if (eventName) trackAnalyticsEvent(eventName, { locale });
      }}
    >
      {children}
    </a>
  );
}
