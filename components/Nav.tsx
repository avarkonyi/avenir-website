"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Translation } from "@/lib/i18n";
import { Icon } from "./Icon";

const SECTION_KEYS = ["about", "services", "references", "news", "career", "contact"] as const;
const LOCALES = ["hu", "en", "de", "zh"] as const;

function normalizeHash(rawHash: string): string {
  if (!rawHash) return "";
  const parts = rawHash.split("#").filter(Boolean);
  const lastPart = parts.at(-1);
  return lastPart ? `#${lastPart}` : "";
}

export function Nav({ t }: { t: Pick<Translation, "nav"> }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const params = useParams<{ locale: string }>();
  const pathname = usePathname();
  const currentLocale = params?.locale ?? "hu";

  // True if currently on the locale homepage (where the section anchors
  // exist for in-page smooth scroll). False on legal pages and other
  // sub-routes — clicking a nav item must navigate back to /[locale]
  // with a hash anchor instead of trying to scrollIntoView a missing id.
  const isOnHomepage =
    pathname === `/${currentLocale}` || pathname === `/${currentLocale}/`;

  // True if currently on a legal page (impresszum/aszf/adatvedelem).
  // These pages have a white background that would clash with the
  // homepage's transparent-at-top nav style — readability hotfix:
  // force the navy nav background regardless of scroll position.
  const isLegalPage = /\/(impresszum|aszf|adatvedelem)\/?$/.test(pathname);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    handler();
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Track window.location.hash for locale switcher hash preservation
  // (P1-C phase 2). Two-pass hydration: initial state is empty so SSR
  // and the first client render produce identical href strings (no
  // hydration mismatch). After mount, useEffect populates the hash and
  // re-renders the language buttons with /<locale><currentPath>#<hash>.
  // Listens to hashchange so anchor jumps via in-page nav update too.
  const [hash, setHash] = useState("");
  useEffect(() => {
    const syncHash = () => {
      const normalizedHash = normalizeHash(window.location.hash);
      if (window.location.hash !== normalizedHash) {
        window.history.replaceState(
          null,
          "",
          `${window.location.pathname}${window.location.search}${normalizedHash}`,
        );
      }
      setHash(normalizedHash);
    };

    // One-time hydration sync of window.location.hash to React state.
    // Cannot read window during SSR; initial render uses "" (matching
    // server output, no hydration mismatch). After mount we sync the
    // actual hash and subscribe to hashchange.
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
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

  const replaceHash = (nextHash: string) => {
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}${nextHash}`,
    );
    setHash(nextHash);
  };

  // Click handler factory for section nav items. On homepage, prevent
  // default Link navigation and smooth-scroll to the section. Off
  // homepage, let Link handle navigation to /[locale]#id (browser will
  // jump to the anchor after page load).
  const handleSectionClick =
    (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (isOnHomepage) {
        e.preventDefault();
        scrollTo(id);
        replaceHash(`#${id}`);
      }
      // Off-homepage: let Link navigate; menu close happens via the
      // page transition (component remounts) so no explicit setMenuOpen.
    };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isOnHomepage) {
      e.preventDefault();
      scrollTo("hero");
      replaceHash("");
    }
    // Off-homepage: let Link navigate to /[locale].
  };

  // Locale switcher — preserve the current path AND hash anchor when
  // changing language. P1-C resolved fully (Codex 2nd pass).
  //
  // Hash preservation: locale-independent IDs (#career, #contact,
  // #about, #services, #references, #news from the homepage; most
  // legal-page section IDs are also shared via t.legal.*.sections[i].id).
  //
  // Edge case — terms section §4 has #magannyomozas (HU) vs
  // #private-investigation (EN/DE/ZH). Switching from /hu/aszf with
  // that hash to EN gives /en/aszf#magannyomozas → not found → graceful
  // top-of-page render. Acceptable: 1 of ~30 IDs differs (~3% miss rate
  // for a corner-case scroll target). Locale-aware id mapping is a
  // future polish if user feedback indicates it matters.
  const buildLocaleHref = (newLocale: string): string => {
    const segments = pathname.split("/");
    let basePath: string;
    if (
      segments[1] &&
      (LOCALES as readonly string[]).includes(segments[1])
    ) {
      segments[1] = newLocale;
      basePath = segments.join("/");
    } else {
      basePath = `/${newLocale}`;
    }
    return `${basePath}${hash}`;
  };

  // Force the navy treatment on legal pages (always) and on homepage
  // after the user scrolls past 60px (hero overlay transition). On
  // homepage at scrollY=0 the nav stays transparent so the hero image
  // can show through.
  const showDarkNav = scrolled || isLegalPage;

  const navStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    background: showDarkNav ? "rgba(11,30,62,0.97)" : "transparent",
    backdropFilter: showDarkNav ? "blur(12px)" : "none",
    borderBottom: showDarkNav ? "1px solid rgba(255,255,255,0.08)" : "none",
    transition: "all 0.35s ease",
    padding: "0 5vw",
  };

  return (
    <nav style={navStyle}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", height: 72, gap: 32 }}>
        <Link
          href={`/${currentLocale}`}
          onClick={handleLogoClick}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "inline-flex" }}
          aria-label="Avenir home"
        >
          <Image
            src="/avenir-logo-horizontal-dark.svg"
            alt="Avenir Facility Management"
            width={3000}
            height={750}
            priority
            unoptimized
            style={{
              height: 36,
              width: "auto",
              display: "block",
              maxWidth: "100%",
            }}
          />
        </Link>
        <div style={{ flex: 1 }} />

        {/* Desktop nav — Link with onClick: smooth-scroll on homepage,
            navigate to /[locale]#id on legal pages and other sub-routes. */}
        <div className="desktop-nav" style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {SECTION_KEYS.map((k) => (
            <Link
              key={k}
              href={`/${currentLocale}#${k}`}
              onClick={handleSectionClick(k)}
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
                textDecoration: "none",
              }}
            >
              {t.nav[k]}
            </Link>
          ))}

          {/* Language switcher — preserves current path + scroll position */}
          <div style={{ display: "flex", gap: 6, marginLeft: 8 }}>
            {LOCALES.map((l) => (
              <Link
                key={l}
                href={buildLocaleHref(l)}
                scroll={false}
                prefetch
                aria-label={`Switch to ${l.toUpperCase()}`}
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

          <Link
            href={`/${currentLocale}#contact`}
            onClick={handleSectionClick("contact")}
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
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            {t.nav.cta}
          </Link>
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
            <Link
              key={k}
              href={`/${currentLocale}#${k}`}
              onClick={(e) => {
                setMenuOpen(false);
                handleSectionClick(k)(e);
              }}
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
                textDecoration: "none",
              }}
            >
              {t.nav[k]}
            </Link>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {LOCALES.map((l) => (
              <Link
                key={l}
                href={buildLocaleHref(l)}
                scroll={false}
                prefetch
                aria-label={`Switch to ${l.toUpperCase()}`}
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
