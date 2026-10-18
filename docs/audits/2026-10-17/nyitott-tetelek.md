# AFM szövegaudit – nyitott tételek

Állapot: 2026-10-18, a tulajdonosi megerősítések átvezetése után. A cég ISO-tanúsítottsága elfogadott. A magyar jogi szöveg ügyvéd által ellenőrzött, a többi nyelvre irányadó forrás. A fordítási ellenőrzés és az éles kiadás ettől külön feladat.

Az **506 eredeti auditazonosítóból 108 forrásban javított**, 4 korábban stagingben javított, 2 eltávolított tartalomhoz tartozik, 3 pedig nem igazolt hiba. **13 további sor a magyar jogi forrás elfogadásával lezárt; 376 sor nyitott vagy részben javított.** Ez összesített állapot, nem mind új javítás ebben a körben. Az eredeti 51 P1-ből 32 forráshiba javított, 19 nyitott/részleges; a kiadási feltételek továbbra is érvényesek.

| Nyitott státusz | Darab | Következő lépés |
| --- | ---: | --- |
| További forrás- és nyelvi ellenőrzés | 306 | Az eredeti javaslat és a jelenlegi kimenet összevetése; nem mind bizonyított hiba |
| Részben javított, összevont sor | 24 | A sor megmaradt részének külön ellenőrzése |
| Dokumentum / tény igazolása | 12 | Tulajdonosi vagy szolgáltatói bizonyíték |
| Fordítási paritás | 2 | A HU-ban nem szereplő DE jogi betoldások eltávolítása |
| Konkrét CMS-javítás | 13 | Előtte–utána csomag staging-jóváhagyása és alkalmazása |
| Üzleti döntés | 8 | Szolgáltatási vállalás pontosítása |
| Kiadás / production-visszaellenőrzés | 7 | Jóváhagyott élesítés utáni ellenőrzés |
| Szerkesztési döntés | 4 | Hangnem vagy terminológia kiválasztása |

A [teljes ellenőrzési jelentés](text-audit-closure-verification.md) rögzíti a 145 unit teszt, a build, a 15 oldalpróba és a 9 analitikai regressziós próba eredményét. A CSV-ben minden sorhoz megmaradt a prioritás, a bíráló, az eredeti szöveg, indoklás, javítási javaslat, valamint az új felelős és következő lépés.

## Döntés vagy dokumentum szükséges a tulajdonostól

| Téma | Mi kell a lezáráshoz? | Auditazonosítók |
| --- | --- | --- |
| Távfelügyelet 24/7 | Pontos szolgáltatási terjedelem: diszpécseri háttér, folyamatos jelzésfogadás vagy felügyeleti központ? | DES-002, KOS-004, ENS-001, EDU-002; FRS-001/FKZ-001/FKZ-002 fennmaradó része |
| Hard FM / Soft FM teljesítés | Kizárólag saját állomány, vagy jóváhagyott alvállalkozó / ügyféloldali szolgáltató koordinálása is? | HUA-018, EDU-015, FKZ-005, KOS-052 |
| Új nemzetbiztonsági határozat | A közlés szerint 2029-ig érvényes. Pontos határozatszám, dátum és érvényességi adat kell; nem lejárt jogosultságként kezeljük. | HUA-002, HUB-002, ENB-008, DEB-018 |
| További vállalások, bizonyítékok | Az 1–3 munkanapos helyszíni felmérés, a munkatársi képesítések, engedélyterjedelem dokumentált alátámasztása. | HUA-004/016/020; részletek a CSV-ben |

## Elfogadott jogi forrás és fordítási követelmények

A [2026-10-18-i tulajdonosi döntés](owner-confirmations-2026-10-18.md) szerint a magyar jogi szöveg ügyvéd által ellenőrzött és irányadó. Ennek általános jóváhagyását nem kérjük újra. A magyar jogi vállalások megtartandók, a többi nyelv feladata ezek hű fordítása.

- A panaszhatáridő, felelősségi és bírósági kikötések, jogszabályi hivatkozások és pályázói megőrzési szöveg újabb jogi jóváhagyását kérő tételek az elfogadott forrás alapján lezártak; az eredeti észrevételek a teljes CSV-ben megmaradnak.
- A fordítási, nyelvi, megjelenítési és belső szövegegyezési eltérések továbbra is javítandók. Nem kerülhet új jogi vállalás a fordításba.
- A DE Biztonságtechnika két külön GYIK-je és GDPR-betoldása nincs a HU forrásban: eltávolításuk fordítási paritási feladat (DES-003/004), nem új jogi döntéskérés.
- A süti-visszavonás technikai hibája és a HU/EN/DE jövő idejű leírása javítva. A tényleges Google-tag hálózati viselkedése, a GA4 megőrzési/adattovábbítási konfigurációja és a Microsoft 365 tényleges használata technikai egyeztetési kérdés marad; a működésnek kell megfelelnie az elfogadott tájékoztatónak.
- HUA-001: a tulajdonos külön elfogadta a „Nevet, e-mail-címet, telefonszámot, üzenetet vagy más űrlaptartalmat nem küldünk az analitikába.” mondatot. A hatnyelvű süti-sáv ehhez igazítva; a szövegezési döntés lezárt. A többi magyar tételt egyenként, közösen vizsgáljuk tovább.
- Az ISO-tanúsítottság ténye elfogadott. A fennmaradó ISO-sorokban a kiállító, szabvány, akkreditációs mező, CMS-adat és fordítás pontos megjelenítése vizsgálandó.

## Előkészített CMS-javítás – még nincs alkalmazva

A [konkrét előtte/utána javaslat](staging-text-corrections-proposal.json) friss staging-olvasáson alapul. **7 szolgáltatás 14 mezője** érintett:

- DE/ZH Objektumőrzés, Biztonságtechnika és Mystery Shopping rövid leírása: 6 mező.
- EN Recepció: adatkezelési állítás és riportálási GYIK: 2 JSON-mező.
- EN Soft FM: „first month” helyett a HU szerinti kezdeti működési időszak: 1 JSON-mező.
- EN Objektumőrzés: engedélyezési dokumentáció GYIK: 1 JSON-mező.
- EN Mystery Shopping: egyes munkatársak adataira és előzetes megállapodásra vonatkozó korlát: 1 JSON-mező.
- EN Távfelügyelet: lehetőségből ne legyen feltétlen vállalás, és ne kerüljön be új feltétel: 1 szöveg- és 1 JSON-mező. A 24/7 üzleti kérdés érintetlen.
- EN Hard FM: „összegezhetők / összehangolhatók” jelentés visszaállítása: 1 JSON-mező.

Lezárás menete: konkrét staging-írás jóváhagyása → friss érték-összehasonlítás és mentés → célzott módosítás → visszaolvasás és Preview-ellenőrzés. A korábbi négyrekordos staging-jóváhagyás erre az új csomagra nem terjedt ki. Production-módosítás külön marad.

Az EN szolgáltatásaudit további CMS-szövegjavaslatai is szerepelnek a teljes listában; a fenti 14 mezős csomag nem állítja az összes EN tétel lezárását.

## Nyelvi és szerkesztési ellenőrzés

Az egyértelmű jelentés- és nyelvtani hibák javítása után a szakterminológia, szolgáltatásnevek, címstílus, hangnem és idiomatikus megfogalmazás nyitott sorai anyanyelvi lektorhoz tartoznak. A teljes listában minden sorhoz megmarad az eredeti szöveg, indoklás és konkrét javítási javaslat.

Nem alkalmazunk automatikusan egymásnak ellentmondó javaslatokat, például többféle kínai kivonulási megnevezést. A jóváhagyott ügyfélmegjelenés bizonyítékhoz kötött jelentését sem cseréljük általános marketingállításra.

## Kiadás

A korábbi éles változatban látott hibák csak production-frissítés és célzott ellenőrzés után zárhatók le élesben. A draft PR és Preview ellenőrzése önmagában ezt nem teljesíti. A noindex nem hozzáférés-védelem; a nyilvános nyelvi kiadás előtt a tartalmi jóváhagyásokat is rendezni kell.

A külön draft PR #3-ban előkészített függőségjavítás és az éles admin/Entra/űrlapfolyamat próbája külön kiadási feladat. Ez a szövegaudit-kör nem alkalmazza és nem igazolja azokat.

## Teljes nyilvántartás

- [Mind az 506 auditazonosító státusza](text-audit-status.csv)
- [Csak nyitott és részben javított sorok](text-audit-open-items.csv)
- [Státuszok bizonyítékai és csoportosítása](text-audit-dispositions.json)

A `JAVITVA_FORRAS` a konkrét forráshiba javítását jelenti, nem production-lezárást. A `NYITOTT_ELLENORZES` sor nem automatikusan bizonyított hiba: az eredeti audit javaslata, amelynek teljes jelentés- és aktuális forrásellenőrzése még nincs lezárva. A prioritások az eredeti auditból származnak.

A `LEZART_JOVAHAGYOTT_FORRAS` a 2026-10-18-i tulajdonosi döntésen alapuló lezárás; nem új kódjavítás. A korábbi jelentések jogi jóváhagyásra váró megjegyzéseit ez a döntés felülírja a magyar jogi forrás tekintetében.
