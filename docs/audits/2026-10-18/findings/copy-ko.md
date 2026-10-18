# COPY-KO — findings

Coverage: Every line of `S\crawl\text_ko.md` (1,377 lines) was read: shared header/nav, shared footer, `/ko` homepage, all 8 `/ko/szolgaltatasok/*` pages, every TITLE / META DESCRIPTION / H1, and the "[UI extras — ko]" block (consent banner, form labels, placeholders, options, aria-labels, alts, 404). The crawl does not include FAQ answers (the accordions are closed), so all 71 KO FAQ answers were read from the page FAQPage JSON-LD and checked against the source. Meaning was compared with the matching HU page in `S\crawl\text_hu.md`, plus the HU FAQPage JSON-LD for all 8 services. Source scan: `lib/i18n/ko.ts` (all 170 lines) and `lib/services/ko-service-details.ts` (all 403 lines, including the quote-modal copy and the unused related-card copy). Also scanned: the KO strings in `lib/homepage-content.ts`, `lib/certification-translations.ts`, `lib/analytics/consent-copy.ts`, `lib/email-templates/reply.ts`, `lib/locale-ui-helpers.ts`, `lib/locale-accessibility.ts`, `lib/not-found-copy.ts`, `lib/runtime-error-copy.ts`, `lib/schema-locale-copy.ts`, `lib/seo-data.ts` and `app/[locale]/szolgaltatasok/[slug]/page.tsx`. Total ≈ 850 KO sentences or UI strings. Light GETs: /ko legal, news and trust routes, plus /en/recruitment-privacy. Cross-checked against `docs/verified_claims.md`, AGENTS.md, the open-items and status CSVs (KOS-*, FKZ-*), owner-confirmations-2026-10-18 and the June audit F-001…F-008.
NOT covered: the opened service-quote modal in a browser (source only), form success/error states (no submission, per the hard rules), the mobile menu, email rendering in real clients, and text inside the OG image.

Summary: NEW — P2 ×4, P3 ×15. KNOWN and still live — P1 ×1, P2 ×8, P3 ×44 ids (grouped in COPY-KO-029). No P0.

## Findings

### COPY-KO-001 — Footer calls the "Legal Statements" document "Terms of Use" (이용약관)
- Severity: P2
- Category: legal-consistency / mistranslation
- Where: every KO page footer → `/en/aszf`. `lib/i18n/ko.ts:128` (`footer.terms`), `lib/locale-ui-helpers.ts:202`, latent `lib/i18n/ko.ts:110` (`specialDataWarningLink`)
- Evidence: KO "이용약관 (영문)". The linked page is titled "Legal Statements" and states "It is not a set of general terms and conditions covering the Provider's entire business." The lawyer-reviewed HU source is "Jogi nyilatkozatok", version "1.1 verzió - cím pontosítása", which clarified the title away from ÁSZF/T&C.
- Problem: 이용약관 means Terms of Use / T&C. That is the exact framing the authoritative HU v1.1 title change removed, so the KO label contradicts the approved legal document type.
- Fix: `terms: "법적 고지사항(영문)"` in both places; latent link `"법적 고지사항(영문) 제4조"`. This replaces the FKZ-034 suggestion "이용약관(영문) 제4조".
- Status: NEW (the latent link part overlaps KNOWN FKZ-034)
- Confidence: high

### COPY-KO-002 — Remote-monitoring lead now says every signal gets escalated
- Severity: P2
- Category: mistranslation / claim
- Where: /ko/szolgaltatasok/tavfelugyelet-vonuloszolgalat, lead (`valueProposition`, `lib/services/ko-service-details.ts:229`)
- Evidence: "각 신호는 확인 절차를 거친 후 에스컬레이션되며 조치는 사건 일지에 기록됩니다." The same page continues: "오경보는 기록하고 분석할 수 있으며 실제 사건은 … 전달합니다." HU: "minden jelzés ellenőrzött eszkalációs folyamatba kerül" (every signal enters a controlled escalation *process*).
- Problem: The KO lead says every signal is escalated after checking, which contradicts the false-alarm handling described in the body. The wording came from the KOS-028 fix and introduces a new meaning error.
- Fix (merged with the KOS-004 fix): "Avenir는 24/7 디스패처 지원 체계를 바탕으로 연결된 사업장의 경보·침입·CCTV 신호를 처리합니다. 모든 신호는 확인 절차를 포함한 에스컬레이션 프로세스에 따라 처리되며, 조치는 사건 일지에 기록됩니다."
- Status: NEW (side effect of the KOS-028 fix marked JAVITVA_FORRAS)
- Confidence: medium-high

### COPY-KO-003 — Career copy: wrong role type, wrong location scope, odd "합법적인 고용"
- Severity: P2
- Category: mistranslation
- Where: /ko homepage, career section (`lib/i18n/ko.ts:67` `careerText` paragraph 2; `ko.ts:80` `careerFallbacks.locations`)
- Evidence: "보안, 청소, 기술 및 현장 운영 관련 역할에 지원할 수 있습니다. 안정적인 회사 기반, 합법적인 고용, …" and the job card "부다페스트 및 지역 현장". HU: "Biztonsági, takarítási, műszaki és irányítói pozíciókba …", "Budapest / országosan".
- Problem: "irányítói" (supervisory/management) became "현장 운영" (field operations). "országosan" (nationwide) became "지역 현장" (regional). "합법적인 고용" reads as if lawful employment were unusual. The paragraph-1 issues are already KNOWN FKZ-022.
- Fix: "보안, 청소, 기술 및 관리자(현장 책임자) 직무에 지원하실 수 있습니다. 안정적인 회사 기반, 정식 고용, 체계적인 입사 교육과 성장 기회를 제공합니다." and `"Budapest, regional": "부다페스트 및 전국 현장"`.
- Status: NEW
- Confidence: high

### COPY-KO-004 — Service-page quote form shows no privacy notice (cross-locale; the KO homepage form has one)
- Severity: P2
- Category: data-protection UI / legal-consistency (raise with the privacy area for HU/EN)
- Where: the "견적 요청" modal on all 8 KO service pages (`components/ServiceQuoteCta.tsx`; the hints at ~l.459–460 render only `requiredField` and `nextStepHelper`)
- Evidence: the source contains no privacy, notice or link string (grep for privacy/adatkez/notice/layered returns 0 hits). The modal collects "이름 / 이메일 / 전화번호 / 회사명 (선택) / 문의 내용". The homepage form shows "제출하면 다음 문서를 확인한 것으로 간주됩니다: 개인정보 처리방침 (영문)."
- Problem: Two personal-data forms on the same locale behave differently. The service-page form gives no Art. 13-style pointer to the privacy notice. This is not KO-specific, since the component is shared.
- Fix: add a hint line, linked to `/en/adatvedelem` for KO: "제출 시 개인정보 처리방침(영문)을 확인한 것으로 간주됩니다." (HU/EN/DE: reuse each locale's `form.layeredNotice` + link.)
- Status: NEW
- Confidence: high that the notice is absent (source); medium on severity, because the opened modal was not visually verified

### COPY-KO-005 — Homepage service cards use different terms than the detail pages, and two cards drift from HU
- Severity: P3
- Category: terminology / translation drift
- Where: /ko service cards (`lib/homepage-content.ts:51,56,66,76`); about text (`lib/i18n/ko.ts:37`)
- Evidence:
  - Guarding card: "업무 기록" (szolgálati napló). The detail page and FAQ use "근무 일지".
  - Remote card: "… 이벤트 기록 … 지원하는 원격 모니터링 서비스입니다." The detail page uses "사건 기록 / 사건 일지". The card also drops the response service (HU: "Távfelügyelet és vonulószolgálat …").
  - Event card: "주최자 기준 에스컬레이션". The detail page uses "주최 측이 정한 에스컬레이션" (HU "szervezői eszkaláció").
  - Reception card: "우편물·배송물". HU has only "csomagok", so "우편물" is an addition.
  - About text: "여러 공급자를 따로 조율하는 대신". Everywhere else the copy uses "서비스 제공자 / 업체".
- Problem: The same concept appears under 2–3 different terms across homepage and detail pages, and there is one omission and one addition against HU.
- Fix:
  - Guarding card: "사업장 출입 관리, 순찰, 사건 처리, 근무 일지 및 합의된 에스컬레이션을 지원하는 현장 보안 인력 서비스입니다."
  - Remote card: "신호 접수, 경보 확인, 에스컬레이션, 사건 기록 및 합의된 조건의 대응 프로세스를 갖춘 원격 모니터링 및 출동 대응 서비스입니다." (Use whichever esemény term is chosen under KOS-010.)
  - Event card: "… 사건 기록 및 주최 측이 정한 에스컬레이션을 지원합니다."
  - Reception card: "… 열쇠, 배송물, 출입 기록 …"
  - About text: "여러 서비스 제공자를 따로 조율하는 대신".
- Status: NEW (related to KNOWN KOS-010, FKZ-024)
- Confidence: high

### COPY-KO-006 — Value pillars: "전문적인 현장 대응" mistranslates "Szakmai jelenlét" and repeats "대응"
- Severity: P3
- Category: mistranslation / style
- Where: /ko "Avenir 소개" pillars (`lib/i18n/ko.ts:40-49`)
- Evidence: pillar 2 is titled "전문적인 현장 대응" and pillar 3 "대응과 책임성". Pillar 1 body: "…명확한 책임 지점을 통해 현장에서 무엇이 일어나는지 파악할 수 있도록 지원합니다." HU titles: "Szakmai jelenlét" / "Reagálás és felelősség"; HU pillar 1: "…hogy mindig lássa".
- Problem: "presence" became "response", so two of the three pillars now say 대응 and the triad loses its distinction. "책임 지점" is a literal rendering, and "mindig" (always) is lost. Pillar 2's body is already KNOWN FKZ-021.
- Fix: pillar 2 title "전문적인 현장 운영"; pillar 1 body "문서화된 프로세스, 정기 보고, 명확한 책임 소재를 통해 현장에서 무엇이 일어나는지 항상 파악할 수 있도록 지원합니다."
- Status: NEW
- Confidence: high

### COPY-KO-007 — Use-case heading "어떤 사업장에 적합한가요" does not fit most of the lists under it
- Severity: P3
- Category: mistranslation / UX copy
- Where: all 8 KO service pages, H2 (`KO_REVIEW_SERVICE_DETAIL_SHARED_COPY.useCasesTitle`, `ko-service-details.ts:361`)
- Evidence: the heading asks "which sites", but the lists contain people ("사무용 건물 및 비즈니스 센터의 소유주와 운영자", Hard FM), activities ("택시·여객 운송·교통 서비스의 모의 탑승", Mystery), events ("콘서트 및 실내 공개 행사"), and situations ("…요구하는 경우", Soft FM; "…검토하려는 경우", remote monitoring). HU: "Kinek jó" (who it suits).
- Problem: The heading narrows the meaning to physical sites. The missing "?" is already KNOWN KOS-048.
- Fix: `useCasesTitle: "적합한 고객과 활용 상황"` (eyebrow "추천 대상" stays).
- Status: NEW (extends KNOWN KOS-048)
- Confidence: high

### COPY-KO-008 — Certificate texts omit the issuer names, drop "international standard", and the aria date reads oddly
- Severity: P3
- Category: translation drift / accessibility copy
- Where: /ko certification cards + Credential JSON-LD (`lib/certification-translations.ts:20,25`); card aria-labels
- Evidence:
  - KO: "인증된 경영시스템은 인증서에 정의된 범위 내에서 인증서에 명시된 발급기관의 심사를 받았습니다." HU: "…auditálásra a MartonCert Rendszertanúsító Kft. által".
  - KO: "MSZ ISO/IEC 27001:2023은 인증서에 명시된 정보보안경영시스템(ISMS) 표준입니다." HU: "…nemzetközi szabványa".
  - aria-label: "…, 발급기관 MartonCert Rendszertanúsító Kft., 유효기간 2029년 3월 18일".
- Problem: The issuer name is replaced by a roundabout phrase, and 인증서 appears three times in one sentence. "International standard" is dropped (the KO follows EN, not HU). "유효기간 + a single date" is unidiomatic.
- Fix:
  - ISO 9001: "ISO 9001은 품질경영시스템에 관한 국제 표준입니다. 인증서에 명시된 인증 범위는 ‘종합 보안 서비스’입니다. 인증된 경영시스템은 이 범위 내에서 MartonCert Rendszertanúsító Kft.의 심사를 받았습니다. 이 인증서는 IAF MLA 협정에 따라 국제적으로 인정됩니다."
  - ISO 27001: "MSZ ISO/IEC 27001:2023은 정보보안경영시스템(ISMS)에 관한 국제 표준입니다. Avenir의 인증된 정보보안경영시스템은 인증서에 정의된 범위 내에서 MCert Rendszertanúsító Kft.의 심사를 받았습니다. …"
  - aria-label: "…, 2029년 3월 18일까지 유효".
- Status: NEW
- Confidence: high

### COPY-KO-009 — Credential schema category labels differ from the visible ones
- Severity: P3
- Category: terminology / schema
- Where: /ko and all KO service pages, `EducationalOccupationalCredential.credentialCategory` (`lib/schema-locale-copy.ts:33`)
- Evidence: schema "품질 경영 시스템 인증" / "정보보호 경영 시스템 인증"; visible "ISO 9001 품질경영시스템 인증" / "ISO 27001 정보보안경영시스템 인증".
- Problem: The ISO 27001 concept appears as both 정보보호 and 정보보안, with inconsistent spacing.
- Fix: `qualityCategory: "품질경영시스템 인증", securityCategory: "정보보안경영시스템 인증"`.
- Status: NEW
- Confidence: high

### COPY-KO-010 — Hungarian "Magyarország" leaks into the KO Service JSON-LD
- Severity: P3
- Category: schema / i18n leak
- Where: all 8 KO service pages, `Service.areaServed.name`; hardcoded at `app/[locale]/szolgaltatasok/[slug]/page.tsx:229`
- Evidence: `"areaServed": {"@type":"Country","name":"Magyarország"}`, while the KO LocalBusiness on the same page uses "헝가리".
- Problem: Hungarian text in Korean structured data. It also affects the EN/DE/FR/ZH service pages, including the indexed EN pages; flag this to the schema area.
- Fix: use the locale schema copy (`copy.country` → "헝가리"), or use `"HU"` as `homepage-schema.ts:68` already does.
- Status: NEW
- Confidence: high

### COPY-KO-011 — Two broken sentence structures in FAQ copy
- Severity: P3
- Category: grammar
- Where: /ko/szolgaltatasok/biztonsagtechnika FAQ 2 answer (`ko-service-details.ts:209`); /ko/szolgaltatasok/mystery-shopping-helyszini-audit FAQ 2 question (`:127`)
- Evidence:
  - "CCTV, 출입 통제 또는 경보 프로세스는 경비 인력, 게이트하우스, 담당자 및 에스컬레이션 체계에서 각 신호에 필요한 조치를 알고 있을 때 실질적인 가치를 제공합니다."
  - "감사 범위는 어떻게 정하고 합의된 범위를 지키나요?"
- Problem: In the first sentence, "체계에서 … 알고 있을 때" has no grammatical subject that "knows". The second sentence joins two questions with mismatched predicates.
- Fix:
  - "네. CCTV, 출입 통제 또는 경보 프로세스는 경비 인력, 게이트하우스 및 담당자가 각 신호에 필요한 조치를 알고 있고 에스컬레이션 체계가 이를 뒷받침할 때 실질적인 가치를 제공합니다."
  - "감사 범위는 어떻게 정하며, 합의된 범위는 어떻게 지키나요?"
- Status: NEW
- Confidence: high

### COPY-KO-012 — "독립적인/독립적으로" is a literal rendering of "elszigetelt/különálló" (isolated)
- Severity: P3
- Category: machine-translation artefact
- Where: /ko/szolgaltatasok/biztonsagtechnika, body paragraph 2 (`ko-service-details.ts:185`) and FAQ 1 answer (`:208`)
- Evidence: "Avenir는 보안 기술을 독립적인 장비 구매로 다루지 않습니다." / "장비가 독립적으로 남지 않고". HU: "nem elszigetelt eszközbeszerzésként" / "ne különálló eszköz legyen".
- Problem: 독립적 is positive ("independent/autonomous"), while the source means isolated, standalone hardware.
- Fix: "Avenir는 보안 기술을 단순한 개별 장비 구매로 다루지 않습니다." / "장비가 따로 운용되지 않고 경비, 게이트하우스 및 에스컬레이션을 지원하도록 하는 것이 목표입니다."
- Status: NEW
- Confidence: high

### COPY-KO-013 — "방문객 및 손님 응대" is redundant, and 손님/방문객 are mixed
- Severity: P3
- Category: style / terminology
- Where: /ko/szolgaltatasok/portaszolgalat, "포함되는 업무" item 1 (`ko-service-details.ts:68`), FAQ 1 answer (`:86`), process step 3
- Evidence: "방문객 및 손님 응대"; "손님 응대, 방문객 등록"; "손님 응대, 출입 통제, 열쇠 지급…". HU: "Látogatók és vendégek fogadása".
- Problem: In Korean B2B copy, 방문객 and 손님 are near-synonyms, so the pair reads as duplication and the copy switches between them.
- Fix: "방문객 응대 및 안내"; use "방문객" throughout (keep "접객" only for front-of-house).
- Status: NEW
- Confidence: medium

### COPY-KO-014 — "Single accountable contact" softened on the guarding page
- Severity: P3
- Category: translation drift (weakening)
- Where: /ko/szolgaltatasok/objektumorzes, trust item 3 (`ko-service-details.ts:37`)
- Evidence: "책임 연락 담당자 지정 / … 지정하여 고객이 여러 관계자 사이에서 직접 조율할 필요를 줄입니다." HU: "Egy felelős kapcsolattartó / … így a megrendelő nem különálló szereplők között egyeztet."
- Problem: "Egy" (one) is lost, and "does not have to coordinate" becomes "reduces the need".
- Fix: title "단일 책임 연락 담당자"; body "일상 운영을 위한 책임 연락 담당자를 한 명 지정하므로 고객이 여러 관계자와 따로 조율할 필요가 없습니다."
- Status: NEW
- Confidence: medium

### COPY-KO-015 — Space before parentheses in labels
- Severity: P3
- Category: punctuation
- Where: footer ×3, 404 page, form notice and success link, certificate download, quote modal (`ko.ts:103,113,127-129,152`; `locale-ui-helpers.ts:201-203`; `not-found-copy.ts:8`; `ko-service-details.ts:370`)
- Evidence: "개인정보 처리방침 (영문)", "회사 정보 (영문)", "인증서 다운로드 (PDF)", "회사명 (선택)"
- Problem: Korean convention attaches the parenthetical. The FKZ-018/FKZ-034 proposals already use the attached form ("개인정보 처리방침(영문)"), but the source still has the space.
- Fix: "개인정보 처리방침(영문)", "회사 정보(영문)", "인증서 다운로드(PDF)", "회사명(선택)".
- Status: NEW (related to KNOWN FKZ-018)
- Confidence: high

### COPY-KO-016 — UI microcopy: breadcrumb label inconsistent, generic 404 title, stiff 404 body
- Severity: P3
- Category: UI copy / accessibility
- Where: `app/[locale]/szolgaltatasok/[slug]/page.tsx:784` vs `lib/locale-accessibility.ts:8`; KO 404 page (`lib/not-found-copy.ts:8`)
- Evidence: breadcrumb aria-label "현재 위치" vs a11y map "탐색 경로"; 404 TITLE "Avenir Facility Management Kft. — 보안 및 FM"; body "요청하신 콘텐츠를 이용할 수 없습니다."
- Problem: Two labels exist for the same landmark. The 404 tab title gives no error signal. The body is a literal rendering of "nem érhető el".
- Fix: use one label ("탐색 경로") in both places; 404 title "페이지를 찾을 수 없습니다 | Avenir"; body "요청하신 페이지를 찾을 수 없습니다. 주소를 확인하시거나 홈으로 이동해 주세요."
- Status: NEW (FKZ-013 itself looks resolved for KO: the live 404 is Korean with lang=ko)
- Confidence: high

### COPY-KO-017 — Hungarian address abbreviations in the KO footer
- Severity: P3
- Category: i18n leak
- Where: all KO pages, footer company line (`footer.headquartersLabel` + address)
- Evidence: "등록 소재지: 1039 Budapest, Királyok útja 291. B. ép. 15. ajtó"
- Problem: "ép." and "ajtó" (building, door) mean nothing to a Korean reader. The street address can stay in the original for postal use.
- Fix: "… B. ép. 15. ajtó(B동 15호)"
- Status: NEW
- Confidence: low (keeping the original postal form may be intentional)

### COPY-KO-018 — Dead or divergent KO copy sets that reviewers may edit by mistake
- Severity: P3
- Category: maintainability / translation process
- Where: `lib/i18n/ko.ts:155-169` (`serviceDetail`) and `lib/services/ko-service-details.ts:349-358` (`KO_REVIEW_RELATED_SERVICE_COPY`)
- Evidence:
  - `ko.ts` has "적합 대상 / 적합한 현장 / 포함 사항 / 협업 시작 방식 / Avenir를 선택하는 이유 / 신뢰 요소", but the live pages render "추천 대상 / 어떤 사업장에 적합한가요 / 포함되는 업무 / 협업 시작 방법 / 운영 신뢰의 근거 / 관리 및 확인 체계" from the shared copy.
  - `KO_REVIEW_RELATED_SERVICE_COPY` is never rendered: related cards use `shortDesc` via `getKoReviewRelatedServicesBySlugs`.
- Problem: There are three different short-description sets per service and two label sets. A native reviewer can edit strings that never ship.
- Fix: remove the unused sets, or wire them in and record in `docs/translations/translation_notes.md` which file is authoritative.
- Status: NEW
- Confidence: high

### COPY-KO-019 — Reply email italicises the quoted original, which renders poorly for Hangul
- Severity: P3
- Category: typography (email)
- Where: `lib/email-templates/reply.ts:138`
- Evidence: `font-style:italic;` applied to the quoted customer message for every locale, including `ko`
- Problem: Hangul has no true italics; clients synthesise a slant that hurts legibility.
- Fix: no italics for `ko`/`zh` (for example, `font-style:${locale === "ko" || locale === "zh" ? "normal" : "italic"}`).
- Status: NEW
- Confidence: medium

### COPY-KO-020 — "24/7 관제 지원" on the remote-monitoring lead strengthens the approved claim
- Severity: P1
- Category: claim/proof
- Where: /ko/szolgaltatasok/tavfelugyelet-vonuloszolgalat, lead (`ko-service-details.ts:229`)
- Evidence: "Avenir는 24/7 관제 지원을 통해 연결된 사업장의 경보·침입·CCTV 신호를 처리합니다."
- Problem: 관제 implies a monitoring/control centre; the approved claim is only "24/7 diszpécseri háttér". The stat-tile part of FKZ-002 is fixed (live "24/7 디스패처 지원"); this lead is the remaining occurrence.
- Fix: see COPY-KO-002 (combined text).
- Status: KNOWN (KOS-004; FKZ-002 residual)
- Confidence: high

### COPY-KO-021 — Homepage form helper omits the approved next-business-day follow-up, contradicting the service pages
- Severity: P2
- Category: translation drift / consistency
- Where: /ko contact form (`ko.ts:106-107`) vs service quote modal (`ko-service-details.ts:375`) and process step 1 on objektumorzes/portaszolgalat
- Evidence: homepage "담당자가 입력하신 연락처로 회신드립니다. 견적 준비는 요청의 범위와 복잡성에 따라 달라집니다." vs "업무 시간 중에는 일반적으로 당일 답변드리며, 늦어도 다음 영업일까지 연락드립니다." vs "늦어도 다음 영업일까지 제공하신 연락처로 연락드립니다."
- Problem: The same locale gives two different follow-up messages, and the homepage weakens the approved claim.
- Fix: "업무 시간 중에는 대부분 당일 회신드리며, 늦어도 다음 영업일까지 연락드립니다. 견적 준비 기간은 요청의 범위와 복잡성에 따라 달라집니다." Use the same text in the quote modal (KOS-050: 답변 → 회신).
- Status: KNOWN (FKZ-006, KOS-050)
- Confidence: high

### COPY-KO-022 — Hero subline: different elements than HU, "지향합니다" weakens it, awkward "한 계약"
- Severity: P2
- Category: translation drift
- Where: /ko hero (`ko.ts:23`)
- Evidence: "…원격 모니터링, 보안 기술, FM 지원을 하나의 운영 체계로 연결합니다. 한 계약, 한 책임 연락 창구, 구조화된 보고를 지향합니다."
- Fix: per FKZ-007: "Avenir는 현장 보안, 출입 관리, 보안 기술, 현장 점검과 보고를 하나로 통합해 운영합니다. 하나의 계약, 하나의 책임 연락 창구로 진행합니다."
- Status: KNOWN (FKZ-007)
- Confidence: high

### COPY-KO-023 — Certification heading and intro: certifies "operations", plus an internal-sounding sentence
- Severity: P2
- Category: claim/proof (ISO scope) / translation drift
- Where: /ko certification section (`ko.ts:139-141`)
- Evidence: "인증된 운영 체계. 문서화된 관리." / "…인증 관련 표현은 해당 인증 범위에 따라 신중하게 사용합니다."
- Fix: per FKZ-008: "인증된 품질. 관리되는 운영." / "품질경영 및 정보보안 경영시스템은 독립 인증기관의 심사를 받습니다. 인증은 문서화되고 추적 가능하며 지속적으로 개선되는 운영의 기반이 됩니다."
- Status: KNOWN (FKZ-008)
- Confidence: high

### COPY-KO-024 — Legal-framework term "인적·재산 보안" (reads as personnel security)
- Severity: P2
- Category: legal-consistency / terminology
- Where: objektumorzes body paragraph 3, trust item 6, FAQ 7; tavfelugyelet FAQ 5
- Evidence: "적용되는 헝가리의 인적·재산 보안 규제 체계에 따라"
- Fix: "적용되는 헝가리의 신변 보호 및 재산 보호(경비업) 관련 법규에 따라"
- Status: KNOWN (KOS-006)
- Confidence: high

### COPY-KO-025 — "게이트하우스" (literal of the English "gatehouse") as the core service term (≈38 fields)
- Severity: P2
- Category: terminology
- Where: portaszolgalat (name, H1, title, meta) and cross-references on 5 pages; homepage card, footer and dropdown
- Evidence: "리셉션 및 게이트하우스 서비스"
- Fix: "리셉션 및 출입 관리 서비스" (body text: "출입 관리(경비실)")
- Status: KNOWN (KOS-008)
- Confidence: high

### COPY-KO-026 — "현장 보안 인력 서비스" suggests staffing/agency labour; mixed with 경비/경비 인력/현장 경비
- Severity: P2
- Category: terminology
- Where: objektumorzes name, H1, title, meta; cross-references; homepage, footer, dropdown
- Evidence: "기업 사업장을 위한 현장 보안 인력 서비스 | Avenir"
- Fix: "시설 경비 서비스" (title "기업 시설 경비 서비스 | Avenir")
- Status: KNOWN (KOS-009)
- Confidence: high

### COPY-KO-027 — esemény/incidens both rendered as "사건" (crime connotation), with one "사고"
- Severity: P2
- Category: terminology
- Where: tavfelugyelet (lead, body, items, trust, FAQ), biztonsagtechnika FAQ 6, rendezvenybiztositas FAQ 6. The homepage card uses "이벤트" (see COPY-KO-005).
- Evidence: "침입 감지, 경보 사건, CCTV, 출입 사건, 외곽 보안 신호"
- Fix: per KOS-010 (esemény → 이벤트/상황, eseménynapló → 이벤트 일지, incidens → 사건), applied across all surfaces.
- Status: KNOWN (KOS-010)
- Confidence: high

### COPY-KO-028 — Hard FM: "조율 책임을 고객에게 보이지 않게 넘기지 않습니다" is muddled
- Severity: P2
- Category: mistranslation
- Where: /ko/szolgaltatasok/hard-fm, body paragraph 2
- Evidence: "…합의된 운영 모델 안에서 조율하며, 조율 책임을 고객에게 보이지 않게 넘기지 않습니다."
- Fix: "…합의된 운영 모델 안에서 조율하며, 전문 업체 조율을 고객에게 떠넘기지 않습니다."
- Status: KNOWN (KOS-012)
- Confidence: high

### COPY-KO-029 — Remaining KNOWN P3 rows confirmed still live on 2026-10-18 (grouped)
- Severity: P3
- Category: terminology / style / punctuation (see each row)
- Where / Evidence (live text) → id:
  - "제출하면 다음 문서를 확인한 것으로 간주됩니다: 개인정보 처리방침 (영문)." → FKZ-018
  - "보안 서비스 · 보안 기술 · 운영 지원" → FKZ-019
  - "…통제된 수행 방식으로 산업, 물류, 상업 및 사무 환경을 지원합니다." → FKZ-021
  - "단순한 현장 존재에 그치지 않고" / "우리는 … 안정적인 현장 존재와" → FKZ-022
  - "…축적된 경험을 바탕으로…" (no "수십 년", no "전국"; mystery shopping shown only as "서비스 감사") → FKZ-023
  - "…현장별 보안 모델에 맞춰 설계·운영하도록 지원하는…" → FKZ-024
  - "견적 문의" (nav) vs "견적 요청" (service CTA); modal "이름 / 전송 중... / * 필수 항목 / 알려주세요" vs "성명 / 전송 중… / * 필수 입력 항목" → FKZ-026, KOS-049
  - "세금번호 · 등록 소재지" → FKZ-027
  - "Avenir Facility Management Kft. — 보안 및 FM" → FKZ-028
  - no recruitment-privacy line in the KO career section (/en/recruitment-privacy returns 200, so the FR/DE-style link is feasible) → FKZ-033
  - latent "이용약관 4항", "민간조사" → FKZ-034 (see COPY-KO-001 for the corrected document name)
  - "신호 처리 및 에스컬레이션 절차 수립", "기술 신호" → KOS-013
  - "에스컬레이션" vs "상위 담당자에게 보고"/"상위 대응" → KOS-014
  - "협업 시작 시 정합니다" (×8) → KOS-015
  - "입장 및 퇴장 절차 지원" → KOS-016
  - "실명 담당자 연락 체계", "실명 운영 담당자" → KOS-017
  - Hard FM FAQ 4 answer "고객의 기존 협력사를 조율하는 방식" (remaining 협력사) → KOS-020
  - "초청객·관객 동선", "초청 행사" (also on the homepage event card) → KOS-021
  - "특별 보호 구역" → KOS-022
  - "장애 대응", "장애 일지" → KOS-023
  - "냉난방·환기·공조" → KOS-024
  - "ISO 9001 및 ISO 27001 인증 경영시스템이" → KOS-025
  - "합의된 연결 설정에 따라 연결된 사업장의" → KOS-026
  - "시작·운영 지원 및 조정" → KOS-029
  - "…맞춰 서비스를 구성합니다." (licence trust item) → KOS-030
  - "CCTV 시스템 및 관찰 지점 조사" → KOS-031
  - "비례적인 감시 범위" vs "비례적인 촬영 범위" → KOS-032
  - "CCTV나 경보 시스템 자체는 장비입니다." → KOS-033
  - "보고 가능한 관찰 내용, 우선순위, 연계 지점" → KOS-034
  - "순찰, 확인 지점 점검 및 구내 순회" → KOS-035
  - "열쇠 관리 및 지급 규칙 준수", "지급·반납 기록" → KOS-036
  - "적절한 정보 제공도 절차에 포함됩니다", "현장의 개인정보 보호 규칙에 맞춰" → KOS-037
  - "브랜드 감사는 외관, 시각적 기준, 청결" → KOS-038
  - "차이점·위험·개선 지점 기록" → KOS-039
  - "민간 조사, 제한 없는 관찰, 증거 수집" → KOS-040. NEW aspect: spacing "민간 조사" here vs "민간조사" in `ko.ts:111`; use "민간조사" in both.
  - "범위에는 건물 구조체, …" → KOS-043
  - "합의된 설비와 시스템의 일정에 따른 계획 예방정비" → KOS-044
  - "…출입 지점, 순찰 필요, 사건 처리…" → KOS-045
  - "서비스 제공자 관리 및 현장 운영 조율" → KOS-046
  - "기업 사업장을 위한 보안 기술 | Avenir" → KOS-047
  - "어떤 사업장에 적합한가요" (no "?") → KOS-048 (see COPY-KO-007)
  - "Avenir는 연결된 사업장의 신호를 24/7 접수하며", "24/7 경보 및 CCTV 신호 접수", "24/7 신호 처리가 필요한 사업장" → KOS-051 (HU-level claim check)
  - "승인된 하도급업체", "하도급업체와의 협의" → KOS-052 (business decision)
- Problem / Fix: as recorded in `docs/audits/2026-10-17/text-audit-open-items.csv` for each id; the open-items proposals still match the live text.
- Status: KNOWN (ids above)
- Confidence: high

## Verified OK
- Routes: `/ko` and all 8 KO service pages return 200 with `noindex, follow`, a self-canonical URL and no hreflang. `/ko/adatvedelem`, `/ko/aszf`, `/ko/impresszum`, `/ko/hirek`, `/ko/trust-center` and `/ko/megfelelosegi-kozpont` return 404 (light GET). Footer legal links go to `/en/adatvedelem`, `/en/aszf` and `/en/impresszum` (all 200 in the crawl), are labelled "(영문)", and the footer disclaimer says legal links open English documents and news is not yet in Korean.
- Service names are identical across card h3/aria-label, contact dropdown, footer, H1, breadcrumb and Service JSON-LD (the KO part of FKZ-012 is resolved). Each page has one H1. FAQPage JSON-LD count matches the visible FAQ count on all 8 pages (9/8/8/10/8/8/8/12).
- Speech level: declaratives are consistently 합니다체. FAQ questions use the conventional customer-voice "-나요?". Requests use "~해 주세요". No 해요체 declaratives were found. Particles after Latin words and numbers are correct (Avenir는/를/가, Hard FM은/이, ISO 27001은, 2023은, 8218로).
- Facts match HU and `verified_claims.md`:
  - company number 01-09-328046, tax number 26395124-2-41, address, phone and email;
  - "30+", "200+", "AA / D&B 높은 신용도 평가";
  - ISO 9001 MartonCert 843579099 (2026-03-19 → 2029-03-18) and ISO 27001 MCert 988960032 (2026-04-27 → 2029-04-26), MSZ ISO/IEC 27001:2023;
  - KO date format "2026년 3월 19일" is correct.
- Claims and compliance:
  - Homepage stat and guarding/reception trust items say "24/7 디스패처 지원 … 연계할 수 있으며" (approved; KOS-001/002/003 fixed).
  - Process step 1 on objektumorzes/portaszolgalat matches the approved next-business-day contact wording, so there is no June F-002 regression.
  - Site-visit timing matches the owner-approved HUA-004 sentence.
  - Armed guarding is always conditional on contract, legal requirements and risk profile.
  - Every guarantee question is answered with a negation: event conflict-free, Hard FM repair time and cleaning quality; arrival time is not promised.
  - Private investigation appears only as a negative distinction in the Mystery FAQ and is absent from the dropdown.
  - There is no GDPR-compliance promise: "법적 근거와 최종 개인정보 보호 결정은 고객 및 자문가에게 있습니다" and "이는 법률 자문은 아니지만". KOS-005 and KOS-007 are fixed.
  - Mystery shopping is framed as "감시나 징계를 목적으로 하지 않습니다" (KOS-011 fixed).
  - ISO statements on service pages are scoped "해당 프로세스가 인증 범위에 포함되는 경우".
  - No EcoVadis or Special-Services wording, and no invented clients or numbers.
- Fixed rows confirmed in the live text: KOS-018 (모의 구매/모의 탑승), KOS-019 (규정 준수 항목), KOS-027, KOS-041, KOS-042, the FKZ-002 stat tile, FKZ-030 (KO email quote label "원본 메시지 — …:"), and FKZ-031/032 (localized KO Organization/Credential JSON-LD with correct issuers). KOS-028 is fixed, but see COPY-KO-002.
- The KO consent banner matches the owner-approved HUA-001 content (name, email, phone, message or other form content not sent to analytics; "거부" / "분석 동의"). The KO 404 renders in Korean with `lang=ko`.
- Cross-area observations, not scored here:
  - KO service pages have no `og:locale` (the `/ko` homepage has `ko_KR`).
  - `WebSite.inLanguage` still lists ko (June P2-01).
  - `docs/copy_strategy.md:303-304`, `docs/translations/translation_notes.md:10,89` and the `ko.ts:3` comment say KO is homepage-only or that KO service routes are closed, while production serves them and the footer disclaimer announces them (the related QA FAIL ×8 is in `qa-preview.txt`).
