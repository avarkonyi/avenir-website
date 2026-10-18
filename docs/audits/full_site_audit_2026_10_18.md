# Avenir teljes éles audit — 2026-10-18

Auditált kiadás: **https://www.afm.hu**, Vercel production `dpl_FVGmrdFmBhLAMniZp5ZtE8i5Awt4`, commit `9b767ef`
(PR #2: SEO-publikálási konzisztencia, francia, koreai és kínai review-fordítások). Előző éles build: `8f9bba4` (2026-06-14).

Terület: kód és biztonság, technikai SEO, AI-keresés / GEO / strukturált adatok, valamint a látható szöveg
**minden nyelven (HU, EN, DE, FR, ZH, KO) mondatonként**.

Az audit csak olvasott: nem módosított kódot, nem írt adatbázisba, nem küldött be űrlapot, és nem fogadott el analitikai hozzájárulást.
A nyers megállapítások, a bizonyítékok és a teljes élő szövegkorpusz a [`2026-10-18/`](2026-10-18/) mappában van.

---

## 1. Összefoglaló

**Ítélet: az oldal élőben működik, P0 (azonnali leállást vagy jogi kárt okozó) hiba nincs.**
Van viszont **10 P1-es téma** (18 nyelvenkénti P1-tétel), és ezeket nem érdemes a következő tartalmi körig hagyni:

- 2 **adatvédelmi** tétel (CODE-001: személyes adat kerülhet a naplóba; az ajánlatkérő ablakban nincs adatkezelési tájékoztató);
- 1 **lejárt jogi adat** (nemzetbiztonsági névjegyzék, felülvizsgálat 2026-06-30);
- 7 **túlzó vagy nem igazolt szöveges állítás**. Ezek többsége már az október 17-i szövegauditban is nyitott tétel volt (KNOWN), csak még nem került élesbe javítás.

A júniusi fő hibák (F-001…F-004, a fix „2 munkanapos” válaszidő) **élőben javultak** mind a 6 nyelven.
Az indexelési modell helyes: csak a HU/EN indexelhető, a 38 review-oldal (DE/FR/ZH/KO) mind `noindex`, nincs a sitemapben és a hreflangban.
A 48 régi szolgáltatás-slug mind 404-et ad, és belső törött link nincs.

| Terület | Megállapítás (csoportosítva) | P0 | P1 | P2 | P3 | Új | Ismert |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Kód és biztonság (`CODE`) | 19 | 0 | 1 | 4 | 14 | 13 | 6 |
| Technikai SEO (`SEO`) | 19 | 0 | 0 | 6 | 13 | 14 | 5 |
| AI / GEO / schema (`AIGEO`) | 24 | 0 | 1 | 6 | 17 | 14 | 10 |
| Szöveg — magyar (`COPY-HU`) | 37 | 0 | 6 | 14 | 17 | 21 | 16 |
| Szöveg — angol (`COPY-EN`) | 38 | 0 | 4 | 14 | 20 | 19 | 19 |
| Szöveg — német (`COPY-DE`) | 39 | 0 | 3 | 9 | 27 | 14 | 25 |
| Szöveg — francia (`COPY-FR`) | 26 | 0 | 1 | 2 | 23 | 21 | 2 |
| Szöveg — koreai (`COPY-KO`) | 29 | 0 | 1 | 12 | 16 | 19 | 10 |
| Szöveg — kínai (`COPY-ZH`) | 20 | 0 | 1 | 4 | 15 | 17 | 1 |
| **Összesen** | **251** | **0** | **18** | **71** | **162** | **152** | **94** |

Megjegyzés: a nyelvi auditorok az azonos hibákat oldalakon át, az ismert sorokat pedig csoportosan rögzítették,
ezért egy sor több előfordulást vagy több ismert azonosítót is lefedhet. Az „Ismert” oszlop az
`2026-10-17/text-audit-open-items.csv` nyitott soraira, illetve a júniusi auditra hivatkozik.

## 2. Lefedettség és módszer

- **Crawl:** Playwright-renderelés, 76 élő URL (6 nyelv), a sitemap mind a 32 URL-je. Oldalanként rögzítve: státusz, robots, X-Robots-Tag,
  canonical, hreflang, OG/Twitter, H1 és címsorok, teljes JSON-LD (636 node), linkek, látható szöveg.
  Kiegészítésként a nyelvenkénti consent-sáv, űrlapcímkék, placeholderek, opciók, aria-labelek, alt-szövegek és a lokalizált 404.
- **Szöveg:** nyelvenként egy auditor olvasta végig a teljes korpuszt (HU kb. 1900, EN kb. 1750, DE kb. 1560, FR kb. 680+143, KO és ZH kb. 850–900 szegmens).
  Ide tartoztak a JSON-LD-ből kiolvasott, csukott GYIK-válaszok (71–73 db) és a nem renderelt forrásszövegek is
  (`lib/i18n/*.ts`, e-mail-sablonok, hibaüzenetek, az ajánlatkérő ablak).
  A nem magyar szövegeket mondatonként vetették össze a magyar oldallal.
- **Kód:** a kiadás teljes kódkülönbsége (`75b2cd7..9b767ef`, 106 nem-docs fájl), valamint az admin, a contact API, a feltöltés, a CSP, a consent, a QA-eszközök és a CI.
- **Nem lefedett:** a beküldött űrlapok siker- és hibaállapota (csak forrásból), az admin felület böngészőben, Lighthouse és Core Web Vitals mérés,
  a Search Console és a GA4 fiókbeállításai, valamint külső nyilvántartások lekérdezése.

## 3. P1 témák (deduplikálva)

### P1-1 — Személyes adat a szervernaplóban, ha a kapcsolatfelvételi mentés elbukik — **ÚJ** (CODE-001)
- **Hol:** `app/api/contact/route.ts:143-151`, továbbá a válaszmentés útja (`sendReply`).
- **Bizonyíték:** a drizzle-orm 0.45.2 `DrizzleQueryError` üzenete `Failed query: … params: …` formájú
  (`node_modules/drizzle-orm/errors.js:11-13`), a paraméterek pedig maguk az űrlapmezők: név, cég, e-mail, telefon, üzenet.
  A `sanitizeDbErrorMessage` (`lib/db/redact.ts`) csak az adatbázis-URL-t és a jelszót takarja ki.
  A naplósor ráadásul kifejezetten azt állítja: „Personal form fields were not logged.”
  A kód alapján igazolt. A valódi naplókat nem néztük meg.
- **Kockázat:** adatbázis-kimaradáskor (júniusban és októberben is volt Neon `fetch failed`) a látogatók adatai a Vercel naplóba kerülhetnek.
  Ez ellentmond az adatkezelési tájékoztatónak és az adattakarékosságnak.
- **Javítás:** a naplóba csak az `err.name`, `err.cause?.code` és az osztályozott hibatípus kerüljön, a `.message` soha.
  Ugyanez kell a `safe-action-error.ts` és a news-lekérdezések naplózásába is.
- **Döntés:** a DPO-val egyeztetve érdemes megnézni a Vercel runtime naplókat, hogy volt-e `[contact] db-insert failed` sor a megőrzési időn belül.

### P1-2 — Az ajánlatkérő ablakból hiányzik az adatkezelési tájékoztató — ISMERT (EDU-020; COPY-HU-006, COPY-KO-004, COPY-DE-012)
- **Hol:** mind a 8 szolgáltatásoldal, minden nyelven, az indexelt HU/EN oldalakon is (`components/ServiceQuoteCta.tsx:334-470`).
- **Bizonyíték:** az ablak nevet, e-mailt, telefont, cégnevet és üzenetet kér, de nincs benne link a tájékoztatóra.
  A főoldali űrlapon van: „A küldéssel tudomásul veszi az Adatkezelési tájékoztatót.”
- **Javítás:** ugyanaz a mondat és ugyanaz a `getContactPrivacyHref(locale)` link az ablak gombjai alá. Opcionálisan a különleges adatokra vonatkozó figyelmeztetés is.

### P1-3 — Lejárt nemzetbiztonsági névjegyzék-felülvizsgálati dátum — ISMERT (HUA-002, HUB-002, ENB-008, DEB-018; AIGEO-001)
- **Hol:** `/hu|en|de/impresszum` 6. d), `/hu|en|de/aszf` 5. d); forrás: `lib/seo-data.ts` `SEO_LICENSES[3]`.
- **Bizonyíték:** „Érvényesség felülvizsgálat: 2026-06-30” / „felülvizsgálat 2026.06.30-ig kötelező” / „review required by 30 June 2026”.
- **Javítás:** a tulajdonos szerint van új, 2029-ig érvényes határozat. Ennek **pontos számát és dátumát** be kell írni a `SEO_LICENSES[3]`-ba.
  Addig a felülvizsgálati sort el kell hagyni, nem a lejárt dátumot mutatni.

### P1-4 — Túlzó 24/7 távfelügyeleti állítások — ISMERT (HUA-005, ENS-001/004, DES-002/006, FRS-001, KOS-004; EN-ben részben ÚJ)
- **Hol:** a `tavfelugyelet-vonuloszolgalat` oldal bevezetője, bizalmi kártyái és GYIK-je minden nyelven; a DE főoldali kártya és az `ItemList` JSON-LD.
- **Bizonyíték:** HU: „Az Avenir 24/7 jelzésfogadást biztosít…”, „minden jelzés ellenőrzött eszkalációs folyamatba kerül”.
  EN: „Avenir operates 24/7 monitoring…”. DE: „24/7-Leitstelle”, „aufgeschaltete Standorte”.
  FR: „Le centre de supervision d’Avenir traite 24 h/24…”. KO: „24/7 관제 지원”.
  EN főoldal: „24/7 Dispatcher availability” (COPY-EN-004, ÚJ).
- **Jóváhagyott forma (verified_claims):** „24/7 diszpécseri háttér”. Felügyeleti központot, minden jelzés kezelését vagy jelzésfogadás biztosítását nem állíthatjuk.
- **Javítás:** a nyelvenkénti cseremondatok a nyers fájlokban vannak. Előtte **tulajdonosi döntés** kell a HUA-005 szerinti magyar alapmondatról.

### P1-5 — A CMS főoldali szolgáltatáskártyák nem a magyar szöveg fordításai — ISMERT (EDU-003/004/007/017, FKZ-004; COPY-DE-003, COPY-ZH-018)
- **Hol:** a `/de` és `/zh` szolgáltatáskártyái és az `ItemList` JSON-LD minden DE/ZH oldalon.
  A szöveg az adatbázisból jön, a forrásban már van javított szöveg.
- **Bizonyíték:** DE „Personen- und Sachschutz”, „Planung, Installation und Wartung”. ZH „人身及财产安全保护”, „设计、安装与维护”.
- **Javítás:** **adatbázis-javítás staging-first** módon. A korábbi `staging-text-corrections-proposal.json` (14 mező) bővítése és alkalmazása
  stagingen, ellenőrzés, majd jóváhagyás után production. Ide tartozik a CODE-018 is: a production DB-ben még ott van a visszavont
  „1–3 munkanapon belül” mondat, az élő oldal csak egy futásidejű szövegcsere miatt nem mutatja.

### P1-6 — Csak németül létező DSGVO-mondat és két jogi GYIK — ISMERT (DES-003/004; COPY-DE-001)
- **Hol:** `/de/szolgaltatasok/biztonsagtechnika`, bevezető 3. bekezdés, GYIK [9] és [10], a FAQPage JSON-LD-ben is (DE 11 kérdés, HU 9).
- **Bizonyíték:** „— im Einklang mit den Grundsätzen der DSGVO und dem in Ungarn anwendbaren Rechtsrahmen.”
  Ez megfelelési ígéretként olvasható, holott az AGENTS.md ezt tiltja.
- **Javítás:** a betoldás és a két GYIK törlése (a forrás `lib/services/de-service-details.ts`).

### P1-7 — Nem igazolt tapasztalati állítás a főoldalon — **ÚJ** (COPY-HU-002)
- **Hol:** `/hu` „Az Avenirről” (`lib/i18n/hu.ts` `aboutText`), és ennek fordításai.
- **Bizonyíték:** „…vezetői csapata és szakemberei több évtizedes tapasztalattal rendelkeznek…”. Nincs benne a `verified_claims.md`-ben.
- **Javítás:** tulajdonosi megerősítés és rögzítés a `verified_claims.md`-ben, vagy enyhítés:
  „vezetői és kulcsmunkatársai hosszú szakmai múlttal rendelkeznek…”.

### P1-8 — „Igen” az engedélyekre vonatkozó GYIK-ben, bizonyíték nélkül — ISMERT (HUA-016; COPY-HU-004)
- **Hol:** `/hu/szolgaltatasok/tavfelugyelet-vonuloszolgalat`, GYIK[4] és FAQPage JSON-LD, valamint a fordítások.
- **Javítás:** tulajdonosi vagy jogi megerősítés kell. Enélkül: „A szolgáltatást az alkalmazandó magyar személy- és vagyonvédelmi szabályozás szerint nyújtjuk;
  az engedélyadatok az Impresszumban érhetők el.”

### P1-9 — „Többnyire még aznap visszajelzünk” — ISMERT (HUA-019; COPY-HU-005)
- **Hol:** a főoldali űrlap segédszövege és az ajánlatkérő ablak (HU/EN/DE/FR). A KO főoldalról viszont hiányzik a következő munkanapos mondat (COPY-KO-021).
- **Kérdés:** a `verified_claims.md` csak a „legkésőbb a következő munkanapon” formát rögzíti.
  Ha a „többnyire még aznap” is tulajdonosi döntés, rögzíteni kell. Ha nem, törölni kell.
  Kapcsolódik: a DE „Werktag” szóban benne van a szombat is, miközben ugyanazon az oldalon „8 Arbeitstagen” szerepel (COPY-DE-005, tesztben rögzítve).

### P1-10 — Angol tényállítások, amelyek a magyarban csak lehetőségek — ISMERT (ENS-002, ENS-003)
- `/en/szolgaltatasok/portaszolgalat`: „Visitor and access data are handled with purpose limitation, time-limited retention…”
  Ez tényként állítja az adatkezelést, a magyar szöveg csak szempontként említi.
- `/en/szolgaltatasok/soft-fm`: „During the first month…”. A magyar szöveg „első működési időszakot” mond.
- Ugyanez a minta, ÚJ előfordulásokkal: COPY-EN-021 („Reactive jobs are classified…”, „Avenir defines what information must be recorded…”).

## 4. A júniusi audit (F-001…F-008) állapota élőben

| Azonosító | Téma | Állapot 2026-10-18 |
| --- | --- | --- |
| F-001 | Fix 2 munkanapos válaszidő az ÁSZF-ben | **Javítva élőben** (HU/EN/DE: „legkésőbb a következő munkanapon”) |
| F-002 | 2 munkanap a szolgáltatásoldalak folyamatszövegében | **Javítva élőben**, de csak futásidejű szövegcserével. A DB-ben még régi szöveg van (CODE-018) |
| F-003 | `llms-full.txt` „2-working-day” | **Javítva** |
| F-004 | `verified_claims.md` ↔ `copy_strategy.md` ellentmondás | **Javítva** (`verified_claims.md:48`, `:171-172`) |
| F-005 | Toborzási tájékoztató DPO-kapuja nincs dokumentálva | **Nyitott**: a `recruitment-privacy-review.md` és a kódkomment még függőben lévő aláírást mutat |
| F-006 | GA4 adatfeldolgozói szöveg DPO-jóváhagyása | **Nyitott** (`google-analytics-processor-review.md`) |
| F-007 | Nincs admin audit trail | **Nyitott** (CODE-005) |
| F-008 | `staging_runbook.md` dátuma | **Nyitott** (még mindig 2026-05-28) |

A júniusi P2-ből még nyitott: WebSite `inLanguage` (SEO-005, AIGEO-003, CODE-004; most már az `fr`-t is tartalmazza),
a Trust Center árva oldal (SEO-002, AIGEO-006), és a 60 karakternél hosszabb hírcímek.

## 5. P2 kiemelések területenként

**Kód**
- CODE-002: a build továbbra is leáll bármilyen átmeneti DB-hiba esetén. Októberben is előfordult (Preview, Neon `fetch failed`).
  Az élő oldal ilyenkor nem áll le, de a kiadás elakad. Javaslat: csak olvasó lekérdezésekre újrapróbálás, egy build előtti DB-ébresztés és a layout-adatok gyorsítótárazása.
  Ha az újrapróbálás után is hiba van, a build továbbra is álljon le, mert így marad meg a „nincs hiányos szolgáltatásréteg” garancia.
- CODE-003: a `qa:preview` mátrix a régi nyelvi szabályt kódolja. Ebből jön az éles smoke 16 téves hibája (ZH/KO szolgáltatásoldal 200),
  és nincs benne sem FR-, sem ZH/KO/FR noindex-ellenőrzés. **Maga az élő oldal helyesen működik.**
- CODE-004: `inLanguage`. CODE-005: admin audit trail.

**Technikai SEO**
- SEO-001: a `/hu/felelos-hibabejelentes` és az `/en/responsible-disclosure` indexelhető, de nincs a sitemapben. A x-default az EN-re mutat, minden más párnál a HU-ra.
- SEO-002: a Trust Center (`/hu/megfelelosegi-kozpont`, `/en/trust-center`) árva oldal: se navigáció, se lábléc, se főoldali link nem mutat rá.
- SEO-003: a főoldalakon és a hírcikken kívül egyik oldalon sincs `og:image`, `og:locale` és `twitter:image`. A 15 jogi és Trust Center oldal `twitter:title`-je a főoldal címe.
- SEO-004 (és COPY-HU-015, COPY-EN-001, COPY-EN-002): a jogi oldalak meta leírása 160 karakternél szó közepén vágódik el („…during the c”).
  Az EN Legal Notice leírásában „Kft..” szerepel.
- SEO-006: a smoke-mátrix elavult (lásd CODE-003). Az AGENTS.md, a README és a runbook is a régi „ZH service 404” szabályt írja.

**AI / GEO / schema**
- AIGEO-002: mindkét `llms` fájl azt írja, hogy a DE/FR/KO/ZH review-oldalak talán nincsenek élesben, pedig élesben vannak (noindex).
- AIGEO-004: az `iso6523Code "0190:01-09-328046"` a holland OIN-séma kódja, a magyar cégjegyzékszámhoz nem használható. Helyette `PropertyValue` azonosító kell (`lib/seo-data.ts:40`).
- AIGEO-005: a Service `areaServed` értéke kódba égetve „Magyarország” az EN és minden más nyelvű oldalon (`app/[locale]/szolgaltatasok/[slug]/page.tsx:229`).
- AIGEO-007: a HU/EN főoldalon nincs egy jól idézhető mondat arról, hogy ki, mit és hol csinál; a teljes cégnév és az ország sem szerepel a fő szövegben.

**Szöveg (a teljes lista a nyers fájlokban)**
- HU: vonzatnyelvtani hiba az objektumőrzés GYIK-ben; névelő nélküli „Avenir …” mondatok; „megfigyelés” a Próbavásárlás oldalon (a szabály szerint kerülendő);
  az AutoWallis-kártya leíró szövege nincs jóváhagyva; tegezés a Karrier részben; a Jogi nyilatkozatok harmadik feles listájából hiányzik a GA4.
- EN: a Legal Statements 4. pont „written” betoldása, ami a magyar jogi szövegben nincs; háromféle 24/7 diszpécser-kifejezés; a cégadatok címkéi és formátumai eltérnek.
- DE: a „Verwandte Leistungen” kártyák harmadik, nem HU-hű leírást mutatnak (COPY-DE-011); hibás DSGVO-terminus („Vertreter”); vegyes du/Sie forma a karrier részben, és hiányzik az (m/w/d).
- FR: a Soft FM „prestations sanitaires” egészségügyi szolgáltatásnak olvasható, helyesen „hygiène des sanitaires”.
- KO: a lábléc „이용약관” (felhasználási feltételek) néven hivatkozik a Jogi nyilatkozatokra; a távfelügyeleti bevezető szerint minden jelzés eszkalálódik; a karrier szövegben rossz a szerepkör és a hatókör.
- ZH: a próbavásárlás bizalmi kártyája elvesztette a „nem megfigyelés” biztosítékot; a távfelügyeleti kártyából kimaradt a verifikáció és az eszkaláció;
  a karrier helyszíne szűkebb a magyarnál; a lábléc két jogi címkéje fel van cserélve.

## 6. Ellenőrizve és rendben

- Éles smoke (`qa:preview`): 422 ellenőrzés. 406 PASS, a 16 FAIL a mátrix hibája (ZH/KO review szolgáltatásoldalak szándékosan 200 + noindex).
- Analytics QA élesben (`qa:analytics`): **16/16 PASS**. GA4 csak hozzájárulás után töltődik be, az elutasítás megmarad,
  az események nem tartalmaznak személyes adatot, a magánnyomozás nem szerepel a legördülő listában, a CSP nem enged Ads/DoubleClick végpontot.
- Helyi ellenőrzések a `9b767ef`-en: ESLint, `tsc --noEmit`, unit tesztek, copy guard (220 fájl, 33 szabály): mind PASS.
- Indexelés: a sitemap, a canonical és a hreflang teljesen konzisztens. A 38 review-oldal noindex, hreflang nélkül, és nincs a sitemapben. A 48 régi slug 404.
  Nincs törött belső link, a júniusi statikus `lastmod`-hiba javult.
- Schema: mind a 636 JSON-LD node értelmezhető. FAQPage csak látható GYIK mellett van. ISO-, D&B- és engedélyadatok egyeznek a `verified_claims.md`-vel.
  A cégadatok minden forrásban azonosak. A `security.txt` érvényes 2027-06-10-ig. A robots.txt engedi az AI-crawlereket, a `/admin`-t és az `/api`-t tiltja.
- Megfelelés: nincs EcoVadis-állítás, nincs GDPR-megfelelési ígéret (a P1-6 kivétellel), a magánnyomozás csak jogi tényként szerepel, és nincs AOS-kód a weboldalon.
  Az admin szerverakciók mind újraellenőrzik az engedélylistát, a feltöltés és az űrlapvalidáció rendben van.

## 7. Döntési lista (tulajdonos, jogi szakértő, DPO)

1. **Új nemzetbiztonsági határozat** pontos száma és dátuma (P1-3).
2. **Távfelügyeleti alapmondat** a HUA-005 szerint (P1-4), utána mind az 5 nyelv igazítása.
3. **„Több évtizedes tapasztalat”**: igazolható-e, vagy enyhítjük (P1-7).
4. **Engedély-GYIK „Igen”** megerősítése (P1-8).
5. **„Többnyire még aznap”**: marad és rögzítjük, vagy törlődik (P1-9). Ehhez kapcsolódik a DE „Werktag/Arbeitstag” kérdés.
6. **DPO:** az F-005 (toborzási tájékoztató) és az F-006 (GA4 adatfeldolgozó) írásos lezárása; a Vercel-naplók átnézése a CODE-001 miatt.
7. **Referenciák:** az AutoWallis jogi neve és leíró szövege nyilvánosan maradhat-e (COPY-HU-010, HUB-025).

## 8. Javasolt sorrend

1. **Gyors technikai javítócsomag**, kis kockázattal, preview → jóváhagyás → production:
   CODE-001 (naplózás); az adatkezelési sor az ajánlatkérő ablakba (P1-2); a DE DSGVO-betoldás törlése (P1-6);
   mondathatáron vágott vagy kézzel írt jogi meta leírások, valamint a „Kft..” javítása; a felelős hibabejelentési oldalak a sitemapbe;
   `inLanguage` csak HU/EN; az `iso6523Code` cseréje; lokalizált `areaServed`; az `llms` fájlok review-szövegének frissítése;
   a `qa:preview` mátrix frissítése FR/ZH/KO review-ellenőrzésekkel; az FR „sanitaires”, a KO és a ZH lábléc jogi címkéinek javítása.
2. **Tulajdonosi döntések** (7. pont), utána a P1-4, P1-7, P1-8 és P1-9 szövegek javítása forrásban.
3. **CMS/DB javítás staging-first módon:** a DE/ZH főoldali kártyák, a régi „1–3 munkanap” mondat (CODE-018), majd a futásidejű szövegcsere kivezetése.
4. **Build-ellenállóság** (CODE-002), utána a Trust Center belső linkjei és a megosztott metaadat-segéd (SEO-002, SEO-003).
5. A nyelvi P2/P3 tételek nyelvenként, a nyitott-tétel CSV-vel összevonva.

## 9. Futtatott ellenőrzések

| Ellenőrzés | Eredmény | Bizonyíték |
| --- | --- | --- |
| Vercel production deploy | `9b767ef` READY (az előző, `75b2cd7` ERROR volt: build közben nem volt elérhető DB) | Vercel MCP |
| `npm run lint` | PASS | `2026-10-18/checks/lint.txt` |
| `npx tsc --noEmit` | PASS | `2026-10-18/checks/tsc.txt` |
| `npm test` | PASS (0 fail) | `2026-10-18/checks/unit.txt` |
| `npm run qa:copy` | PASS (220 fájl, 33 szabály) | `2026-10-18/checks/qa-copy.txt` |
| `npm run qa:preview -- https://www.afm.hu --allow-production` | 422 ellenőrzés, 16 FAIL (elavult mátrix, lásd CODE-003) | `2026-10-18/checks/qa-preview.txt` |
| `npm run qa:analytics -- https://www.afm.hu --allow-production` | 16/16 PASS | `2026-10-18/checks/qa-analytics.txt` |
| Playwright crawl + szövegkorpusz | 76 URL, 6 nyelv | `2026-10-18/crawl/` |
| `npm run build` | Nem futott. Production DB kellene hozzá, a helyi build nem cél ebben a körben | — |

## 10. Nyers anyag

- Megállapítások területenként (bizonyíték, javasolt szöveg, státusz, megbízhatóság): `2026-10-18/findings/{code,seo,ai-geo,copy-hu,copy-en,copy-de,copy-fr,copy-ko,copy-zh}.md`
- Élő szövegkorpusz nyelvenként: `2026-10-18/crawl/text_{hu,en,de,fr,ko,zh}.md`; URL-index: `2026-10-18/crawl/index.json`
- Előzmények: [`full_site_audit_2026_06_13_2134.md`](full_site_audit_2026_06_13_2134.md), [`2026-10-17/nyitott-tetelek.md`](2026-10-17/nyitott-tetelek.md)
