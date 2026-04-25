const LOCALES = ["hu", "en", "de", "zh"];

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <main>
      <h1>Locale: {locale}</h1>
    </main>
  );
}
