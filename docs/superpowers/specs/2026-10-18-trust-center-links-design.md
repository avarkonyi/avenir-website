# A01 – Megfelelőségi központ bekötése

## Jóváhagyott döntés

A tulajdonos 2026-10-18-án a „Lábléc + kapcsolódó tartalmi részek” megoldást választotta. A chatben bemutatott terv szerint HU/EN nyelven kerül link a láblécbe, a főoldali tanúsítványok alá, valamint az objektumőrzés és portaszolgálat bizalmi részébe. Felső menüpont nem készül.

## Szöveg és cél

| Nyelv | Felirat | Kísérőszöveg | Cél |
|---|---|---|---|
| HU | Megfelelőségi központ | Tekintse át cégadatainkat, ISO-tanúsítványainkat és engedélyezési információinkat. | /hu/megfelelosegi-kozpont |
| EN | Trust Center | View our company details, ISO certificates and licensing information. | /en/trust-center |

A lábléc csak a linkfeliratot mutatja; a tartalmi helyeken a mondat és alatta a link jelenik meg. A célutakat a meglévő trust-center-routes helper szolgáltatja. A tartalmi link visszafogott, aláhúzott, billentyűzettel elérhető és mobilon tördelhető.

## Határok

A változtatás kizárólag navigáció és rövid kapcsolódó szöveg. Nincs adatbázisírás, új route, új indexelhető nyelv, felső menüpont, új tanúsítási/jogi állítás vagy analytics-esemény. A review-nyelvek ezen a módosításon keresztül nem kapnak új linket. A többi szolgáltatásoldalon csak a közös HU/EN lábléc változik.

## Átvétel

- HU/EN főoldal: link a tanúsítványok alatt és a láblécben.
- HU/EN objektumőrzés és porta: link a bizalmi részben és a láblécben.
- Egy másik HU/EN szolgáltatás: csak lábléclink.
- DE/FR/KO/ZH minták: nincs új Trust Center link.
- A linkcélok helyes nyelvű, meglévő oldalakra vezetnek; a nav és a sitemap változatlan.
- Meglévő unit ellenőrzések, lint, TypeScript, build és célzott HTTP/böngészős előnézeti ellenőrzés.

## Kiadás

Alap: main `a068eba`; branch: `codex/trust-center-links`. Előnézet és PR készül. A mostani választás az elhelyezés és megvalósítás jóváhagyása; éles merge/deploy előtt a konkrét előnézetet kell átadni a projekt kiadási rendje szerint.
