"use client";

import { useState } from "react";
import type { Translation } from "@/lib/i18n";
import { Icon } from "./Icon";
import { AvenirLogo } from "./AvenirLogo";

export type Article = {
  id: number;
  title: string;
  lead: string;
  body: string;
  date: string;
};

function formatDate(iso: string, locale: string) {
  try {
    return new Date(iso).toLocaleDateString(locale === "zh" ? "zh-CN" : locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function News({
  t,
  locale,
  articles,
}: {
  t: Pick<
    Translation,
    "newsSub" | "newsTitle" | "newsText" | "newsEmpty" | "newsReadMore"
  >;
  locale: string;
  articles: Article[];
}) {
  const [active, setActive] = useState<Article | null>(null);

  return (
    <section id="news" style={{ padding: "100px 5vw", background: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 24,
            marginBottom: 52,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 3, background: "#D1172E" }} />
              <span
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: 13,
                  letterSpacing: 2.5,
                  color: "#D1172E",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                {t.newsSub}
              </span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 800,
                fontSize: "clamp(36px, 4vw, 54px)",
                color: "#0B1E3E",
                lineHeight: 1.1,
                marginBottom: 12,
              }}
            >
              {t.newsTitle}
            </h2>
            <p style={{ color: "#556070", fontSize: 16, lineHeight: 1.65, fontWeight: 300, maxWidth: 560 }}>
              {t.newsText}
            </p>
          </div>
        </div>

        {articles.length === 0 ? (
          <div
            style={{
              padding: "60px 0",
              textAlign: "center",
              color: "#8A9BB0",
              fontSize: 18,
            }}
          >
            {t.newsEmpty}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 28,
            }}
          >
            {articles.map((art) => (
              <article
                key={art.id}
                className="news-card"
                onClick={() => setActive(art)}
              >
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "16/9",
                    background: "linear-gradient(135deg, #0B1E3E, #1a3a6b)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AvenirLogo size={36} />
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                      background: "#D1172E",
                      color: "#fff",
                      fontFamily: "var(--font-head)",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 1,
                      padding: "4px 10px",
                      borderRadius: 2,
                      textTransform: "uppercase",
                    }}
                  >
                    {formatDate(art.date, locale)}
                  </div>
                </div>
                <div
                  style={{
                    padding: "24px 24px 28px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-head)",
                      fontWeight: 700,
                      fontSize: 22,
                      color: "#0B1E3E",
                      lineHeight: 1.25,
                      marginBottom: 12,
                    }}
                  >
                    {art.title}
                  </h3>
                  <p style={{ color: "#667788", fontSize: 14.5, lineHeight: 1.6, fontWeight: 300, flex: 1 }}>
                    {art.lead}
                  </p>
                  <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        fontFamily: "var(--font-head)",
                        fontWeight: 700,
                        fontSize: 13,
                        letterSpacing: 1.2,
                        color: "#D1172E",
                        textTransform: "uppercase",
                      }}
                    >
                      {t.newsReadMore}
                    </span>
                    <Icon name="arrow" size={14} color="#D1172E" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Article modal */}
      {active && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setActive(null);
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(11,30,62,0.85)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            backdropFilter: "blur(6px)",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 4,
              maxWidth: 760,
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              position: "relative",
            }}
          >
            <button
              onClick={() => setActive(null)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "rgba(255,255,255,0.95)",
                border: "1px solid #E2E8F0",
                borderRadius: "50%",
                width: 36,
                height: 36,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
              }}
              aria-label="Close"
            >
              <Icon name="close" size={18} color="#0B1E3E" />
            </button>
            <div style={{ padding: 40 }}>
              <div
                style={{
                  fontFamily: "var(--font-head)",
                  fontSize: 13,
                  letterSpacing: 2,
                  color: "#D1172E",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                {formatDate(active.date, locale)}
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-head)",
                  fontWeight: 800,
                  fontSize: 34,
                  color: "#0B1E3E",
                  lineHeight: 1.15,
                  marginBottom: 20,
                }}
              >
                {active.title}
              </h2>
              <div
                style={{
                  color: "#445566",
                  fontSize: 16,
                  lineHeight: 1.75,
                  fontWeight: 300,
                  whiteSpace: "pre-wrap",
                }}
              >
                {active.body}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
