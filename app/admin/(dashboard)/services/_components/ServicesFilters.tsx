"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

// Filter chips + search + showInactive toggle for the services list.
// URL search params are the source of truth — the Server Component
// list page reads them and queries the DB. No router.push, no
// debounced search; the search input is part of a <form method="get">
// that submits on Enter, mirroring NewsFilters / MessagesFilters
// across the rest of the admin UI.

const STATUS_OPTIONS = [
  { key: "", label: "Mind" },
  { key: "draft", label: "Vázlat" },
  { key: "published", label: "Publikálva" },
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
  return qs ? `/admin/services?${qs}` : "/admin/services";
}

export function ServicesFilters() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? "";
  const showInactive = searchParams.get("showInactive") === "1";
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
      {/* Search row + showInactive toggle + Új CTA */}
      <form
        action="/admin/services"
        method="get"
        style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}
      >
        {status && <input type="hidden" name="status" value={status} />}
        {showInactive && <input type="hidden" name="showInactive" value="1" />}
        <input
          type="text"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Keresés név, slug vagy leírás alapján…"
          style={{
            flex: "1 1 280px",
            minWidth: 220,
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

      {/* Status pills + showInactive toggle + Új CTA */}
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
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

        {/* showInactive toggle is rendered as a <Link> so the URL is
            shareable and the server is the single source of truth.
            Looks like a checkbox label but is actually navigation. */}
        <Link
          href={buildHref(searchParams, { showInactive: showInactive ? "" : "1" })}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            fontWeight: 600,
            color: "#0B1E3E",
            textDecoration: "none",
            padding: "6px 12px",
            borderRadius: 4,
            border: "1px solid #CBD5E1",
            background: showInactive ? "#F1F5F9" : "#fff",
          }}
        >
          <span
            aria-hidden
            style={{
              display: "inline-block",
              width: 14,
              height: 14,
              borderRadius: 3,
              border: "1px solid #94A3B8",
              background: showInactive ? "#0B1E3E" : "#fff",
              position: "relative",
            }}
          >
            {showInactive && (
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 11,
                  lineHeight: 1,
                }}
              >
                ✓
              </span>
            )}
          </span>
          Inaktívak megjelenítése
        </Link>

        <div style={{ flex: 1 }} />

        <Link
          href="/admin/services/new"
          style={{
            background: "#D1172E",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: 4,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          + Új szolgáltatás
        </Link>
      </div>
    </div>
  );
}
