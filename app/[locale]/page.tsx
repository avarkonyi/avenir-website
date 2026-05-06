import { notFound } from "next/navigation";
import { and, desc, eq, isNotNull, isNull } from "drizzle-orm";
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
import { db, news } from "@/lib/db";
import { getActiveTopLevelServices } from "@/lib/db/queries/services";

const LOCALES = ["hu", "en", "de", "zh"] as const;
type Locale = (typeof LOCALES)[number];

export const revalidate = 3600;

const NEWS_COLS = {
  hu: { title: news.titleHu, lead: news.leadHu, body: news.bodyHu, published: news.publishedHu },
  en: { title: news.titleEn, lead: news.leadEn, body: news.bodyEn, published: news.publishedEn },
  de: { title: news.titleDe, lead: news.leadDe, body: news.bodyDe, published: news.publishedDe },
  zh: { title: news.titleZh, lead: news.leadZh, body: news.bodyZh, published: news.publishedZh },
} as const;

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
  const cols = NEWS_COLS[locale as Locale];

  // EN/DE/ZH locale columns are nullable post-Iter 3A. We only surface
  // rows where the picked locale has a non-null title (defensive: an
  // admin could in theory flip publishedXx without filling titleXx).
  // Lead/body fall back to empty strings since the locale model permits
  // title-only teasers.
  const newsRows = await db
    .select({
      id: news.id,
      title: cols.title,
      lead: cols.lead,
      body: cols.body,
      date: news.date,
    })
    .from(news)
    .where(
      and(
        eq(cols.published, true),
        isNotNull(cols.title),
        isNull(news.deletedAt),
      ),
    )
    .orderBy(desc(news.date));

  const articles = newsRows.map((r) => ({
    id: r.id,
    title: r.title ?? "",
    lead: r.lead ?? "",
    body: r.body ?? "",
    date: r.date.toISOString(),
  }));

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

  return (
    <>
      <Nav t={{ nav: t.nav }} />
      <main>
        <Hero t={{ hero: t.hero, stats: t.stats }} />
        <About t={t} />
        <Services locale={locale} />
        <References t={t} />
        <Certifications t={t} locale={locale} />
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
      <Footer t={t} locale={locale} />
    </>
  );
}
