import Image from "next/image";
import Link from "next/link";
import { type Translation } from "@/lib/i18n";
import { SEO_DATA } from "@/lib/seo-data";
import {
  getActiveTopLevelServices,
  getAllPublishedServicePathsForBuild,
} from "@/lib/db/queries/services";
import { getReadyServiceDetailHref } from "@/lib/service-detail-links";
import {
  getFooterLegalLinks,
  getLocaleServiceListLabel,
} from "@/lib/locale-ui-helpers";
import { CookieSettingsButton } from "./analytics/CookieSettingsButton";
import { TrackedContactLink } from "./analytics/TrackedContactLink";

export async function Footer({
  t,
  locale,
  readyServiceDetailPaths,
}: {
  t: Translation;
  locale: string;
  readyServiceDetailPaths?: readonly { locale: string; slug: string }[];
}) {
  // Locale-aware services-quick-links via shared helper
  // (lib/db/queries/services.ts). Footer surface needs name only;
  // empty-field guard drops rows with no usable title.
  const rows = await getActiveTopLevelServices(locale);
  const effectiveReadyServiceDetailPaths =
    readyServiceDetailPaths ??
    (await getAllPublishedServicePathsForBuild("footer service detail links"));
  const serviceLinks = rows
    .map((row) => ({
      slug: row.slug,
      title: getLocaleServiceListLabel(locale, row.slug, row.name),
      href: getReadyServiceDetailHref({
        locale,
        slug: row.slug,
        readyServiceDetailPaths: effectiveReadyServiceDetailPaths,
      }),
    }))
    .filter((link) => link.title.length > 0);
  const legalLinks = getFooterLegalLinks(locale, t.footer);
  const linkedInLabel =
    locale === "hu" ? "Avenir a LinkedInen" : "Avenir on LinkedIn";

  return (
    <footer style={{ background: "#070F1E", padding: "60px 5vw 28px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Top grid: logo / services / contact / legal */}
        <div
          className="footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1.2fr 1fr",
            gap: 48,
            marginBottom: 40,
          }}
        >
          {/* Column 1: Logo */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", minHeight: 150 }}>
            <Image
              src="/avenir-logo-horizontal-dark.svg"
              alt="Avenir Facility Management"
              width={3000}
              height={750}
              unoptimized
              style={{
                height: 106,
                width: "auto",
                display: "block",
                maxWidth: "100%",
              }}
            />
          </div>

          {/* Column 2: Services links */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-head)",
                color: "var(--avenir-on-dark)",
                fontSize: 13,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                fontWeight: 700,
                marginBottom: 18,
              }}
            >
              {t.servicesTitle}
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {serviceLinks.map((link) => (
                <li key={link.slug}>
                  {link.href ? (
                    <Link
                      href={link.href}
                      className="footer-link"
                      style={{
                        color: "var(--avenir-on-dark-muted)",
                        fontSize: 13,
                        textDecoration: "none",
                      }}
                    >
                      {link.title}
                    </Link>
                  ) : (
                    <a
                      href="#services"
                      className="footer-link"
                      style={{
                        color: "var(--avenir-on-dark-muted)",
                        fontSize: 13,
                        textDecoration: "none",
                      }}
                    >
                      {link.title}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact info (hardcoded — not from translations) */}
          {/* SOURCE OF TRUTH for company facts: lib/seo-data.ts */}
          {/* Keep these strings synced when seo-data is updated. */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-head)",
                color: "var(--avenir-on-dark)",
                fontSize: 13,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                fontWeight: 700,
                marginBottom: 18,
              }}
            >
              {t.contactTitle}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, color: "var(--avenir-on-dark-muted)", fontSize: 13, lineHeight: 1.6, fontWeight: 300 }}>
              <div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=1039+Budapest%2C+Kir%C3%A1lyok+%C3%BAtja+291"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                  title="Megnyitás Google Maps-en"
                  style={{
                    color: "inherit",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
                  </svg>
                  1039 Budapest, Királyok útja 291.
                </a>
              </div>
              <div>
                <TrackedContactLink
                  href="tel:+36703168218"
                  locale={locale}
                  eventName="phone_click"
                  className="footer-link"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  +36 70 316 8218
                </TrackedContactLink>
              </div>
              <div>
                <TrackedContactLink
                  href="mailto:info@afm.hu"
                  locale={locale}
                  eventName="email_click"
                  className="footer-link"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  info@afm.hu
                </TrackedContactLink>
              </div>
            </div>
          </div>

          {/* Column 4: Legal links — locale-prefixed Next/Link */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-head)",
                color: "var(--avenir-on-dark)",
                fontSize: 13,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                fontWeight: 700,
                marginBottom: 18,
              }}
            >
              {t.footer.legalTitle}
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link" style={{ color: "var(--avenir-on-dark-muted)", fontSize: 13, textDecoration: "none" }}>
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <CookieSettingsButton locale={locale} />
              </li>
            </ul>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 18 }}>
          <a
            href={SEO_DATA.officialProfiles.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={linkedInLabel}
            className="footer-social-link"
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.91 1.64-1.87 3.37-1.87 3.61 0 4.27 2.38 4.27 5.47v6.29ZM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.54V9H7.1v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
            </svg>
          </a>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24 }}>
          <p style={{ color: "var(--avenir-on-dark-muted)", fontSize: 13, fontWeight: 300, marginBottom: 6 }}>
            {t.footer.rights}
          </p>
          <p style={{ color: "var(--avenir-on-dark-soft)", fontSize: 12, fontWeight: 300 }}>
            {t.footer.companyNumberLabel}: 01-09-328046 · {t.footer.taxNumberLabel}: 26395124-2-41 · {t.footer.headquartersLabel}: 1039 Budapest, Királyok útja 291. B. ép. 15. ajtó
          </p>
          {t.footer.machineTranslationDisclaimer && (
            <p style={{ color: "var(--avenir-on-dark-soft)", fontSize: 11, fontWeight: 300, marginTop: 10, fontStyle: "italic" }}>
              {t.footer.machineTranslationDisclaimer}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
