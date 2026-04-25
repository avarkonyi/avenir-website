import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { References } from "@/components/References";
import { News } from "@/components/News";
import { Career } from "@/components/Career";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { getTranslation } from "@/lib/i18n";

const LOCALES = ["hu", "en", "de", "zh"];

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getTranslation(locale);

  return (
    <>
      <Nav t={t} />
      <main>
        <Hero t={t} />
        <About t={t} />
        <Services t={t} />
        <References t={t} />
        <News t={t} locale={locale} />
        <Career t={t} />
        <Contact t={t} />
      </main>
      <Footer t={t} />
    </>
  );
}
