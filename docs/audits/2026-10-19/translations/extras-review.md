# Nem szolgáltatási CMS-maradék – ellenőrzés

Ellenőrizve: 2026-10-19T09:31:30.035Z. Csak nyilvános tartalommezők SELECT-je az engedélyezett stagingen (ep-twilight-sound-al2b7jsb), explicit read-only tranzakcióban; a tranzakció read-only állapota ellenőrizve. A mai éles snapshotokkal összevetve. Sem adatbázis-, sem forrásmódosítás nem történt; a 68 mezős szolgáltatási csomag érintetlen.

| Audit | Eredmény | Következő lépés |
|---|---|---|
| EDU-019 | Igazolt EN/DE/ZH helyszínhiba stagingen és élesben | 3 helyszínmező; a HU „Budapest / országosan” jelentésének visszaállítása |
| FKZ-015 | ISO 9001 ZH leírásában angol scope-részlet stagingen és élesben | 1 leírásmező, a meglévő 全面安保服务 scope felhasználásával |
| EDU-021 | Régi túlállítás és 2022-es szabvány javítva; DE angol scope-részlet maradt | 1 leírásmező, a meglévő Umfassende Sicherheitsdienstleistungen scope felhasználásával |
| EDU-022 | MartonCert / MCert már helyes stagingen és élesben | Nincs módosítás |
| EDU-046 | Éles cikk helyes, stagingben a négy régi szolgáltatásnév maradt | 1 body_en mező; a javasolt teljes törzs egyezik az élessel |

A külön **extras-cms-proposal.json 6 mezőt / 3 rekordot** tartalmaz teljes előtte–utána értékekkel: positions.id=1 (3 mező), certifications.iso-9001 (2 mező), news.megujult-az-avenir-weboldala-es-arculata (1 mező). Ez javaslat, nincs alkalmazva.

Opcionális: a német állásnevek m/w/d jelölése és a Standard → Norm szóválasztás. Ezekből nem állapítottunk meg bizonyított fordítási hibát vagy új jogi kötelezettséget, ezért kimaradnak. A további három aktív állás Budapest-helyszíne megfelelően fordított. A 27001 standard és tanúsítási hatókör állításai már a javított, visszafogott forrást követik.

scripts/seed.ts és scripts/update-positions-prod.ts megőrzik a régi helyszínértékeket; scripts/seed.ts és scripts/update-certifications-prod.ts az angol DE/ZH scope-részleteket. A CMS-javítás későbbi alkalmazásakor ezeket külön felül kell vizsgálni a visszaírás elkerülésére; most egyik sem változott.

Bizonyítékok: staging-extras.json; extras-review.json; az aznapi külső live-before.json és live-extra-before.json. A hírcikk négy cseréje a meglévő scripts/launch-news-en-service-label-replacements.ts tiszta transzformációjával is egyezik.
