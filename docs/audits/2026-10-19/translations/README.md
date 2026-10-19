# AFM fordítási felülvizsgálat — 2026. október 19.

Állapot: **forrásjavítás elkészült; a jóváhagyott 68 szolgáltatásmező stagingben alkalmazva és Preview-n ellenőrizve; nincs élesítés**.

A felhasználó a 68 szolgáltatásmező előtte–utána listájának átnézése után „elfogadom” válasszal jóváhagyta a kért staging-frissítést. Az alkalmazás 2026. október 19-én 15:11-kor (Budapest) sikeres volt. Ez az engedély nem terjed ki production-kiadásra vagy a külön hat CMS-mezőre. [Alkalmazási és ellenőrzési jegyzőkönyv](staging-application.md).

## Eredmény

A korábbi 506 tételes audit **408 fordítási tételét** egyeztettük a jelenlegi forrással, staginggel és éles oldalakkal. A 98 HU-A/HU-B tétel nem ennek a fordítási körnek a része. Egy audit-ID több szövegmezőt is érinthet; a számok nem hibás oldalak vagy adatbázismezők számát jelentik.

| Státusz | Eredeti audit-ID |
| --- | ---: |
| Ebben a körben forrásban javítva, még nincs kiadva | 102 |
| Korábban már rendezve | 108 |
| Stagingben javítva, élesítésre vár | 60 |
| Részben stagingben javítva, külön maradék nyitva | 2 |
| Külön CMS-csomagban nyitva | 4 |
| Forrásadat vagy külső dokumentum pontosításához kapcsolódik | 5 |
| Mai forrásból nem igazolt hiba / elfogadott üzleti tény | 36 |
| Opcionális stiláris javaslat | 91 |
| **Összesen** | **408** |

Tételes döntések és bizonyítékok: [findings.csv](findings.csv), [findings.json](findings.json). A forrásjavítás és a CMS-frissítés külön státusz: ahol egy auditpont mindkettőt érinti, a CMS-feladat nyitva marad.

## Mit javít a forráscsomag?

- EN: főoldali és űrlapszövegek, HU-hű jogi/pályázói illetékességi mondatok, hibabejelentési megnevezések, Trust Center szöveg. Az EDPB angol hivatkozás újabb ellenőrzése külön hibás linket talált: a régi URL HTTP 403/HTML, a hivatalos 2026-04 URL HTTP 200/PDF; az EN URL javítva.
- DE: szolgáltatások és jogi fordítások jelentésbeli pontossága, hiányzó/eltérő részletek, munkanap megnevezése, a magyarhoz igazított impresszumdátum.
- FR: szolgáltatásfordítások, feltételes állítások, jogi linkcímke, nem törő szóközök a javított szövegekben.
- KO/ZH: szolgáltatási szakkifejezések és feltételes állítások, kártyák tartalma, hiányzó pályázói adatkezelési linkfeliratok az angol dokumentum nyelvének jelzésével.
- Az űrlap szolgáltatás-előtöltése hiányzó CMS-opciónál is saját nyelvű címkét használ. A koreai külön szövegréteget is kezeli; az ismert CMS-címke elsőbbsége megmarad.

A magyar jogi szöveg elfogadott forrás. Az ISO megléte, a saját 24/7 felügyeleti központ, a teljes naplózás és a Soft/Hard FM vegyes teljesítési modellje elfogadott. E tényeket nem nyitjuk újra.

## CMS-csomagok állapota

1. **8 szolgáltatás, 68 mező — stagingben alkalmazva:** 44 EN + 11 DE + 13 ZH. EN-en belül 89 szövegrész változott. [Teljes előtte–utána lista](cms-proposal.md), [gépi javaslat](cms-proposal.json). Friss régiérték-ellenőrzés után egyetlen tranzakcióban alkalmazva; teljes soros visszaolvasás igazolja, hogy a magyar és minden más mező változatlan. Preview smoke: **569/569 PASS**; a 68 oszlop 399 szövegrészének megjelenési ellenőrzése: **68/68 PASS**, 11 útvonalon. A javaslat és a korábbi dry-run változatlan történeti jóváhagyási pillanatkép; az alkalmazás aktuális állapotát a [jegyzőkönyv](staging-application.md) és a [receipt](staging-application.json) rögzíti.
2. **Külön 6 mező, 3 rekord — alkalmazatlan:** az álláshirdetés „Budapest / országosan” helyszíne EN/DE/ZH nyelven; ISO9001 leírásban maradt angol részlet DE/ZH nyelven; staging EN hírcikk négy régi szolgáltatásneve. [Javaslat](extras-cms-proposal.json), [bizonyíték](extras-review.md). A hírcikk élesben már helyes. Ezek nem részei az első 68 mező jóváhagyási körének. Nyitott audit-ID-k: EDU-019, EDU-021, EDU-046, FKZ-015. Az FKZ-031 kiállító/szabvány/terjedelem tétele a korábbi javítás bizonyítéka alapján lezárva; a megmaradt angol leírásrészletet az FKZ-015 külön követi.

A külön álláshirdetési csomag alkalmazása előtt a FR/KO `careerFallbacks` térképeknek az új angol helyszínkulcsot is támogatniuk kell; a seed/update eszközök régi szövegeit is felül kell vizsgálni. A külön csomag ezért még nem alkalmazásra kész.

**Részleges javítás, EDU-017:** a szolgáltatási német megnevezések stagingben javítva. Ugyanez az audit-ID a német hírcikk régi „personelle Objektbewachung, Empfangs- und Portierdienste” kifejezéseit is érinti; a hírcikk nem része a 68 szolgáltatásmezőnek vagy a külön hatmezős javaslatnak. Ez a maradék külön előkészítést igényel, az auditpontot nem tekintjük teljesen lezártnak.

**Részleges javítás, ENS-049:** a Mystery Shopping felsorolásában és GYIK-jében a „folyamatkövetés” fordítása stagingben javítva. A `seo_description_en` mezőben még `process follow-through` maradt; itt is `process adherence` szükséges. Ez az egy mező nincs a jóváhagyott 68 mezőben vagy a külön hatmezős javaslatban, így külön nyitott. Az ENS-057 kapcsolódó kártyáit és reception/Soft FM metaadatait visszaellenőriztük: már helyes, magyarhoz hű szövegek; ott nem maradt bizonyított hiba.

## Mi marad külön nyitva?

- **Nemzetbiztonsági névjegyzék:** az új, 2029-ig érvényes okirat pontos száma és dátuma, valamint a dokumentumtípus pontos megnevezése. Nem következtetünk lejárt jogosultságra.
- **IAF MLA strukturált adat:** az alany megnevezése pontatlan. Az akkreditáló testület aláírói szerepét kell megkülönböztetni a tanúsító és a tanúsítvány szerepétől. Ez közös schema/adatmodell-pontosítás, nem az ISO meglétének kérdése.
- **Magyar EDPB-dokumentumhivatkozás:** a jelenlegi magyar PDF elérhető, de régebbi; magyar v2-t a hivatalos oldal nem kínált. Az angol működő v2-link javítva, a magyar elfogadott tartalom változatlan.
- **Külön üzemeltetési tényellenőrzés:** a kapcsolati értesítés végső vállalati postafiókjának adatútja. A HU/EN felsorolás között nincs igazolt fordításeltérés; ez nem általános jogi jóváhagyási blokk.
- **Opcionális nyelvi egységesítés:** címek nagybetűzése, brit/amerikai írásmód, dátum- és központozási stílus, néhány természetesebb szóválasztás. A 91 stiláris észrevételt nem minősítjük automatikusan hibának.

## Ellenőrzés és korlátok

- 81 éles HTTP-oldal tartalma/metadata/alt/aria/JSON-LD ahol renderelődött; közülük 6 ismeretlen útvonal 404. A 404-törzsszöveget külön, tényleges böngészőben is ellenőriztük mind a hat nyelven.
- A jelenlegi hatnyelvű forrás és szolgáltatásszövegek összevetése; friss, célazonosított staging-olvasás a nyolc szolgáltatásra és a kapcsolódó publikált CMS-tartalmakra.
- Unit teszt: **212/212 PASS**; copy guard: **33/33 PASS**; lint, TypeScript és build sikeres. A forráscommit (`2d7424a`) CI-ja sikeres. A staging-frissítés után újraépített Preview Ready, **569/569 smoke PASS**; a forráscsomag korábbi 12 képernyőméret-mérése mellett a friss CMS-sel további 6 EN/DE/ZH mobil/asztali mérésen nincs vízszintes túllógás. Részletek és korlátok a [jegyzőkönyvben](staging-application.md).
- Független kód- és szemantikai ellenőrzés. A koreai fallback-eltérés a review során előkerült és javítva lett. A HU szövegek, a védett design/CSS és indexelési szabályok változatlanok; a kliens nyolc szolgáltatáscímkével bővebb adatot kap.
- Ez nem anyanyelvi lektori tanúsítás vagy új jogi jóváhagyás. A FR/KO/ZH jogi linkek továbbra is az angol dokumentumot jelölik; nem állítunk teljes, saját nyelvű jogi dokumentumkészletet.

Következő kiadási lépés: külön production-jóváhagyás a PR #14 merge-éhez és ugyanezen 68 szolgáltatásmező célazonosított, friss régiérték-ellenőrzéssel védett éles alkalmazásához; utána production smoke és célzott szövegellenőrzés.
