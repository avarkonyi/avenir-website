> Ez az első javítási kör történeti jelentése. Az aktuális, tételes státusz a [nyitott tételek listájában](nyitott-tetelek.md) és a [506 soros nyilvántartásban](text-audit-status.csv) található.

# Szövegaudit – jelenlegi forrás és javítási státusz

Dátum: 2026-10-17. Kiinduló kód: `239c539`. Az eredeti Claude-audit a `claude-review/szoveg-audit/` könyvtárban változatlanul megmarad.

Az eredeti CSV 506 sora (51 P1, 151 P2, 304 P3) soronkénti triázson ment át. Ez nem mind az 506 állítás független nyelvi vagy jogi igazolása. Az audit a korábbi `c6824d6` állapothoz készült; a jelenlegi forrás és az éles oldal állapota külön kezelendő. A duplikált találatok nem külön kódhibák.

## Tulajdonosi pontosítás: nemzetbiztonsági névjegyzék

A tulajdonos 2026-10-17-i közlése: „van új, 2029-ig érvényes” határozat. A pontos határozatszám és nap jelenleg nem áll rendelkezésre; az új okiratot ebben a munkában nem ellenőriztük.

Ezért a T5 / HUA-002 / HUB-002 / ENB-008 / DEB-018 megállapítás helyes státusza: **elavult közzétett adat, az új határozat pontos adatainak pótlása szükséges**. Nem állítható ebből, hogy a névjegyzéki jogosultság megszűnt. Nem írtunk be kitalált 2029-es napot, és nem rendeltük a régi határozatszámot az új határozathoz. A nyilvános adat frissítése az okirat pontosítására vár.

## Ebben a csomagban módosított forrás

| Téma | Módosítás | Korlát |
| --- | --- | --- |
| T2 | FR/KO/ZH Biztonságtechnika: HU-ban nem szereplő GDPR-betoldás és két DE-only GYIK eltávolítása; 9 GYIK marad | A DE külön review-szöveg és jogi ellenőrzési kötelezettség megmarad |
| T3 | Hatnyelvű süti-sáv: az általános személyesadat-kizárás helyett az űrlapban megadott név/e-mail/telefon/üzenet analitikába küldésének kizárása | DPO-jóváhagyás nincs; nem állítja, hogy a GA nem kezel online azonosítókat |
| T9 | DE/ZH űrlap: tudomásulvétel az elfogadás helyett | Fordítási paritás, nem új hozzájárulási jogalap |
| T10 | DE/ZH három főoldali forráskártya közelítése a HU szolgáltatási terjedelemhez | A nem üres CMS-mező elsőbbséget élvez; az élő kártyák javítását ez nem igazolja |
| T11 | DE/FR/KO Mystery Shopping: a megfigyelési/fegyelmi cél kizárásának helyreállítása | Anyanyelvi ellenőrzés továbbra is szükséges |
| HU | Egyértelmű helyesírási javítások; `nyilatkozatokre` helyett `nyilatkozatokra` | A jogi tartalom érdemi átírása nincs benne |
| FR | Nem törő szóköz a francia látható próza írásjelei előtt | Nem URL-, kulcs- vagy programszintaxis-csere |

Érintett auditazonosítók: FRS-002/003/004, KOS-005/007/011, ZHS-001, DES-008, EDU-005, FKZ-003, HUA-009; részben HUA-010/011, FRS-014, FKZ-017, EDU-003/004/007, HUB-009, ENB-024, DEB-045. T3: HUA-001, EDU-006/011, FKZ-029. A részleges státusz nem jelent teljes lezárást. A HUA-012 hangnemjavaslatát nem alkalmaztuk.

Az importált audit `szkriptek/extract-text.ts` fájlja hiányzó `../repo` forrásokra hivatkozik; a dokumentációs bizonyítékokat kizártuk az alkalmazás TypeScript/ESLint forrásköréből. Az alkalmazás, saját scriptek és tesztek ellenőrzése megmarad.

## Korábbi javítások és auditpontosítások

- Forrásban már javított: DES-001, KOS-001–003, EDU-001, FKZ-001–002, ENB-022. FRS-001 részleges, mert a Távfelügyelet szövege külön döntést igényel.
- HUB-001 és ENB-006 következő munkanapi kapcsolatfelvételi mondata már javított a forrásban; az éles közzététel külön feladat.
- HUA-045/046, EDU-022, FKZ-031 és több tanúsítványtalálat korábbi staging-szinkronhoz tartozik. Az előző javítás jelentése a `repair-verification.md`; ez nem production-szinkron igazolása.
- T10: a DE „Personen- und Sachschutz” és a ZH megfelelője önmagában nem bizonyít személyvédelmi szolgáltatást. Az igazolható hiba a HU-hoz képesti terjedelemeltérés.
- T2: a KO/ZH „GDPR-elvek figyelembevétele” nem szó szerinti megfelelőségi garancia. Az igazolható hiba a jóváhagyott forrás bővítése.
- FRS-029, ENS-014, HUA-033 többértelmű vagy szerkesztési döntés; nem automatikus hibajavítás. HUA-042 angol security-policy linkje önmagában nem hiba. EDU-039 október 17-én CET helyett időzónatudatos formázást igényel.

## Nyitott döntések és további javítások

1. **T1 / 24/7:** általános diszpécseri háttér javítva, de a Távfelügyelet folyamatos jelzésfogadásának pontos terjedelmét a tulajdonosnak kell tisztáznia. DES-002, KOS-004, FRS-001 fennmaradó része, ENS-001, EDU-002.
2. **FM alvállalkozók:** saját állomány kontra alvállalkozó/ügyféloldali szolgáltató koordinálása még nyitott. HUA-018, EDU-015, FKZ-005, KOS-052.
3. **T4 / hozzájárulás visszavonása:** HU/EN/DE jövőbeli feltételes szöveg nem illeszkedik a már létező GA4-hez. A lábléc elutasítási állapotot ment, és a saját események ezt figyelik, de a már betöltött Google-script teljes leállítása nincs igazolva (`gtag` consent update / `ga-disable` / cookie-törlés nem látható). Szöveg és működés közös ellenőrzést igényel.
4. **T7 / EN v1.1:** a `getTermsContent` és `withLegalContent` HU-only felülírása miatt az angol régi marad. Együtt javítandó a cím, bevezetés, általános rendelkezések, módosítás, adatvédelem és UI-hivatkozások. Jogi fordítástervezet szükséges; e csomag nem állítja lezártnak.
5. **T8 / DE jogi paritás:** a runtime markdown 12 szakaszos átdolgozás. A teljes HU-paritáshoz a szakasztérkép és a DPO-blokk renderelése is javítandó. Bíróság, felelősség, panaszválasz és hatálybalépés közös jogi ellenőrzést igényel.
6. **T10/T12 és CMS:** DE/ZH főoldali DB-felülírások, EN recepciós adatvédelmi és Soft FM „first month” állítások külön, csak olvasó aktuális adatellenőrzés és konkrét staging-módosítási előnézet után kezelhetők. Új adatbázis-írás nem történt.
7. **További UI/nyelvi kör:** lokalizált hiba- és 404-oldalak, hírmorzsa aria-feliratok, LLM-összefoglalók és további determinisztikus szóhibák még nyitottak. A fennmaradó stiláris és szakszókincsbeli ajánlások anyanyelvi ellenőrzési listák; nincs 506/506 lezárási állítás.

## Jogi szövegtervezet – nem jóváhagyott, nem bekötött

T4 HU javaslat: „A hozzájáruláson alapuló adatkezeléshez – jelenleg a Google Analytics 4 használatához – adott hozzájárulás bármikor visszavonható a lábléc »Sütibeállítások« felületén az »Elutasítom« választással. A visszavonás nem érinti az azt megelőző, hozzájáruláson alapuló adatkezelés jogszerűségét.” A működés fenti hiányosságát publikálás előtt rendezni kell.

T7 EN bevezető javaslat: “This document provides information on the use of the www.afm.hu website, the contact and quote-request process, and the legal statements published on the website. It is not a set of general terms and conditions covering the Provider's entire business.” Cím: “Legal Statements”; hatályos HU-változat: 6 May 2026, v1.1. Ez résztervezet, nem teljes javított jogi dokumentum.

T8 DE egyeztetési cél: 13 HU-sorrendű szakasz és 14. Datenschutz/DPO-blokk; május 6-i v1.1 dátum, április 28-i első hatálybalépés megkülönböztetése; webhasználati elfogadás-betoldás eltávolítása; HU szerinti kapcsolatfelvétel, panaszválasz, felelősségi terjedelem, jogvita és archiválás hű fordítása. Az alapul szolgáló vállalások jogi jóváhagyása külön marad.

Elsődleges ellenőrzési források: [Google Analytics adatkezelés](https://support.google.com/analytics/answer/6004245?hl=en), [Google PII-szabályok](https://support.google.com/analytics/answer/6366371/), [GDPR 7. cikk (3)](https://eur-lex.europa.eu/eli/reg/2016/679).

## Ellenőrzés és közzététel

- Teljes tesztkör: **130/130 PASS**, benne a HU jogi cím ragozásának regressziója.
- ESLint és TypeScript: **PASS**. Az első tesztfutás régi `E-mail cím` placeholder-elvárását frissítettük a javított felirathoz, utána a teljes kör sikeres.
- Copy guard: **213 fájl, 33 ellenőrzés, PASS**.
- Staging cél igazolva: `ep-twilight-sound-al2b7jsb`, `br-round-fog-al4isa1i`; csak olvasás. Next build: **PASS, 100/100 oldal**.
- Generált HTML: FR/KO/ZH Biztonságtechnika noindex, 9 GYIK a JSON-LD-ben és a HTML-ben; HU `/aszf` helyes `nyilatkozatokra` alak. Ez helyi build-ellenőrzés, nem felhő-Preview vagy production igazolás.
- Külön spec review és utána quality review: **PASS**. A spec review által jelzett nem szükséges karrier-hangnemváltást visszavontuk.

Nincs élesítés, merge, új DB-írás vagy űrlapküldés. A noindex/sitemap/hreflang kapuk változatlanok. A noindex nem hozzáférés-védelem: az új nyelvek nyilvános kiadásához a nyitott tartalmi döntéseket is le kell zárni.
