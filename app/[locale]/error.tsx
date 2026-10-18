"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AvenirLogo } from "@/components/AvenirLogo";
import { getRecoveryLocale, getRuntimeErrorCopy } from "@/lib/runtime-error-copy";

// Locale-aware runtime error boundary. Must be a Client Component
// because it receives reset() from React error boundaries. Logs to
// console for debugging; production telemetry (e.g., Sentry) wired
// in a later commit. Rendered inside the [locale] layout (parent
// provides <html><body>), so this returns content only.
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams<{ locale: string }>();
  const locale = getRecoveryLocale(params?.locale);
  const copy = getRuntimeErrorCopy(locale);
  useEffect(() => {
    console.error("[locale-error]", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0B1E3E",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "5vw",
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 560, textAlign: "center" }}>
        <div style={{ marginBottom: 32, display: "flex", justifyContent: "center" }}>
          <AvenirLogo size={48} />
        </div>
        <h1
          style={{
            fontFamily: "var(--font-head)",
            fontSize: "clamp(24px, 3vw, 36px)",
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          {copy.title}
        </h1>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, lineHeight: 1.65, marginBottom: 28 }}>
          {copy.body}
          {error.digest && (
            <>
              <br />
              <span style={{ fontFamily: "monospace", fontSize: 12, opacity: 0.5 }}>
                ID: {error.digest}
              </span>
            </>
          )}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              background: "#D1172E",
              color: "#fff",
              padding: "12px 22px",
              borderRadius: 4,
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 14,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              fontFamily: "inherit",
            }}
          >
            {copy.retry}
          </button>
          <Link
            href={`/${locale}`}
            style={{
              background: "transparent",
              color: "#fff",
              padding: "12px 22px",
              borderRadius: 4,
              border: "1px solid rgba(255,255,255,0.3)",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 14,
              letterSpacing: 0.5,
              textTransform: "uppercase",
            }}
          >
            {copy.home}
          </Link>
        </div>
      </div>
    </div>
  );
}
