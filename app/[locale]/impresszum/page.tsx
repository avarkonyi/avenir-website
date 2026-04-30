import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslation, LOCALES, type Locale } from "@/lib/i18n";
import {
  SEO_DATA,
  SEO_EXECUTIVE,
  SEO_COURT_REGISTRY,
  SEO_HOSTING_PROVIDER,
  SEO_LIABILITY,
  SEO_LICENSES,
  SEO_REGULATORY_BODIES,
  type SeoLocale,
} from "@/lib/seo-data";
import {
  LegalPageChrome,
  LegalHeader,
} from "@/components/LegalPageChrome";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();
  const t = getTranslation(locale);
  const title = `${t.legal.impressum.title} — ${SEO_DATA.legalNameShort}`;
  const description = `${SEO_DATA.legalName}. ${SEO_DATA.address.streetAddress}, ${SEO_DATA.address.postalCode} ${SEO_DATA.address.addressLocality}. Cégjegyzékszám: ${SEO_DATA.registrationId}.`;
  const url = `${SEO_DATA.url}/${locale}/impresszum`;

  return {
    metadataBase: new URL(SEO_DATA.url),
    title,
    description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: url,
      languages: {
        hu: `${SEO_DATA.url}/hu/impresszum`,
        en: `${SEO_DATA.url}/en/impresszum`,
        de: `${SEO_DATA.url}/de/impresszum`,
        zh: `${SEO_DATA.url}/zh/impresszum`,
        "x-default": `${SEO_DATA.url}/hu/impresszum`,
      },
    },
    openGraph: { type: "article", title, description, url },
  };
}

const sectionStyle: React.CSSProperties = { marginBottom: 36 };

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: "var(--font-head)",
  fontSize: 22,
  fontWeight: 700,
  marginBottom: 16,
  color: "#0B1E3E",
  borderBottom: "2px solid #D1172E",
  paddingBottom: 8,
  display: "inline-block",
};

const subTitleStyle: React.CSSProperties = {
  fontFamily: "var(--font-head)",
  fontSize: 17,
  fontWeight: 700,
  marginTop: 16,
  marginBottom: 8,
  color: "#0B1E3E",
};

const rowStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(180px, 220px) 1fr",
  gap: 16,
  fontSize: 15,
  padding: "6px 0",
  alignItems: "baseline",
};

const labelStyle: React.CSSProperties = {
  color: "rgba(11,30,62,0.55)",
  fontSize: 14,
  fontWeight: 500,
};

const valueStyle: React.CSSProperties = { color: "rgba(11,30,62,0.9)" };

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={rowStyle}>
      <div style={labelStyle}>{label}</div>
      <div style={valueStyle}>{value}</div>
    </div>
  );
}

function getExecutiveTitle(locale: SeoLocale): string {
  switch (locale) {
    case "hu": return SEO_EXECUTIVE.titleHu;
    case "en": return SEO_EXECUTIVE.titleEn;
    case "de": return SEO_EXECUTIVE.titleDe;
    case "zh": return SEO_EXECUTIVE.titleZh;
  }
}

function getExecutiveName(locale: SeoLocale): string {
  return locale === "en" ? SEO_EXECUTIVE.nameEn : SEO_EXECUTIVE.name;
}

function formatValidity(
  license: (typeof SEO_LICENSES)[number],
  labels: { validIndefinite: string; validUntilLabel: string; reviewBy: string },
): string {
  if (license.indefinite) return labels.validIndefinite;
  if (license.type === "national-security" && license.validUntil) {
    return `${labels.reviewBy}: ${license.validUntil}`;
  }
  if (license.validUntil) return `${labels.validUntilLabel} ${license.validUntil}`;
  return "";
}

export default async function ImpresszumPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();
  const t = getTranslation(locale);
  const seoLocale = locale as SeoLocale;
  const L = t.legal.impressum.labels;
  const ST = t.legal.impressum.sectionTitles;
  const LT = t.legal.impressum.licenseTitles;
  const RT = t.legal.impressum.regulatoryTitles;
  const courtName =
    locale === "en" ? SEO_COURT_REGISTRY.nameEn : SEO_COURT_REGISTRY.name;

  return (
    <LegalPageChrome
      t={t}
      locale={locale}
      pageTitle={t.legal.impressum.title}
      pageDescription={`${SEO_DATA.legalName} — ${SEO_DATA.address.streetAddress}, ${SEO_DATA.address.postalCode} ${SEO_DATA.address.addressLocality}.`}
      pageSlug="impresszum"
    >
      <LegalHeader
        title={t.legal.impressum.title}
        lastUpdated={t.legal.impressum.lastUpdated}
      />

      {/* 1. Cégadatok */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>1. {ST.company}</h2>
        <Row label={L.legalName} value={SEO_DATA.legalName} />
        <Row label={L.shortName} value={SEO_DATA.alternateName} />
        <Row label={L.marketingName} value={SEO_DATA.legalNameShort} />
        <Row label={L.registrationNumber} value={SEO_DATA.registrationId} />
        <Row label={L.court} value={`${courtName} (${SEO_COURT_REGISTRY.address})`} />
        <Row label={L.taxId} value={SEO_DATA.taxID} />
        <Row label={L.vatId} value={SEO_DATA.vatID} />
        <Row label={L.foundingDate} value={SEO_DATA.foundingDate} />
        <Row
          label={L.registeredOffice}
          value={`${SEO_DATA.address.postalCode} ${SEO_DATA.address.addressLocality}, ${SEO_DATA.address.streetAddress}`}
        />
      </section>

      {/* 2. Képviselő */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>2. {ST.representative}</h2>
        <Row
          label={L.executiveTitle}
          value={`${getExecutiveName(seoLocale)}, ${getExecutiveTitle(seoLocale)}`}
        />
        <Row label={L.guardCard} value={SEO_EXECUTIVE.guardCardNumber} />
        <Row label={L.pidetective} value={SEO_EXECUTIVE.pidetectiveNumber} />
        <Row
          label={L.email}
          value={
            <a href={SEO_EXECUTIVE.emailHref} style={{ color: "#D1172E", textDecoration: "none" }}>
              {SEO_EXECUTIVE.email}
            </a>
          }
        />
        <Row
          label={L.phone}
          value={
            <a href={SEO_EXECUTIVE.phoneTel} style={{ color: "#D1172E", textDecoration: "none" }}>
              {SEO_EXECUTIVE.phoneDisplay}
            </a>
          }
        />
      </section>

      {/* 3. Adatvédelmi tisztviselő (DPO) — GDPR Art. 37(1)(b)+(c) szerint
          kijelölt belső munkavállaló. NAIH-bejelentés Infotv. 25/L. § alapján
          folyamatban (2026-04-29). Külön szakasz a 2. Képviselő után, mert
          a DPO az érintettekkel közvetlenül kapcsolattartó pozíció (Art.
          38(4)) — vizuális elsődlegesség az általános elérhetőség előtt. */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>3. {ST.dpo}</h2>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.7,
            color: "rgba(11,30,62,0.85)",
            marginBottom: 16,
          }}
        >
          {t.legal.impressum.dpoSection.intro}
        </p>
        <Row label={L.dpoName} value={t.legal.impressum.dpoSection.name} />
        <Row
          label={L.dpoEmail}
          value={
            <a
              href={`mailto:${t.legal.impressum.dpoSection.email}`}
              style={{ color: "#D1172E", textDecoration: "none" }}
            >
              {t.legal.impressum.dpoSection.email}
            </a>
          }
        />
        <Row
          label={L.dpoPhone}
          value={
            <a
              href={`tel:${t.legal.impressum.dpoSection.phone.replace(/\s/g, "")}`}
              style={{ color: "#D1172E", textDecoration: "none" }}
            >
              {t.legal.impressum.dpoSection.phone}
            </a>
          }
        />
        <Row label={L.dpoPostal} value={t.legal.impressum.dpoSection.postal} />
        <p
          style={{
            fontSize: 13,
            lineHeight: 1.6,
            color: "rgba(11,30,62,0.6)",
            marginTop: 16,
            fontStyle: "italic",
          }}
        >
          {t.legal.impressum.dpoSection.note}
        </p>
      </section>

      {/* 4. Általános elérhetőség */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>4. {ST.contact}</h2>
        <Row
          label={L.registeredOffice}
          value={`${SEO_DATA.address.postalCode} ${SEO_DATA.address.addressLocality}, ${SEO_DATA.address.streetAddress}`}
        />
        <Row
          label={L.generalEmail}
          value={
            <a href={SEO_DATA.contact.emailHref} style={{ color: "#D1172E", textDecoration: "none" }}>
              {SEO_DATA.contact.email}
            </a>
          }
        />
        <Row
          label={L.generalPhone}
          value={
            <a href={SEO_DATA.contact.phoneTel} style={{ color: "#D1172E", textDecoration: "none" }}>
              {SEO_DATA.contact.phoneDisplay}
            </a>
          }
        />
      </section>

      {/* 5. Szabályozott szakma */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>5. {ST.regulatedProfession}</h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(11,30,62,0.85)" }}>
          {t.legal.impressum.regulatedProfessionText}
        </p>
      </section>

      {/* 6. Tevékenységi engedélyek */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>6. {ST.licenses}</h2>
        {SEO_LICENSES.map((license, i) => (
          <div key={license.number} style={{ marginBottom: 20 }}>
            <h3 style={subTitleStyle}>
              {String.fromCharCode(0x61 + i)}) {LT[license.type]}
            </h3>
            <Row label={L.licenseNumber} value={license.number} />
            <Row
              label={L.validity}
              value={formatValidity(license, {
                validIndefinite: L.validIndefinite,
                validUntilLabel: L.validUntilLabel,
                reviewBy: L.reviewBy,
              })}
            />
            <Row label={L.issuer} value={locale === "en" ? license.issuerEn : license.issuer} />
            <Row label={L.legalBasis} value={locale === "en" ? license.legalBasisEn : license.legalBasis} />
          </div>
        ))}
      </section>

      {/* 7. Felügyeleti hatóságok */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>7. {ST.regulatory}</h2>
        {(["guarding", "nationalSecurity", "dataProtection"] as const).map((key, i) => {
          const body = SEO_REGULATORY_BODIES[key];
          return (
            <div key={key} style={{ marginBottom: 20 }}>
              <h3 style={subTitleStyle}>
                {String.fromCharCode(0x61 + i)}) {RT[key]}
              </h3>
              <Row label={L.issuer} value={locale === "en" ? body.nameEn : body.name} />
              <Row label={L.regulatoryAddress} value={body.address} />
              {"postalAddress" in body && body.postalAddress && (
                <Row label={L.regulatoryPostal} value={body.postalAddress} />
              )}
              <Row label={L.phone} value={body.phone} />
              {"fax" in body && body.fax && (
                <Row label={L.regulatoryFax} value={body.fax} />
              )}
              {"email" in body && body.email && (
                <Row
                  label={L.email}
                  value={
                    <a href={`mailto:${body.email}`} style={{ color: "#D1172E", textDecoration: "none" }}>
                      {body.email}
                    </a>
                  }
                />
              )}
              <Row label={L.legalBasis} value={locale === "en" ? body.legalBasisEn : body.legalBasis} />
            </div>
          );
        })}
      </section>

      {/* 8. Felelősségbiztosítás */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>8. {ST.liability}</h2>
        <Row
          label={L.legalBasis}
          value={locale === "en" ? SEO_LIABILITY.legalBasisEn : SEO_LIABILITY.legalBasis}
        />
        <Row label={L.insurerName} value={SEO_LIABILITY.insurerLegalName} />
        <Row label={L.insurerAddress} value={SEO_LIABILITY.insurerAddress} />
        <Row label={L.insurerRegNumber} value={SEO_LIABILITY.insurerRegNumber} />
        <Row label={L.policyNumber} value={SEO_LIABILITY.policyNumber} />
      </section>

      {/* 9. Tárhelyszolgáltató */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>9. {ST.hosting}</h2>
        <Row label={L.hostingName} value={SEO_HOSTING_PROVIDER.name} />
        <Row label={L.hostingAddress} value={SEO_HOSTING_PROVIDER.address} />
        <Row
          label={L.email}
          value={
            <a
              href={`mailto:${SEO_HOSTING_PROVIDER.email}`}
              style={{ color: "#D1172E", textDecoration: "none" }}
            >
              {SEO_HOSTING_PROVIDER.email}
            </a>
          }
        />
      </section>

      {/* 10. Szerzői jog */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>10. {ST.copyright}</h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(11,30,62,0.85)" }}>
          {t.legal.impressum.copyrightText}
        </p>
      </section>
    </LegalPageChrome>
  );
}
