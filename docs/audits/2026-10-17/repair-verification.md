# Auditjavítások ellenőrzése – 2026-10-17

Ez az utóellenőrzés a `c6824d6` állapot utáni javításokra vonatkozik. A Claude-audit eredeti bizonyítékfájljai változatlanok. Nem történt merge, production deploy, éles adatbázisírás vagy űrlapküldés. A lent részletezett staging-adatjavítás külön felhasználói jóváhagyás után történt.

## Elkészült forrásjavítások

- F5: a DE/FR/KO általános őrzési és recepciós szöveg diszpécseri támogatást ír le; a tényleges távfelügyeleti szolgáltatás jelentése megmaradt.
- F7: mind a 23 sikeres szolgáltatás-, tanúsítvány-, állás- és partnermódosítás érvényteleníti a közös nyelvi layoutot. A szolgáltatásmódosítás a sitemapet is. Az adminoldalak érvénytelenítése megmaradt.
- F8: a német, noindex jogi oldalak nem örökölnek HU/EN hreflangot.
- F12 részben: az angol impresszum meta description angol.
- F13: a hosszú német H1 mobilon törhet; 390 × 844-es böngészőnézetben a szöveg a képernyőn belül maradt.
- F16 részben: a forrásfájl felesleges záró üres sora eltűnt. A korábbi robots.txt bizonyítékok bájtjait nem módosítottuk whitespace-tisztítás címén.
- Az adatbázis-generálási hibák külön diagnosztikai sora kizárólag előre engedélyezett hibakódot és rögzített magyarázatot ír ki. Nem másol tetszőleges belső hibaüzenetet, SQL-t vagy kapcsolatijelszót.

## F1 – éles build vizsgálata

A Vercel felületén azonosított aktuális éles commit: `8f9bba48f2c22d4155b25293a41bc53708aca684`.
A `75b2cd7` deploymentje (`dpl_AHqE21syC44Ayr8dViveaTnfH29n`) fordítás és TypeScript után, a szolgáltatásútvonalak DB-lekérdezésénél hibázott. A napló nem tartalmazza az eredeti adatbázis-hibakódot, ezért önmagában nem választja szét a kapcsolati, hitelesítési és sémahibákat.

A production és preview DATABASE_URL külön környezeti bejegyzésként szerepel a Vercelben. A jelszavakat nem jelenítettük meg. A Vercel Storage felületén az Upstash kapcsolat `Suspended`; ez külön ellenőrzendő az éles űrlapfolyamat előtt.

A felhasználó kifejezett engedélyével ellenőrzött cél:

- Neon projekt: `calm-glade-02466781` (`avenir-db`), Vercel-szervezet.
- Production ág: `br-divine-silence-almpoz68` (`main`).
- Endpoint: `ep-young-meadow-aln5ux5m`, adatbázis: `neondb`; egyezik a hibás Vercel-build naplójával és a staging runbookkal.
- `SELECT 1 AS connection_ok`: sikeres, eredmény `1`.
- `information_schema.columns`, csak `public.services`: a build által kért oszlopok jelen vannak.
- Az eredeti szolgáltatáslekérdezés oszlopaival és feltételével, `LIMIT 0`: sikeres, 0 visszaadott sor. Üzleti adatot nem olvasott ki.

**Korlát:** a próbák a Neon connectorral történtek, nem a Vercelben tárolt hitelesítő adatokkal. A jelenlegi oszlophiány kizárható; a történeti buildhiba pontos oka és a Vercel production kapcsolat továbbra sem bizonyított. A sikeres staging build ezt nem helyettesíti. Nincs bizonyítékot igénylő migrációs javítás.

## Friss ellenőrzések

- Egységtesztek: 128/128 sikeres; új regressziós tesztek a közös cache-érvénytelenítésre, valódi jogi metaadatgenerálásra és biztonságosan korlátozott DB-diagnosztikára.
- ESLint, TypeScript `--noEmit`, copy guard (213 fájl, 33 ellenőrzés): sikeres.
- Next 16.2.6 build, staging olvasással: 100/100 generált oldal, sikeres.
- Munkafa `git diff --check`: sikeres. A teljes korábbi PR-diff két nyers robots.txt bizonyítékának üres sora megőrzött auditadat.
- Független specifikációs és kódminőségi review: PASS, javítandó észrevétel nélkül.
- Helyi HTTP: DE adatvédelem/ÁSZF 200, noindex, saját canonical, nincs hreflang; EN impresszum 200, angol leírás, HU/EN alternates; FR szolgáltatás 200/noindex, HU szolgáltatás 200/index. A preview környezeti noindex fejléc változatlan.
- Az `a2a9aad` commit GitHub CI-je sikeres. Első Preview-buildje a DE adatvédelmi oldal generálásakor Neon `fetch failed` hibával leállt; ugyanaz a commit változtatás nélkül újraépítve sikeres (`dpl_AquiLwBemphpHwNDaY5g4UL9J4p7`). Ez az új eset átmeneti kapcsolatkimaradásra utal, de nem bizonyítja a júniusi production hiba okát.

## F3 – jóváhagyott staging-tartalomszinkron

A felhasználó a konkrét dry-run megtekintése után mindkét staging-javítást engedélyezte. Cél: `br-round-fog-al4isa1i`, endpoint `ep-twilight-sound-al2b7jsb`, `neondb`.

- Előzetes helyi mentés: `afm-staging-before-content-sync-1792239512776.json` az operációs rendszer ideiglenes mappájában, a 2 tanúsítvány és 2 szolgáltatás érintett adataival.
- `db:update-certs -- --apply`: 2 sor, 12 változó mező; ISO 9001 MartonCert, ISO 27001 MCert kiállító, helyes szabványok és HU/EN/DE/ZH leírások.
- `db:update-response-time-contact-copy -- --apply`: 2 sor, 4 HU/EN process mező; az első lépés a következő munkanapig történő kapcsolatfelvételt írja le, az ajánlat elkészítési idejét külön kezeli.
- Mindkét szkript előtte staging célvédelmet futtatott; az alkalmazás utáni dry-run egyaránt **0 sor / 0 mező** további változást mutatott.
- Ez nem production-szinkron és nem az ÁSZF-változás jogi jóváhagyása. A friss tartalmat új Preview-builddel kell újragenerálni.

## Nyitott és külön jóváhagyást igénylő tételek

- F1: a production Vercel-kapcsolat bizonyítása és a pontos eredeti hiba elkülönítése.
- F2: a korábban ki nem adott ÁSZF-válaszidő vállalás jogi/tulajdonosi jóváhagyása.
- F3 staging-adatjavítás elkészült; a frissen újragenerált Preview tartalmi ellenőrzése zárja le.
- F4: külön `codex/security-dependency-fixes` ág; a forrásjavításokat nem keveri a biztonsági frissítéshez.
- DE/FR/KO/ZH anyanyelvi/jogi review és a review-oldalak kiadási döntése; az indexelési kapu zárva marad.
- F6 további integrációs tesztek, F9 404-metaadatok, F10 sitemap döntés, F11 strukturált adatok, F12 további OG-metaadatok, F14 fókuszkezelés, F15 dokumentáció, F17 domain-redirect és mobil LCP: további feladatok, nem készre jelentett javítások.
- Production deploy és éles smoke, valódi CMS-/űrlapfolyamat, Microsoft-belépés, Search Console/Bing/valódi robotforgalom külön ellenőrzésre vár.
