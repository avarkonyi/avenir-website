import { SEO_DATA, META_DESCRIPTIONS, credentialId, type SeoLocale } from "./seo-data";
import { INDEXABLE_SERVICE_LOCALES } from "./services/publication";
import { getSchemaLocaleCopy, localizeCredentialCategory } from "./schema-locale-copy";

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
  readonly iafMlaMember: boolean;
  readonly pdfUrl: string | null;
};

function absoluteUrl(url: string): string {
  if (/^https?:\/\//.test(url)) return url;
  return `${SEO_DATA.url}${url}`;
}

export function buildJsonLdSchemas(
  localeIso: SeoLocale,
  services: readonly { readonly name: string; readonly description: string }[],
  certs: readonly CertSchemaInput[],
): Record<string, unknown>[] {
  const copy = getSchemaLocaleCopy(localeIso);
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
      hasCredential: credentialRefs,
      sameAs: [SEO_DATA.officialProfiles.linkedin],
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": localBusinessId,
      parentOrganization: { "@id": orgId },
      name: SEO_DATA.legalNameShort,
      alternateName: SEO_DATA.alternateName,
      description: META_DESCRIPTIONS[localeIso],
      knowsAbout: [...copy.knowsAbout],
      image: SEO_DATA.ogImageUrl,
      url: SEO_DATA.url,
      telephone: SEO_DATA.contact.phone,
      email: SEO_DATA.contact.email,
      address: postalAddress,
      areaServed: { "@type": "Country", name: copy.country },
      hasCredential: credentialRefs,
      sameAs: [SEO_DATA.officialProfiles.linkedin],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: copy.catalog,
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
      "@type": "WebSite",
      "@id": websiteId,
      url: SEO_DATA.url,
      name: SEO_DATA.name,
      publisher: { "@id": orgId },
      // Only the production (indexable) languages; de/zh/ko/fr are noindex
      // review surfaces and must not be advertised as site languages.
      inLanguage: [...INDEXABLE_SERVICE_LOCALES],
    },
    // One top-level EducationalOccupationalCredential per certification.
    // Organization and LocalBusiness reference these via @id above.
    ...certs.map((c) => {
      const additionalProperty: Record<string, unknown>[] = [];
      if (c.standardCode) {
        additionalProperty.push({
          "@type": "PropertyValue",
          name: copy.standard,
          value: c.standardCode,
        });
      }
      if (c.accreditationBody || c.accreditationNumber) {
        additionalProperty.push({
          "@type": "PropertyValue",
          name: copy.accreditation,
          value: [c.accreditationBody, c.accreditationNumber]
            .filter(Boolean)
            .join(" · "),
        });
      }
      if (c.iafMlaMember) {
        additionalProperty.push({
          "@type": "PropertyValue",
          name: copy.iafMember,
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
        schema.credentialCategory = localizeCredentialCategory(localeIso, c.credentialCategory);
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
