import type { Metadata, Viewport } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { Geist, Barlow_Condensed } from "next/font/google";
import { and, asc, eq } from "drizzle-orm";
import "../globals.css";
import { LOCALES } from "@/lib/i18n";
import { JsonLd } from "@/components/JsonLd";
import { db, certifications } from "@/lib/db";
import { getActiveTopLevelServices } from "@/lib/db/queries/services";
import {
  SEO_DATA,
  SEO_FAQS_HU,
  SEO_LOCALES,
  OG_LOCALE_MAP,
  META_DESCRIPTIONS,
  META_TAGLINES,
  META_KEYWORDS_HU,
  SECURITY_FIRST_DESCRIPTION,
  SCHEMA_KNOWS_ABOUT,
  credentialId,
  type SeoLocale,
} from "@/lib/seo-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
  const localeUrl = `${SEO_DATA.url}/${seoLocale}`;
  const alternateLocales = SEO_LOCALES.filter((l) => l !== seoLocale).map(
    (l) => OG_LOCALE_MAP[l],
  );

  return {
    metadataBase: new URL(SEO_DATA.url),
    title,
    description,
    keywords: META_KEYWORDS_HU,
    authors: [{ name: SEO_DATA.legalNameShort }],
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    alternates: {
      canonical: localeUrl,
      languages: {
        hu: `${SEO_DATA.url}/hu`,
        en: `${SEO_DATA.url}/en`,
        de: `${SEO_DATA.url}/de`,
        zh: `${SEO_DATA.url}/zh`,
        "x-default": `${SEO_DATA.url}/hu`,
      },
    },
    openGraph: {
      type: "website",
      siteName: SEO_DATA.name,
      title,
      description,
      url: localeUrl,
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

type CertSchemaInput = {
  readonly slug: string;
  readonly name: string;
  readonly fullName: string;
  readonly description: string | null;
  readonly credentialCategory: string | null;
  readonly issuer: string;
  readonly issuerUrl: string | null;
  readonly issuedDate: string | null;
  readonly expiresDate: string | null;
  readonly standardCode: string | null;
  readonly certificateNumber: string | null;
  readonly accreditationBody: string | null;
  readonly accreditationNumber: string | null;
  readonly iafMlaMember: boolean;
  readonly pdfUrl: string | null;
};

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
} as const;

function withHuFallback(
  value: string | null,
  fallback: string | null,
): string | null {
  if (value && value.trim().length > 0) return value;
  return fallback && fallback.trim().length > 0 ? fallback : null;
}

function absoluteUrl(url: string): string {
  if (/^https?:\/\//.test(url)) return url;
  return `${SEO_DATA.url}${url}`;
}

function buildJsonLdSchemas(
  localeIso: SeoLocale,
  services: readonly { readonly name: string; readonly description: string }[],
  certs: readonly CertSchemaInput[],
) {
  const orgId = `${SEO_DATA.url}/#organization`;
  const localBusinessId = `${SEO_DATA.url}/#localbusiness`;
  const websiteId = `${SEO_DATA.url}/#website`;
  const postalAddress = {
    "@type": "PostalAddress",
    streetAddress: SEO_DATA.address.streetAddress,
    addressLocality: SEO_DATA.address.addressLocality,
    postalCode: SEO_DATA.address.postalCode,
    addressCountry: SEO_DATA.address.addressCountry,
  };
  const credentialRefs = certs.map((c) => ({ "@id": credentialId(c.slug) }));

  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": orgId,
      name: SEO_DATA.legalNameShort,
      legalName: SEO_DATA.legalName,
      alternateName: SEO_DATA.alternateName,
      url: SEO_DATA.url,
      logo: SEO_DATA.logoUrl,
      image: SEO_DATA.ogImageUrl,
      description: SECURITY_FIRST_DESCRIPTION,
      foundingDate: SEO_DATA.foundingDate,
      taxID: SEO_DATA.taxID,
      vatID: SEO_DATA.vatID,
      iso6523Code: SEO_DATA.iso6523,
      address: postalAddress,
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: SEO_DATA.contact.phone,
          email: SEO_DATA.contact.email,
          contactType: "customer service",
          areaServed: "HU",
          availableLanguage: ["Hungarian", "English"],
        },
      ],
      hasCredential: credentialRefs,
      sameAs: [],
    },
    {
      "@context": "https://schema.org",
      "@type": ["ProfessionalService", "SecurityService"],
      "@id": localBusinessId,
      name: SEO_DATA.legalNameShort,
      alternateName: SEO_DATA.alternateName,
      description: SECURITY_FIRST_DESCRIPTION,
      serviceType: "Property Protection and Security Services",
      knowsAbout: [...SCHEMA_KNOWS_ABOUT],
      image: SEO_DATA.ogImageUrl,
      url: SEO_DATA.url,
      telephone: SEO_DATA.contact.phone,
      email: SEO_DATA.contact.email,
      priceRange: "$$",
      address: postalAddress,
      areaServed: { "@type": "Country", name: "Magyarország" },
      hasCredential: credentialRefs,
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "00:00",
          closes: "23:59",
          description: "24/7 diszpécseri készenlét",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Avenir szolgáltatások",
      itemListElement: services.map((svc, i) => ({
        "@type": "Service",
        position: i + 1,
        name: svc.name,
        description: svc.description,
        provider: { "@id": orgId },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: SEO_FAQS_HU.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": websiteId,
      url: SEO_DATA.url,
      name: SEO_DATA.name,
      publisher: { "@id": orgId },
      inLanguage: [...SEO_LOCALES],
    },
    // One top-level EducationalOccupationalCredential per certification.
    // Organization and ProfessionalService reference these via @id above.
    ...certs.map((c) => {
      const additionalProperty: Record<string, unknown>[] = [];
      if (c.standardCode) {
        additionalProperty.push({
          "@type": "PropertyValue",
          name: "Standard",
          value: c.standardCode,
        });
      }
      if (c.accreditationBody || c.accreditationNumber) {
        additionalProperty.push({
          "@type": "PropertyValue",
          name: "Accreditation",
          value: [c.accreditationBody, c.accreditationNumber]
            .filter(Boolean)
            .join(" · "),
        });
      }
      if (c.iafMlaMember) {
        additionalProperty.push({
          "@type": "PropertyValue",
          name: "IAF MLA member",
          value: "true",
        });
      }
      const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "EducationalOccupationalCredential",
        "@id": credentialId(c.slug),
        name: c.name,
        recognizedBy: {
          "@type": "Organization",
          name: c.issuer,
          ...(c.issuerUrl ? { url: c.issuerUrl } : {}),
        },
      };
      if (c.fullName) schema.alternateName = c.fullName;
      if (c.description) schema.description = c.description;
      if (c.credentialCategory)
        schema.credentialCategory = c.credentialCategory;
      if (c.certificateNumber) schema.identifier = c.certificateNumber;
      if (c.issuedDate) schema.dateCreated = c.issuedDate;
      if (c.expiresDate) schema.expires = c.expiresDate;
      if (c.pdfUrl) schema.url = absoluteUrl(c.pdfUrl);
      if (additionalProperty.length > 0)
        schema.additionalProperty = additionalProperty;
      return schema;
    }),
  ];
}

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
  // Certifications fall back to HU for nullable localized text.
  await connection();
  const certCols = CERT_SCHEMA_COLS[seoLocale] ?? CERT_SCHEMA_COLS.hu;
  const certRows = await db
    .select({
      slug: certifications.slug,
      name: certifications.name,
      fullName: certCols.fullName,
      fullNameHu: certifications.fullNameHu,
      description: certCols.description,
      descriptionHu: certifications.descriptionHu,
      credentialCategory: certifications.credentialCategory,
      issuer: certifications.issuer,
      issuerUrl: certifications.issuerUrl,
      issuedDate: certifications.issuedDate,
      expiresDate: certifications.expiresDate,
      standardCode: certifications.standardCode,
      certificateNumber: certifications.certificateNumber,
      accreditationBody: certifications.accreditationBody,
      accreditationNumber: certifications.accreditationNumber,
      iafMlaMember: certifications.iafMlaMember,
      pdfUrl: certifications.pdfUrl,
    })
    .from(certifications)
    .where(
      and(eq(certifications.active, true), eq(certifications.isPublished, true)),
    )
    .orderBy(asc(certifications.sortOrder));
  const certs: CertSchemaInput[] = certRows.map((cert) => ({
    ...cert,
    fullName: withHuFallback(cert.fullName, cert.fullNameHu) ?? cert.name,
    description: withHuFallback(cert.description, cert.descriptionHu),
  }));

  // Locale-aware service rows via shared helper
  // (lib/db/queries/services.ts). JSON-LD ItemList requires both name
  // and description, so the empty-field guard checks both.
  const serviceRows = await getActiveTopLevelServices(locale);
  const serviceItems = serviceRows
    .map((r) => ({ name: r.name, description: r.shortDesc }))
    .filter((s) => s.name.length > 0 && s.description.length > 0);

  const schemas = buildJsonLdSchemas(seoLocale, serviceItems, certs);
  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${barlowCondensed.variable}`}
    >
      <body>
        <JsonLd schemas={schemas} />
        {children}
      </body>
    </html>
  );
}
