# Avenir Facility Management Kft. — afm.hu Project Roadmap

**Verzió:** 1.0
**Készült:** 2026. április 28.
**Tulajdonos:** Várkonyi András (operatív vezetés)
**Cél:** afm.hu új B2B weboldal launch + admin felület + belső dokumentumok publikálása

---

## 🎯 STRATÉGIAI DÖNTÉSEK (Q1-Q5)

| Q | Döntés | Mit jelent |
|---|---|---|
| **Q1** | Iteratív launch (B) | 2-3 hét + post-launch iteráció |
| **Q2** | News + Partners + References CRUD (β) | minimum admin |
| **Q3** | Mind a 10 belső dokumentum (a) | szimultán szövegezés |
| **Q4** | Maximális SEO (a+b+c+d) | alapok + schema + Lighthouse + AI-search |
| **Q5** | NextAuth.js + 1 user (α) | te magad szerkeszted |
| **Q6** | Szolgáltatás-aloldalak Phase 2 | post-launch |

**Plusz döntések:**
- **MA**: Vercel staging-preview setup
- **Dokumentum-szövegezés**: Én sablont adok, te bővíted (Opció β)
- **URL-pattern**: `/hu/etikai-kodex/` vagy `/hu/compliance/` (kettő közül egy)
- **Rendering**: HTML page + PDF letöltés (mindkettő)
- **Admin**: HOLNAP-tól, MA még Vercel + Etikai Kódex sablon

---

## 📅 IDŐVONAL — 3-4 HÉT a LAUNCH-IG

### HÉT 1 (2026.04.28 — 2026.05.04)

#### MA este (2026.04.28)
- [x] 18. commit GitHub-on (commit `0ab19a1`)
- [ ] Vercel staging-preview setup ⭐
- [ ] Production env vars beállítása (RESEND_API_KEY, DATABASE_URL, ALLOWED_ORIGINS)
- [ ] vercel.json fra1 régió aktiválódik
- [ ] Smoke-test (mind 25 page 200)
- [ ] Etikai Kódex sablon (én készítem, te holnap bővíted)

#### HOLNAP (2026.04.29)
- [ ] Te: Etikai Kódex teljes szövegezés (cégspecifikus adatok)
- [ ] Claude Code: NextAuth.js v5 setup + login skeleton
- [ ] Admin layout + Dashboard skeleton
- [ ] Csegény Fanni NAIH-iktatószám várhatóan visszaérkezik

#### HÉT 1 vége (2026.05.04)
- [ ] Etikai Kódex DRAFT 1.0 kész
- [ ] Admin auth működik
- [ ] Admin Dashboard kész
- [ ] News CRUD modul indítása

---

### HÉT 2 (2026.05.05 — 2026.05.11)

#### Admin felület építése
- [ ] News CRUD (~3-4 óra) — create/edit/delete/publish + image-upload
- [ ] Partners CRUD (~2-3 óra) — logo-upload + sorrend
- [ ] References CRUD (~3-4 óra) — case study + kategória
- [ ] Image-upload Vercel Blob (~2-3 óra)

#### Te: Plus 4 dokumentum (PRIO 2)
- [ ] Whistleblowing Policy
- [ ] Anti-Corruption Policy
- [ ] Minőségbiztosítási Politika (ISO 9001-ből)
- [ ] Munkavállalói Titoktartási Kódex (SzVMt. + Vbt.)

#### SEO alapok
- [ ] Google Search Console setup + sitemap submit
- [ ] Bing Webmaster Tools setup
- [ ] Yandex Webmaster setup
- [ ] Google Business Profile (GBP)

---

### HÉT 3 (2026.05.12 — 2026.05.18)

#### SEO maximum
- [ ] Hreflang tags
- [ ] LocalBusiness schema (GBP-vel sync)
- [ ] Service schema per-szolgáltatás
- [ ] Breadcrumb schema
- [ ] Lighthouse audit + Core Web Vitals fix
- [ ] AI-search optimalizáció: `llms.txt` + markdown-mirror

#### Te: Plus 3 dokumentum (PRIO 3)
- [ ] Beszállítói Magatartási Kódex
- [ ] Környezetvédelmi Politika
- [ ] Egyenlőségi és Sokszínűségi Politika

#### LinkedIn + profizmus
- [ ] LinkedIn cégoldal verify (domain-link)
- [ ] About szöveg + tagline
- [ ] "Follow us" gomb a Footer-ben
- [ ] Press-kit / Media-kit page

#### Ügyvédi review eredménye várhatóan visszaérkezik

---

### HÉT 4 (2026.05.19 — 2026.05.25)

#### 19. commit
- [ ] Ügyvéd-finomítások beépítése
- [ ] Admin felület véglegesítés
- [ ] Belső dokumentumok integrálása website-ra (10 db × 4 locale)
- [ ] EN/DE/ZH fordítások (gépi + emberi review)

#### Production deploy
- [ ] Vercel production deploy
- [ ] DNS afm.hu cutover
- [ ] News-management: teszt-hír törlés admin-felületen
- [ ] Új-hír feltöltése: "Megújult weboldalunk + ISO 9001 + ISO 27001"
- [ ] **⭐ LAUNCH ⭐**

---

## 📋 5 PÁRHUZAMOS SÁV — RÉSZLETES SCOPE

### A) BELSŐ DOKUMENTUMOK (10 db) — szimultán szövegezés

| # | Dokumentum | Becslés | Prio | Státusz |
|---|---|---|---|---|
| 1 | Etikai Kódex | 8-15 oldal | 🔴 PRIO 1 | sablon készül MA |
| 2 | Információbiztonsági Politika | 5-8 oldal | 🔴 PRIO 1 | ISO 27001-ből |
| 3 | Adatvédelmi Alapelvek | 3-5 oldal | 🔴 PRIO 1 | GDPR-pillér |
| 4 | Whistleblowing Policy | 5-8 oldal | 🟡 PRIO 2 | EU-direktíva |
| 5 | Anti-Corruption Policy | 4-6 oldal | 🟡 PRIO 2 | B2B-tender |
| 6 | Minőségbiztosítási Politika | 3-5 oldal | 🟡 PRIO 2 | ISO 9001-ből |
| 7 | Munkavállalói Titoktartási Kódex | 4-6 oldal | 🟡 PRIO 2 | SzVMt. + Vbt. |
| 8 | Beszállítói Magatartási Kódex | 4-6 oldal | 🟢 PRIO 3 | supply-chain |
| 9 | Környezetvédelmi Politika | 3-5 oldal | 🟢 PRIO 3 | ESG |
| 10 | Egyenlőségi és Sokszínűségi Politika | 3-5 oldal | 🟢 PRIO 3 | ESG B2B-trust |

**Total**: 17-23 óra szövegezés
**URL**: `/hu/etikai-kodex/...` vagy `/hu/compliance/...` (DÖNTÉS SZÜKSÉGES)
**Rendering**: HTML page + PDF letöltés (mindkettő)
**Locale**: HU primary + EN/DE/ZH (gépi fordítás + machine-translation disclaimer)

#### Plus opcionális POST-LAUNCH
- [ ] Disaster Recovery Terv
- [ ] Incident Response Plan
- [ ] Business Continuity Plan
- [ ] Munkahelyi Egészség és Biztonság (MEBIR)

---

### B) ADMIN FELÜLET — 19. commit

#### Tech-stack
- **Auth**: NextAuth.js v5
- **DB**: Drizzle + Neon (meglévő)
- **Image-upload**: Vercel Blob
- **UI**: meglévő design-system

#### Modulok
- [ ] Auth + Login (~3-4 óra) — 1 user (te)
- [ ] Dashboard home (~1-2 óra) — info-cards
- [ ] News CRUD (~3-4 óra) — create/edit/delete/publish + image-upload
- [ ] Partners CRUD (~2-3 óra) — logo-upload + sorrend
- [ ] References CRUD (~3-4 óra) — case study + kategória
- [ ] Image-upload Vercel Blob (~2-3 óra)

**Total**: 14-20 óra

---

### C) SEO MAXIMUM — Q4 a+b+c+d

#### C.1 Alapok (~2-3 óra)
- [ ] Google Search Console setup + sitemap submit
- [ ] Bing Webmaster Tools setup
- [ ] Yandex Webmaster setup
- [ ] Google Business Profile (GBP) setup
- [ ] GBP: posts, photos, services, reviews (folyamatos)

#### C.2 Schema + technikai (~3-4 óra)
- [ ] Hreflang tags
- [ ] LocalBusiness schema
- [ ] Service schema per-szolgáltatás
- [ ] Breadcrumb schema
- [ ] Review schema (ha van)
- [ ] JobPosting schema (karrier-page-en)
- [ ] Article schema (news-en)

#### C.3 Lighthouse + Core Web Vitals (~5-7 óra)
- [ ] Lighthouse audit (home + 3 legal + 9 szolgáltatás)
- [ ] LCP optimalizálás
- [ ] CLS fix
- [ ] INP responsiveness
- [ ] Bundle-size analyzer
- [ ] Image optimization (további WebP-conversions)

#### C.4 AI-search optimalizáció (~7-10 óra)
- [ ] `llms.txt` fájl a /public-ben
- [ ] `llms-full.txt` (kiterjesztett)
- [ ] Markdown-mirror a publikus oldalakra
- [ ] AI-friendly sitemap
- [ ] Semantic HTML5 finomítás
- [ ] Author + Publisher schema
- [ ] knowsAbout bővítés
- [ ] Expertise area-k per-engedély
- [ ] GEO-data (EU + Hungary + Budapest XX-XXII district)

**Total SEO**: 17-24 óra

---

### D) LINKEDIN + PROFIZMUS

- [ ] LinkedIn cégoldal verify (domain-link)
- [ ] About szöveg + tagline
- [ ] Banner-grafika (külső designer)
- [ ] "Follow us" gomb a Footer-ben
- [ ] Press-kit / Media-kit page
- [ ] Karrier-alap-page (statikus)
- [ ] Brochures / PDF letöltés

**Total**: 8-12 óra

---

### E) DEPLOY + LAUNCH

- [ ] Vercel staging-preview setup ⭐ MA
- [ ] Production env vars (RESEND, DATABASE, ALLOWED_ORIGINS)
- [ ] vercel.json fra1 verify
- [ ] DNS-setup (afm.hu A-record / CNAME Vercel-hez)
- [ ] SSL-cert verify (Vercel auto)
- [ ] Smoke-test mind 25+ page
- [ ] News-management: teszt-hír törlés + új-hír
- [ ] Production deploy
- [ ] Post-launch monitoring (első 24-48 óra)

---

## 🔵 PHASE 2 — POST-LAUNCH (1-3 hónap)

### Szolgáltatás-aloldalak (9 db × 4 locale = 36 page)

| Aloldal | Path | Becslés |
|---|---|---|
| Őrzés-védelem | `/hu/szolgaltatasok/orzes-vedelem` | 2-3 óra |
| Vagyonvédelmi rendszer | `/szolgaltatasok/vagyonvedelmi-rendszer` | 2-3 óra |
| Magánnyomozás | `/szolgaltatasok/magannyomozas` | 2-3 óra |
| Takarítás | `/szolgaltatasok/takaritas` | 1-2 óra |
| Épületüzemeltetés | `/szolgaltatasok/epuletuzemeltetes` | 1-2 óra |
| Portaszolgálat | `/szolgaltatasok/portaszolgalat` | 1-2 óra |
| Zöldterület-kezelés | `/szolgaltatasok/zoldterulet-kezeles` | 1-2 óra |
| Technikai karbantartás | `/szolgaltatasok/technikai-karbantartas` | 1-2 óra |
| Mystery Shopping | `/szolgaltatasok/mystery-shopping` | 2-3 óra |

**Total Phase 2 szolgáltatások**: 14-22 óra (HU) + 4× locale fordítás

### Plus Phase 2
- [ ] CSP implementáció
- [ ] News modal WCAG (focus-trap + Escape)
- [ ] Cookie-banner (ha cookie audit kéri)
- [ ] Monitoring (Sentry + Vercel logs alert)
- [ ] CI/CD GitHub Actions
- [ ] Upstash KV rate-limit (ha skálázódik)
- [ ] Footer color-contrast 0.55 → AAA
- [ ] DE/ZH human-grade translation review (külső)
- [ ] README.md M6 rewrite
- [ ] Karrier-page bővítés (job postings)
- [ ] Case study oldalak
- [ ] GYIK / FAQ szakasz (a JSON-LD-ben már van adat)
- [ ] CRM-integráció
- [ ] Email-marketing (newsletter)
- [ ] Whistleblowing csatorna platform (250+ alkalmazott)

---

## ⚖️ JOGI HÁTTÉR

### Ügyvédi review (folyamatban)
- **Indítás**: 2026.04.28
- **Várható eredmény**: 2026.05.05 — 2026.05.18
- **Csomag**: privacy + ÁSZF + impresszum + microcopy + cégadatok + engedélyek + DPO + DPA-k + AI-review

### NAIH-bejelentés
- **DPO**: Csegény Fanni
- **Email**: dpo@afm.hu
- **Telefon**: +36 70 622 6242
- **Bejelentés**: Infotv. 25/L. § alapján Ügyfélkapun
- **Várható iktatószám**: 2026.04.29-30

### Tanfolyam
- **Csegény Fanni GDPR-tanfolyam**: 2026. június

---

## 📊 STATUS — 2026.04.28

| Kategória | Készültség |
|---|---|
| **Fejlesztés (kód)** | 95% ✅ |
| **Jogi-tartalom** | 90% ⏳ (ügyvédi review hátra) |
| **Deploy-prep** | 70% ⏳ (Vercel staging hátra) |
| **NAIH-bejelentés** | 80% ⏳ (Csegény Fanni befejezi) |
| **Admin felület** | 0% ⏳ (HOLNAP-tól) |
| **Belső dokumentumok** | 0% ⏳ (MA-HOLNAP) |
| **SEO maximum** | 30% ⏳ (alapok HÉT 2-3) |
| **LinkedIn + profizmus** | 0% ⏳ (HÉT 3) |
| **Production-launch** | 60% ⏳ (HÉT 4) |
| **Post-launch (Phase 2)** | 0% 🔵 |

**Total deploy-readiness**: ~80%

---

## 🎯 KÖVETKEZŐ KONKRÉT LÉPÉS

**MA este**: Vercel staging-preview setup (~60-90 perc)
**HOLNAP reggel**: Te: Etikai Kódex szövegezés
**HOLNAP délután**: Claude Code: Admin auth + skeleton

---

## 📞 ELÉRHETŐSÉGEK

| Szerep | Név | Email | Telefon |
|---|---|---|---|
| **Ügyvezető** | Kovács Attila | info@afm.hu | +36 70 312 5868 |
| **Operatív vezetés** | Várkonyi András | info@afm.hu | +36 70 316 8218 |
| **DPO** | Csegény Fanni | dpo@afm.hu | +36 70 622 6242 |
| **Általános** | — | info@afm.hu | +36 70 316 8218 |

---

## 🔄 VERZIÓTÖRTÉNET

| Verzió | Dátum | Megjegyzés |
|---|---|---|
| 1.0 | 2026.04.28 | Első kiadás — Q1-Q5 döntések alapján |

---

**Frissítendő**: minden fontos döntés után. Commit-elendő a repó-ba.
