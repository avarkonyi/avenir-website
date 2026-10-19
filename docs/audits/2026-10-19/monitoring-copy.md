# Távfelügyeleti szövegek — 2026-10-19

## Elfogadott üzleti alap

A tulajdonos közvetlen válaszai:

- „Saját felügyeleti központunk fogadja és kezeli a jelzéseket 24/7.”
- Minden jelzés, ellenőrzési lépés és eszkalációs döntés naplózva megmarad: „Mindhárom minden esetben naplózva megmarad”.
- Soft FM és Hard FM esetében saját munkatársak, jóváhagyott alvállalkozók/szakcégek és az ügyfél meglévő szolgáltatóinak koordinálása is helyes működési modell.

A magyar jogi alap és az ISO megléte korábban elfogadott. Ez a dokumentum nem új jogi vagy anyanyelvi jóváhagyás, és nem igazol új hatósági dokumentumot.

## Változás

A távfelügyeleti oldalon nyelvenként négy szöveghely igazodik az elfogadott működéshez: a bevezető megnevezi a saját központot; a hosszú leírás és a negyedik GYIK-válasz biztos naplózást és lehetséges utólagos elemzést mond; a kilencedik GYIK-válaszban a naplózás ténnyé válik. A minden jelzés/ellenőrzés/eszkaláció naplózását már kimondó bizalmi bekezdés megmarad.

- HU: a seed-forrás frissül, a megjelenő tartalom továbbra is CMS-adat.
- EN: a fordítási mátrix négy rekordjának HU/EN cellái frissülnek, a megjelenő tartalom továbbra is CMS-adat.
- DE/FR/KO/ZH: a meglévő szolgáltatásobjektumok négy-négy mezője frissül.
- CMS: egyetlen szolgáltatásrekord (`id=6`, `tavfelugyelet-vonuloszolgalat`), hat oszlop, összesen nyolc szövegrész. A két GYIK-tömbben csak a 3. és 8. indexű válasz változik; a kérdések és a többi válasz megmarad.

Az új updater alapból csak előnézetet készít. Ellenőrzi az adatbáziscélt, a rekordot, a régi szövegek pontos és egyedi előfordulását, a GYIK-kérdéseket és indexeket. Az írás egyetlen UPDATE, az eredetileg kiolvasott hat teljes oszlopérték összehasonlításával. Közben változott tartalomnál leáll; részleges alkalmazást nem folytat automatikusan.

## Auditkövetés

| Tétel | Döntés és korlát |
| --- | --- |
| HUA-005 | Mindkét üzleti kérdés megválaszolt; a saját központ és a minden esetben történő naplózás elfogadott. A tényleges CMS/kiadási állapotot külön kell követni. |
| DES-002, ENS-001, ENS-004, KOS-004, KOS-051, ZHS-032; FRS-001, FKZ-001, FKZ-002 ide tartozó része | A központ és folyamatos jelzésfogadás tényét már nem kell jóvá nem hagyott túlzásnak tekinteni. Ez nem a több részből álló auditmegállapítások automatikus teljes lezárása. |
| ENS-006 | A helyes irány: `are logged and can be analysed`; a naplózás tény, az elemzés lehetőség. |
| HUA-018, EDU-015, FKZ-005, KOS-052 teljesítési modellre vonatkozó része | Tulajdonosi döntéssel rendezett; a Soft/Hard FM működési modellje marad. |
| EDU-002, DES-006 egyéb részletei | A saját központ nem dönt el külön tanúsítási vagy más fordítási eltérést. |

## Ellenőrzési és kiadási állapot

- Kiinduló main: `257e779c95e8fc8976381fbbcae40d2b6f08971c`; ág: `codex/monitoring-copy-oct19`.
- Kiinduló unit suite: 167/167 PASS.
- Staging csak olvasó célazonosítás: `ep-twilight-sound-al2b7jsb`, `br-round-fog-al4isa1i`.
- A kiolvasott HU/EN bevezető, a hosszú leírás minden bekezdése és a két érintett GYIK-válasz a nyilvános éles oldalak szövegével egyezik: 12/12 ellenőrzés.
- Független szemantikai és kódbiztonsági review: PASS.
- Teljes lint, TypeScript, 179 unit teszt (ebből 12 új frissítővédelmi teszt), 33 copy check és helyi build: PASS. Az új tesztek RED → GREEN sorrendben készültek. A helyi build még a staging-írás előtti adatokkal futott; a friss Preview külön ellenőrzi a javított CMS-tartalmat.
- A tulajdonos konkrét staging-engedélye: „Igen, ezek mehetnek stagingben”. Az ellenőrzött staging-célon egy rekord hat oszlopa frissült. Visszaolvasás után mind a nyolc részszöveg már alkalmazott állapotú; az ismételt dry-run 0 oszlopot módosítana. Minden más mező ellenőrzőösszege előtte és utána azonos.
- Preview és éles kiadás: még nem történt meg. A forrás és a staging elkészült; az éles tartalom továbbra is a korábbi verzió.

## Üzemeltetési parancsok és visszaállítás

Az updater nem fut buildből vagy automatikus deployból. A repo gyökerében:

```text
node scripts/verify-db-target.mjs --target staging --runtime-only
node node_modules/tsx/dist/cli.mjs scripts/update-monitoring-copy.ts --dry-run
```

Az `--apply` csak konkrét jóváhagyással használható. Productionnél mindkét parancshoz `--target production --allow-production` szükséges, külön célazonosítás és kiadási jóváhagyás után. Az aktuális adatoknak a jóváhagyott régi részszövegeket kell tartalmazniuk; részleges vagy eltérő állapotnál nincs automatikus helyreállítás.

A helyi, csak operatív bizonyítékok az `audit-artifacts/monitoring-copy-2026-10-19/` mappában vannak: `staging-before.json`, `staging-proposal.json`, `staging-apply.log`, `staging-after.json`, `staging-after-dry-run.log`. Ezek teljes korábbi értékeket őriznek a hat oszlophoz. Visszaállítás csak a mentett korábbi értékekre, a jelenlegi értékek összehasonlításával és külön célzott jóváhagyással történhet; teljes seed/import nem használható.

A CLI-adatfrissítés nem üríti a Next.js gyorsítótárát. Új build vagy támogatott revalidálás után ellenőrizni kell a HU/EN szöveget és a FAQ JSON-LD-t is. A kiadáskor a kód és a jóváhagyott adatfrissítés sorrendjét ezért össze kell hangolni.

Nincs design-, működési, útvonal-, indexelési vagy jogi változás. A régi 506 auditmegállapítás teljes lezárását ez a célzott javítás nem jelenti.
