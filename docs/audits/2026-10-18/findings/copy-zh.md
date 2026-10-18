# COPY-ZH — findings

Coverage:
- Live corpus `S\crawl\text_zh.md` read in full: shared header/nav, shared footer, /zh homepage, all 8 /zh/szolgaltatasok/* pages, every TITLE / META DESCRIPTION / H1, and the full "[UI extras — zh]" block (consent banner, placeholders, labels, options, aria-labels, title, alts, localized 404). About 900 text segments (sentences, headings, list items, labels; repeated related-card and footer text included).
- FAQ answers are collapsed, so they are not in the visible-text corpus. I read all 71 ZH FAQ answers (143 sentences) from the FAQPage JSON-LD in `S\crawl\pages\zh__*.json` and compared them with the 71 HU answers from `hu__*.json`. Question, use-case, included, process, trust and related-service counts match HU on all 8 pages.
- I compared meaning against the HU page on the same path in `S\crawl\text_hu.md` (homepage plus 8 service pages). For the mystery-shopping wording I also cross-checked EN `text_en.md`.
- Source scan: `lib/i18n/zh.ts` (all keys, including latent and unrendered ones), `lib/services/zh-service-details.ts` (all 8 services, the unrendered service-quote modal copy and the related-copy map), and the Chinese strings in `lib/locale-ui-helpers.ts`, `lib/not-found-copy.ts`, `lib/runtime-error-copy.ts`, `lib/locale-accessibility.ts`, `lib/seo-data.ts`, `lib/schema-locale-copy.ts`, `lib/analytics/consent-copy.ts`, `lib/email-templates/reply.ts`, `components/PartnerLogoStrip.tsx`, `app/[locale]/szolgaltatasok/[slug]/page.tsx`, and the DB seed text in `scripts/seed.ts` / `scripts/update-positions-prod.ts` (ZH positions).
- Mechanical checks: all 772 distinct Han characters in the live corpus, JSON-LD and ZH sources encode in GB2312 (iconv), so there are no Traditional characters. I ran regex scans for half-width punctuation next to Han characters, spaces between Han characters, spaced em dashes and ASCII ellipses. Hits are reported below; most are already KNOWN.
- Cross-referenced all 25 ZHS-* and 28 FKZ-* rows in `docs/audits/2026-10-17/text-audit-open-items.csv`, and the closed ZHS/FKZ rows in `text-audit-status.csv`, for regressions.
- Not covered: the service-quote modal and the success/error states as rendered (I reviewed them from source only; the crawl did not open the modal or submit forms). I did not visually inspect the certificate-card label rendering. The DB-driven homepage cards were reviewed as rendered text and JSON-LD only; I did not read the DB.

Counts in this file (distinct issues): 0 P0 · 1 P1 (KNOWN FKZ-004) · 14 P2 (3 NEW, 11 KNOWN ids grouped in COPY-ZH-019) · 41 P3 (14 NEW, 27 KNOWN ids grouped in COPY-ZH-020). One open row is resolved live and can be closed: ZHS-033.

## Findings

### COPY-ZH-001 — Mystery shopping trust card drops the "no surveillance framing" safeguard
- Severity: P2
- Category: mistranslation / compliance wording
- Where: https://www.afm.hu/zh/szolgaltatasok/mystery-shopping-helyszini-audit — 信任依据, card 2 (`lib/services/zh-service-details.ts:120`, `trustItems[1].body`)
- Evidence: ZH "检查真实客户情境中约定的服务步骤、品牌要求及客户旅程接触点，不将其界定为监管检查或纪律处理。" — HU "…valós ügyfélhelyzetben, felügyeleti vagy fegyelmi keretezés nélkül." — EN "…without surveillance or disciplinary framing."
- Problem: "felügyeleti" (EN "surveillance") was rendered as "监管检查" (regulatory inspection). The ZH card therefore no longer says that mystery shopping is not surveillance, which is exactly the separation AGENTS.md requires (Mystery Shopping ≠ private investigation or surveillance). In its place it introduces an unrelated "regulatory inspection" disclaimer.
- Fix: "检查真实客户情境中约定的服务步骤、品牌要求及客户旅程接触点，不带有监视性质，也不作为纪律处分依据。"
- Status: NEW
- Confidence: high

### COPY-ZH-002 — Homepage card for remote monitoring leaves out verification, escalation and event logging
- Severity: P2
- Category: translation drift (DB/CMS card)
- Where: https://www.afm.hu/zh#services card "远程监控与现场响应服务". The same text is in the /zh JSON-LD `ItemList` position 6.
- Evidence: ZH "依托调度后台处理报警和视频监控信号，并在需要时按照约定流程进行现场响应。" — HU "Távfelügyelet és vonulószolgálat jelzésfogadással, riasztás-verifikációval, eszkalációval, eseménynaplózással és egyeztetett reagálási folyamattal."
- Problem: Alarm verification, escalation and event logging, the core of the HU card, are missing. "调度后台" is a vague term not used anywhere else on the site. FKZ-004 and FKZ-011 cover the other 7 cards but not this one, and the CMS fix will be the same.
- Fix (CMS `name_zh`/`description_zh` card text): "远程监控与现场响应服务：信号接收、报警核实、升级处理、事件日志记录及约定的响应流程。"
- Status: NEW (same root cause as FKZ-004 / FKZ-011)
- Confidence: high

### COPY-ZH-003 — Security-guard job location narrows "Budapest / nationwide" to "Budapest and surroundings"
- Severity: P2
- Category: mistranslation (DB content)
- Where: https://www.afm.hu/zh#career, position "保安员" (source `scripts/seed.ts:137`, `scripts/update-positions-prod.ts:48` `locationZh`)
- Evidence: ZH "布达佩斯及周边" — HU "Budapest / országosan"
- Problem: HU says Budapest and nationwide; ZH says Budapest and the surrounding area. The ZH (and EN "Budapest, regional") value follows a non-HU source. It also contradicts the ZH career text "Avenir 团队在全国范围内…".
- Fix: "布达佩斯 / 全国各地". Update the positions row in staging first, then in production after approval. The EN value has the same drift; flag it to the EN area.
- Status: NEW
- Confidence: high

### COPY-ZH-004 — Remote-monitoring lead implies every signal is escalated
- Severity: P3
- Category: meaning drift (residual of a closed fix)
- Where: https://www.afm.hu/zh/szolgaltatasok/tavfelugyelet-vonuloszolgalat lead (`valueProposition`, zh-service-details.ts:229)
- Evidence: "每项信号经核实后进入升级处理流程，相关行动记录在事件日志中。" — HU "minden jelzés ellenőrzött eszkalációs folyamatba kerül"
- Problem: As written, the ZH lead means that every signal is escalated once verified. That contradicts the same page's "误报可记录并分析" and the HU meaning, which is that every signal enters a controlled escalation process. The ZHS-002 fix (JAVITVA_FORRAS) was applied with different wording from the one the audit proposed.
- Fix: "每项信号均进入经核实的升级处理流程，相关处置措施记录在事件日志中。"
- Status: NEW (wording regression of the ZHS-002 fix)
- Confidence: medium

### COPY-ZH-005 — Footer legal link labels point to differently named EN pages
- Severity: P3
- Category: legal-consistency / UI
- Where: footer on all 9 /zh pages and the 404 (`lib/locale-ui-helpers.ts:209-211`)
- Evidence: "使用条款（英文）" → /en/aszf (page title "Legal Statements"; HU "Jogi nyilatkozatok"); "法律声明（英文）" → /en/impresszum (page title "Legal Notice"; HU "Impresszum")
- Problem: "法律声明" is the literal translation of the /aszf page name ("Legal Statements") but is used on the Impressum link, while /aszf is labelled "Terms of use". A ZH reader looking for the legal statements opens the company-info page instead. All three targets return 200 (checked).
- Fix: privacy "隐私政策（英文）"; aszf "法律声明（英文）"; impresszum "公司信息（英文）" (KO uses "회사 정보 (영문)").
- Status: NEW
- Confidence: high

### COPY-ZH-006 — Job-application email subject uses the button CTA "立即申请"
- Severity: P3
- Category: UI copy
- Where: https://www.afm.hu/zh#career, all 4 "立即申请" mailto links
- Evidence: `mailto:info@afm.hu?subject=立即申请 - 保安员` (HU: `subject=Jelentkezés - Biztonsági őr`)
- Problem: The email subject reuses the button label "Apply now", which reads oddly as a subject line. HU uses the noun "Jelentkezés" (application).
- Fix: subject "职位申请 - 保安员" etc. Use a separate subject label, not `applyBtn`.
- Status: NEW
- Confidence: high

### COPY-ZH-007 — D&B stat label departs from the approved ZH wording
- Severity: P3
- Category: claim/proof wording
- Where: https://www.afm.hu/zh stats tile 3 (`lib/i18n/zh.ts:32` `stats[2].l`)
- Evidence: "D&B 高信用评级" — `docs/verified_claims.md`: "EN/DE/ZH: 'D&B High Creditworthy 2026'"
- Problem: The tile uses a free Chinese rendering and drops "2026", which the approved claim includes. The meaning is close, so this is not an overstatement, but it is not the approved wording.
- Fix: "D&B High Creditworthy 2026". Alternatively, record an owner-approved ZH form such as "D&B 高信用等级（High Creditworthy 2026）" in verified_claims.md.
- Status: NEW
- Confidence: medium

### COPY-ZH-008 — Services subtitle "一站式综合解决方案" is generic marketing
- Severity: P3
- Category: tone / copy rules
- Where: https://www.afm.hu/zh#services eyebrow (`zh.ts:57` `servicesSub`)
- Evidence: "一站式综合解决方案" — HU "KOMPLEX MŰKÖDÉS EGY KÉZBŐL"
- Problem: "One-stop integrated solution" is a stock phrase of the kind copy_strategy and AGENTS ask to avoid. HU says integrated operation from one hand.
- Fix: "综合运营，一方统筹"
- Status: NEW
- Confidence: medium

### COPY-ZH-009 — 404 body adds "temporarily"
- Severity: P3
- Category: mistranslation (UI)
- Where: /zh/<unknown> 404 page (`lib/not-found-copy.ts:7`)
- Evidence: "您查找的内容暂不可用。" — HU "A keresett tartalom nem érhető el."
- Problem: "暂" (temporarily) suggests the page will come back. HU and EN simply say the content is not available.
- Fix: "您访问的页面不存在或已不可用。"
- Status: NEW
- Confidence: high

### COPY-ZH-010 — Soft FM "运营接口" calque
- Severity: P3
- Category: terminology / naturalness
- Where: /zh/szolgaltatasok/soft-fm `useCases[4]` "可通过同一运营接口衔接 Soft FM、Hard FM、门岗与驻场安保的场所"; trust card 3 title "连接多个服务商的运营接口"
- Evidence: see the quotes above (HU "egy operatív felület")
- Problem: "接口" (technical interface/API) is a literal rendering. In B2B FM Chinese it reads as IT jargon.
- Fix: "可通过统一运营协调窗口衔接……的场所"; title "多服务商统一运营协调"
- Status: NEW
- Confidence: medium

### COPY-ZH-011 — Remote-monitoring FAQ 2 answer is circular
- Severity: P3
- Category: grammar / style
- Where: /zh/szolgaltatasok/tavfelugyelet-vonuloszolgalat FAQ "远程监控与现场响应有什么区别？" (`faq[1].a`)
- Evidence: "现场响应则可依合同提供现场响应流程。"
- Problem: The answer defines 现场响应 using 现场响应. HU: "a vonulószolgálat szerződéses feltételek alapján helyszíni reagálási folyamatot biztosíthat".
- Fix: "现场响应服务则可按合同条件提供人员到场处置流程。"
- Status: NEW
- Confidence: high

### COPY-ZH-012 — Homepage meta description and hero: comma splice and wrong measure word for a person
- Severity: P3
- Category: grammar / SEO snippet
- Where: /zh TITLE/META and Organization/LocalBusiness JSON-LD `description` (`lib/seo-data.ts:134`); hero sub (`zh.ts:16`)
- Evidence: META "Avenir 在匈牙利提供安保服务、安防技术、现场审核和设施管理支持，一份合同，一个责任明确的对接人。"; hero "只需一份合同，一个责任明确的对接人。"
- Problem: The meta description is a comma splice. "一个…对接人" uses the plain measure word for a person; B2B copy uses "一位". The meta says "现场审核", but HU says "szolgáltatásaudit" and the service page uses "服务审核". HU also says "országosan" (nationwide).
- Fix: META "Avenir 在匈牙利全国提供安保服务、安防技术、服务审核及设施管理支持：一份合同，一位责任明确的对接人。"; hero "只需一份合同，一位责任明确的对接人。"
- Status: NEW
- Confidence: high

### COPY-ZH-013 — About text adds "cost" to "fewer coordination needs"
- Severity: P3
- Category: translation drift
- Where: /zh#about paragraph 2 (`zh.ts:41`)
- Evidence: "我们的目标是减少客户日常协调成本" — HU "Célunk, hogy ügyfeleink oldalán kevesebb egyeztetésre legyen szükség"
- Problem: "协调成本" turns "less coordination effort" into an implied cost-saving claim.
- Fix: "我们的目标是减少客户日常所需的协调工作，降低风险，并提升现场运营的透明度。"
- Status: NEW
- Confidence: medium

### COPY-ZH-014 — Footer address keeps Hungarian building/door abbreviations
- Severity: P3
- Category: Hungarian leaking into ZH UI
- Where: footer impressum line on all /zh pages
- Evidence: "总部地址: 1039 Budapest, Királyok útja 291. B. ép. 15. ajtó"
- Problem: "B. ép. 15. ajtó" means nothing to Chinese readers. The latent zh.ts legal block already uses "B栋，15门". It is acceptable to keep the postal form, but a gloss helps.
- Fix: "注册地址：1039 Budapest, Királyok útja 291. B. ép. 15. ajtó（B 栋 15 室）". The label and colon parts are KNOWN under FKZ-027 and ZHS-037.
- Status: NEW
- Confidence: medium

### COPY-ZH-015 — Minor calques and inconsistent styling (grouped polish)
- Severity: P3
- Category: naturalness / typography
- Where / Evidence:
  - biztonsagtechnika longDesc p3 and trust card 5: "保存逻辑" (HU "megőrzési logika") → "保存规则"
  - homepage career p2: "合法雇佣" → "正规雇佣"
  - mystery `valueProposition`: "在真实客户情境中展示客户体验…" → "揭示"
  - number/date spacing is inconsistent: "成立于 2018 年", "200 多名" (spaced) vs "2026年3月19日" (unspaced). Pick one convention.
- Problem: Literal renderings and inconsistent typographic conventions.
- Fix: as listed.
- Status: NEW
- Confidence: medium

### COPY-ZH-016 — JSON-LD `knowsAbout` terms do not match the page service names
- Severity: P3
- Category: terminology (schema copy)
- Where: LocalBusiness JSON-LD on all /zh pages (`lib/schema-locale-copy.ts:28`)
- Evidence: ["驻场安保","安防技术","报警系统监控","门禁系统","门岗服务","24/7 调度支持","神秘顾客审核","综合设施管理"]
- Problem: "报警系统监控" and "神秘顾客审核" differ from the page names "远程监控与现场响应" and "神秘顾客与服务审核". This adds to the naming inconsistency already tracked in ZHS-006.
- Fix: ["驻场安保","前台与门岗服务","安防技术","远程监控与现场响应","神秘顾客与服务审核","活动安保","Hard FM（技术设施管理）","Soft FM（日常设施支持）"], aligned with the name set chosen for ZHS-006.
- Status: NEW
- Confidence: medium

### COPY-ZH-017 — Latent ZH legal block in zh.ts is stale and conflicts with the authoritative HU text
- Severity: P3
- Category: legal-consistency (latent; not rendered)
- Where: `lib/i18n/zh.ts:209-345` (`legal.privacy/terms/impressum`). Not rendered: `LEGAL_PAGE_RENDER_LOCALES = ["hu","en","de"]` (`lib/legal-routes.ts:5-9`).
- Evidence: "1.0版本 — 首次发布"; cookies: "在当前运行状态下，https://www.afm.hu 网站不使用任何分析、营销…Cookie"; `privacyLinkHref: "/zh/adatvedelem"`; "审查截止 2026.06.30"
- Problem: The block contradicts the live GA4 consent banner and the authoritative HU v1.3 (consent-based GA4). It links to a ZH route that returns 404 and carries an expired review date. If a ZH legal route is ever enabled, or a component starts reading `t.legal.*` for zh, it would publish legally wrong text.
- Fix: Remove the zh `legal` block, or replace it with a faithful translation of the current HU legal text before any ZH legal route is enabled. Keep footer links on the EN documents until then.
- Status: NEW
- Confidence: high

### COPY-ZH-018 — KNOWN P1: homepage cards (security guarding, security technology) state claims not in HU
- Severity: P1
- Category: claim/proof
- Where: /zh#services cards and /zh JSON-LD ItemList positions 1 and 5 (CMS)
- Evidence: "由训练有素的安保人员提供人身及财产安全保护…"; "视频监控、门禁和报警系统的设计、安装与维护…"
- Problem: Still live. The cards claim personal-protection, installation and maintenance services that HU does not state.
- Fix: as FKZ-004: "驻场安保服务：出入管理、巡逻、事件处理、执勤日志及约定的升级处理流程。" / "面向视频监控、门禁和报警流程的安防技术，融入适合现场的安保模式，并在技术设计中纳入数据保护要求。"
- Status: KNOWN (FKZ-004)
- Confidence: high

### COPY-ZH-019 — KNOWN P2 items still live on /zh (grouped)
- Severity: P2
- Category: translation drift / terminology / claim scope
- Where / Evidence / Status:
  - Other homepage cards (porta "租户沟通", mystery "独立评估", events "巡逻", Hard/Soft FM "作为补充服务", "小型维修"): KNOWN (FKZ-011)
  - Service names differ by surface. Footer, cards and form options use "驻场安保服务 / 神秘顾客评估与现场审核 / 远程监控与现场响应服务 / Soft FM（软性设施管理） / Hard FM（硬性设施管理）"; H1s and related cards use "驻场安保 / 神秘顾客与服务审核 / 远程监控与现场响应 / Soft FM — 日常设施支持 / Hard FM — 技术设施管理". "出勤" is now gone; this part is fixed. KNOWN (FKZ-012, ZHS-006)
  - ISO block "经认证的质量。经审核的运营。" / "我们的质量管理和信息安全运营由独立认证机构进行审核。": KNOWN (FKZ-009)
  - Value pillars "统一的现场规范" / "有助于及时处理": KNOWN (FKZ-010)
  - Homepage form helper lacks the same-day/next-business-day sentence that the service-quote modal has (`zh-service-details.ts:375`): KNOWN (FKZ-006)
  - ISO 9001 description: "证书中列明的范围为 “Comprehensive security services”。" (English inside the Chinese text, a stray space before the quotation mark; also in JSON-LD): KNOWN (FKZ-015)
  - "有记录的…" calque, about 11 occurrences (porta META "有记录的日常门岗运营", Hard FM META/H1 page "有记录的报告", trust cards): KNOWN (ZHS-007)
  - "租户期望白天可见服务水平…": KNOWN (ZHS-009)
  - 404: lang=zh and the copy are now localized (improved). The residual is a generic `<title>` "Avenir Facility Management Kft. — 安保与设施管理" instead of "页面未找到 | Avenir": KNOWN (FKZ-013, partially resolved)
  - Customer reply email signature "此致敬礼," (`lib/email-templates/reply.ts:68`): KNOWN (FKZ-016)
- Fix: per the open-items rows.
- Confidence: high

### COPY-ZH-020 — KNOWN P3 items still live on /zh (grouped)
- Severity: P3
- Category: typography / terminology / style
- Where / Evidence / Status:
  - Half-width separators "切换语言: Magyar", "认证, 颁发机构 …, 有效期至", "…我们的 隐私政策（英文）.": FKZ-018
  - "公司注册号: … · 税号: … · 总部地址: …": ZHS-037 (colons); "总部地址" / "法律": FKZ-027
  - Hero alt "Avenir 设施管理 — 匈牙利…", "30+ 活跃站点", "关于Avenir": FKZ-025
  - CTA/label drift "获取报价 / 申请报价 / 发送报价申请", "邮箱 / 电子邮箱". It also covers the modal-vs-form drift seen in source: "电话" vs "电话号码", "公司（选填）" vs "公司名称", "留言" vs "留言 / 需求说明", "发送" vs "发送报价申请": FKZ-026
  - ZH career section has no applicant-privacy pointer (HU has one): FKZ-033
  - Latent "私家侦探", "需另行签署合同": FKZ-034
  - "安防技术可以与驻场保安衔接吗？": ZHS-011
  - biztonsagtechnika still uses "评估" for felmérés/felülvizsgálat ("哪些现场适合开展安防技术评估？", "适合现场的安防技术评估", "现有…的评估"). The porta FAQ is now "门岗现场勘查", which is fixed: ZHS-012 (partial)
  - "当服务涉及远程报警处理时…" / "…和结案就能形成同一运营模式": ZHS-015
  - "汇总主要事件、偏差、事故及改进建议": ZHS-016
  - "出入管理与入口管理": ZHS-018; "演唱会及室内公开活动": ZHS-019
  - Spaced " — " in "Hard FM — 技术设施管理", "Soft FM — 日常设施支持" (H1/TITLE/breadcrumb; also the homepage TITLE): ZHS-021
  - "明确的书面服务范围": ZHS-022; "日常保洁", "将报修…" in Soft FM: ZHS-023
  - "记录服务商责任…" (Hard FM step 3): ZHS-024; "品牌审核检查外观…": ZHS-025; "发现针对…", "合规观察": ZHS-026
  - "服务根据安防技术许可与现场合同要求设置。": ZHS-027; "…具有书面确定的目的…": ZHS-028
  - "是否提供钥匙管理？" → "可以。": ZHS-030; "24/7 后方支持", "24/7 调度支持": ZHS-031
  - Unconditional "Avenir 为联网现场提供 24/7 信号接收" (faithful to HU; source-level check): ZHS-032
  - "管理与验证机制" (all 8 trust headings): ZHS-034
  - Modal error text has no phone number (`zh-service-details.ts:373`): ZHS-035
  - "正在发送…" (modal) and "发送中…" (homepage form, `zh.ts:141`, same issue): ZHS-036
- Fix: per the open-items rows.
- Confidence: high

## Verified OK
- Script: all 772 distinct Han characters on the live /zh pages, in the JSON-LD and in the ZH sources are GB2312 Simplified. There are no Traditional characters, and no Hungarian or English UI strings leak, apart from the KNOWN ISO scope (FKZ-015) and the address (COPY-ZH-014).
- Structural parity with HU on all 8 service pages: the same number of use cases, included items, process steps, trust cards, FAQs (71/71) and related services.
- Response-time wording matches the approved claim. objektumorzes/portaszolgalat step 1: "最迟于下一个工作日…报价所需时间取决于…". objektumorzes step 2 now carries the owner-approved HUA-004 sentence "我们在首次沟通时共同确定现场勘查及基本风险梳理的时间。" The old "1–3 个工作日" is gone, so ZHS-033 is resolved live and the open row can be closed.
- No guarantees or SLAs: the Hard FM repair time, remote-monitoring arrival time, event conflict-free and cleaning quality FAQs all explicitly decline guarantees, faithful to HU.
- 24/7 appears only as dispatcher support ("调度员值班", "可由 24/7 调度支持配合"). The remote-monitoring 24/7 signal reception is faithful to HU (KNOWN ZHS-032).
- Armed guarding depends on risk profile, contract need and legal conditions. Licences are phrased as "按照适用的匈牙利人身与财产安保监管框架", with documents shared at contract preparation, matching HU.
- Private investigation appears only in the mystery-shopping differentiation FAQ ("它不是私人调查、无限制观察、取证活动或自动纪律处分机制"). There are no Special Services routes, CTA or options, and no "GDPR" or compliance promise. The data-protection passages keep "法律依据及最终数据保护决定仍由客户及其顾问负责".
- ISO data match HU and the certificates: MartonCert 2026年3月19日–2029年3月18日; MCert MSZ ISO/IEC 27001:2023 2026年4月27日–2029年4月26日. No EcoVadis or OPTEN text.
- The consent banner matches the owner-approved HU sentence (HUA-001), including the exclusion of other form content.
- Footer legal links resolve to /en/adatvedelem, /en/aszf and /en/impresszum, all 200 and labelled "（英文）". The ZH disclaimer accurately says legal links point to English documents and that news is not available in Chinese. No /zh legal links are rendered.
- Previously fixed rows did not regress: ZHS-001/003/029 (no added GDPR FAQs), ZHS-005 (no "出勤"), ZHS-008, ZHS-010 ("结案"), ZHS-013, ZHS-014, ZHS-017 ("分区管理"), ZHS-020, FKZ-003 ("已知悉").
- All /zh pages render 200 with `noindex, follow`, `lang=zh`, self-canonical and no hreflang. The 404 is localized (lang=zh, noindex).
- Out of my area, for the SEO/schema agent: WebSite JSON-LD `inLanguage` lists hu,en,de,zh,ko,fr, which the June audit P2-01 had asked to narrow. The Organization `@id` is shared across locales but carries a localized `description`.
