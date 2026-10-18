import type { SeoLocale } from "./seo-data";

// Translate descriptive schema values only. Legal names, addresses, certificate
// identifiers and standard codes remain the approved source values.
const COPY = {
  hu: {
    catalog: "Avenir szolgáltatások", country: "Magyarország", contact: "ügyfélszolgálat", languages: ["magyar", "angol"],
    standard: "Szabvány", accreditation: "Akkreditáció", iafMember: "IAF MLA-tag",
    qualityCategory: "Minőségirányítási rendszer tanúsítása", securityCategory: "Információbiztonsági irányítási rendszer tanúsítása",
    knowsAbout: ["Élőerős őrzés-védelem", "Technikai vagyonvédelem", "Riasztórendszer-felügyelet", "Beléptetési rendszerek", "Portaszolgálat", "24/7 diszpécseri háttér", "Mystery Shopping audit", "Integrált létesítményüzemeltetés"],
  },
  en: {
    catalog: "Avenir services", country: "Hungary", contact: "customer service", languages: ["Hungarian", "English"],
    standard: "Standard", accreditation: "Accreditation", iafMember: "IAF MLA member",
    qualityCategory: "Quality Management System Certification", securityCategory: "Information Security Management System Certification",
    knowsAbout: ["On-site security guarding", "Security technology", "Alarm system monitoring", "Access control systems", "Gatehouse services", "24/7 dispatcher support", "Mystery Shopping audit", "Integrated facility management"],
  },
  de: {
    catalog: "Avenir Dienstleistungen", country: "Ungarn", contact: "Kundenservice", languages: ["Ungarisch", "Englisch"],
    standard: "Norm", accreditation: "Akkreditierung", iafMember: "IAF-MLA-Mitglied",
    qualityCategory: "Zertifizierung des Qualitätsmanagementsystems", securityCategory: "Zertifizierung des Informationssicherheitsmanagementsystems",
    knowsAbout: ["Objektschutz vor Ort", "Sicherheitstechnik", "Alarmanlagenüberwachung", "Zutrittskontrollsysteme", "Pförtnerdienst", "24/7-Dispositionsunterstützung", "Mystery-Shopping-Audit", "Integriertes Facility Management"],
  },
  zh: {
    catalog: "Avenir 服务", country: "匈牙利", contact: "客户服务", languages: ["匈牙利语", "英语"],
    standard: "标准", accreditation: "认可", iafMember: "IAF MLA 成员",
    qualityCategory: "质量管理体系认证", securityCategory: "信息安全管理体系认证",
    knowsAbout: ["驻场安保", "安防技术", "报警系统监控", "门禁系统", "门岗服务", "24/7 调度支持", "神秘顾客审核", "综合设施管理"],
  },
  ko: {
    catalog: "Avenir 서비스", country: "헝가리", contact: "고객 서비스", languages: ["헝가리어", "영어"],
    standard: "표준", accreditation: "인정", iafMember: "IAF MLA 회원",
    qualityCategory: "품질 경영 시스템 인증", securityCategory: "정보보호 경영 시스템 인증",
    knowsAbout: ["현장 보안 인력 서비스", "보안 기술", "경보 시스템 모니터링", "출입 통제 시스템", "게이트하우스 서비스", "24/7 디스패처 지원 체계", "미스터리 쇼핑 감사", "통합 시설 관리"],
  },
  fr: {
    catalog: "Services Avenir", country: "Hongrie", contact: "service client", languages: ["hongrois", "anglais"],
    standard: "Norme", accreditation: "Accréditation", iafMember: "Membre de l’IAF MLA",
    qualityCategory: "Certification du système de management de la qualité", securityCategory: "Certification du système de management de la sécurité de l’information",
    knowsAbout: ["Gardiennage sur site", "Technologies de sécurité", "Télésurveillance des systèmes d’alarme", "Systèmes de contrôle d’accès", "Services de poste de garde", "Permanence de dispatching 24 h/24 et 7 j/7", "Audit client mystère", "Gestion intégrée des installations"],
  },
} as const;

export function getSchemaLocaleCopy(locale: SeoLocale) {
  return COPY[locale];
}

export function localizeCredentialCategory(locale: string, category: string | null): string | null {
  const copy = COPY[locale as SeoLocale];
  if (!copy || !category) return category;
  if (category === "Quality Management System Certification") return copy.qualityCategory;
  if (category === "Information Security Management System Certification") return copy.securityCategory;
  // Unknown CMS values retain their source meaning; do not guess a credential.
  return category;
}
