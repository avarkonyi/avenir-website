import { getHomepagePartnerLogos } from "@/lib/db/queries/partners";

const MARQUEE_THRESHOLD = 8;

const ARIA_LABELS: Record<string, string> = {
  hu: "Jóváhagyott partnerlogók",
  en: "Approved partner logos",
  de: "Freigegebene Partnerlogos",
  zh: "已批准的合作伙伴标识",
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
        width={220}
        height={88}
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

  const ariaLabel = ARIA_LABELS[locale] ?? ARIA_LABELS.hu;
  const isMarquee = partners.length >= MARQUEE_THRESHOLD;

  return (
    <section className="partner-logo-strip" aria-label={ariaLabel}>
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
