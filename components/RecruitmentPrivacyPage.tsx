import { getTranslation } from "@/lib/i18n";
import { RECRUITMENT_PRIVACY_CONTENT } from "@/lib/recruitment-privacy-content";
import {
  RECRUITMENT_PRIVACY_SLUGS,
  type RecruitmentPrivacyLocale,
} from "@/lib/recruitment-privacy-routes";
import {
  LegalPageChrome,
  LegalHeader,
  LegalSection,
} from "@/components/LegalPageChrome";

// Shared renderer for the PL-091 Option B recruitment privacy routes. The
// two route files (app/[locale]/palyazoi-adatkezeles and
// app/[locale]/recruitment-privacy) are thin locale gates around this:
// the HU slug renders only for hu, the EN slug only for en — every other
// locale/slug combination 404s. Metadata lives in
// lib/recruitment-privacy-routes.ts (buildRecruitmentPrivacyMetadata).

export function RecruitmentPrivacyPage({
  locale,
}: {
  locale: RecruitmentPrivacyLocale;
}) {
  const t = getTranslation(locale);
  const content = RECRUITMENT_PRIVACY_CONTENT[locale];

  return (
    <LegalPageChrome
      t={t}
      locale={locale}
      pageTitle={content.title}
      pageDescription={content.intro.slice(0, 160)}
      pageSlug={RECRUITMENT_PRIVACY_SLUGS[locale]}
    >
      <LegalHeader
        title={content.title}
        lastUpdated={content.lastUpdated}
        version={content.version}
        intro={content.intro}
      />
      {content.sections.map((s) => (
        <LegalSection key={s.id} id={s.id} title={s.title} body={s.body} />
      ))}

      <p
        style={{
          marginTop: 48,
          paddingTop: 24,
          borderTop: "1px solid rgba(11,30,62,0.12)",
          fontSize: 12,
          lineHeight: 1.6,
          color: "rgba(11,30,62,0.5)",
          fontStyle: "italic",
        }}
      >
        {content.versionHistory}
      </p>
    </LegalPageChrome>
  );
}
