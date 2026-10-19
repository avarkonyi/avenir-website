import { buildJsonLdSchemas, type CertSchemaInput } from "@/lib/homepage-schema";
import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Geist, Barlow_Condensed } from "next/font/google";
import { and, asc, eq } from "drizzle-orm";
import "../globals.css";
import { LOCALES } from "@/lib/i18n";
import { JsonLd } from "@/components/JsonLd";
import { AnalyticsConsentBanner } from "@/components/analytics/AnalyticsConsentBanner";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { db, certifications } from "@/lib/db";
import { localizeCertificationText } from "@/lib/homepage-content";
import { getLocaleAccessibility } from "@/lib/locale-accessibility";
import {
  SEO_DATA,
  SEO_LOCALES,
  OG_LOCALE_MAP,
  META_DESCRIPTIONS,
  META_TAGLINES,
  type SeoLocale,
} from "@/lib/seo-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  // Hungarian body text needs ő/ű; preload its subset alongside Latin.
  subsets: ["latin", "latin-ext"],
});

// NOTE: Geist_Mono dropped 2026-04-30 — `var(--font-geist-mono)` had 0
// references across components/. Saves 1 woff2 preload (P1-G perf fix).
// If a future feature needs monospace, re-add here + html className.

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin", "latin-ext"],
  // Weight 400 dropped 2026-04-30 — never rendered (only 600/700/800
  // used across UI). Saves 2 woff2 preloads (latin + latin-ext × 1 weight).
  weight: ["600", "700", "800"],
});

export const viewport: Viewport = {
  themeColor: SEO_DATA.themeColor,
  width: "device-width",
  initialScale: 1,
};

export const revalidate = 3600;
const INDEXABLE_LOCALES = ["hu", "en"] as const;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!SEO_LOCALES.includes(locale as SeoLocale)) notFound();
  const seoLocale = locale as SeoLocale;
  const tagline = META_TAGLINES[seoLocale];
  const title = `${SEO_DATA.legalNameShort} — ${tagline}`;
  const description = META_DESCRIPTIONS[seoLocale];
  const alternateLocales = INDEXABLE_LOCALES.filter((l) => l !== seoLocale).map(
    (l) => OG_LOCALE_MAP[l],
  );

  return {
    metadataBase: new URL(SEO_DATA.url),
    title,
    description,
    authors: [{ name: SEO_DATA.legalNameShort }],
    // robots and canonical/hreflang are set per page (lib/page-metadata.ts),
    // so the localized 404 boundary inherits no index directive or canonical.
    openGraph: {
      type: "website",
      siteName: SEO_DATA.name,
      title,
      description,
      locale: OG_LOCALE_MAP[seoLocale],
      alternateLocale: alternateLocales,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

const CERT_SCHEMA_COLS = {
  hu: {
    fullName: certifications.fullNameHu,
    description: certifications.descriptionHu,
  },
  en: {
    fullName: certifications.fullNameEn,
    description: certifications.descriptionEn,
  },
  de: {
    fullName: certifications.fullNameDe,
    description: certifications.descriptionDe,
  },
  zh: {
    fullName: certifications.fullNameZh,
    description: certifications.descriptionZh,
  },
  ko: {
    fullName: certifications.fullNameEn,
    description: certifications.descriptionEn,
  },
  fr: {
    fullName: certifications.fullNameEn,
    description: certifications.descriptionEn,
  },
} as const;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!SEO_LOCALES.includes(locale as SeoLocale)) notFound();
  const seoLocale = locale as SeoLocale;
  // JSON-LD: services and certifications are per-locale DB-backed.
  // Missing translated certification prose is omitted rather than replaced
  // with a different language. Stable credential names remain available.
  const certCols = CERT_SCHEMA_COLS[seoLocale] ?? CERT_SCHEMA_COLS.hu;
  const certRows = await db
    .select({
      slug: certifications.slug,
      name: certifications.name,
      fullName: certCols.fullName,
      description: certCols.description,
      credentialCategory: certifications.credentialCategory,
      issuer: certifications.issuer,
      issuerUrl: certifications.issuerUrl,
      issuedDate: certifications.issuedDate,
      expiresDate: certifications.expiresDate,
      standardCode: certifications.standardCode,
      certificateNumber: certifications.certificateNumber,
      accreditationBody: certifications.accreditationBody,
      accreditationNumber: certifications.accreditationNumber,
      pdfUrl: certifications.pdfUrl,
    })
    .from(certifications)
    .where(
      and(eq(certifications.active, true), eq(certifications.isPublished, true)),
    )
    .orderBy(asc(certifications.sortOrder));
  const certs: CertSchemaInput[] = certRows.map((cert) => ({
    ...cert,
    fullName: localizeCertificationText(locale, cert.fullName, cert.slug, "fullName") ?? cert.name,
    description: localizeCertificationText(locale, cert.description, cert.slug, "description"),
  }));

  // The service ItemList is emitted on the homepage only (app/[locale]/page.tsx).
  const schemas = buildJsonLdSchemas(seoLocale, certs);
  const skipLinkText = getLocaleAccessibility(seoLocale).skip;

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${barlowCondensed.variable}`}
    >
      <body>
        <a href="#main" className="skip-link">
          {skipLinkText}
        </a>
        <JsonLd schemas={schemas} />
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        {children}
        <AnalyticsConsentBanner locale={locale} />
      </body>
    </html>
  );
}
