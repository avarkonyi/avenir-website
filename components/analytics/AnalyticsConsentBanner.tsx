"use client";

import { useEffect, useState } from "react";
import {
  ANALYTICS_SETTINGS_EVENT,
  readAnalyticsConsent,
  writeAnalyticsConsent,
  type AnalyticsConsentChoice,
} from "@/lib/analytics/consent";

type Copy = {
  text: string;
  accept: string;
  reject: string;
  title: string;
};

const COPY: Record<"hu" | "en", Copy> = {
  hu: {
    title: "Analitikai beállítások",
    text: "Analitikai sütiket csak hozzájárulás esetén használunk. Ezek segítenek megérteni, mely oldalaink és szolgáltatásaink érdeklik a látogatókat. Személyes adatot, üzenetmezőt vagy űrlaptartalmat nem küldünk analitikába.",
    accept: "Elfogadom az analitikát",
    reject: "Elutasítom",
  },
  en: {
    title: "Analytics settings",
    text: "We use analytics cookies only with your consent. They help us understand which pages and services visitors use. We do not send personal details, message fields or form content to analytics.",
    accept: "Accept analytics",
    reject: "Reject",
  },
};

export function AnalyticsConsentBanner({ locale }: { locale: string }) {
  const [visible, setVisible] = useState(false);
  const copy = locale === "hu" ? COPY.hu : COPY.en;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setVisible(readAnalyticsConsent() === null);
    });

    function openSettings() {
      setVisible(true);
    }

    window.addEventListener(ANALYTICS_SETTINGS_EVENT, openSettings);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener(ANALYTICS_SETTINGS_EVENT, openSettings);
    };
  }, []);

  function choose(choice: AnalyticsConsentChoice) {
    writeAnalyticsConsent(choice);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <section
      className="analytics-consent-banner"
      aria-labelledby="analytics-consent-title"
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        zIndex: 1000,
        width: "min(520px, calc(100vw - 40px))",
        padding: 20,
        border: "1px solid rgba(209, 23, 46, 0.22)",
        borderRadius: 4,
        background: "#fff",
        boxShadow: "0 18px 48px rgba(11, 30, 62, 0.18)",
        color: "#0B1E3E",
      }}
    >
      <h2
        id="analytics-consent-title"
        style={{
          margin: "0 0 8px",
          color: "#0B1E3E",
          fontFamily: "var(--font-head)",
          fontSize: 20,
          fontWeight: 800,
          letterSpacing: 0.2,
        }}
      >
        {copy.title}
      </h2>
      <p
        style={{
          margin: 0,
          color: "var(--avenir-text-soft)",
          fontSize: 13,
          lineHeight: 1.55,
        }}
      >
        {copy.text}
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          justifyContent: "flex-end",
          marginTop: 16,
        }}
      >
        <button
          type="button"
          className="analytics-consent-button analytics-consent-button--secondary"
          onClick={() => choose("rejected")}
        >
          {copy.reject}
        </button>
        <button
          type="button"
          className="analytics-consent-button analytics-consent-button--primary"
          onClick={() => choose("accepted")}
        >
          {copy.accept}
        </button>
      </div>
    </section>
  );
}
