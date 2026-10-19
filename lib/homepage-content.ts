import { en } from "./i18n/en";
import { de } from "./i18n/de";
import { zh } from "./i18n/zh";
import { fr } from "./i18n/fr";
import { CERTIFICATION_TRANSLATIONS } from "./certification-translations";

const SERVICE_IDS: Record<string, string> = {
  objektumorzes: "security", portaszolgalat: "reception", biztonsagtechnika: "building",
  "tavfelugyelet-vonuloszolgalat": "technical", "mystery-shopping-helyszini-audit": "mystery",
  rendezvenybiztositas: "cleaning", "hard-fm": "hardfm", "soft-fm": "green",
};

/** Source overlays translate only the eight existing services. Publication still
 * depends on the active/published DB row; unknown untranslated records are omitted. */
export function localizeHomepageService(
  locale: string, slug: string,
  row: { name: string | null; shortDesc: string | null },
): { name: string; shortDesc: string } {
  if (locale === "ko") return KOREAN_SERVICE_DISPLAY[slug] ?? { name: "", shortDesc: "" };
  const source = ({ en, de, zh, fr } as const)[locale as "en" | "de" | "zh" | "fr"];
  const translated = source?.services.find((service) => service.id === SERVICE_IDS[slug]);
  if (locale === "fr") return { name: translated?.t ?? "", shortDesc: translated?.d ?? "" };
  return { name: row.name?.trim() || translated?.t || "", shortDesc: row.shortDesc?.trim() || translated?.d || "" };
}

/** Keep source-only prefill labels on the same locale overlays as CMS cards.
 * Return only the eight existing service identifiers and their display names. */
export function getContactServiceFallbackOptions(
  locale: string,
  services: readonly { readonly id: string; readonly t: string }[],
): { slug: string; label: string }[] {
  return Object.entries(SERVICE_IDS).flatMap(([slug, id]) => {
    const name = services.find((service) => service.id === id)?.t ?? null;
    const label = localizeHomepageService(locale, slug, { name, shortDesc: null }).name;
    return label ? [{ slug, label }] : [];
  });
}

export function localizeCareerField(
  locale: string, value: string | null,
  translations: Readonly<Record<string, string>> | undefined,
): string | null {
  if (!value) return null;
  if (locale === "ko" || locale === "fr") return translations?.[value] ?? null;
  return value.trim() || null;
}

/** Do not substitute HU/EN prose into another language, including screen-reader
 * captions and structured data. Neutral certification names remain available. */
export function localizeCertificationText(locale: string, value: string | null, slug?: string, field?: "fullName" | "description" | "scope"): string | null {
  if (locale === "fr" || locale === "ko") {
    return slug && field ? CERTIFICATION_TRANSLATIONS[locale]?.[slug]?.[field] ?? null : null;
  }
  return value?.trim() || null;
}

const KOREAN_SERVICE_DISPLAY: Record<
  string,
  { readonly name: string; readonly shortDesc: string }
> = {
  objektumorzes: {
    name: "현장 보안 인력 서비스",
    shortDesc:
      "사업장 출입 관리, 순찰, 사건 처리, 업무 기록 및 합의된 보고·에스컬레이션을 지원하는 현장 보안 인력 서비스입니다.",
  },
  portaszolgalat: {
    name: "리셉션 및 게이트하우스 서비스",
    shortDesc:
      "방문객, 납품업체, 임직원, 열쇠, 우편물·배송물, 출입 기록 및 합의된 에스컬레이션을 관리하는 리셉션 및 게이트하우스 서비스입니다.",
  },
  biztonsagtechnika: {
    name: "보안 기술",
    shortDesc:
      "개인정보 보호를 고려한 기술 설계를 바탕으로 CCTV·출입 통제·경보 프로세스를 현장별 보안 모델에 연계합니다.",
  },
  "tavfelugyelet-vonuloszolgalat": {
    name: "원격 모니터링 및 출동 대응 서비스",
    shortDesc:
      "신호 접수, 경보 확인, 에스컬레이션, 이벤트 기록 및 합의된 조건의 대응 프로세스를 지원하는 원격 모니터링 서비스입니다.",
  },
  "mystery-shopping-helyszini-audit": {
    name: "미스터리 쇼핑 및 서비스 감사",
    shortDesc:
      "실제 고객 접점과 운영 상황에서 서비스 품질을 확인하고, 구조화된 관찰·보고·개선 제안을 제공하는 서비스 감사입니다.",
  },
  rendezvenybiztositas: {
    name: "행사 보안",
    shortDesc:
      "기업 행사, 비공개 행사 및 공개 행사에서 출입 관리, 동선 지원, 구역 관리, 사건 기록 및 주최자 기준 에스컬레이션을 지원합니다.",
  },
  "hard-fm": {
    name: "Hard FM – 기술 시설 관리",
    shortDesc:
      "계획 예방정비, 장애 대응, 전문 업체 조율, 장애 기록 및 운영 보고를 지원하는 Hard FM 서비스입니다.",
  },
  "soft-fm": {
    name: "Soft FM – 일상 시설 운영 지원",
    shortDesc:
      "청소, 조경, 위생, 폐기물 처리 지원 및 서비스 제공자 관리를 합의된 범위와 품질 확인, 서면 보고에 따라 지원하는 Soft FM 서비스입니다.",
  },
};
