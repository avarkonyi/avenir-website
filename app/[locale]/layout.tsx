import type { Metadata, Viewport } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono, Barlow_Condensed } from "next/font/google";
import { asc, eq } from "drizzle-orm";
import "../globals.css";
import { getTranslation, LOCALES } from "@/lib/i18n";
import { JsonLd } from "@/components/JsonLd";
import { db, certifications } from "@/lib/db";
import {
  SEO_DATA,
  SEO_FAQS_HU,
  SEO_LOCALES,
  OG_LOCALE_MAP,
  META_TAGLINES,
  META_KEYWORDS_HU,
  SECURITY_FIRST_DESCRIPTION,
  SCHEMA_KNOWS_ABOUT,
  SCHEMA_SERVICE_ORDER,
  credentialId,
  type SeoLocale,
} from "@/lib/seo-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700", "800"],
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
  const t = getTranslation(locale);
  const tagline = META_TAGLINES[seoLocale];
  const title = `${SEO_DATA.legalNameShort} — ${tagline}`;
  const description = t.hero.sub;
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
  readonly fullNameHu: string;
  readonly descriptionHu: string | null;
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

function buildJsonLdSchemas(
  localeIso: SeoLocale,
  services: readonly { readonly id: string; readonly t: string; readonly d: string }[],
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
      itemListElement: SCHEMA_SERVICE_ORDER.flatMap((id, i) => {
        const svc = services.find((s) => s.id === id);
        return svc
          ? [
              {
                "@type": "Service",
                position: i + 1,
                name: svc.t,
                description: svc.d,
                provider: { "@id": orgId },
              },
            ]
          : [];
      }),
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
      if (c.fullNameHu) schema.alternateName = c.fullNameHu;
      if (c.descriptionHu) schema.description = c.descriptionHu;
      if (c.credentialCategory)
        schema.credentialCategory = c.credentialCategory;
      if (c.certificateNumber) schema.identifier = c.certificateNumber;
      if (c.issuedDate) schema.dateCreated = c.issuedDate;
      if (c.expiresDate) schema.expires = c.expiresDate;
      if (c.pdfUrl) schema.url = `${SEO_DATA.url}${c.pdfUrl}`;
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
  // JSON-LD schemas use HU services + HU certifications regardless of locale
  // (decision: structured data stays in canonical HU; per-locale schema
  // translation is a later pass).
  const tHu = getTranslation("hu");
  await connection();
  const certs = await db
    .select({
      slug: certifications.slug,
      name: certifications.name,
      fullNameHu: certifications.fullNameHu,
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
    .where(eq(certifications.active, true))
    .orderBy(asc(certifications.sortOrder));
  const schemas = buildJsonLdSchemas(seoLocale, tHu.services, certs);
  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} ${barlowCondensed.variable}`}
    >
      <body>
        <JsonLd schemas={schemas} />
        {children}
      </body>
    </html>
  );
}
