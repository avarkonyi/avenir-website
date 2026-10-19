# EN CMS fordításjavaslat – független szemantikai review, 2026-10-19

**PASS – a vizsgált 89 részváltozásban nincs blokkoló új jelentéserősítés, jelentésgyengítés vagy nyelvtani hiba.** Ez tartalmi ellenőrzés, nem adatbázisírási vagy élesítési jóváhagyás. Sem DB-t, sem EN forrást nem módosítottam.

Vizsgált csomag: `C:/Users/andra/Documents/avenir weblap/audit-artifacts/translation-review-2026-10-19/en-cms-proposal.json`.

SHA-256: `a6babf1bff473f78b0b319d61e13915e6efabc4f4b628cc2b0d6bf2f66fe5e77`

Alap: a csomag mind a 89 leaf before/after/huSource értéke, a `staging-public-services.json` aktuálisan kiolvasott HU/EN mezői és az `en-services-proposed.json` összeállított végeredménye. A 89 részváltozás 85 különböző végső mezőre, 44 CMS-oszlopra és 8 szolgáltatásra vonatkozik.

| Szolgáltatás | Átnézett részváltozás | Eredmény |
| --- | ---: | --- |
| objektumorzes | 15 | PASS |
| portaszolgalat | 11 | PASS |
| biztonsagtechnika | 7 | PASS |
| mystery-shopping-helyszini-audit | 11 | PASS |
| tavfelugyelet-vonuloszolgalat | 15 | PASS |
| rendezvenybiztositas | 5 | PASS |
| hard-fm | 11 | PASS |
| soft-fm | 14 | PASS |

A modalitási módosítások a HU forrást követik: kapcsolódhat → can include; kezelhetők → may be processed; tartalmazhat → may include; összegezhetők/összehangolhatók → can be summarised/aligned. A látogatóadat-kezelésnél a szempontok figyelembevételét írja le a javaslat, és nem kész megfelelési eredményt ígér. A helyreállított saját vonulószolgálati folyamat, 24/7 háttér, minden jelzés/ellenőrzés/eszkáláció naplózása, valamint Soft/Hard FM alvállalkozói koordináció összhangban marad a jóváhagyott tényekkel.

A nagyobb átírások közül a mystery-shopping value proposition és a Soft FM hosszú leírás a HU-ban ténylegesen meglévő részleteket állítja vissza. A Soft FM első hónap helyett kezdeti működési időszak pontosítás megszünteti a forrás nélküli időígéretet. Az eseménybiztosítás nem ígér konfliktusmentességet, és a gyorsabb egyeztetést már nem gyorsabb megoldásként állítja.

Programozott ellenőrzés:

- Mind a 44 CMS-oszlop `before` értéke megegyezik a staging snapshot megfelelő oszlopával, és az `after` megegyezik az összeállított proposed snapshot értékével.
- Az azonos mezőn végzett egymás utáni részváltozások before/after lánca konzisztens; a végső érték megegyezik az utolsó lépéssel.
- Egyetlen nem-EN mező sem változott az összeállított snapshotban.
- A 89 `huSource` értékből 88 az azonos indexű aktuális HU mezőnek felel meg. Egy szándékosan jelentés szerinti párosítás van: `soft-fm.included_items_en[6]` → `included_items_hu[5]`. A régi EN listában az 5. és 6. elem sorrendje eltér a HU-tól; a javaslat a megfelelő szolgáltatókoordinációs tartalmat fordítja, és mindkét lista tartalmi elemei megmaradnak. Ez nem tartalmi hiba.
- Mind a 89 `beforeObservedLive` true. Ez a készítő által rögzített live-igazolás, nem a peer reviewer által újra lefuttatott hálózati ellenőrzés.

Nincs kötelező javítási javaslat. A csomag további kezelésekor az explicit staging célpontellenőrzés és az aktuális before értékek összehasonlítása továbbra is szükséges; a review nem végzett és nem engedélyezett írást.
