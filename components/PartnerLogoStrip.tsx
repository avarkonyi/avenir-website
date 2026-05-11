import { getHomepagePartnerLogos } from "@/lib/db/queries/partners";

const MARQUEE_THRESHOLD = 8;

const HEADINGS: Record<string, string> = {
  hu: "Jóváhagyott referenciák és együttműködések",
  en: "Approved references and collaborations",
  de: "Freigegebene Referenzen und Kooperationen",
  zh: "已批准的参考与合作",
};

function isApprovedAssetUrl(src: string): boolean {
  if (src.startsWith("/")) return true;

  try {
    const url = new URL(src);
    return (
      url.protocol === "https:" &&
      url.hostname.endsWith(".public.blob.vercel-storage.com")
    );
  } catch {
    return false;
  }
}

function LogoItem({
  name,
  logoUrl,
  decorative = false,
}: {
  name: string;
  logoUrl: string;
  decorative?: boolean;
}) {
  return (
    <div className="partner-logo-item">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoUrl}
        alt={decorative ? "" : `${name} logo`}
        width={160}
        height={64}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

export async function PartnerLogoStrip({ locale }: { locale: string }) {
  const partners = (await getHomepagePartnerLogos()).filter((partner) =>
    isApprovedAssetUrl(partner.logoUrl),
  );

  if (partners.length === 0) return null;

  const heading = HEADINGS[locale] ?? HEADINGS.hu;
  const isMarquee = partners.length >= MARQUEE_THRESHOLD;

  return (
    <section className="partner-logo-strip" aria-labelledby="partner-logo-title">
      <h3 id="partner-logo-title" className="partner-logo-strip-title">
        {heading}
      </h3>

      {isMarquee ? (
        <div className="partner-logo-marquee-viewport">
          <div className="partner-logo-marquee-track">
            {partners.map((partner) => (
              <LogoItem
                key={partner.id}
                name={partner.name}
                logoUrl={partner.logoUrl}
              />
            ))}
            <div className="partner-logo-marquee-copy" aria-hidden="true">
              {partners.map((partner) => (
                <LogoItem
                  key={`copy-${partner.id}`}
                  name={partner.name}
                  logoUrl={partner.logoUrl}
                  decorative
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="partner-logo-static-grid">
          {partners.map((partner) => (
            <LogoItem
              key={partner.id}
              name={partner.name}
              logoUrl={partner.logoUrl}
            />
          ))}
        </div>
      )}
    </section>
  );
}
