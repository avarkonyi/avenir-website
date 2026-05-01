"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

type Props = {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

export function AdminTopbar({ user }: Props) {
  const [open, setOpen] = useState(false);
  const initial = (user?.name || user?.email || "?").charAt(0).toUpperCase();

  return (
    <header
      style={{
        height: 60,
        background: "#fff",
        borderBottom: "1px solid #E2E8F0",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 24px",
        position: "relative",
      }}
    >
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
