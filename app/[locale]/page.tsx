import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
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
    <main>
      <Hero t={t} />
      <About t={t} />
      <Services t={t} />
    </main>
  );
}
