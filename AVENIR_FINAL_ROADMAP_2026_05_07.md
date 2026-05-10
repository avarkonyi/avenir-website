# Avenir vegleges dontesi roadmap

**Datum:** 2026-05-07  
**Cel:** egyetlen attekintheto fejlesztesi menetrend az afm.hu post-launch idoszakara.  
**Allapot:** dontesi dokumentum, nem implementacios ticketlista.  
**Forrasok:** jelenlegi repo-roadmap, production tapasztalatok, Search Console / Bing tapasztalatok, Claude audit 2026-05-07, Avenir Operating System otletek.

---

## 0. Vezetoi osszefoglalo

A jelenlegi oldal mar production-kepes es jogi/compliance szempontbol eros. A kovetkezo fejlesztesi sorrendben nem a belso rendszerrel kell kezdeni, hanem a publikus uzletszerzesi alapot kell megerositeni.

**Javasolt sorrend:**

1. Publikus lead-generation alap stabilizalasa.
2. Szolgaltatas-aloldalak magyar MVP.
3. Referenciak es partnerek publikus trust retege.
4. SEO / GEO / AI-search sprint.
5. Konverzios javitasok az ajanlatkereshez.
6. AOS mini-CRM dashboard es teendo-nezet.
7. OneDrive / SharePoint dokumentumgerinc.
8. Ajanlatgenerator MVP.
9. Trust Center / tenderanyagok.

Specialis szolgaltatasok, megfelelosegi dokumentumretegek, Shadow Audit es elektronikus ornaplo szerepeljenek a roadmapben, de ne elozzek meg a publikus szolgaltatas-, referencia-, SEO- es konverzios prioritast.

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
- Staging service-detail reteg:
  - `/hu/szolgaltatasok/objektumorzes`
  - `/hu/szolgaltatasok/portaszolgalat`
  - `/hu/szolgaltatasok/biztonsagtechnika`
  - `/hu/szolgaltatasok/tavfelugyelet-vonuloszolgalat`
  - `/hu/szolgaltatasok/mystery-shopping-helyszini-audit`
  - `/hu/szolgaltatasok/rendezvenybiztositas`
  - `/hu/szolgaltatasok/hard-fm`
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
- Tovabbi szolgaltatas-aloldalak es production cutover
- Publikus partner/referencia megjelenites
- Hir reszletezo aloldalak
- Article schema
- Service schema reszletezese
- LocalBusiness geo es sameAs bovites
- Google Business Profile / Bing Places
- `llms.txt`, `llms-full.txt`
- Konverzios tracking-kompatibilis thank-you flow
- megfelelosegi / fenntarthatosagi dokumentumtar es panaszkezeles
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

### Celzott fooldali struktura

A publikus lead-generation oldal celzott sorrendje:

1. Hero
2. Rolunk / ertekajanlat
3. 8 fo szolgaltatas-kartya
4. Specialis szolgaltatasok
5. Tanusitvanyok / megfeleloseg / dokumentumtar
6. Referenciak
7. Hirek
8. Kapcsolat

Az elso 8 fo szolgaltatas-kartya maradjon a fo publikus szolgaltatasi reteg.
A specialis szolgaltatasok ne 9-10-11. hangos kartyakent jelenjenek meg,
hanem masodlagos, diszkret B2B blokkkent a 8 fo kartya utan, a trust /
compliance / referencia reteg elott.

### Mi legyen az elso korben

Nem kell rogton 8-9 szolgaltatas x 4 nyelv. Eloszor magyar MVP:

1. `Elos objektumorzes`
2. `Recepcios es portaszolgalat`
3. `Biztonsagtechnika`
4. `Tavfelugyelet es vonuloszolgalat`
5. `Mystery Shopping es helyszini audit`
6. `Rendezvenybiztositas`
7. `Hard FM`
8. `Soft FM` - kovetkezo FM prioritas

### Jelenlegi staging allapot

Status: current staging HU service detail layer.

Az elso het HU oldal stagingen kesz:

| Szolgaltatas | Canonical slug | Legacy slug |
| --- | --- | --- |
| Elos objektumorzes | `objektumorzes` | `security` |
| Recepcios es portaszolgalat | `portaszolgalat` | `reception` |
| Biztonsagtechnika | `biztonsagtechnika` | `building` |
| Tavfelugyelet es vonuloszolgalat | `tavfelugyelet-vonuloszolgalat` | `technical` |
| Mystery Shopping es helyszini audit | `mystery-shopping-helyszini-audit` | `mystery` |
| Rendezvenybiztositas | `rendezvenybiztositas` | `cleaning` |
| Hard FM | `hard-fm` | `hardfm` |

Szabaly:

- canonical HU URL-ek publikusak stagingen;
- legacy detail URL-ek 404-et adnak;
- EN/DE/ZH service detail URL-ek 404-et adnak, amig nincs sajat lokalizalt detail tartalom;
- sitemap csak a ready HU service detail URL-eket tartalmazza;
- hreflang csak ready locale-t hirdet;
- contact prefill canonical es legacy query aliasokat is elfogad, de uj linkekben canonical slugot kell hasznalni.

### Javasolt URL-ek

- `/hu/szolgaltatasok/objektumorzes`
- `/hu/szolgaltatasok/portaszolgalat`
- `/hu/szolgaltatasok/biztonsagtechnika`
- `/hu/szolgaltatasok/tavfelugyelet-vonuloszolgalat`
- `/hu/szolgaltatasok/mystery-shopping-helyszini-audit`
- `/hu/szolgaltatasok/rendezvenybiztositas`
- `/hu/szolgaltatasok/hard-fm`
- `/hu/szolgaltatasok/soft-fm`

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
- kontakt form prefill canonical sluggal:
  - `?service=objektumorzes`
  - `?service=portaszolgalat`
  - `?service=biztonsagtechnika`
  - `?service=tavfelugyelet-vonuloszolgalat`
  - `?service=mystery-shopping-helyszini-audit`
  - `?service=rendezvenybiztositas`
  - `?service=hard-fm`
- legacy query aliasok hatterkompatibilitasra:
  - `security`
  - `reception`
  - `building`
  - `technical`
  - `mystery`
  - `cleaning`
  - `hardfm`

### Dontesi pont

**A szolgaltatasoldalak adminbol legyenek szerkeszthetok, vagy kodban legyenek indulaskor?**

Javaslat: indulaskor kod + DB-tartalom kombinacio. A szoveges struktura legyen stabil, de a leirasok es kepek kesobb adminbol bovulhetnek.

---

## 4A. Phase 2A - Specialis biztonsagi es vizsgalati szolgaltatasok

**Prioritas:** P1/P2
**Ido:** tervezes 0.5-1 nap, elso oldalak 1-3 nap
**Cel:** a szabalyzott, celzott vizsgalati es audit jellegu szolgaltatasok elerhetok legyenek, de ne toljak el a fo 8 szolgaltatas publikusan ertheto struktura-jarol a hangsulyt.

### Fooldali blokk

**Cim:** Specialis biztonsagi es vizsgalati szolgaltatasok

**Intro:**
Bizonyos helyzetek nem altalanos orzesi vagy facility feladatot igenyelnek, hanem celzott vizsgalatot, helyszini auditot vagy szabalyozott tenyfeltarast.

### Blokk elemei

- Magannyomozas
- Helyszini biztonsagi audit
- Vizsgalati / ellenorzesi szolgaltatasok

### Javasolt URL-ek

- `/hu/szolgaltatasok/magannyomozas`
- `/hu/szolgaltatasok/helyszini-biztonsagi-audit`
- `/hu/szolgaltatasok/vizsgalati-ellenorzesi-szolgaltatasok`

### Strukturalis szabaly

Ezek ne keruljenek be automatikusan a 8 fo szolgaltatas-kartya koze.
Kulon, visszafogott, B2B specialis szolgaltatas blokkban jelenjenek meg.
A magannyomozas kulonosen diszkret megjelenitest igenyel: legyen megtalalhato, de ne legyen tulpromotalva a fooldalon.

### Copy es compliance szabalyok

- Ne implikaljon jogellenes rejtett megfigyelest.
- Ne implikaljon munkavallaloi monitoringot elore jovahagyott, jogszeru scope nelkul.
- Ne allitson jogi/compliance auditot, ha csak mukodesi vizsgalatrol van szo.
- Minden vizsgalatnal legyen elore rogzitett cel, scope, modszertan es adatkezelesi keret.
- A megallapitasok mukodesi megfigyelesek es fejlesztesi javaslatok legyenek, ne bizonyitatlan garanciak.

---

## 4B. Shadow Audit / Mystery Shopping sub-brand opcio

**Status:** discovery / strategic option
**Prioritas:** future P2/P3 after current HU service page MVP and SEO/trust work
**Implementacio:** do not implement yet

### Strategiai irany

Az Avenir oldalon a `/hu/szolgaltatasok/mystery-shopping-helyszini-audit` maradjon rovid, komoly B2B szolgaltatasoldal:

- probavasarlas
- szolgaltatasaudit
- brand audit
- situation shopping
- ugyfelut audit
- probautazas / service journey audit
- service quality measurement
- elore egyeztetett megfelelesi pontok merese

Ez kesobb kulon sub-brand vagy microsite lehet, mert az edukacios, SEO es lead-generation potencial nagyobb, mint egyetlen Avenir service page.

Javasolt brand architektura:

- Avenir = parent brand, bizalom, B2B facility/security/compliance hatter
- Shadow Audit vagy hasonlo = specializalt szolgaltatasaudit / mystery shopping / customer journey audit brand

### Fontos jogi/brand ovatosag

Nem szabad feltetelezni, hogy a Shadow Agency, Shadow Audit vagy barmely Shadow nev jogilag szabad.

Szukseges dontes es ellenorzes:

- nev shortlist
- domain ellenorzes
- magyar vedjegy ellenorzes
- EUIPO vedjegy ellenorzes
- jogi review
- brand kockazati review

Elso korben visszafordithato megoldas javasolt: Avenir-kontrollalt subdomain, peldaul `shadow.afm.hu`. Kulon domain csak nev/domain/jogi tisztazas utan.

### Copy es compliance szabaly

Hasznalhato:

- probavasarlas
- szolgaltatasaudit
- ugyfelut audit
- brand audit
- situation shopping
- probautazas
- szolgaltatasminoseg-meres
- elore egyeztetett megfelelesi pontok
- strukturalt riport
- vezetoi osszefoglalo
- fejlesztesi javaslat
- jogszeru, celhoz kotott vizsgalati keretek

Kerulendo:

- kemkedes
- megfigyeles
- beepules
- lebuktatas
- titkos ellenorzes
- buntetes
- nyomozas
- bizonyitekgyujtes

Ez nem magannyomozas, nem rejtett munkavallaloi monitoring es nem bizonyitekgyujtes.

### Dontesek Andrasnak

- Maradjon Avenir service page, vagy legyen kulon sub-brand?
- Melyik legyen a preferalt munkanev?
- Subdomain vagy kulon domain?
- Ki viszi a jogi/vedjegy/domain ellenorzest?
- Mit lehet publikus mondani taxi / transport service audit temaban?
- Lehet-e demo riportot mutatni?
- Legyen-e kulon lead form?
- Kapjon-e sajat lead kategoriat a mini-CRM-ben?

Reszletes strategia: `docs/shadow_audit_strategy.md`.

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

## 7A. Phase 5A - Megfeleloseg, fenntarthatosag es dokumentumtar

**Prioritas:** P1/P2
**Ido:** elso publikus reteg 2-5 nap, teljes dokumentum eletciklus kesobb
**Cel:** nagyvallalati beszerzesnel, tendernel, kulso fenntarthatosagi ertekelesnel es AI-search kornyezetben az Avenir dokumentalt, ellenorizheto es beszallitoi szempontbol felkeszult partnernek latszodjon.

### Pozicio a roadmapben

Ez a blokk a szolgaltatasoldalak, referencia/trust jelek es SEO/GEO sprint kozott kapjon helyet, az AOS melyebb moduljai elott. Nem belso dokumentumtar-fejleszteskent indul, hanem publikus bizalmi es megfelelosegi retegkent.

### Javasolt publikus URL-ek

- `/hu/megfeleloseg-es-fenntarthatosag`
- `/hu/tanusitvanyok-es-engedelyek`
- `/hu/panaszkezeles`
- `/hu/visszaeles-bejelentes` vagy `/hu/etikai-bejelentes` - csak ha jogilag es mukodesileg eldontott
- `/hu/dokumentumok/[slug]` - kesobb, ha adminbol kezelt dokumentumtar lesz

Alternativa: a dokumentumok kezdetben a `/hu/megfeleloseg-es-fenntarthatosag` oldal szekcioikent jelennek meg, es csak kesobb kapnak onallo dokumentum URL-t.

### EcoVadis irany

Az Avenir jelenleg ne allitsa, hogy EcoVadis tanusitott, minositett, auditált vagy medal/badge birtokosa.

Hasznalhato megfogalmazasok:

- EcoVadis felkeszules
- fenntarthatosagi es megfelelosegi dokumentacio
- nagyvallalati beszallitoi elvarasok tamogatasa
- kulso fenntarthatosagi ertekelesekre valo felkeszules

Kerulendo:

- EcoVadis tanusitott
- EcoVadis minositett
- EcoVadis auditált
- EcoVadis medal / badge allitas, amig nincs igazolt rating

### Dokumentumok besorolasa

#### Publikus weboldalra tervezheto dokumentumok

- Minosegpolitika
- Informaciobiztonsagi nyilatkozat
- Fenntarthatosagi nyilatkozat
- Etikai kodex
- Anti-korrupcios nyilatkozat
- Panaszkezelesi tajekoztato
- Adatvedelmi tajekoztato
- Kornyezetvedelmi nyilatkozat
- Munkavedelmi es biztonsagi alapelvek
- Sokszinuseg es eselyegyenloseg nyilatkozat
- Minosegiranyitasi alapelvek
- Informaciobiztonsagi alapelvek
- Adatvedelmi es adatbiztonsagi osszefoglalo

#### Publikus, de jovahagyas-koteles dokumentumok

- Beszallitoi magatartasi kodex
- Visszaeles-bejelentesi tajekoztato
- Whistleblowing / etikai bejelentes tajekoztato
- Emberi jogi / munkavallaloi jogi nyilatkozat
- Beszallitoi ertekelesi alapelvek
- Felelossegbiztositasi igazolas, ha publikalhato
- ISO 9001 tanusitvany, ha publikalhato
- ISO 27001 tanusitvany, ha publikalhato
- Vagyonvedelmi engedely, ha publikalhato
- Biztonsagtechnikai engedely, ha publikalhato
- Magannyomozoi engedely, ha publikalhato

#### Internal / audit-only / tender-only dokumentumok

- belso audit bizonyitekok
- ugyfel- vagy szerzodesspecifikus dokumentumok
- szemelyes adatot tartalmazo riportok
- belso incidensnaplok
- reszletes biztonsagi kontroll listak
- belso kockazatertekelesek
- ugyfelspecifikus SLA-k es arak
- nem publikus partneri / tender anyagok

Ezek ne keruljenek nyilvanos weboldalra. A webapp kesobb csak jovahagyott publikus verziot vagy publikus linket tegyen ki.

### Panaszkezeles oldal

URL: `/hu/panaszkezeles`

Javasolt szerkezet:

1. H1: Panaszkezeles
2. Milyen ugyekben lehet panaszt tenni?
3. Hogyan lehet panaszt benyujtani?
4. Milyen adatokat erdemes megadni?
5. Mi tortenik a panasz beerkezese utan?
6. Valaszadasi hatarido
7. Jogorvoslati / tovabbi lehetosegek
8. Adatkezelesi kapcsolat
9. Kapcsolodo dokumentumok

Production publikacio elott jogi review kotelezo.

### Footer es navigacio

Javasolt uj footer csoport:

**Megfeleloseg**

- Megfeleloseg es fenntarthatosag
- Tanusitvanyok es engedelyek
- Panaszkezeles
- Etikai kodex
- Beszallitoi magatartasi kodex

Specialis szolgaltatasok kisebb footer csoportban:

- Magannyomozas
- Helyszini biztonsagi audit
- Vizsgalati / ellenorzesi szolgaltatasok

### Admin / AOS dokumentum modul kesobb

Javasolt admin modul: Documents / Policies / Certifications.

Mezok:

- title
- slug
- category
- documentType
- description
- issuer
- validFrom
- validUntil
- lastReviewedAt
- language
- fileUrl
- isPublic
- isDownloadable
- approvalStatus
- approvedBy
- approvedAt
- sortOrder
- relatedServices
- tags

Kategoriak:

- certification
- license
- policy
- procedure
- complaint-handling
- whistleblowing
- sustainability
- ethics
- supplier
- privacy
- security
- quality
- environment
- health-and-safety
- human-rights
- diversity

OneDrive / SharePoint maradjon a hosszu tavu dokumentumgerinc. A weboldal csak jovahagyott publikus verziokat, publikus linkeket vagy letoltheto PDF-eket tegyen elerhetove. Internal evidence dokumentumok maradjanak Microsoft 365-ben, nem a publikus weben.

### SEO / GEO / AI-search kovetelmenyek

- stabil publikus URL-ek
- tiszta H1/H2 struktura
- dokumentum metadata
- utolso frissites datum
- Organization / WebPage / Breadcrumb schema
- kesobb opcionalisan DigitalDocument / CreativeWork schema, ha a publikus dokumentumok mar leteznek
- belso linkek szolgaltatasoldalakrol es footerbol
- AI-search-barát osszefoglalok
- `llms.txt` / `llms-full.txt` hivatkozas kesobb

Schema-t ne vigyuk tulzasba, amig a publikus oldalak es dokumentumok nem leteznek.

---

## 8. Phase 6 - Konverzios javitasok

**Prioritas:** P1/P2  
**Ido:** 1-3 nap  
**Cel:** tobb latogatobol legyen valodi ajanlatkeres.

### Gyors nyeresek

- service card -> kontakt form elotoltes:
  - `/hu?service=objektumorzes#contact`
  - `/hu?service=portaszolgalat#contact`
  - `/hu?service=biztonsagtechnika#contact`
  - `/hu?service=tavfelugyelet-vonuloszolgalat#contact`
  - `/hu?service=mystery-shopping-helyszini-audit#contact`
  - `/hu?service=rendezvenybiztositas#contact`
  - `/hu?service=hard-fm#contact`
  - legacy query aliasok tovabbra is biztonsagosan kezelhetok: `security`, `reception`, `building`, `technical`, `mystery`, `cleaning`, `hardfm`
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

## 9A. Future AOS module - Elektronikus ornaplo

**Status:** future AOS module
**Prioritas:** after mini-CRM and after public lead-generation layer is stable
**Implementacio:** do not implement yet

### Strategiai szerep

Az elektronikus ornaplo belso operativ eszkoz legyen eloszor, nem publikus weboldal-fejlesztes. Celja, hogy az objektumorzes, portaszolgalat, tavfelugyelet, incidenskezeles es riportalas strukturalt digitalis naplozast kapjon.

Nem elozheti meg a jelenlegi publikus prioritast:

1. szolgaltatas-aloldalak
2. referenciak / trust reteg
3. SEO/GEO sprint
4. konverzios javitasok
5. mini-CRM
6. elektronikus ornaplo discovery
7. elektronikus ornaplo MVP
8. OneDrive / SharePoint riportintegracio
9. kliens oldali riport reteg

### MVP gondolat

Tablet- vagy mobilbarat felulet oroknek es helyszini szemelyzetnek:

- szolgalat kezdete / vege
- napi ornaplo bejegyzesek
- incidensrogzites
- jaror / checkpoint rekordok
- kulcsatadas
- latogatoi / beszallitoi rendellenessegek
- muszakatadas
- helyszini utasitas tudomasulvetele
- supervisor/admin review
- exportalhato riportok

### Copy es compliance szabaly

Ne legyen munkavallaloi megfigyelesi vagy dolgozoi tracking termekkent pozicionalva.

Hasznalhato:

- elektronikus ornaplo
- operational reporting
- strukturalt szolgalati dokumentacio
- incidens es muszakatadas naplozas
- jaror / checkpoint dokumentacio
- ugyfelriport

Kerulendo:

- employee surveillance
- dolgozok kovetese
- orok monitorozasa
- performance policing
- hidden monitoring

Jogi/adatvedelmi review szukseges, mielott production vagy kliens oldali hasznalatba kerul.

### Dontesek Andrasnak

- Elso verzio csak belso legyen?
- Tablet-first vagy mobile-first?
- Mely szerepkorok kellenek eloszor?
- Melyik legyen a pilot szolgaltatas: objektumorzes vagy portaszolgalat?
- QR checkpoint MVP vagy kesobb?
- Foto csatolas MVP vagy kesobb?
- Riportok OneDrive/SharePoint mappaba menjenek?
- Kapjanak-e ugyfelek read-only hozzaferest?
- Milyen jogi/adatvedelmi szabalyok vonatkoznak a staff activity logokra?
- Mi a minimalis riportformatum, ami ugyfelnek is ertekes?

Reszletes strategia: `docs/aos_guard_log.md`.

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
Ez kapcsolodik a Phase 5A megfeleloseg/fenntarthatosag reteghez: ott induljon a publikus informacios architektura, itt kesobb bovulhet tenderanyag-csomagga es belso AOS dokumentumfolyamattá.

EcoVadis csak felkeszuleskent szerepelhet, amig nincs igazolt rating vagy medal.

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
- elso canonical HU service oldalak validalasa stagingen

### 3. nap

- objektumorzes oldal tartalom finomitas
- portaszolgalat oldal
- biztonsagtechnika oldal

### 4. nap

- tavfelugyelet oldal
- mystery shopping oldal
- service card belso linkek
- specialis szolgaltatasok fooldali masodlagos blokkjanak terve
- rendezvenybiztositas staging service page QA es kapcsolodo service linkek ellenorzese

### 5. nap

- Service schema
- sitemap/canonical ellenorzes
- kontakt prefill elso verzio
- megfeleloseg / fenntarthatosag / dokumentumtar informacios architektura

### 6. nap

- partnerek/referenciak public cutover terv
- logok, jogosultsagok, admin publish allapot
- tanusitvanyok es engedelyek publikus lista jovahagyasi korrel

### 7. nap

- review es dontes:
  - tovabb szolgaltatasok EN/DE/ZH iranyba
  - vagy referencia blokk
  - vagy SEO sprint
  - vagy megfeleloseg / panaszkezeles oldal elso publikus kor

---

## 15. 30 napos cel

30 napon belul idealis allapot:

- staging workflow stabil
- magyar szolgaltatas-aloldalak elso kor kesz
- 4-6 partner/referencia publikus trust signal
- specialis szolgaltatasok masodlagos fooldali blokk terve
- panaszkezeles es megfeleloseg/fenntarthatosag oldalak tartalmi vazlata
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
- megfeleloseg es fenntarthatosag publikus trust reteg
- dokumentumtar MVP jovahagyott publikus dokumentumokkal
- EcoVadis felkeszulesi dokumentacio, EcoVadis rating allitas nelkul
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
8. Specialis szolgaltatasok kozul melyik legyen publikus eloszor?
9. Mely dokumentumok publikalhatok weben, es melyek csak tender/audit csomagban?
10. Panaszkezeles oldal jogi review felelose?
11. EcoVadis felkeszuleshez milyen belso dokumentumok hianyoznak?
12. Legyen-e 30 napos sprintterv napi bontasban?

---

## 19. Javasolt kovetkezo commit-sorrend

Ha ezt a roadmapet elfogadjuk, a kovetkezo commit-sorrend:

1. `docs(ops): define staging workflow`
2. `feat(services): add public service detail routes`
3. `feat(services): add objektumorzes service page`
4. `feat(services): add portaszolgalat and biztonsagtechnika pages`
5. `feat(services): add monitoring and mystery shopping pages`
6. `feat(services): add service schema and breadcrumbs`
7. `feat(contact): prefill service from url`
8. `docs(compliance): plan public document and complaint-handling layer`
9. `docs(strategy): outline shadow audit and guard log future scope`
10. `feat(home): add secondary special services block`
11. `feat(partners): render published partners on homepage`
12. `feat(news): add public article pages`
13. `feat(seo): add article schema and localbusiness geo`
14. `feat(seo): add llms files`

---

## 20. Vegso ajanlas

A legjobb sorrend:

**Staging -> Szolgaltatasoldalak -> Referenciak/trust -> SEO/GEO/AI -> Konverzio -> mini-CRM/AOS -> Dokumentumfolyamatok -> Ajanlatgenerator -> Trust Center**

Ez adja a legjobb aranyt:

- tobb relevans keresesi talalat
- erosebb bizalom
- tobb ajanlatkeres
- jobb merhetoseg
- utana ertelmesebb belso automatizalas

Az AOS nem hatra van sorolva, hanem megfelelo alapra kerul: eloszor legyen eleg minosegi lead es tartalmi struktura, utana erdemes a belso operativ rendszert melyebbre vinni.
