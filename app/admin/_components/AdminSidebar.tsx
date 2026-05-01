"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AvenirLogo } from "@/components/AvenirLogo";

// Sidebar nav items. Phase 2 Iteration 1: only Dashboard is implemented;
// the remaining items are placeholder stubs (visible but disabled +
// "Hamarosan" label) so the user sees the planned scope.
type NavItem = {
  label: string;
  href: string;
  enabled: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Vezérlőpult", href: "/admin", enabled: true },
  { label: "Üzenetek", href: "/admin/messages", enabled: false },
  { label: "Hírek", href: "/admin/news", enabled: false },
  { label: "Karrier", href: "/admin/positions", enabled: false },
  { label: "Partnerek", href: "/admin/partners", enabled: false },
  { label: "Tanúsítványok", href: "/admin/certifications", enabled: false },
  { label: "Beállítások", href: "/admin/settings", enabled: false },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 240,
        background: "#0B1E3E",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "24px 0",
        flexShrink: 0,
      }}
    >
      <div style={{ padding: "0 24px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <Link href="/admin" style={{ display: "inline-flex", textDecoration: "none" }}>
          <AvenirLogo size={32} />
        </Link>
        <p
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: 11,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            fontFamily: "var(--font-head)",
            fontWeight: 700,
            marginTop: 12,
          }}
        >
          Admin
        </p>
      </div>

      <nav style={{ flex: 1, padding: "16px 0" }}>
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const baseStyle: React.CSSProperties = {
              display: "flex",
              alignItems: "center",
              padding: "10px 24px",
              fontFamily: "var(--font-head)",
              fontSize: 13,
              letterSpacing: 0.8,
              fontWeight: 600,
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "background 0.15s ease, color 0.15s ease",
            };
            if (!item.enabled) {
              return (
                <li key={item.href}>
                  <span
                    style={{
                      ...baseStyle,
                      color: "rgba(255,255,255,0.25)",
                      cursor: "not-allowed",
                      justifyContent: "space-between",
                    }}
                  >
                    {item.label}
                    <span
                      style={{
                        fontSize: 9,
                        letterSpacing: 1,
                        background: "rgba(255,255,255,0.08)",
                        padding: "2px 6px",
                        borderRadius: 2,
                      }}
                    >
                      Soon
                    </span>
                  </span>
                </li>
              );
            }
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  style={{
                    ...baseStyle,
                    color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                    background: isActive ? "rgba(209,23,46,0.15)" : "transparent",
                    borderLeft: isActive ? "3px solid #D1172E" : "3px solid transparent",
                  }}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <Link
          href="/hu"
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: 11,
            letterSpacing: 0.8,
            textDecoration: "none",
          }}
        >
          ← Vissza a publikus oldalra
        </Link>
      </div>
    </aside>
  );
}
