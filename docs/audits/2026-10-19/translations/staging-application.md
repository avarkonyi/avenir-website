# Jóváhagyott fordítási CMS-csomag — staging-alkalmazás

2026. október 19., 15:11 Budapest. **Staging kész; production-jóváhagyás nincs.**

## Engedély és hatókör

A tulajdonos a 68 szolgáltatásmező előtte–utána listájának átnézése után „elfogadom” választ adott a staging-frissítésre. A csomag nyolc szolgáltatás 44 EN, 11 DE és 13 ZH mezőjét tartalmazza. Magyar mező, más rekord vagy a külön hat CMS-mező nem része a műveletnek.

Jóváhagyott `changes` SHA-256: `da02b01b2676c1827b0a621829b9cbe16e2ae4061489e5d984bb0081679431e6`. A `cms-proposal.json` és `cms-proposal.md` változatlan jóváhagyási pillanatképek: az ottani alkalmazatlan státusz a létrehozás időpontjára vonatkozik; az alkalmazást ez a jegyzőkönyv rögzíti.

## Adatbázis-ellenőrzés

- Azonosított staging endpoint: `ep-twilight-sound-al2b7jsb`; branch: `br-round-fog-al4isa1i`. A célazonosítás a tranzakcióban is megtörtént.
- Friss csak olvasó próba: 68/68 régi érték egyezett. A nyolc teljes szolgáltatássor mentése írás előtt elkészült, felülírást tiltó fájllétrehozással.
- Nyolc paraméterezett UPDATE egyetlen Serializable tranzakcióban. Minden érintett korábbi mező értéke a WHERE feltétel része; nulla módosított sor hibát és tranzakció-visszagörgetést okoz.
- Nyolc rekord frissült, mindegyik pontosan egyszer. A tranzakción belüli teljes soros visszaolvasás eredménye a commit után egyezett a mentett sorok és a 68 jóváhagyott változtatás kombinációjával. Magyar vagy más oszlop nem változott.
- Külön utólagos olvasás: 68/68 jóváhagyott új érték egyezik.
- A végrehajtó eszköz stagingre rögzített; production-célra nem használható. Production-művelet nem történt.

Gépi igazolás: [staging-application.json](staging-application.json). A nyolc teljes soros mentés, a végrehajtó eszköz és a részletes naplók a helyi `audit-artifacts/translation-review-2026-10-19/` mappában maradnak.

## Preview QA a friss staging-adatokkal

- Forráscommit: `2d7424a56d6a4fb7cd92ed12ef5cc518156f82cd`.
- Deployment: `dpl_GH4VEp7gqaCmRKsZoMywyZLTtSkz`, **Ready / Preview**. A staging-frissítés után újraépítve.
- [Ellenőrzött angol portaszolgálati oldal](https://avenir-website-jcvbbhse2-andrasvarkonyi-7800s-projects.vercel.app/en/szolgaltatasok/portaszolgalat).
- Általános Preview smoke: **569/569 PASS**, űrlapbeküldés nélkül.
- A 68 módosított oszlop 399 szövegrésze ellenőrizve 11 útvonal megjelenített tartalmában, metaadataiban és JSON-LD-jében: **68/68 PASS**. A 399 szám a teljes oszlopok változatlan tömbrészeit is tartalmazza, nem 399 új javítást jelent.
- Az objektumőrzés meglévő jóváhagyott folyamatfelülírása továbbra is az egyeztetett időpontot írja ki a régi 1–3 munkanapos CMS-mondat helyett. Az ellenőrző az elfogadott mondat jelenlétét és a régi hiányát is vizsgálja.
- Böngészős szúrópróba: angol portaszolgálat, német és kínai főoldal, 390 és 1365 pixel beállított szélességen. **6/6 vízszintes túllógás nélkül**, oldalanként egy H1. A német/kínai szolgáltatásválasztó nyolc helyes lokalizált címkét és kanonikus szolgáltatásértéket ad. Új elrendezési hibát a mintában nem találtunk; ez nem teljes vizuális vagy akadálymentességi audit.
- A korábbi forráscsomag ellenőrzése megmarad: 212 unit teszt, 33 copy guard, lint, TypeScript, build és CI sikeres; hat nyelv 12 mobil/asztali mérése túllógás nélkül. E staging-lépés nem módosította az alkalmazáskódot.

## Kiadásra váró és külön nyitott tételek

A 408 fordítási audit-ID-ból 62 érintett CMS-tétel: **60 teljesen stagingben javított**, az **EDU-017 és ENS-049 részben javított**. A német hírcikk régi megnevezései és a Mystery Shopping `seo_description_en` mezőjének `process follow-through` → `process adherence` javítása nincsenek a 68 szolgáltatásmezőben. A szolgáltatási javítások 102 forrásjavítással együtt production-kiadásra várnak. Az FKZ-031 a korábbi bizonyíték alapján már javított volt, így a korábban rendezett tételek száma 108. Négy audit-ID marad a külön hatmezős CMS-javaslatban: EDU-019, EDU-021, EDU-046, FKZ-015. Az EDU-017 és ENS-049 maradéka azon felül nyitott; külön előtte–utána javaslat szükséges hozzájuk. Az ENS-057 kártya- és metaadat-hivatkozásait a végső review ellenőrizte: már helyesek.

A következő lépés külön kiadási jóváhagyás a PR #14-re és ugyanennek a 68 mezőnek az éles alkalmazására. A célazonosításnak és a régiérték-ellenőrzésnek productionön is frissen teljesülnie kell. Eltérés esetén az adott adatfrissítés megáll, nem írja felül automatikusan az időközben módosított tartalmat. Élesítés után külön production smoke és szövegellenőrzés szükséges.
