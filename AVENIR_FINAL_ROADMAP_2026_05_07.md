# Avenir vegleges dontesi roadmap

**Datum:** 2026-05-07  
**Cel:** egyetlen attekintheto fejlesztesi menetrend az afm.hu post-launch idoszakara.  
**Allapot:** dontesi dokumentum, nem implementacios ticketlista.  
**Forrasok:** jelenlegi repo-roadmap, production tapasztalatok, Search Console / Bing tapasztalatok, Claude audit 2026-05-07, Avenir Operating System otletek.

---

## 0. Vezetoi osszefoglalo

A jelenlegi oldal mar production-kepes es jogi/compliance szempontbol eros. A kovetkezo fejlesztesi sorrendben nem a belso rendszerrel kell kezdeni, hanem a publikus uzletszerzesi alapot kell megerositeni.

**Javasolt sorrend:**

1. Staging / preview workflow rendbetetele.
2. Szolgaltatas-aloldalak magyar MVP.
3. Referenciak es partnerek publikus megerositese.
4. Hiraloldalak es Article schema.
5. SEO / GEO / AI-search sprint.
6. Konverzios javitasok az ajanlatkereshez.
7. AOS mini-CRM dashboard es teendo-nezet.
8. OneDrive / SharePoint dokumentumgerinc.
9. Ajanlatgenerator MVP.
10. Case study / Trust Center / tenderanyagok.

**Fo dontes:** az Avenir Operating System fontos, de ne elozze meg a publikus szolgaltatas-, referencia- es SEO-reteget. Eloszor legyen tobb minosegi erkezo forgalom es bizalom, utana erdemes a belso folyamatokat melyebben automatizalni.

---

## 1. Kiindulo allapot

### Ami kesz

- Production oldal: `https://www.afm.hu`
- Locale oldalak: `/hu`, `/en`, `/de`, `/zh`
- Root redirect: `/` -> `/hu`
- Uppercase locale redirect: `/HU` -> `/hu`
- Sitemap, robots, canonical, hreflang alapok
- Google Search Console es Bing Webmaster elinditva
- Bing site verification hozzaadva
- SEO title / meta description hibak javitva
- FAQPage schema eltavolitva, mert nem volt lathato FAQ blokk
- DPO eszrevetelek alapjan javitott jogi tartalom
- `ASZF` tartalom iranya: `Jogi nyilatkozatok`
- Admin alapmodulok:
  - News
  - Messages
  - Services
  - Positions
  - Partners
  - Certifications
  - Settings
- News: tobbnyelvu publikacio, kepfeltoltes, publikus megjelenites
- Mini-CRM V1 a Messages modulban:
  - lead statusz
  - felelos
  - kovetkezo teendo
  - becsult ertek
  - helyszintipus
  - ajanlat link
  - szerzodes link
  - belso jegyzet

### Ami meg nyitott

- Staging workflow formalizalasa
- Kulon staging adatbazis
- Szolgaltatas-aloldalak
- Publikus partner/referencia megjelenites
- Hir reszletezo aloldalak
- Article schema
- Service schema reszletezese
- LocalBusiness geo es sameAs bovites
- Google Business Profile / Bing Places
- `llms.txt`, `llms-full.txt`
- Konverzios tracking-kompatibilis thank-you flow
- AOS kovetkezo retegei

---

## 2. Fejlesztesi mukodesi szabaly mostantol

### Alapelv

Minden erdemi fejlesztes stagingen indul. Main/production csak jovahagyott, tesztelt allapotot kap.

### Workflow

1. Uj branch: `feature/<tema>`
2. Vercel Preview URL
3. Kulon Neon staging DB
4. Migration eloszor staging DB-n
5. Admin es public teszt preview-on
6. Dontes: mehet / modositas / elvetes
7. Merge `main`-re
8. Production migration csak jovahagyas utan
9. Search Console / Bing ujrateszt, ha SEO-t erint

### Mindenkepp staging kell ezeknel

- DB migration
- admin mukodes
- email kuldes / Resend
- kontakt form
- SEO/canonical/robots/sitemap/schema
- jogi oldalak
- public URL struktura
- news/article routing

---

## 3. Phase 1 - Staging es fejlesztesi kontroll

**Prioritas:** P0  
**Ido:** 0.5-1 nap  
**Cel:** ne productionben kiserletezzunk.

### Feladatok

- `staging` branch vagy feature branch workflow rogzites
- Vercel Preview ellenorzes
- staging Neon DB letrehozasa
- `.env.staging` / Vercel Preview env szetvalasztasa
- migration szabaly:
  - preview -> staging DB
  - main -> production DB
- admin tesztfelhasznalo / jogosultsag ellenorzes
- egyszeru `STAGING_RUNBOOK.md`

### Kesz definicio

- Van preview URL
- Van staging DB
- Egy teszt migration lefut stagingen
- Production DB-t nem erinti preview fejlesztes
- Dokumentalt, hogyan inditunk uj fejlesztest

---

## 4. Phase 2 - Szolgaltatas-aloldalak HU MVP

**Prioritas:** P0/P1  
**Ido:** 3-5 nap az elso magyar MVP-re  
**Cel:** a szolgaltatasok ne csak kartyak legyenek, hanem keresok es B2B erdeklodok szamara kulon landing oldalak.

### Mi legyen az elso korben

Nem kell rogton 8-9 szolgaltatas x 4 nyelv. Eloszor magyar MVP:

1. `Elos objektumorzes`
2. `Recepcios es portaszolgalat`
3. `Biztonsagtechnika`
4. `Tavfelugyelet es vonuloszolgalat`
5. `Mystery Shopping es helyszini audit`
6. `Hard FM` vagy `Soft FM` - uzleti prioritas alapjan

### Javasolt URL-ek

- `/hu/szolgaltatasok/objektumorzes`
- `/hu/szolgaltatasok/portaszolgalat`
- `/hu/szolgaltatasok/biztonsagtechnika`
- `/hu/szolgaltatasok/tavfelugyelet-vonuloszolgalat`
- `/hu/szolgaltatasok/mystery-shopping-helyszini-audit`
- `/hu/szolgaltatasok/hard-fm`

### Oldalszerkezet

Minden szolgaltatas-oldal:

- H1: konkret szolgaltatas neve
- rovid B2B ertekajanlat
- milyen helyzetben jo
- mit tartalmaz
- hogyan indul az egyuttmukodes
- ellenorzes / riport / SLA jellegu elemek
- kapcsolodo szolgaltatasok
- CTA: ajanlatkeres elotoltott szolgaltatassal
- FAQ csak akkor, ha lathato FAQ blokk is van

### Technikai elemek

- dinamikus route vagy adminbol publikalt szolgaltatas oldal
- SEO title es description oldalszinten
- canonical
- Breadcrumb
- Service JSON-LD
- belso link a fooldali service cardokbol
- kontakt form prefill: `?service=security`

### Dontesi pont

**A szolgaltatasoldalak adminbol legyenek szerkeszthetok, vagy kodban legyenek indulaskor?**

Javaslat: indulaskor kod + DB-tartalom kombinacio. A szoveges struktura legyen stabil, de a leirasok es kepek kesobb adminbol bovulhetnek.

---

## 5. Phase 3 - Referenciak es partnerek

**Prioritas:** P0/P1  
**Ido:** 1-3 nap az elso publikus korre  
**Cel:** a "Biznak bennunk" resz ne csak kategoriakat mutasson, hanem valodi trust signalt.

### Mi a problema most

Jelenleg a referencia blokk kategoria-szintu:

- Irodahazak
- Bevasarlokozpontok
- Ipari es logisztikai parkok
- Kozintezmenyek

Ez kevesebb bizalmat ad, mint konkret partnerlogok vagy esettanulmanyok.

### Minimum publikus verzio

- 4-6 partnerlogo
- 1-2 soros leiras vagy kategoria
- adminban sorrendezes
- csak jovahagyott partnerek publikalasa

### Erositett verzio

- Kifli.hu hir visszaemelese / ujrafogalmazasa
- MARS / Sodexo / Kifli.hu vagy anonim partnerek
- 1-1 rovid case-card:
  - iparag
  - problema
  - Avenir megoldas
  - eredmeny / kontroll / riport

### Kockazat

Csak olyan partnert es logot szabad publikalni, ahol erre van jogosultsag vagy irasos jovahagyas.

---

## 6. Phase 4 - Hiraloldalak es Article schema

**Prioritas:** P1  
**Ido:** 1-2 nap  
**Cel:** a hirek indexelheto, megoszthato, SEO-erteku tartalmak legyenek.

### Feladatok

- `/hu/hirek/[slug]`
- `/en/news/[slug]`
- `/de/aktuelles/[slug]`
- `/zh/news/[slug]`
- cikkenkenti SEO metadata
- Article vagy NewsArticle JSON-LD
- OpenGraph image fallback
- markdown/body rendereles
- kapcsolodo CTA a cikk vegen

### Tartalmi minimum

Legyen legalabb 3 publikus hir:

1. Megujult az Avenir weboldala es arculata
2. Kifli.hu partnerseg / logisztikai vagyonvedelem
3. Bovulo szolgaltatasportfolio / Hard FM / biztonsagtechnika

---

## 7. Phase 5 - SEO / GEO / AI-search sprint

**Prioritas:** P1  
**Ido:** 2-4 nap  
**Cel:** Google, Bing es AI osszefoglalo rendszerek szamara strukturalt, eros cegprofil.

### SEO technikai

- szolgaltatasoldalak metadata
- Service schema per szolgaltatas
- BreadcrumbList
- Article schema
- LocalBusiness `geo`
- Organization `sameAs`
- sitemap bovites
- robots ellenorzes
- canonical ellenorzes
- hreflang ellenorzes

### sameAs javaslat

- LinkedIn cegoldal
- OPTEN profil
- hivatalos cegjegyzek / e-cegjegyzek
- KSH vagy ceginformacios profil, ha van publikus
- kamara, ha relevans

### AI-search / GEO

- `llms.txt`
- `llms-full.txt`
- rovid gepi cegprofil
- szolgaltatasi taxonomia
- `knowsAbout` bovites:
  - kockazatkezeles
  - uzletfolytonossag
  - elooro-vezenyles
  - behatolas-detektalas
  - biztonsagi protokoll-tervezes
  - objektumvedelmi audit

### Google / Bing helyi jelenlet

- Google Business Profile
- Bing Places
- nyitvatartas / 24/7 diszpecser megfogalmazas
- szolgaltatasok listazasa
- fotok
- cegadatok egyezosege az oldallal

---

## 8. Phase 6 - Konverzios javitasok

**Prioritas:** P1/P2  
**Ido:** 1-3 nap  
**Cel:** tobb latogatobol legyen valodi ajanlatkeres.

### Gyors nyeresek

- service card -> kontakt form elotoltes:
  - `/hu#contact?service=security`
  - vagy `/hu?service=security#contact`
- kontakt form mellett lathato mikrocopy:
  - "Valasz 2 munkanapon belul"
  - "ISO 9001 szerint dokumentalt folyamat"
- success allapot javitasa
- kulon thank-you URL, ha meres kell
- surgos ugyeknel telefon kiemelese

### Kesobbi konverzios elemek

- PDF brosura letoltes
- tender checklist
- "Mire figyeljen vagyonvedelmi szolgaltato valasztasakor?" guide
- ROI / oraszam becslo
- referenciak CTA-val

---

## 9. Phase 7 - AOS: mini-CRM kovetkezo szint

**Prioritas:** P2  
**Ido:** 2-5 nap az elso kovetkezo reteg  
**Cel:** a beerkezo leadek kovethetok, priorizalhatok es visszakereshetok legyenek.

### Ami mar kesz

Messages modulbol mini-CRM V1:

- lead statusz
- felelos
- kovetkezo teendo
- becsult ertek
- helyszintipus
- ajanlat / szerzodes link
- belso jegyzet

### Kovetkezo AOS-fejlesztesek

1. Dashboard lead metrikak:
   - uj leadek
   - ajanlat alatt
   - kovetkezo 7 nap teendoi
   - nyert / elveszett
2. Kovetkezo teendok nezet:
   - ma
   - kesesben
   - ezen a heten
3. Lead export CSV
4. Egyszeru activity timeline
5. Admin jogosultsagok kesobb:
   - owner
   - read-only
   - editor
6. Reminder email / Outlook naptar kesobb

### Fontos elv

Kulsos CRM-integracio csak akkor, ha a sajat pipeline 2-4 hetig napi hasznalatban bizonyitott.

---

## 10. Phase 8 - OneDrive / SharePoint dokumentumgerinc

**Prioritas:** P2  
**Ido:** 1-2 nap tervezes + 2-5 nap alap integracios/operativ munka  
**Cel:** dokumentumok ne a webappban eljenek, hanem Microsoft 365-ben, a webapp csak hivatkozza es iranyitsa oket.

### Elso lepes: dokumentumstruktura

```text
Avenir/
  01_Cegadatok/
  02_Jogi_dokumentumok/
  03_Tanusitvanyok/
  04_Ajanlatok/
  05_Szerzodesek/
  06_Ugyfelek/
  07_Marketing_anyagok/
  08_Weboldal_media/
  09_Szabalyzatok/
  10_Tenderek/
  11_Helyszini_riportok/
  12_Szolgaltatasi_protokollok/
```

### Webapp kapcsolat eloszor

- leadhez `proposalUrl`
- leadhez `contractUrl`
- ugyfelhez kesobb `clientFolderUrl`
- helyszinhez kesobb `reportFolderUrl`

### Microsoft Graph csak kesobb

- ugyfelmappa automatikus letrehozasa
- ajanlat PDF mentese
- riport mappa
- jogosultsagkezeles
- audit log

---

## 11. Phase 9 - Ajanlatgenerator MVP

**Prioritas:** P3  
**Ido:** 1-2 het MVP  
**Cel:** leadbol gyors ajanlati vazlat.

### MVP tartalma

- lead adatok atvetele
- szolgaltatas valasztasa
- helyszintipus
- oraszam / muszak / lefedettseg
- ajanlati bevezeto szoveg
- tanusitvanyok es trust elemek
- PDF vagy DOCX export
- OneDrive link mentese

### Nem MVP

- arkeplet automatizalas
- teljes szerzodesgeneralas
- elektronikus alairas
- kulso CRM sync

---

## 12. Phase 10 - Trust Center es tenderanyagok

**Prioritas:** P2/P3  
**Ido:** 1-3 het folyamatosan  
**Cel:** nagyvallalati beszerzesnel az Avenir ellenorizheto, dokumentalt partnernek latszodjon.

### Trust Center tartalom

- ISO 9001
- ISO 27001
- hatosagi engedelyek
- felelossegbiztositas
- adatvedelem
- informaciobiztonsagi politika
- minosegpolitika
- etikai kodex
- anti-corruption policy
- whistleblowing tajekoztato
- beszallitoi magatartasi kodex
- kornyezetvedelmi nyilatkozat

### Prioritas

Eloszor ne teljes Trust Center, hanem egy "Tanusitvanyok es engedelyek" oldal.

---

## 13. Specifikus audit-megjegyzesek dontesre

### Magannyomozas

Jelenleg a kontakt dropdownban szerepel, de a service cardok kozott nem.

Dontesi opciok:

1. Kivesszuk a dropdownbol, ha tudatosan nem akarjuk reklamozni.
2. Betesszuk 9. szolgaltataskent.
3. Kulon, diszkret jogi/szakmai oldalon kezeljuk, nem fookent marketing szolgaltataskent.

Javaslat: donteni kell uzletileg. Ha publikus szolgaltatas, akkor ne legyen csak a dropdownban.

### Footer link: ASZF vs Jogi nyilatkozatok

Javaslat: footerben is `Jogi nyilatkozatok` legyen, hogy egyezzen az oldal cimevel.

### NAIH / compliance hataridok

Ha van konkret hatarido vagy belso naptari datum, keruljon admin vagy naptar reminderbe. Pelda: 2026-06-30 jellegu compliance feladatok.

### FAQ schema

FAQPage schema csak akkor keruljon vissza, ha van lathato FAQ blokk az oldalon. Rejtett FAQ schema nem ajanlott.

---

## 14. 7 napos javasolt menetrend

### 1. nap

- staging workflow dokumentalasa
- staging DB ellenorzes
- feature branch szabaly

### 2. nap

- szolgaltatas aloldal technikai vaza
- routing, metadata, breadcrumb
- 1 pilot oldal: objektumorzes

### 3. nap

- objektumorzes oldal tartalom finomitas
- portaszolgalat oldal
- biztonsagtechnika oldal

### 4. nap

- tavfelugyelet oldal
- mystery shopping oldal
- service card belso linkek

### 5. nap

- Service schema
- sitemap/canonical ellenorzes
- kontakt prefill elso verzio

### 6. nap

- partnerek/referenciak public cutover terv
- logok, jogosultsagok, admin publish allapot

### 7. nap

- review es dontes:
  - tovabb szolgaltatasok EN/DE/ZH iranyba
  - vagy referencia blokk
  - vagy SEO sprint

---

## 15. 30 napos cel

30 napon belul idealis allapot:

- staging workflow stabil
- magyar szolgaltatas-aloldalak elso kor kesz
- 4-6 partner/referencia publikus trust signal
- hiroldalak sluggal
- Article schema
- Service schema
- Google Business Profile / Bing Places elinditva
- `llms.txt`
- konverzios prefill
- mini-CRM dashboard alap

---

## 16. 90 napos cel

90 napon belul:

- szolgaltatas-aloldalak 4 nyelven
- legalabb 3 case study
- Trust Center alap
- SEO/GEO/AI-search csomag stabil
- mini-CRM napi hasznalatban
- OneDrive dokumentumgerinc mukodik
- ajanlatgenerator MVP elokeszitve vagy elinditva
- LinkedIn cegoldal aktiv tartalommal
- havi tartalomritmus

---

## 17. Mit nem javasolt most csinalni

- Teljes AOS-t elore megtervezni es tulfejleszteni
- Kulsos CRM-integraciot azonnal bekotni
- Microsoft Graph automatizalast azelott, hogy a mappastruktura stabil
- Minden szolgaltatasoldalt egyszerre 4 nyelven megirni
- Analytics / remarketing bevezetese cookie/jogi frissites nelkul
- FAQ schema visszarakasa lathato FAQ nelkul
- Production DB migration staging teszt nelkul

---

## 18. Dontesi lista Andrasnak

Olvasas utan ezekrol erdemes donteni:

1. Elfogadjuk-e, hogy a kovetkezo nagy blokk a szolgaltatas-aloldalak legyen?
2. Melyik legyen az elso 6 szolgaltatas?
3. Magannyomozas: publikus service, diszkret oldal vagy dropdownbol kivetel?
4. Referenciaknal mely logok publikalhatok jogilag?
5. A szolgaltatasoldalak eloszor csak HU vagy rogton 4 locale?
6. Staging DB-t hogyan valasszuk szet a productiontol?
7. AOS-t mikor folytassuk: szolgaltatas/SEO utan vagy parhuzamosan heti 1 nap?
8. Legyen-e 30 napos sprintterv napi bontasban?

---

## 19. Javasolt kovetkezo commit-sorrend

Ha ezt a roadmapet elfogadjuk, a kovetkezo commit-sorrend:

1. `docs(ops): define staging workflow`
2. `feat(services): add public service detail routes`
3. `feat(services): add security service page`
4. `feat(services): add reception and security tech pages`
5. `feat(services): add service schema and breadcrumbs`
6. `feat(contact): prefill service from url`
7. `feat(partners): render published partners on homepage`
8. `feat(news): add public article pages`
9. `feat(seo): add article schema and localbusiness geo`
10. `feat(seo): add llms files`

---

## 20. Vegso ajanlas

A legjobb sorrend:

**Staging -> Szolgaltatasoldalak -> Referenciak -> SEO/GEO/AI -> Konverzio -> AOS**

Ez adja a legjobb aranyt:

- tobb relevans keresesi talalat
- erosebb bizalom
- tobb ajanlatkeres
- jobb merhetoseg
- utana ertelmesebb belso automatizalas

Az AOS nem hatra van sorolva, hanem megfelelo alapra kerul: eloszor legyen eleg minosegi lead es tartalmi struktura, utana erdemes a belso operativ rendszert melyebbre vinni.
