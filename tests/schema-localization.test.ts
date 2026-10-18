import assert from "node:assert/strict";
import test from "node:test";
import { buildJsonLdSchemas, buildServiceItemListSchema } from "../lib/homepage-schema";
import { localizeCredentialCategory } from "../lib/schema-locale-copy";
import { SEO_DATA, SEO_LOCALES, META_DESCRIPTIONS, credentialId } from "../lib/seo-data";

const isOrganization = (schema: Record<string, unknown>) =>
  Array.isArray(schema["@type"]) && (schema["@type"] as string[]).includes("Organization");

test("organization schema uses each locale's approved metadata while identifiers stay stable", () => {
  const catalogs = new Set<string>();
  const knowledge = new Set<string>();
  for (const locale of SEO_LOCALES) {
    const schemas = buildJsonLdSchemas(locale, []);
    const org = schemas.find(isOrganization)!;
    const catalog = buildServiceItemListSchema(locale, [{ name: "CMS service", description: "CMS description" }]);
    assert.equal(org.description, META_DESCRIPTIONS[locale]);
    assert.equal(org.legalName, SEO_DATA.legalName);
    assert.equal(org.taxID, SEO_DATA.taxID);
    assert.deepEqual(org.address, { "@type": "PostalAddress", ...SEO_DATA.address });
    assert.equal("openingHoursSpecification" in org, false);
    catalogs.add(String(catalog.name));
    knowledge.add(JSON.stringify(org.knowsAbout));
    assert.ok(JSON.stringify(catalog).includes("CMS service"));
  }
  assert.equal(catalogs.size, SEO_LOCALES.length);
  assert.equal(knowledge.size, SEO_LOCALES.length);
});

test("the company is one Organization/LocalBusiness node, not a parent and a branch", () => {
  const schemas = buildJsonLdSchemas("hu", []);
  const org = schemas.find(isOrganization)!;
  assert.deepEqual(org["@type"], ["Organization", "LocalBusiness"]);
  assert.equal(org["@id"], `${SEO_DATA.url}/#organization`);
  assert.equal(org.telephone, SEO_DATA.contact.phone);
  assert.equal(schemas.some((s) => s["@type"] === "LocalBusiness"), false);
  assert.equal(JSON.stringify(schemas).includes("#localbusiness"), false);
  assert.equal(schemas.some((s) => s["@type"] === "ItemList"), false, "ItemList is homepage-only");
});

test("service ItemList links public service pages and leaves unpublished ones unlinked", () => {
  const url = `${SEO_DATA.url}/en/szolgaltatasok/objektumorzes`;
  const list = buildServiceItemListSchema("en", [
    { name: "On-site Security Guarding", description: "Guarding.", url },
    { name: "Draft service", description: "Not public." },
  ]);
  const items = list.itemListElement as Array<{ "@type": string; position: number; item: Record<string, unknown> }>;
  assert.equal(items[0]["@type"], "ListItem");
  assert.equal(items[0].position, 1);
  assert.equal(items[0].item.url, url);
  assert.equal(items[0].item["@id"], `${url}#service`);
  assert.equal("url" in items[1].item, false);
});

test("credential translations retain proof identifiers and unknown CMS category text", () => {
  const cert = { slug: "iso-test", name: "ISO 9001", fullName: "", description: null, credentialCategory: "Quality Management System Certification", issuer: "Official Issuer Kft.", issuerUrl: null, issuedDate: null, expiresDate: null, standardCode: "MSZ EN ISO 9001:2015", certificateNumber: "123", accreditationBody: "NAT", accreditationNumber: "456", iafMlaMember: true, pdfUrl: "/cert.pdf" };
  const propertyLabels = new Set<string>();
  for (const locale of SEO_LOCALES) {
    const credential = buildJsonLdSchemas(locale, [cert]).find(s => s["@id"] === credentialId(cert.slug))!;
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
    const org = buildJsonLdSchemas(locale, []).find(isOrganization)!;
    const knowledge = org.knowsAbout as string[];
    assert.ok(knowledge.includes(expected[locale]));
    assert.doesNotMatch(knowledge.join("\n"), /Leitstellenunterstützung|관제 지원|centre de dispatch/);
  }
});
