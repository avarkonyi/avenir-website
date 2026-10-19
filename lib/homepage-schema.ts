import { SEO_DATA, META_DESCRIPTIONS, credentialId, type SeoLocale } from "./seo-data";
import { INDEXABLE_SERVICE_LOCALES } from "./services/publication";
import { getSchemaLocaleCopy } from "./schema-locale-copy";
import { accreditationVerificationUrl } from "./certification-proof";

export type CertSchemaInput = {
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
  readonly pdfUrl: string | null;
};

function absoluteUrl(url: string): string {
  if (/^https?:\/\//.test(url)) return url;
  return `${SEO_DATA.url}${url}`;
}

export function buildJsonLdSchemas(
  localeIso: SeoLocale,
  certs: readonly CertSchemaInput[],
): Record<string, unknown>[] {
  const copy = getSchemaLocaleCopy(localeIso);
  const orgId = `${SEO_DATA.url}/#organization`;
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
      // One entity for the company: the registered seat is not a separate
      // customer-facing branch, so Organization and LocalBusiness share @id.
      "@type": ["Organization", "LocalBusiness"],
      "@id": orgId,
      name: SEO_DATA.legalNameShort,
      legalName: SEO_DATA.legalName,
      alternateName: SEO_DATA.alternateName,
      url: SEO_DATA.url,
      logo: SEO_DATA.logoUrl,
      image: SEO_DATA.ogImageUrl,
      description: META_DESCRIPTIONS[localeIso],
      foundingDate: SEO_DATA.foundingDate,
      taxID: SEO_DATA.taxID,
      vatID: SEO_DATA.vatID,
      // Hungarian company registration number. No ISO 6523 ICD prefix is
      // asserted: 0190 is the Dutch OIN scheme, not the HU company registry.
      identifier: {
        "@type": "PropertyValue",
        propertyID: "HU cégjegyzékszám",
        value: SEO_DATA.registrationId,
      },
      address: postalAddress,
      telephone: SEO_DATA.contact.phone,
      email: SEO_DATA.contact.email,
      knowsAbout: [...copy.knowsAbout],
      areaServed: { "@type": "Country", name: copy.country },
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: SEO_DATA.contact.phone,
          email: SEO_DATA.contact.email,
          contactType: copy.contact,
          areaServed: "HU",
          availableLanguage: [...copy.languages],
        },
      ],
      hasCertification: credentialRefs,
      sameAs: [SEO_DATA.officialProfiles.linkedin],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": websiteId,
      url: SEO_DATA.url,
      name: SEO_DATA.name,
      publisher: { "@id": orgId },
      // Only the production (indexable) languages; de/zh/ko/fr are noindex
      // review surfaces and must not be advertised as site languages.
      inLanguage: [...INDEXABLE_SERVICE_LOCALES],
    },
    // Management-system certificates belong to Avenir; accreditation belongs
    // to the issuing certification body. The stable IDs are unchanged.
    // The Organization node references these via @id above.
    ...certs.map((c) => {
      const accreditationUrl = accreditationVerificationUrl(c);
      const accreditation = c.accreditationBody || c.accreditationNumber
        ? {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: copy.accreditation,
            ...(accreditationUrl ? { url: accreditationUrl } : {}),
            ...(c.accreditationNumber ? { identifier: c.accreditationNumber } : {}),
            ...(c.accreditationBody ? {
              recognizedBy: { "@type": "Organization", name: c.accreditationBody },
            } : {}),
          }
        : null;
      const schema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Certification",
        "@id": credentialId(c.slug),
        name: c.standardCode || c.name,
        about: { "@id": orgId },
        issuedBy: {
          "@type": "Organization",
          name: c.issuer,
          ...(c.issuerUrl ? { url: c.issuerUrl } : {}),
          ...(accreditation ? { hasCredential: accreditation } : {}),
        },
      };
      if (c.fullName) schema.alternateName = c.fullName;
      if (c.description) schema.description = c.description;
      if (c.certificateNumber) {
        schema.identifier = c.certificateNumber;
        schema.certificationIdentification = c.certificateNumber;
      }
      if (c.issuedDate) schema.datePublished = c.issuedDate;
      if (c.expiresDate) schema.expires = c.expiresDate;
      if (c.pdfUrl) schema.url = absoluteUrl(c.pdfUrl);
      return schema;
    }),
  ];
}

export type ServiceListItem = {
  readonly name: string;
  readonly description: string;
  /** Canonical service page URL; only for published, indexable pages. */
  readonly url?: string;
};

// Service catalogue as an ItemList, emitted on the homepage only. Items link
// to the canonical service page (and its #service node) when one is public.
export function buildServiceItemListSchema(
  localeIso: SeoLocale,
  services: readonly ServiceListItem[],
): Record<string, unknown> {
  const copy = getSchemaLocaleCopy(localeIso);
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: copy.catalog,
    itemListElement: services.map((svc, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        ...(svc.url ? { "@id": `${svc.url}#service`, url: svc.url } : {}),
        name: svc.name,
        description: svc.description,
        provider: { "@id": `${SEO_DATA.url}/#organization` },
      },
    })),
  };
}
