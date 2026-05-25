import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { References } from "@/components/References";
import { Certifications } from "@/components/Certifications";
import { News } from "@/components/News";
import { Career } from "@/components/Career";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { getTranslation } from "@/lib/i18n";
import {
  getActiveTopLevelServices,
  getAllPublishedServicePathsForBuild,
} from "@/lib/db/queries/services";
import {
  getPublishedNewsIndexHu,
  newsDetailHrefHu,
} from "@/lib/db/queries/news";

const LOCALES = ["hu", "en", "de", "zh"] as const;
type Locale = (typeof LOCALES)[number];

export const revalidate = 3600;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();
  const t = getTranslation(locale);

  const articles =
    locale === "hu"
      ? (await getPublishedNewsIndexHu()).map((r) => ({
          id: r.id,
          title: r.title,
          lead: r.lead,
          date: r.date.toISOString(),
          imageUrl: r.imageUrl,
          href: newsDetailHrefHu(r.slug),
        }))
      : [];

  // Service-of-interest dropdown options for the Contact form via
  // shared helper (lib/db/queries/services.ts). Contact is a client
  // component so we fetch here and pass serializable props.
  //
  // Wire-format contract: option `value` MUST be services.slug
  // (string) — never the numeric services.id — so /api/contact
  // validation and lib/email-templates/notification.ts
  // SERVICE_LABELS_HU keep working unchanged.
  const serviceRows = await getActiveTopLevelServices(locale);
  const serviceOptions = serviceRows
    .map((row) => ({ slug: row.slug, label: row.name }))
    .filter((opt) => opt.label.length > 0);
  const readyServiceDetailPaths = await getAllPublishedServicePathsForBuild(
    "homepage service detail links",
  );

  return (
    <>
      <Nav t={{ nav: t.nav }} />
      <main id="main">
        <Hero t={{ hero: t.hero, stats: t.stats }} />
        <About t={t} />
        <Services
          locale={locale}
          readyServiceDetailPaths={readyServiceDetailPaths}
        />
        <References t={t} locale={locale} />
        <Certifications t={t} locale={locale} />
        {locale === "hu" && (
          <News
            t={{
              newsSub: t.newsSub,
              newsTitle: t.newsTitle,
              newsText: t.newsText,
              newsEmpty: t.newsEmpty,
              newsReadMore: t.newsReadMore,
            }}
            locale={locale}
            articles={articles}
          />
        )}
        <Career t={t} locale={locale} />
        <Contact
          t={{
            contactSub: t.contactSub,
            contactTitle: t.contactTitle,
            contactLabels: t.contactLabels,
            form: t.form,
          }}
          locale={locale}
          serviceOptions={serviceOptions}
        />
      </main>
      <Footer
        t={t}
        locale={locale}
        readyServiceDetailPaths={readyServiceDetailPaths}
      />
    </>
  );
}
