"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";

type Props = {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

// Static labels for known admin paths. Dynamic segments (numeric ids,
// "edit", "new") are resolved by SEGMENT_LABELS / numeric detection in
// computeBreadcrumbs(). The bottom of the function decides linkability:
// only crumbs with a known PATH_LABELS entry become hyperlinks; ad-hoc
// segments (an id, the literal "edit") are rendered as plain text since
// /admin/news/12 is not a real route.
const PATH_LABELS: Record<string, string> = {
  "/admin": "Vezérlőpult",
  "/admin/messages": "Üzenetek",
  "/admin/news": "Hírek",
  "/admin/news/new": "Új hír",
};

const SEGMENT_LABELS: Record<string, string> = {
  edit: "Szerkesztés",
};

type Crumb = { path: string; label: string; linkable: boolean };

function computeBreadcrumbs(pathname: string): Crumb[] {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: Crumb[] = [];
  let cursor = "";
  for (const seg of segments) {
    cursor += `/${seg}`;
    const known = PATH_LABELS[cursor];
    if (known) {
      crumbs.push({ path: cursor, label: known, linkable: true });
    } else if (/^\d+$/.test(seg)) {
      crumbs.push({ path: cursor, label: `#${seg}`, linkable: false });
    } else {
      crumbs.push({
        path: cursor,
        label: SEGMENT_LABELS[seg] ?? seg,
        linkable: false,
      });
    }
  }
  return crumbs;
}

export function AdminTopbar({ user }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? "/admin";
  const crumbs = computeBreadcrumbs(pathname);
  const initial = (user?.name || user?.email || "?").charAt(0).toUpperCase();

  return (
    <header
      style={{
        height: 60,
        background: "#fff",
        borderBottom: "1px solid #E2E8F0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        position: "relative",
        gap: 16,
      }}
    >
      <nav
        aria-label="Breadcrumb"
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 4,
          fontSize: 13,
          color: "#64748B",
          minWidth: 0,
        }}
      >
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <span
              key={c.path}
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              {i > 0 && (
                <span style={{ margin: "0 8px", color: "#CBD5E1" }} aria-hidden>
                  /
                </span>
              )}
              {isLast ? (
                <span
                  aria-current="page"
                  style={{ color: "#0B1E3E", fontWeight: 700 }}
                >
                  {c.label}
                </span>
              ) : c.linkable ? (
                <Link
                  href={c.path}
                  style={{
                    color: "#0B1E3E",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  {c.label}
                </Link>
              ) : (
                <span style={{ color: "#94A3B8" }}>{c.label}</span>
              )}
            </span>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "6px 8px",
          borderRadius: 4,
          transition: "background 0.15s ease",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#F1F5F9";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#0B1E3E",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-head)",
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          {initial}
        </div>
        <div style={{ textAlign: "left", lineHeight: 1.2 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#0B1E3E" }}>
            {user?.name ?? "Admin"}
          </div>
          <div style={{ fontSize: 11, color: "#64748B" }}>
            {user?.email ?? ""}
          </div>
        </div>
      </button>

      {open && (
        <>
          {/* Click-outside backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 5,
            }}
          />
          <div
            role="menu"
            style={{
              position: "absolute",
              right: 24,
              top: 56,
              minWidth: 200,
              background: "#fff",
              border: "1px solid #E2E8F0",
              borderRadius: 4,
              boxShadow: "0 10px 30px rgba(11,30,62,0.12)",
              zIndex: 10,
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              style={{
                display: "block",
                width: "100%",
                padding: "12px 16px",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                fontSize: 13,
                color: "#0B1E3E",
                fontFamily: "var(--font-geist-sans)",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#F1F5F9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              Kijelentkezés
            </button>
          </div>
        </>
      )}
    </header>
  );
}
