"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { LEAD_STATUS_OPTIONS } from "@/lib/messages-lead";

const STATUS_OPTIONS = [
  { key: "", label: "Mind" },
  { key: "olvasatlan", label: "Olvasatlan" },
  { key: "olvasott", label: "Olvasott" },
  { key: "megvalaszolt", label: "Megvalaszolt" },
  { key: "archivalt", label: "Archivalt" },
] as const;

const LOCALE_OPTIONS = [
  { key: "", label: "Mind" },
  { key: "hu", label: "HU" },
  { key: "en", label: "EN" },
  { key: "de", label: "DE" },
  { key: "zh", label: "ZH" },
] as const;

function buildHref(
  current: URLSearchParams,
  patch: Record<string, string>,
): string {
  const next = new URLSearchParams(current);
  for (const [key, value] of Object.entries(patch)) {
    if (!value) next.delete(key);
    else next.set(key, value);
  }
  const qs = next.toString();
  return qs ? `/admin/messages?${qs}` : "/admin/messages";
}

export function MessagesFilters() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? "";
  const locale = searchParams.get("locale") ?? "";
  const lead = searchParams.get("lead") ?? "";
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
        action="/admin/messages"
        method="get"
        style={{ display: "flex", gap: 8 }}
      >
        {status && <input type="hidden" name="status" value={status} />}
        {locale && <input type="hidden" name="locale" value={locale} />}
        {lead && <input type="hidden" name="lead" value={lead} />}
        <input
          type="text"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Kereses nevben, emailben, cegben vagy uzenetben..."
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
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: 0.5,
          }}
        >
          Kereses
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
            Torles
          </Link>
        )}
      </form>

      <div style={filterRowStyle}>
        <FilterLabel>Statusz:</FilterLabel>
        {STATUS_OPTIONS.map((option) => {
          const active = status === option.key;
          const activeBg = option.key === "archivalt" ? "#64748B" : "#0B1E3E";
          return (
            <Chip
              key={option.key || "all-status"}
              href={buildHref(searchParams, { status: option.key })}
              active={active}
              activeColor={activeBg}
            >
              {option.label}
            </Chip>
          );
        })}
      </div>

      <div style={filterRowStyle}>
        <FilterLabel>Lead:</FilterLabel>
        <Chip
          href={buildHref(searchParams, { lead: "" })}
          active={!lead}
          activeColor="#0B1E3E"
        >
          Mind
        </Chip>
        {LEAD_STATUS_OPTIONS.map((option) => (
          <Chip
            key={option.value}
            href={buildHref(searchParams, { lead: option.value })}
            active={lead === option.value}
            activeColor={option.color}
          >
            {option.shortLabel}
          </Chip>
        ))}
      </div>

      <div style={filterRowStyle}>
        <FilterLabel>Nyelv:</FilterLabel>
        {LOCALE_OPTIONS.map((option) => (
          <Chip
            key={option.key || "all-locale"}
            href={buildHref(searchParams, { locale: option.key })}
            active={locale === option.key}
            activeColor="#D1172E"
          >
            {option.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}

const filterRowStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  alignItems: "center",
  flexWrap: "wrap",
};

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: 12,
        color: "#64748B",
        fontWeight: 700,
        letterSpacing: 0.5,
        textTransform: "uppercase",
        marginRight: 4,
      }}
    >
      {children}
    </span>
  );
}

function Chip({
  href,
  active,
  activeColor,
  children,
}: {
  href: string;
  active: boolean;
  activeColor: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      style={{
        padding: "6px 12px",
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 700,
        textDecoration: "none",
        background: active ? activeColor : "#fff",
        color: active ? "#fff" : "#0B1E3E",
        border: `1px solid ${active ? activeColor : "#CBD5E1"}`,
      }}
    >
      {children}
    </Link>
  );
}
