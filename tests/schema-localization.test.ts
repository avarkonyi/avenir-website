import assert from "node:assert/strict";
import test from "node:test";
import { buildJsonLdSchemas } from "../lib/homepage-schema";
import { localizeCredentialCategory } from "../lib/schema-locale-copy";
import { SEO_DATA, SEO_LOCALES, META_DESCRIPTIONS, credentialId } from "../lib/seo-data";

test("organization schema uses each locale's approved metadata while identifiers stay stable", () => {
  const catalogs = new Set<string>();
  const knowledge = new Set<string>();
  for (const locale of SEO_LOCALES) {
    const schemas = buildJsonLdSchemas(locale, [{ name: "CMS service", description: "CMS description" }], []);
    const org = schemas.find(s => s["@type"] === "Organization")!;
    const business = schemas.find(s => s["@type"] === "LocalBusiness")!;
    const catalog = schemas.find(s => s["@type"] === "ItemList")!;
    assert.equal(org.description, META_DESCRIPTIONS[locale]);
    assert.equal(business.description, META_DESCRIPTIONS[locale]);
    assert.equal(org.legalName, SEO_DATA.legalName);
    assert.equal(org.taxID, SEO_DATA.taxID);
    assert.deepEqual(org.address, { "@type": "PostalAddress", ...SEO_DATA.address });
    assert.equal("openingHoursSpecification" in business, false);
    assert.equal(business["@type"], "LocalBusiness");
    catalogs.add(String(catalog.name));
    knowledge.add(JSON.stringify(business.knowsAbout));
    assert.ok(JSON.stringify(catalog).includes("CMS service"));
  }
  assert.equal(catalogs.size, SEO_LOCALES.length);
  assert.equal(knowledge.size, SEO_LOCALES.length);
});

test("credential translations retain proof identifiers and unknown CMS category text", () => {
  const cert = { slug: "iso-test", name: "ISO 9001", fullName: "", description: null, credentialCategory: "Quality Management System Certification", issuer: "Official Issuer Kft.", issuerUrl: null, issuedDate: null, expiresDate: null, standardCode: "MSZ EN ISO 9001:2015", certificateNumber: "123", accreditationBody: "NAT", accreditationNumber: "456", iafMlaMember: true, pdfUrl: "/cert.pdf" };
  const propertyLabels = new Set<string>();
  for (const locale of SEO_LOCALES) {
    const credential = buildJsonLdSchemas(locale, [], [cert]).find(s => s["@id"] === credentialId(cert.slug))!;
    assert.equal(credential.name, cert.name);
    assert.equal(credential.identifier, cert.certificateNumber);
    assert.deepEqual(credential.recognizedBy, { "@type": "Organization", name: cert.issuer });
    assert.equal(credential.credentialCategory, localizeCredentialCategory(locale, cert.credentialCategory));
    const properties = credential.additionalProperty as { name: string; value: string }[];
    assert.deepEqual(properties.map(p => p.value), [cert.standardCode, "NAT · 456", "true"]);
    propertyLabels.add(JSON.stringify(properties.map(p => p.name)));
    assert.equal(localizeCredentialCategory(locale, "CMS-specific category"), "CMS-specific category");
    assert.equal(localizeCredentialCategory(locale, null), null);
  }
  assert.equal(propertyLabels.size, SEO_LOCALES.length);
});

test("schema dispatch support does not imply an approved monitoring centre", () => {
  const expected = {
    de: "24/7-Dispositionsunterstützung",
    ko: "24/7 디스패처 지원 체계",
    fr: "Permanence de dispatching 24 h/24 et 7 j/7",
  } as const;
  for (const locale of ["de", "ko", "fr"] as const) {
    const business = buildJsonLdSchemas(locale, [], []).find(schema => schema["@type"] === "LocalBusiness")!;
    const knowledge = business.knowsAbout as string[];
    assert.ok(knowledge.includes(expected[locale]));
    assert.doesNotMatch(knowledge.join("\n"), /Leitstellenunterstützung|관제 지원|centre de dispatch/);
  }
});
