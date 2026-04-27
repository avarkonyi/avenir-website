"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Translation } from "@/lib/i18n";
import { AvenirLogo } from "./AvenirLogo";
import { Icon } from "./Icon";

const SECTION_KEYS = ["about", "services", "references", "news", "career", "contact"] as const;
const LOCALES = ["hu", "en", "de", "zh"] as const;

export function Nav({ t }: { t: Translation }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const params = useParams<{ locale: string }>();
  const currentLocale = params?.locale ?? "hu";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    handler();
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [menuOpen]);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: "smooth" });
  };

  const navStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    background: scrolled ? "rgba(11,30,62,0.97)" : "transparent",
    backdropFilter: scrolled ? "blur(12px)" : "none",
    borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
    transition: "all 0.35s ease",
    padding: "0 5vw",
  };

  return (
    <nav style={navStyle}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", height: 72, gap: 32 }}>
        <button
          onClick={() => scrollTo("hero")}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
          aria-label="Avenir home"
        >
          <AvenirLogo size={36} />
        </button>
        <div style={{ flex: 1 }} />

        {/* Desktop nav */}
        <div className="desktop-nav" style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {SECTION_KEYS.map((k) => (
            <button
              key={k}
              onClick={() => scrollTo(k)}
              className="nav-link"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(255,255,255,0.82)",
                fontFamily: "var(--font-head)",
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                padding: "4px 0",
                borderBottom: "2px solid transparent",
                transition: "color 0.2s, border-color 0.2s",
              }}
            >
              {t.nav[k]}
            </button>
          ))}

          {/* Language switcher (URL-based) */}
          <div style={{ display: "flex", gap: 6, marginLeft: 8 }}>
            {LOCALES.map((l) => (
              <Link
                key={l}
                href={`/${l}`}
                style={{
                  background: currentLocale === l ? "#D1172E" : "rgba(255,255,255,0.12)",
                  cursor: "pointer",
                  color: "#fff",
                  fontFamily: "var(--font-head)",
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: 0.5,
                  padding: "4px 8px",
                  borderRadius: 3,
                  transition: "all 0.2s",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                {l}
              </Link>
            ))}
          </div>

          <button
            onClick={() => scrollTo("contact")}
            className="nav-cta"
            style={{
              background: "#D1172E",
              border: "none",
              cursor: "pointer",
              color: "#fff",
              fontFamily: "var(--font-head)",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: 1,
              textTransform: "uppercase",
              padding: "10px 22px",
              borderRadius: 2,
              transition: "background 0.2s",
            }}
          >
            {t.nav.cta}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-menu-btn"
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#fff",
            padding: 0,
          }}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-menu"
        >
          <Icon name={menuOpen ? "close" : "menu"} size={26} color="#fff" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-nav-menu"
          style={{
            background: "rgba(11,30,62,0.98)",
            padding: "20px 5vw 28px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {SECTION_KEYS.map((k) => (
            <button
              key={k}
              onClick={() => scrollTo(k)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(255,255,255,0.85)",
                fontFamily: "var(--font-head)",
                fontWeight: 600,
                fontSize: 17,
                letterSpacing: 1,
                textTransform: "uppercase",
                textAlign: "left",
                padding: "6px 0",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {t.nav[k]}
            </button>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {LOCALES.map((l) => (
              <Link
                key={l}
                href={`/${l}`}
                onClick={() => setMenuOpen(false)}
                style={{
                  background: currentLocale === l ? "#D1172E" : "rgba(255,255,255,0.12)",
                  color: "#fff",
                  fontFamily: "var(--font-head)",
                  fontWeight: 700,
                  fontSize: 12,
                  padding: "6px 12px",
                  borderRadius: 3,
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
