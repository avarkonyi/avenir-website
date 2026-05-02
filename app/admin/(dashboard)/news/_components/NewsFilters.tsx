"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

// Search + filter chips for the news list. Mirrors MessagesFilters
// (same UX language, same search-via-form-submit pattern, same Link-
// based chip toggles). Filter coverage:
//   - status: "" | "draft" | "published"
//     "draft"     → no locale published_X = true
//     "published" → at least one locale published_X = true
//   - locale: "" | "hu" | "en" | "de" | "zh"
//     Filters rows that HAVE a title in the chosen locale
//     (title_<locale> IS NOT NULL).

const STATUS_OPTIONS = [
  { key: "", label: "Mind" },
  { key: "draft", label: "Vázlat" },
  { key: "published", label: "Publikálva" },
] as const;

const LOCALE_OPTIONS = [
  { key: "", label: "Mind" },
  { key: "hu", label: "🇭🇺 HU" },
  { key: "en", label: "🇬🇧 EN" },
  { key: "de", label: "🇩🇪 DE" },
  { key: "zh", label: "🇨🇳 ZH" },
] as const;

function buildHref(
  current: URLSearchParams,
  patch: Record<string, string>,
): string {
  const next = new URLSearchParams(current);
  for (const [k, v] of Object.entries(patch)) {
    if (!v) next.delete(k);
    else next.set(k, v);
  }
  const qs = next.toString();
  return qs ? `/admin/news?${qs}` : "/admin/news";
}

export function NewsFilters() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? "";
  const locale = searchParams.get("locale") ?? "";
  const q = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(q);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        marginBottom: 20,
      }}
    >
      <form
        action="/admin/news"
        method="get"
        style={{ display: "flex", gap: 8 }}
      >
        {status && <input type="hidden" name="status" value={status} />}
        {locale && <input type="hidden" name="locale" value={locale} />}
        <input
          type="text"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Keresés címben vagy összefoglalóban…"
          style={{
            flex: 1,
            padding: "10px 14px",
            fontSize: 14,
            border: "1px solid #CBD5E1",
            borderRadius: 4,
            outline: "none",
            background: "#fff",
          }}
        />
        <button
          type="submit"
          style={{
            background: "#0B1E3E",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: 4,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            letterSpacing: 0.5,
          }}
        >
          Keresés
        </button>
        {q && (
          <Link
            href={buildHref(searchParams, { q: "" })}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0 14px",
              border: "1px solid #CBD5E1",
              borderRadius: 4,
              fontSize: 13,
              color: "#475569",
              textDecoration: "none",
              background: "#fff",
            }}
          >
            Törlés
          </Link>
        )}
      </form>

      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <span
          style={{
            fontSize: 12,
            color: "#64748B",
            fontWeight: 600,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            marginRight: 4,
          }}
        >
          Státusz:
        </span>
        {STATUS_OPTIONS.map((opt) => {
          const active = status === opt.key;
          return (
            <Link
              key={opt.key || "all-status"}
              href={buildHref(searchParams, { status: opt.key })}
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
                background: active ? "#0B1E3E" : "#fff",
                color: active ? "#fff" : "#0B1E3E",
                border: `1px solid ${active ? "#0B1E3E" : "#CBD5E1"}`,
              }}
            >
              {opt.label}
            </Link>
          );
        })}

        <span style={{ width: 1, height: 20, background: "#CBD5E1", margin: "0 8px" }} />

        <span
          style={{
            fontSize: 12,
            color: "#64748B",
            fontWeight: 600,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            marginRight: 4,
          }}
        >
          Nyelv:
        </span>
        {LOCALE_OPTIONS.map((opt) => {
          const active = locale === opt.key;
          return (
            <Link
              key={opt.key || "all-locale"}
              href={buildHref(searchParams, { locale: opt.key })}
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
                background: active ? "#D1172E" : "#fff",
                color: active ? "#fff" : "#0B1E3E",
                border: `1px solid ${active ? "#D1172E" : "#CBD5E1"}`,
              }}
            >
              {opt.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
