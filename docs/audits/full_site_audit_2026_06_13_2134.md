# Avenir teljes site audit — 2026-06-13 21:34

Production URL: https://www.afm.hu
Repo: `C:\Users\andra\avenir-website`
Branch: `main`
Auditált commit: `8f9bba4 fix(privacy): add GA4 processor and transfer wording`
Audit típus: **read-only, bizonyíték-alapú** (production curl + repo source + lokális QA)
Runtime / DB / route / copy / config változtatás: **nincs**
Módszer: 16 dimenziós multi-agent fan-out (read-only `Explore` agentek) + minden P0/P1 finding **független adversarial újraellenőrzése** (source vs. live), majd kézi cross-check a fő tételekre.

> Ez egy **új, timestampelt** report. A korábbi `docs/audits/full_site_audit_2026_06_13.md` fájlt nem írtam felül; azt **inputként** kezeltem, nem igazságként — minden állítását függetlenül ellenőriztem (több helyen pontosítottam vagy cáfoltam).

---

## 1. Executive summary

**Overall score: 8.4 / 10**
**Verdikt: GO — nincs technikai launch-blocker.** Nincs megerősített P0. A nyitott tételek döntő része **legal/proof governance és copy-konzisztencia** (fix válaszidő-megfogalmazás, GA4 account-oldali bizonyíték, toborzási adatkezelés DPO sign-off dokumentálása), plusz néhány dokumentációs frissesség. Egyik sem akadályozza a működést vagy a publikus elérhetőséget.

### Mi a kép a számok mögött

A 16 dimenzióból 186 megfigyelés született. Adversarial verifikáció után:

| Megerősített severity | Darab | Megjegyzés |
|---|---:|---|
| **P0** | **0** | Az egyetlen P0-jelölt (lásd FP-1) a verifikációban P2-re esett vissza. |
| **P1** | 8 | Ebből 4 ugyanaz a téma (válaszidő-megfogalmazás). |
| **P2** | ~16 | Sprint backlog. |
| **P3** | 7 | Nice-to-have / GEO roadmap (+1 saját catch: duplikált devDependency). |
| false-positive / cáfolt | 1 fő + 14 disproved-concern | A `code_architecture` "future Trust Center" cáfolva; 14 SEO-aggály verifikálva rendben. |
| no-action / verifikáltan jó | 137 | Security, analytics, a11y, perf, route-gating mind erős. |

A baseline minden zöld: `lint` clean, `tsc` clean, **91 unit teszt** pass, `qa:copy` PASS (192 fájl / 28 check), `next build` OK (Next.js 16.2.6 Turbopack, 75 statikus oldal), prod `qa:preview` **422 check PASS**, prod `qa:analytics` **16 Playwright teszt PASS**, `git diff --check` tiszta.

### Top 10 kockázat (verifikált severity szerint)

| # | Kockázat | Sev | Bizonyíték |
|--:|---|---|---|
| 1 | Fix válaszidő ("2 munkanap / 2 business days / 2 Werktagen") **élőben** az ÁSZF-ben (HU/EN/DE). | P1 | `lib/i18n/hu.ts:310`, `en.ts:307`, `de.ts:241`; `/hu|en|de/aszf` |
| 2 | Ugyanez **két indexelt szolgáltatásoldal** process-szekciójában (objektumőrzés, portaszolgálat). | P1 | `scripts/seed-pilot-objektumorzes.ts:82`, `…portaszolgalat.ts:81`; `/hu|en/szolgaltatasok/...` |
| 3 | `llms-full.txt:73` továbbra is hirdeti a "2-working-day" választ → AI-rendszerek idézhetik. | P1 | `public/llms-full.txt:73`; live |
| 4 | `verified_claims.md` jóváhagyottként listázza a válaszidő-állításokat, miközben `copy_strategy.md` tiltja → **doc-ellentmondás**. | P1 | `docs/verified_claims.md:29-31` vs `docs/copy_strategy.md:360-364` |
| 5 | Toborzási adatkezelés (`/hu/palyazoi-adatkezeles`, `/en/recruitment-privacy`) **élő**, de a kötelező DPO/jogi sign-off (PL-091 gate) lezárása nincs dokumentálva. | P1 | `lib/recruitment-privacy-content.ts:10-11`; `docs/legal/recruitment-privacy-review.md:136-142` |
| 6 | GA4 processor/transfer szöveg élő (privacy v1.3), de az **account-oldali** DPA/retenció/Signals/Ads bizonyíték review nyitott. | P1 | `lib/current-privacy-content.ts:44`; `docs/legal/google-analytics-processor-review.md:75-89` |
| 7 | Admin mutációkról **nincs audit trail** (sikeres írás nem naplózódik: ki/mit/mikor). | P1 | `lib/admin/safe-action-error.ts`, `app/admin/(dashboard)/*/_actions.ts` |
| 8 | `staging_runbook.md` "Last updated: 2026-05-28" elavult (június 12-i tartalmak vannak benne). | P1* | `docs/staging_runbook.md:3` (*tartalom helyes, csak a dátum áll) |
| 9 | WebSite JSON-LD `inLanguage` mind az 5 nyelvet hirdeti, miközben csak HU/EN indexelhető. | P2 | `app/[locale]/layout.tsx:267` (`SEO_LOCALES`) |
| 10 | `.env.local.staging.backup` plaintext staging titkokkal a working tree-ben (gitignore-olt, **nincs commitolva**). | P2 | repo gyökér (lásd FP-1) |

### Top 10 quick win

| # | Quick win | Prompt típus |
|--:|---|---|
| 1 | **Owner-döntés**: a "2 munkanapos visszajelzés" szándékos vállalás-e? Ha igen → egységesíteni + dokumentálni `verified_claims`-ben; ha nem → kivenni mind az 5 felületről (ÁSZF×3, 2 service, llms-full, FAQ-source). | legal/proof review |
| 2 | `verified_claims.md` ↔ `copy_strategy.md` ellentmondás feloldása (egy állapot a válaszidőre). | docs-only |
| 3 | DPO/jogi sign-off tényének rögzítése a toborzási adatkezelésnél (kommentben vagy gate-closure doksiban). | legal/proof review |
| 4 | WebSite JSON-LD `inLanguage` szűkítése `["hu","en"]`-re. | quick fix |
| 5 | Trust Center felvétele a footer legal-linkek közé (jelenleg nem érhető el a footerből). | quick fix |
| 6 | `.env.local.staging.backup` törlése + staging credek rotálása (Blob token, Neon jelszó). | quick fix |
| 7 | `code_architecture.md` és `staging_runbook.md` "Last updated" dátum frissítése (June 13). | docs-only |
| 8 | Duplikált `@playwright/test` devDependency eltávolítása (`package.json:64-65`). | quick fix |
| 9 | `robots.ts`-be `Google-Extended`, `CCBot`, `Bytespider`, `anthropic-ai` AI-crawler szabályok. | quick fix |
| 10 | `/admin/login` rate-limit (KV alapú, a contact-limiter mintájára) — brute-force védelem. | runtime bugfix |

### Mi kifejezetten kiváló (NE változtass rajta)

- **Analytics/consent (9.8/10):** GA4 consent előtt nem tölt; reject blokkol; accept tölt; minden event PII-mentes allowlist-tel; nincs GTM/LinkedIn/Ads; CSP csak GA4 endpointokat enged. 16 prod Playwright teszt + unit tesztek igazolják.
- **Security headers + app-security:** szigorú CSP (`frame-ancestors 'none'`, csak GA4), HSTS, X-Frame-Options DENY, COOP/CORP, security.txt teljes; admin minden action `requireAdmin()` + middleware; upload magic-byte + MIME + folder + méret + UUID-filename; contact origin-allowlist + honeypot + body-limit + **fail-closed** rate limit prodban; DB-hiba redaktálva.
- **DB/script safety (9.2/10):** minden író script dry-run alapból, `--apply` kell az íráshoz, prod `--allow-production` + `verify-db-target` guard, baseline seed prodban tiltva, DATABASE_URL sosem teljes a logban, idempotens.
- **Route/sitemap/hreflang (9.1/10):** locale-specifikus slug-gating tökéletes (wrong-locale → 404), legacy/unknown slug → 404, sitemap csak HU/EN, DE noindex és nincs sitemap/hreflangban, ZH/KO zárt.
- **Accessibility (9.1/10):** egy H1/oldal, skip-link, ARIA, role=alert hibáknál, focus-visible, prefers-reduced-motion, sr-only, label minden inputon.
- **Trust Center proof-fegyelmét (9.4/10):** csak jóváhagyott proof publikus; D&B és felelősségbiztosítás `pending_review` → kizárva; ISO issuer/szám PDF-pontos; AutoWallis nem testimonial; magánnyomozás csak jogi infó.

---

## 2. Severity definíciók

- **P0** — azonnali blocker: security/legal exposure, production 500, törött űrlap, titok-szivárgás, admin auth bypass.
- **P1** — fontos, rövid távon javítandó (jellemzően legal/proof/governance vagy érdemi hiányosság).
- **P2** — közepes, sprint backlog.
- **P3** — nice-to-have / roadmap.

Minden P1/P0 tételhez kettős verifikáció történt (finder + független verifier; a fő tételeknél + kézi cross-check). Ahol nem sikerült a kettős igazolás, az "needs verification" jelzést kap.

---

## 3. P0 / P1 findings (részletes)

### F-001 — Fix válaszidő-vállalás élőben az ÁSZF-ben (HU/EN/DE)
- **Severity:** P1 | **Category:** Legal / copy / proof
- **Evidence:** `lib/i18n/hu.ts:310` „A Szolgáltató vállalja, hogy a beérkezett ajánlatkérésre **2 munkanapon belül** visszajelez." · `lib/i18n/en.ts:307` „…respond to incoming requests **within 2 business days**." · `lib/i18n/de.ts:241` „**Antwort innerhalb 2 Werktagen**."
- **Source/live:** `/hu/aszf`, `/en/aszf`, `/de/aszf` (DE noindex, de látható). Élőben 3 előfordulás HU/EN ÁSZF-ben (kézzel curl-lel igazolva).
- **Reprodukció:** `curl.exe -s https://www.afm.hu/hu/aszf | grep -c "2 munkanap"` → 3
- **Impact:** Egy "mi történik ezután" lágy elvárást **fix válaszidő-vállalássá** alakít az ÁSZF-ben (jogi szövegben). Ütközik a `copy_strategy.md:360-364` no-SLA guardrail-jával. Ügyfél / beszerzés / AI SLA-ként értelmezheti.
- **Recommendation:** Owner/jogi döntés: szándékos, vállalt válaszidő-e? Ha **nem** → cseréld a `form.nextStepHelper` típusú nem-SLA megfogalmazásra mindhárom nyelven. Ha **igen** → egységesítsd minden felületen és rögzítsd a `verified_claims.md`-ben mint jóváhagyott, pontos wording.
- **Autofix safe?** Nem (owner/jogi döntés kell). **Owner/legal döntés?** Igen. **Confidence:** high (source + live, kétszer igazolva).
- **Suggested prompt type:** legal/proof review + content quick fix.

### F-002 — Fix válaszidő a szolgáltatásoldalak process-szekciójában
- **Severity:** P1 | **Category:** Legal / copy / proof
- **Evidence:** `scripts/seed-pilot-objektumorzes.ts:82` és `scripts/seed-pilot-portaszolgalat.ts:81`: „A megkeresésre **2 munkanapon belül** visszajelzünk…". A DB-ből renderelődik a `/hu|en/szolgaltatasok/{objektumorzes,portaszolgalat}` **indexelt** oldalakon (élőben igazolva: 2-2 előfordulás).
- **Source/live:** seed-scriptek → DB → live service detail. `/hu/szolgaltatasok/objektumorzes` (HU indexelt), EN megfelelők.
- **Reprodukció:** `curl.exe -s https://www.afm.hu/hu/szolgaltatasok/objektumorzes | grep -c "2 munkanap"` → 2
- **Impact:** Mint F-001, de **indexelt, ügyfél-facing** oldalakon, magasabb bizalmi súllyal, mint a jogi boilerplate. AI-idézhető.
- **Recommendation:** F-001-gyel együtt kezelendő. Ellenőrizd mind a 8 kanonikus slugot, mielőtt bármilyen jövőbeli seed-sync visszahozná.
- **Autofix safe?** Nem (owner/jogi). **Owner/legal?** Igen. **Confidence:** high (source + live).
- **Suggested prompt type:** legal/proof review + content quick fix.

### F-003 — `llms-full.txt` stale válaszidő-állítás
- **Severity:** P1 | **Category:** LLM / AI-search / proof governance
- **Evidence:** `public/llms-full.txt:73` „- 2-working-day response wording for contact follow-up." Élőben azonos (`https://www.afm.hu/llms-full.txt`). `llms.txt`-ben **nincs** ilyen.
- **Reprodukció:** `curl.exe -s https://www.afm.hu/llms-full.txt | grep -n "2-working-day"`
- **Impact:** AI-search rendszerek SLA-szerű vállalásként idézhetik, akkor is, ha a látható copy nem ezt használja. A no-SLA politikát aláássa source szinten.
- **Recommendation:** Töröld a 73. sort, kivéve ha owner/jogi explicit jóváhagyja. Ha jóváhagyott → pontos wording + scope a `verified_claims.md`-be és a jogi oldalakra.
- **Autofix safe?** Igen (törlés), ha a no-SLA politika marad; egyébként nem. **Owner/legal?** Igen. **Confidence:** high.
- **Suggested prompt type:** quick fix + proof-policy megerősítés.

### F-004 — `verified_claims.md` ↔ `copy_strategy.md` ellentmondás
- **Severity:** P1 | **Category:** Documentation / proof governance
- **Evidence:** `docs/verified_claims.md:29-31` jóváhagyott állításként listázza: „2 munkanapon belüli visszajelzés", „1–3 munkanapos első egyeztetési…", „5 munkanapon belüli ajánlati előkészítés…". Ugyanakkor `docs/copy_strategy.md:360-364`: „a korábbi »2 munkanapon belül / within 2 business days« success wording eltávolításra került… Ne vezess vissza fix válaszidőket… owner/jogi jóváhagyás nélkül."
- **Impact:** Jövőbeli fejlesztő a `verified_claims.md` alapján joggal hiheti, hogy a válaszidő-állítások jóváhagyottak → újra bevezetheti az SLA-szerű copyt review nélkül. A proof-governance és a copy-stratégia ellentétes utasítást ad.
- **Recommendation:** Egy állapot rögzítése: vagy töröld a 3 állítást a `verified_claims.md`-ből (ha a no-SLA végleges), vagy jelöld őket rejected/pending-ként magyarázattal. F-001…F-003-mal egy döntésként kezelendő.
- **Autofix safe?** Nem (a döntés a tartalmat is befolyásolja). **Owner/legal?** Igen. **Confidence:** high.
- **Suggested prompt type:** legal/proof review.

### F-005 — Toborzási adatkezelés élő, de a DPO gate-lezárás nincs dokumentálva
- **Severity:** P1 | **Category:** Legal / Privacy governance
- **Evidence:** `lib/recruitment-privacy-content.ts:10-11`: „PUBLICATION GATE: this page may reach production only after the written DPO + legal sign-off (PL-091 gate)." A `/hu/palyazoi-adatkezeles` és `/en/recruitment-privacy` **élő (200)**, kiadási dátum 2026-06-12. `docs/legal/recruitment-privacy-review.md:136-142`: a gate 5 (írásos sign-off) még pending-ként szerepel.
- **Impact:** Compliance-gate-elt dokumentum élő prodban anélkül, hogy a kötelező írásos DPO/jogi sign-off ténye dokumentálva/archiválva lenne. Governance-rés (a gate a kódban van, de a teljesítése nincs rögzítve).
- **Recommendation:** **Owner/DPO megerősítés:** megtörtént-e az írásos sign-off (a DPO Csegény Fanni belső, így valószínű)? Ha igen → rögzítsd a dátumot/evidenciát a kommentben vagy gate-closure doksiban. Ha nem → szerezd be azonnal, vagy vond vissza a route-ot. Nem feltétlenül tényleges jogsértés — inkább **bizonyíték-dokumentálási hiány**.
- **Autofix safe?** Nem. **Owner/legal?** Igen. **Confidence:** high (source + live + review doc).
- **Suggested prompt type:** legal/proof review.

### F-006 — GA4 processor/transfer szöveg élő, account-oldali review nyitott
- **Severity:** P1 | **Category:** Privacy / analytics governance
- **Evidence:** A privacy v1.3 (HU/EN/DE) nevesíti a GA4-et: „Google Ireland Limited / Google LLC… Data Privacy Framework and/or Standard Contractual Clauses" (`lib/current-privacy-content.ts:44`). `docs/legal/google-analytics-processor-review.md:75-89` szerint a DPO/jogi sign-off **pending**; `docs/trust_center/proof_catalog.md:336` status `pending_review`. Runtime QA viszont átmegy (consent-gating helyes) → **nem runtime GA4 bug**.
- **Impact:** A privacy notice konkrét processor-azonosítást és transfer-safeguard wordinget tartalmaz, amit a DPO/jogi formálisan még nem hagyott jóvá. Ha a tényleges DPA/Google transfer-keretek/account-beállítások eltérnek a leírttól, a notice pontatlan lehet.
- **Recommendation:** Írásos DPO/jogi sign-off: (1) processor wording pontos; (2) DPF/SCC megfelelő; (3) GA4 account-beállítások (retenció, Google Signals OFF, Ads personalization OFF, Ads link, data sharing) ellenőrizve + screenshot/evidencia archiválva. A wording önmagában konzervatív.
- **Autofix safe?** Nem. **Owner/legal?** Igen. **Confidence:** high.
- **Suggested prompt type:** legal/proof review.

### F-007 — Admin mutációknál nincs audit trail
- **Severity:** P1 | **Category:** Admin / compliance
- **Evidence:** `safeActionError` (`lib/admin/safe-action-error.ts`) **hibákat** logol `console.error`-ral, de **sikeres** mutáció (createService/updateService/deleteService/news/...) nem logolódik (nincs „user=… action=… id=… ts=…"). `auth.ts` logolja a megtagadott bejelentkezést, de a sikereset nem.
- **Impact:** Nincs audit trail compliance-hez / incidensvizsgálathoz. Ha kompromittált session hamis tartalmat publikál, nincs időbélyeges nyom arról, ki tette. 3 fős csapatnál a gyakorlati kockázat alacsony, de szabályozott/tender-környezetben elvárt.
- **Recommendation:** Strukturált action-log tábla (id, adminEmail, action, entityType, entityId, change, ts); sikeres mutációnál írás a kliensnek való visszatérés előtt. Phase 2 backlog (PL-061–063 környéke).
- **Autofix safe?** Igen (additív, low-risk), de **owner-döntés** a megőrzési/PII-szempontok miatt. **Confidence:** high.
- **Suggested prompt type:** runtime bugfix / backlog.

### F-008 — `staging_runbook.md` "Last updated" elavult
- **Severity:** P1 (verifier) — gyakorlati hatás P2/P3 | **Category:** Documentation staleness
- **Evidence:** `docs/staging_runbook.md:3` „Last updated: 2026-05-28", miközben június 12-i tartalmak vannak benne (PL-090 security.txt/responsible disclosure QA a 437-457. sorokban, DE noindex review policy 475-478). A legutóbbi releváns commit 1 napos.
- **Impact:** A tartalom **helyes és aktuális**, csak a dátum áll → csökkenti a fejlesztői bizalmat a doksi frissességében.
- **Recommendation:** Frissítsd a dátumot 2026-06-13-ra (vagy a legutóbbi érdemi változás dátumára).
- **Autofix safe?** Igen. **Owner/legal?** Nem. **Confidence:** high.
- **Suggested prompt type:** docs-only.

---

## 4. P2 findings

| ID | Category | Title | Path | Owner? | Ajánlás |
|---|---|---|---|---|---|
| P2-01 | SEO / JSON-LD | WebSite `inLanguage` mind az 5 nyelvet hirdeti (DE/ZH/KO noindex/partial ellenére). *(seo/T11 + jsonld/J1 ugyanaz)* | `app/[locale]/layout.tsx:267` | Nem | Szűkítsd `["hu","en"]`-re; `Organization.availableLanguage` már helyesen csak HU/EN. |
| P2-02 | LLM / AI-search | `robots.txt` nem fed le minden főbb AI-crawlert. | `app/robots.ts:17-26` | Nem | Add hozzá: `Google-Extended`, `CCBot`, `Bytespider`, `anthropic-ai`. |
| P2-03 | Copy / i18n | DE ÁSZF kapcsolat-szekció rövid/kollokviális, eltér a HU/EN struktúrától. | `lib/i18n/de.ts:241` | Igen | Bővítsd a HU/EN szerkezetre (a válaszidő-döntés után). |
| P2-04 | Legal | HU/EN privacy v1.2 hatálydátum-eltérés a verziótörténetben. | `lib/current-privacy-content.ts:93,179` | Igen | Ellenőrizd, v1.2 deployolva volt-e 2026-06-01-én; ha nem, korrigáld a verziótörténetet. |
| P2-05 | Legal | Toborzási notice kiadási dátum DPO-megerősítésre vár. *(F-005 párja)* | `lib/recruitment-privacy-content.ts:13-14` | Igen | DPO írásos megerősítés a 2026-06-12 dátumra. |
| P2-06 | Performance | Homepage JS first-load 627 KB uncompressed (14 chunk) — tipikus, de jelentős. | `.next/diagnostics/route-bundle-stats.json` | Nem | Monitor; ha gond lesz: Contact form hidratáció késleltetése, validátorok code-splitje. |
| P2-07 | Accessibility | News kártyák `role=button` az `<article>`-ön (funkcionális, de szemantikusan jobb a `<button>`). | `components/News.tsx:181-191` | Igen | Opcionális polish; jelenleg is hozzáférhető. |
| P2-08 | Conversion / UX | **Trust Center nem érhető el a footerből** (csak Privacy/ÁSZF/Impresszum). | `lib/locale-ui-helpers.ts:169-181`, `components/Footer.tsx` | Igen | Add a Trust Centert a footer legal-linkekhez (locale-slug: hu→megfelelosegi-kozpont, en→trust-center). |
| P2-09 | Admin / security | `/admin/login`-on nincs rate-limit/2FA enforcement (NextAuth session-védelem van). | `app/admin/login/page.tsx`, `auth.ts` | Igen | KV-alapú attempt-counter (5/perc), a contact-limiter mintájára. |
| P2-10 | Admin / DB | Services reorder nem atomi (szekvenciális await-ek); Partners/Positions/Certifications már tranzakciósak. | `services/_actions.ts:815-819` | Nem | `neonSql.transaction()` használata (a minta már in-tree). |
| P2-11 | Admin / Legal | Álláshirdetés `applyEmail` DB-ben tárolt + emailben megy, de a job-jelentkezői adatkezelési notice/LIA nincs a form mellé linkelve. | `positions/_actions.ts` | Igen | A most élő toborzási notice (PL-091) prominens linkelése a career form mellé. |
| P2-12 | QA coverage | Nincs automatizált Lighthouse/axe/visual-regression (sem public, sem admin). | `docs/staging_runbook.md` | Igen | `qa:admin` script Lighthouse+axe néhány kulcsoldalra. |
| P2-13 | Operations | Nincs rollback/emergency-recovery runbook prod admin szcenáriókra. | `docs/staging_runbook.md`, `docs/production_handoff_2026_05_28.md` | Igen | 1-2 oldalas admin emergency runbook (unpublish, Neon restore, DBA kontakt). |
| P2-14 | Documentation | `code_architecture.md` "Last updated: 2026-05-28" elavult a júniusi feature-ökhöz. | `docs/code_architecture.md:3` | Nem | Dátum + Trust Center/disclosure/recruitment szekciók frissítése. |
| P2-15 | Documentation | PL-018 status "Ongoing", de a `verified_claims.md` ellentmond a `copy_strategy.md`-nek. *(F-004 párja)* | `docs/post_launch_backlog.md` (PL-018) | Igen | PL-018 status egyértelműsítése (needs action / approved). |
| P2-16 | Security (hygiene) | `.env.local.staging.backup` plaintext staging titkokkal a working tree-ben. *(eredeti P0-jelölt — lásd FP-1)* | repo gyökér | Igen | Töröld a backup-ot; rotáld a staging Blob tokent + Neon jelszót óvatosságból. **Nincs commitolva, nincs deployolva, staging-only.** |

---

## 5. P3 backlog

| ID | Category | Title | Ajánlás |
|---|---|---|---|
| P3-01 | DB / script | `drizzle-kit push/migrate` nincs belső confirmation gate. | drizzle-kit ökoszisztéma-limit, **nem projekt-hiba**; dokumentáld, hogy csak npm scripteken át futtatható (van `verify-db-target` guard). |
| P3-02 | DB / script | Prod scriptek két-flag követelménye (`--target production` + `--allow-production`) lehetne explicitebb a help-ben. | Egy mondat a `usageAndExit` help-be. |
| P3-03 | GEO / content | `llms-full.txt` nem tartalmaz FAQ-korpuszt, pedig FAQPage schema létezik. | 5-8 tételes FAQ szolgáltatásonként (beszerzési kérdések, scope, integráció). |
| P3-04 | GEO / content | GEO roadmap: beszerzés-fókuszú service guide-ok, supplier-evaluation checklistek. | 3-5 HU/EN guide/FAQ oldal a tipikus B2B beszerzői kérdésekre. |
| P3-05 | Performance | `avenir-logo-horizontal-dark.svg` 38 KB, nem optimalizált. | SVGO → ~3-5 KB. |
| P3-06 | Admin / UX | Upload komponensek (Image/Pdf) nincs retry-logika átmeneti hálózati hibára. | Opcionális exponential backoff (2-3 retry). |
| P3-07 | Code hygiene | **Duplikált `@playwright/test` devDependency** (`^1.60.0` és `^1.57.0`). *(saját catch — a workflow nem fogta meg)* | Töröld a duplát; npm az utolsót (`^1.57.0`) használja → szándékosan a `^1.60.0`-t hagyd meg. `package.json:64-65`. |
| P3-08 | SEO | Sitemap `lastModified` statikus (2026-05-07) a nem-news route-okon. *(seo finder szerint nem probléma; konzervatívan polish)* | Opcionális: a fő tartalmi release-ekhez igazított dátum-stratégia; a keresők többnyire ignorálják a lastmodot. |

---

## 6. False positives / cáfolt findingek

| ID | Eredeti állítás | Verdikt | Bizonyíték |
|---|---|---|---|
| **FP-1** | **P0: „Production secrets exposed" a `.env.local.staging.backup`-ban.** | **Cáfolt P0 → P2.** | A fájl (a) **nincs commitolva** (gitignore `.env*`, `git check-ignore` igazolja, nincs git history), és (b) a credek **staging-only**-k (`ep-twilight-sound-…` = staging; a production endpoint más: `ep-young-meadow-…`). Háromszorosan igazolva (finder + verifier + kézi). Marad P2 hygiene. |
| **FP-2** | „P1: `code_architecture.md` future-ként írja a Trust Centert / disclosure-t / recruitmentet." | **False positive.** | A `code_architecture.md:1031-1036` a **Phase 2 tágabb Trust Center víziót** írja le future-ként, nem az implementált MVP-t. A dátum elavultsága külön (P2-14), de a "future" jelölés helyes. |
| FP-3 | "P1: upload endpoint sebezhető?" (finder A4 P1-nek jelölte) | **Pozitív — no-action.** | Defense-in-depth: `requireAdmin` + folder/MIME/méret whitelist + magic-byte + UUID-filename. Nincs path-traversal/MIME-spoof. |
| FP-4 | "P1: admin route exposure?" (finder A15 P1-nek jelölte) | **Pozitív — no-action.** | `proxy.ts:47-69` middleware + per-action `requireAdmin`; unauth → `/admin/login`; upload API 401 JSON. |
| FP-5 | "P1: DE privacy filename v1.2 vs tartalom v1.3" | **P1 → P2.** | A loader a v1.2 fájlnevet hivatkozza, de a tartalom v1.3 és **élőben helyesen renderel**. Csak source-hygiene. |
| FP-6 | (prior audit) „D&B esetleges overclaim az llms-ben." | **Konzisztens — nem hiba.** | A D&B AA **wording** jóváhagyott (`verified_claims.md:139`), a Trust Center **kártya/PDF** szándékosan kizárva (`inclusion_matrix` `exclude_pending_review`). Két külön döntés, mindkettő helyes. |
| FP-7 | (memória) „ISO 27001 még placeholder." | **Megoldva.** | Valós adat: MCert Rendszertanúsító Kft., cert 988960032; PDF-verifikált, JSON-LD + Trust Center + llms egyezik. |

---

## 7. Already fixed / no action needed (verifikáltan jó — kivonat a 137 no-action tételből)

- **Routing:** root `/` → 308 → `/hu`; 8 kanonikus slug él; legacy/unknown → 404; locale-specifikus slug-pár 404-gating mind a 3 párnál (trust/disclosure/recruitment); DE noindex meta minden DE oldalon; sitemap pontosan 32 HU/EN URL.
- **Security:** minden header jelen és helyes; CSP csak GA4 (nincs ads/doubleclick/floodlight); security.txt teljes (security@/dpo@/info@); nincs hardcoded titok a source-ban; admin allowlist (`varkonyi@`, `fanni.csegeny@`, `peter.vagi@afm.hu`); rate-limit fail-closed prodban; DB-hiba redaktálva; JSON-LD XSS-escape.
- **Analytics:** consent-gating; allowlist-sanitizált eventek; nincs PII; consent banner szöveg = privacy v1.3 = runtime; privacy explicit kimondja: nincs GTM/LinkedIn/Ads.
- **SEO:** HU/EN index+follow; DE/ZH/KO noindex; hreflang reciprok + x-default; self-canonical; title+description minden indexelt oldalon; OG image 200 image/png; `<html lang>` egyezik; article:published/modified time; manifest + ikonok rendben.
- **JSON-LD:** `@id` konzisztens; ISO 9001/27001 PDF-pontos; FAQPage csak látható FAQ-nál; BreadcrumbList + Article a news/service oldalakon; ItemList csak published+active; **nincs Review/Rating/Testimonial/priceRange**; sameAs csak a jóváhagyott LinkedIn.
- **Copy/i18n:** egy H1/oldal HU/EN/DE; nincs untranslated key/fallback-leak; contact success/helper nem-SLA (a form felületen!); AutoWallis proof-safe; ZH/KO látható draft-disclaimerrel; magánnyomozás kizárva a dropdownból.
- **Legal:** DPO (Csegény Fanni) konzisztens HU/EN/DE + NAIH; processor-lista (Resend/Vercel/Neon/GA4) teljes; responsible disclosure SLA/bounty-ígéret nélkül; CCTV/HR/magánnyomozás külön notice-ként hivatkozva (nem a fő weben).
- **Trust Center:** ISO issuer/szám verifikált; D&B + felelősségbiztosítás kizárva (pending_review); DE Trust Center 404 (helyes); AutoWallis nem testimonial.
- **Performance:** Hero LCP webp `priority`+`fetchPriority=high`; homepage HTML 161 KB; TTFB 0.123s; font preload minimal (Geist latin, Barlow latin+latin-ext 600/700/800); referencia/partner logók lazy + méretezett; certification logók inline SVG; About `next/image` reszponzív.
- **Accessibility:** skip-link, ARIA nav + language switcher, role=alert hibáknál, focus-visible, prefers-reduced-motion, news modal `role=dialog`/`aria-modal`, logo alt, sr-only; primary `#D1172E` WCAG AA.
- **UX:** service prefill legacy-alias támogatással; magánnyomozás kizárva; nincs SLA a contact helperben; minden szekció tartalmas; reszponzív; news end-CTA szándékosan service-prefill nélkül.
- **Admin/DB scripts:** minden action `requireAdmin`; M365 Entra ID + allowlist; publish-guard; services 2-szintű hierarchia ON DELETE RESTRICT; slug stabil/immutable; minden író script dry-run default + `--apply` + prod-guard + idempotens.

---

## 8. Legal / proof decision register (owner/DPO/jogi döntést igénylő tételek)

| # | Tétel | Döntéshozó | Kérdés |
|--:|---|---|---|
| LR-1 | Válaszidő-vállalás ("2 munkanap") | Owner + jogi | Szándékos, vállalt válaszidő-e? Ha igen: egységesítés + dokumentálás. Ha nem: kivétel mind az 5 felületről (F-001…F-004). |
| LR-2 | Toborzási adatkezelés DPO sign-off | DPO (Csegény Fanni) + jogi | Megtörtént-e az írásos PL-091 sign-off? Rögzítés szükséges (F-005). |
| LR-3 | GA4 account-oldali bizonyíték | DPO + jogi | DPA archiválva? retenció/Signals OFF/Ads personalization OFF/data-sharing ellenőrizve + evidencia? (F-006). |
| LR-4 | Privacy v1.2 hatálydátum | Jogi | v1.2 ténylegesen deployolva volt-e 2026-06-01-én? Verziótörténet korrekció (P2-04). |
| LR-5 | D&B AA Trust Center publikáció | Proof owner | summary-only vs. PDF-publikáció vs. internal; review/lejárati dátum (TC-001/002). Jelenleg helyesen kizárva. |
| LR-6 | Felelősségbiztosítás proof | Proof owner | Trust Center kártya státusza (jelenleg helyesen kizárva). |
| LR-7 | Álláshirdetés adatkezelési notice elhelyezése | DPO | A toborzási notice + LIA prominens linkelése a career form mellé (P2-11). |
| LR-8 | Admin audit-log megőrzés/PII | Owner + DPO | Audit-trail bevezetésekor megőrzési idő + PII-minimalizálás (F-007). |

> A jelen audit **nem dönt** jogi kérdésekben — ezek owner/DPO/jogi hatáskörben maradnak.

---

## 9. Route matrix summary (verifikált, élő)

| Route-osztály | HU | EN | DE | ZH | KO |
|---|---|---|---|---|---|
| Homepage | 200 index, sitemap, hreflang | 200 index, sitemap, hreflang | 200 **noindex**, nincs sitemap/hreflang | 200 **noindex** (draft) | 200 **noindex** (draft) |
| Szolgáltatás (8 kanonikus slug) | 200 index, sitemap | 200 index, sitemap | 200 **noindex**, nincs hreflang | 404 (zárt) | 404 (zárt) |
| Legal (adatvedelem/aszf/impresszum) | 200 index, sitemap | 200 index, sitemap | 200 **noindex** | 404 | 404 |
| Hírek (index + [slug]) | 200 index, sitemap | 200 index, sitemap | 200 **noindex** | 404 | 404 |
| Trust Center | `/hu/megfelelosegi-kozpont` 200 index, sitemap | `/en/trust-center` 200 index, sitemap | 404 | 404 | 404 |
| Responsible disclosure | `/hu/felelos-hibabejelentes` 200 | `/en/responsible-disclosure` 200 | 404 | 404 | 404 |
| Recruitment privacy | `/hu/palyazoi-adatkezeles` 200 index, sitemap | `/en/recruitment-privacy` 200 index, sitemap | 404 | 404 | 404 |
| Wrong-locale slug variáns | 404 | 404 | — | — | — |
| Legacy service slug (security stb.) | 404 | 404 | 404 | 404 | 404 |
| Unknown slug | 404 | 404 | 404 | 404 | 404 |
| `/` | 308 → `/hu` | | | | |
| `/robots.txt`, `/sitemap.xml` | 200 | | | | |

**Anomália:** nincs. Nincs 500 zárt route-on, nincs soft-404, nincs noindex route a sitemapben, nincs hreflang zárt route-ra. Sitemap = 32 HU/EN URL.

---

## 10. Locale status matrix

| Nyelv | Státusz | Indexelhető | Sitemap/hreflang | Rétegek | Megjegyzés |
|---|---|---|---|---|---|
| **HU** | Teljes production | Igen | Igen | összes | Alapnyelv, x-default. |
| **EN** | Teljes production | Igen | Igen | összes | Native EN slugok (trust-center, recruitment-privacy, responsible-disclosure). |
| **DE** | Review / noindex | Nem | Nem | homepage, service, legal, news | Renderel, de zárt SEO-szempontból; final launch külön approval. |
| **ZH** | Partial / draft | Nem | Nem | csak homepage | Látható draft-disclaimer; minden más 404. |
| **KO** | Partial / draft | Nem | Nem | csak homepage | Gépi-fordítás disclaimer; minden más 404. |

Konzisztens a policyval és az `llms.txt`/`llms-full.txt` leírással (mindkettő "Indexed production languages: hu, en", DE/ZH/KO partial/noindex).

---

## 11. Trust Center proof matrix

| Proof | Státusz | Publikus? | Verifikáció |
|---|---|---|---|
| ISO 9001 (MSZ EN ISO 9001:2015) | Jóváhagyott | Igen | MartonCert Rendszertanúsító Kft., cert **843579099**; PDF-verifikált; JSON-LD + Trust Center + llms egyezik. |
| ISO/IEC 27001 (MSZ ISO/IEC 27001:2023) | Jóváhagyott | Igen | MCert Rendszertanúsító Kft., cert **988960032**; PDF-verifikált. |
| Vagyonvédelmi működési engedély | Proof-safe claim | Igen (llms/regulated activities) | 01030-822/4926-7/2023. |
| D&B AA High Creditworthy 2026 | Wording jóváhagyott, **kártya pending_review** | Claim igen, Trust Center kártya **nem** | `verified_claims.md:139` jóváhagyja a wordinget; `inclusion_matrix` kizárja a kártyát. Konzisztens. |
| Felelősségbiztosítás | `pending_review` | Nem | Helyesen kizárva az MVP-ből. |
| AutoWallis Pest referencia | Jóváhagyott | Igen | Proof-safe, nincs testimonial/teljesítményállítás; HU/EN/DE. |
| Magánnyomozás | Jogi/regulatory infó | Csak Trust Center "regulated activities" | Nem szolgáltatás, nincs dropdown/CTA. |
| DPO kontakt (Csegény Fanni) | Publikus | Igen | dpo@afm.hu, konzisztens. |
| Aláírt PDF / DPA / SCC / LIA | Internal | Nem | Helyesen nem publikus. |

---

## 12. Recommended sprint order

**Sprint 1 — Governance & quick wins (P1 + alacsony kockázatú gyorsjavítások).** Owner/DPO bevonással:
1. **Válaszidő-döntés** (LR-1) → ennek mentén F-001…F-004 egységes kezelése (ÁSZF×3, 2 service, llms-full, verified_claims).
2. Toborzási DPO sign-off rögzítése (F-005) + GA4 account-oldali evidencia review indítása (F-006).
3. Quick fixek: `.env.local.staging.backup` törlés + staging cred rotáció (P2-16); WebSite `inLanguage` → hu/en (P2-01); duplikált playwright dep (P3-07); doc-dátumok (F-008, P2-14); robots AI-crawlerek (P2-02).

**Sprint 2 — UX/admin/security hardening (P2):**
4. Trust Center a footerbe (P2-08); `/admin/login` rate-limit (P2-09); services reorder tranzakció (P2-10); álláshirdetés notice linkelése (P2-11).
5. Admin audit-trail (F-007) — additív, low-risk; owner-döntés a megőrzésről.
6. Rollback/emergency runbook (P2-13); Lighthouse/axe QA script (P2-12).

**Sprint 3 — GEO & content depth (P3 + tartalmi program):**
7. FAQ-korpusz szolgáltatásonként + `llms-full.txt` FAQ szekció (P3-03/04).
8. Beszerzés-fókuszú service guide-ok HU/EN (GEO citation opportunity).
9. Maradék polish: SVG logo optimalizálás (P3-05), upload retry (P3-06), news kártya `<button>` (P2-07), sitemap lastmod stratégia (P3-08).

---

## 13. Suggested next Codex prompts (NE futtasd — döntés/owner kell)

1. **(legal/proof)** „Owner megerősítette: a 2 munkanapos válaszidő [szándékos / NEM szándékos]. Ennek megfelelően [egységesítsd és dokumentáld a verified_claims-ben | távolítsd el] a megfogalmazást a HU/EN/DE ÁSZF-ből (`lib/i18n/*.ts`), a két service seed-process lépésből, az `llms-full.txt:73`-ból, és oldd fel a `verified_claims.md` ↔ `copy_strategy.md` ellentmondást. Staging-first, QA, majd jóváhagyás után prod."
2. **(legal/proof)** „Rögzítsd a toborzási adatkezelés (PL-091) DPO/jogi sign-off tényét és dátumát a `lib/recruitment-privacy-content.ts` kommentben + gate-closure doksiban; ha nem történt meg, készíts gate-checklistet."
3. **(quick fix)** „Szűkítsd a WebSite JSON-LD `inLanguage`-t `['hu','en']`-re (`app/[locale]/layout.tsx:267`), töröld a duplikált `@playwright/test` devDependency-t, és frissítsd a `code_architecture.md` / `staging_runbook.md` Last-updated dátumát."
4. **(quick fix)** „Add a Trust Centert a footer legal-linkekhez locale-specifikus sluggal (`lib/locale-ui-helpers.ts` getFooterLegalLinks), és bővítsd a `robots.ts` AI-crawler listáját (Google-Extended, CCBot, Bytespider, anthropic-ai)."
5. **(security hygiene)** „Töröld a `.env.local.staging.backup`-ot, és rotáld a staging Blob tokent + Neon jelszót; ellenőrizd, hogy a Blob token nem közös a production storage-dzsal."
6. **(runtime / backlog)** „Tervezd meg az admin audit-log táblát (id, adminEmail, action, entityType, entityId, change, ts) megőrzési + PII-minimalizálási policyval; implementáld a sikeres mutációk naplózását a `_actions.ts` fájlokban."
7. **(content program / GEO)** „Készíts 5-8 tételes, beszerzés-fókuszú FAQ-korpuszt szolgáltatásonként (HU/EN), kösd be FAQPage schemával és az `llms-full.txt` FAQ szekciójába."

---

## 14. Futtatott ellenőrzések (read-only)

| Parancs | Eredmény |
|---|---|
| `git branch / status / log / diff --check` | main, tiszta (csak az audit fájl untracked), diff-check tiszta |
| `npm run lint` | clean |
| `npx tsc --noEmit` (build-en belül) | clean |
| `npm run test` | **91 pass / 0 fail** |
| `npm run qa:copy` | PASS (192 fájl, 28 check) |
| `npm run build` | OK (Next 16.2.6 Turbopack, 75 statikus oldal) |
| `npm run qa:preview -- https://www.afm.hu --allow-production` | **422 check PASS** |
| `npm run qa:analytics -- https://www.afm.hu --allow-production` | **16 Playwright teszt PASS** |
| `curl.exe` live route/header/llms/canonical próbák | lásd dimenziónkénti evidencia |

**Nem futtatott** (tiltás szerint): DB apply, migration, seed apply, prod update apply, deploy, `.env.local`/`.gitignore` módosítás.

---

## 15. Audit módszertan jegyzet

- 16 read-only finder agent (struktúrálisan nem tud írni/szerkeszteni) → 186 megfigyelés.
- Minden P0/P1-et **független verifier** ellenőrizte más módszerrel (source↔live). Ez érdemben korrigált: 1 P0→P2, 2 "P1"→pozitív, 1 P1→false-positive, 1 P1→P2.
- A fő tételeket (válaszidő, .env titkok, sitemap lastmod, CSP, inLanguage, D&B, ISO 27001) **kézi cross-check** is megerősítette.
- Forrás-prioritás: repo source > lokális QA > production curl > docs > korábbi auditok (csak input).
