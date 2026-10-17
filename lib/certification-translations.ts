// Translated from the verified EN certificate prose in scripts/seed.ts and
// scripts/update-certifications-prod.ts. Issuer, dates, certificate numbers,
// standard codes and links continue to come from the published DB record.
export const CERTIFICATION_TRANSLATIONS: Record<string, Record<string, { fullName: string; description: string; scope: string }>> = {
  fr: {
    "iso-9001": {
      fullName: "Certification ISO 9001 du système de management de la qualité",
      description: "ISO 9001 est la norme internationale relative aux systèmes de management de la qualité. Le périmètre indiqué sur le certificat est « Services de sécurité complets ». Le système de management certifié a été audité par l’organisme émetteur indiqué sur le certificat dans le périmètre défini par le certificat. Celui-ci bénéficie d’une reconnaissance internationale dans le cadre de l’accord IAF MLA.",
      scope: "Services de sécurité complets",
    },
    "iso-27001": {
      fullName: "Certification ISO 27001 du système de management de la sécurité de l’information",
      description: "MSZ ISO/IEC 27001:2023 est la norme relative aux systèmes de management de la sécurité de l’information (SMSI) mentionnée sur le certificat. Le système de management de la sécurité de l’information certifié d’Avenir a été audité par l’organisme émetteur indiqué sur le certificat dans le périmètre défini par le certificat. Celui-ci bénéficie d’une reconnaissance internationale dans le cadre de l’accord IAF MLA.",
      scope: "Services de sécurité complets",
    },
  },
  ko: {
    "iso-9001": {
      fullName: "ISO 9001 품질경영시스템 인증",
      description: "ISO 9001은 품질경영시스템에 관한 국제 표준입니다. 인증서에 명시된 범위는 ‘종합 보안 서비스’입니다. 인증된 경영시스템은 인증서에 정의된 범위 내에서 인증서에 명시된 발급기관의 심사를 받았습니다. 이 인증서는 IAF MLA 협정에 따라 국제적으로 인정됩니다.",
      scope: "종합 보안 서비스",
    },
    "iso-27001": {
      fullName: "ISO 27001 정보보안경영시스템 인증",
      description: "MSZ ISO/IEC 27001:2023은 인증서에 명시된 정보보안경영시스템(ISMS) 표준입니다. Avenir의 인증된 정보보안경영시스템은 인증서에 정의된 범위 내에서 인증서에 명시된 발급기관의 심사를 받았습니다. 이 인증서는 IAF MLA 협정에 따라 국제적으로 인정됩니다.",
      scope: "종합 보안 서비스",
    },
  },
};
