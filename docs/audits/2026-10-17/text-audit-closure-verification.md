# Második szövegaudit-javítási kör – ellenőrzés

Kiinduló commit: `0441caab22d9902e7060e0b990fbe028d4c2d3aa`. A munka a meglévő draft PR #2 ágán történik. Az eredeti audit változatlan.

## Jogi fordítási paritás

EN v1.1 közvetlen/aggregált getter és UI-hivatkozások; DE 13 szakasz + 14. DPO-blokk; privacy/impressum forráshűség és biztos HU szóhibák. 20 célzott teszt, lint és TypeScript sikeres. Külön spec review, majd quality review: PASS. Ez nem jogi vagy anyanyelvi jóváhagyás.

## CMS-javaslat

Csak olvasó staging-cél ellenőrizve: `ep-twilight-sound-al2b7jsb`, `br-round-fog-al4isa1i`. Két SELECT-kör nyilvános szolgáltatásmezőit mentettük a `staging-text-audit-readonly.json` és `staging-en-parity-readonly.json` fájlokba. A `staging-text-corrections-proposal.json` 7 szolgáltatás 14 mezőjének pontos előtte/utána értékét tartalmazza. Nincs alkalmazva; nem production-ellenőrzés.

## Analytics visszavonás – hibareprodukció

Helyi dev előnézet, `G-AUDITTEST` tesztazonosító, minden Google-kérés elfogva, minden egyéb külső kérés blokkolva; nincs űrlapküldés.

Lépések: HU oldal → analitika elfogadása → mock script betöltése → `_ga` tesztsüti → lábléc Süti beállítások → Elutasítom.

Javítás előtti megfigyelés:

```json
{"consent":"rejected","disabled":false,"analyticsCookiePresent":true,"loaded":true}
```

A megfigyelés a hiányzó `ga-disable` opt-outot és süti-takarítást igazolja; nem valódi Google-forgalom mérése. Elsődleges megvalósítási referencia: [Google tag privacy controls](https://developers.google.com/tag-platform/security/guides/privacy), [Google consent mode](https://developers.google.com/tag-platform/security/guides/consent). A javítás utáni eredményeket a végső ellenőrzéskor rögzítjük.

## Felület, strukturált adatok és konkrét szóhibák

Hatnyelvű runtime-hiba és lokalizált 404-recovery; cikk-breadcrumb; LLM review-lefedettség; locale-függő Organization/LocalBusiness/credential leíró mezők; Budapest-időzónás válaszlevél; konkrét HU/DE/FR/KO/ZH jelentés- és nyelvtani hibák. A schema 24/7 állítása kizárólag diszpécseri támogatás, nem felügyeleti központ. Hivatalos azonosítók és címek változatlanok. Célzott renderelési/kimeneti tesztek és TypeScript sikeresek.

Összevont sorok fennmaradó részei:

- FKZ-012: KO/ZH forrásnevek egységesek; CMS-first ZH felülírás nyitott.
- KOS-020: beszállítói/szakági szóhasználat javítva; Hard FM „existing partners” HU-paritás szerint megmaradt.
- ZHS-012: portai helyszíni felmérés javítva; biztonságtechnikai értékelési kontextus anyanyelvi ellenőrzést igényel.
- DEB-044: tanúsítványcímkék és kategóriák lokalizálva; CMS szolgáltatásnevek külön maradnak.
- EDU-036: breadcrumb javítva; összevont navigációs/szolgáltatásnevek nyitottak.
- ENB-019: „Legal entity” javítva; „Additional proof requests” nyitott.
- HUB-025: „Jogi személy” címke javítva; a konkrét cégnév publikálási engedélyét külön kell igazolni.
- EDU-041/HUA-026/HUB-030: schema-címkék fordítva; IAF MLA-tagság/akkreditáció tényszerű értelmezése nincs igazolva.
- HUA-006/HUA-027: schema-diszpécseri kifejezés és e-mail-időbélyeg javítva; a többi összevont előfordulás nyitott.
- FRS-014/FKZ-017: FR próza és válaszlevél kettőspontja javítva; teljes tipográfiai sor lezárása nincs állítva.
- HUA-011: UI-mondat javítva; CMS-leírás külön marad.

Felületi/spec review: PASS (a talált DE/KO/FR schema-túlzás és két HU e-mail-cím kötőjel javítva, visszaellenőrizve). Független code-quality/React review: PASS. Az áttekintett eredeti CSV SHA-256 lenyomata:
CF3A3071C0CA77043BC05B795D3DFD3F539DACE6B87643970586E3FD22CD6148

## Végső helyi ellenőrzés

- Teljes unit csomag: **145/145 PASS**.
- Teljes ESLint és TypeScript: PASS.
- Copy guard: **219 fájl, 33 szabály, PASS**.
- Staging runtime-cél preflight: PASS; production-adatbázis nem érintett.
- Optimált Next build: **100/100 oldal, PASS**, plusz dinamikus locale-catchall. Kizárólag a helyi buildfolyamat kapott `G-AUDITTEST` azonosítót; környezeti fájl nem változott.
- Kész builden `scripts/qa-text-audit-closure.mjs`: **15/15 PASS**. Hat locale: valódi 404/noindex, helyes html lang, egy lokalizált H1 és visszalink. HU/EN/DE jogi nyilatkozat: 14 számozott szakasz, egy DPO-blokk. Hat főoldal: lokalizált schema; review noindex megmaradt.
- Kész builden `tests/analytics-withdrawal.spec.ts`: **9/9 PASS**. Szinkron opt-out, saját sütik törlése és idegen sütik megőrzése, reaccept/reload, késői script, valódi második lap, storage-hibák, első hozzájárulás előtti blokkolás, sorban álló page_view és tisztított URL-ek.
- A böngészős próbákban minden író és külső kérés blokkolva; a Google-script dummy válasz. Nincs valódi analitikai esemény, form submit, e-mail vagy DB-írás. A teszt a letiltást igazolja, nem az egyszer már futott JavaScript eltávolítását vagy a GA4 tényleges riportbeérkezését.
- A nyilvántartás 506 egyedi azonosítója és az eredeti auditmezők változatlanok, beleértve a bírálót. Az eredeti auditmappa nélküli regenerálás is azonos eredményt ad.

A helyi eredmény nem production-, jogi vagy anyanyelvi jóváhagyás. A DPO-, üzleti, dokumentum-, CMS- és kiadási tételek a külön listában maradnak.

Analytics spec review: PASS. Külön végső quality/React és integrációs review: PASS; a valódi Google-tag hálózati ellenőrzése külön kiadási feltétel. A ledger review két észrevétele javítva: DES-001 szótári kifejezés és az eredeti reviewer mező megőrzése.
