# Független végső forrásreview

Ellenőrzés: 2026. október 19., 09:36 UTC. Viszonyítás: a munkafa aktuális diffje a HEAD-hez; a pontos HEAD, a diff és a 36 módosított fájl lenyomata a `final-review-evidence.json` fájlban található.

**Eredmény: a vizsgált root/DE/FR módosításokban nem maradt nyitott javítandó finding.** Az ellenőrzés egy P2 Contact fallback hibát tárt fel; a root javítását az alábbiak szerint függetlenül visszaellenőriztem és lezártam.

Ez forrás- és jelentéshűségi review. A saját KO/ZH fordítási módosításaimnak nem adok vele független jóváhagyást: azok külön peer review alá tartoznak. A működési, böngészős és teljes build/test QA a root feladata. Ebben a reviewban alkalmazáskódot, adatbázist, commitot, távoli ágat és deploymentet nem módosítottam. Csak review-artefaktok keletkeztek.

## Megtalált és lezárt hiba

**FINAL-01, P2 — koreai Contact előválasztási fallback angolul. Lezárva.**

Az első diffben az `app/[locale]/page.tsx` a `t.services` tömbből adta át a fallback címkéket. A `ko.ts` az angol szolgáltatástömböt örökli; a koreai kijelzési szöveg a homepage overlayben található. Ezért ha a kért szolgáltatás hiányzott az átadott CMS opciók közül, a koreai Contact űrlap angol szolgáltatásnevet mutatott volna. Az első teszt az örökölt dictionaryt önmagával hasonlította, így nem jelezte a hibát.

A javítás az új `getContactServiceFallbackOptions` szerveroldali helperrel ugyanazt a locale overlayt használja, mint a szolgáltatáskártyák, és kizárólag a nyolc ismert canonical slugot és címkéjét adja át. A `canonicalServiceOptions` a már meglévő CMS címkét továbbra is előnyben részesíti.

Független futtatással ellenőrizve, HU/EN/DE/FR/KO/ZH mindegyikén:

- pontosan nyolc fallback, csak `slug` és `label` mezőkkel;
- a recepciónév megfelelő nyelvű, KO: `리셉션 및 게이트하우스 서비스`;
- a CMS címke nem íródik felül;
- a legacy alias és a canonical slug nem hoz létre duplikált opciót;
- ismeretlen kéréshez nem keletkezik fallback;
- a HU nyolc címkéje karakter szerint megegyezik a HEAD-beli hardcoded fallback map értékeivel.

A javított teszt explicit, hat nyelvi elvárt recepciónévvel dolgozik. A kiválasztás, a kézi módosítás elsőbbsége és a beküldés canonical slug szerződése forrás szerint megmaradt; a Contact API változatlan.

## Megőrzött korlátok

| Terület | Eredmény és bizonyíték |
| --- | --- |
| Magyar tartalom | `lib/i18n/hu.ts` változatlan. A módosított alkalmazásfájlok 17 `hu` AST tulajdonsága változatlan; ide tartozik a privacy, recruitment privacy, disclosure, trust, schema, SEO és közös UI HU része. A nyolc Contact fallback címke is változatlan. |
| Magyar klienspayload | A magyar tartalmi értékek megmaradnak. A serialized props szerkezete szándékosan bővül a nyolc elemű `serviceFallbackOptions` mezővel, ezért teljes HTML/RSC byte-azonosságot nem állítok. A bővítés csak slugot és címkét tartalmaz, teljes fordítási objektumot vagy parkolt szolgáltatásszöveget nem. |
| Design/CSS | Nincs CSS/SCSS/Sass módosítás. Az érintett JSX fájlok 107 `className`/`style` attribútuma változatlan. A Career kódban csak megjegyzés változik; a már meglévő notice helyére kerül a KO/ZH szöveg. A hosszabb fordítások tördelésének vizuális ellenőrzése a root QA része. |
| Indexelés | A publication policy, page metadata builder, robots, sitemap, review-service gate és locale layout változatlan. A HU/EN indexelhető lista nem bővült; DE/FR/KO/ZH review/noindex szabályát a diff nem oldja fel. A módosított DE meta leírás tartalmi pontosítás. |
| Hatnyelvű analitikai hozzájárulás | Az analytics consent copy mind a hat locale esetén tartalmazza a `text`, `title`, `accept`, `reject`, `settings` mezőt. A teljes copy, a consent tárolás/visszavonás, az analytics runtime, eseménykezelés, banner, beállításgomb és GA komponens változatlan. A szövegek továbbra is előzetes hozzájárulást és a személyes űrlaptartalmak analitikából kizárását írják le. |
| Űrlap adatkezelési tájékoztatás | Az új KO/ZH karrierlink az angol pályázói tájékoztatóra mutat, és a címkéje ezt megnevezi. A Contact tudomásulvételi tájékoztatását a diff nem alakítja hozzájárulásos checkboxszá. |
| 24/7 és naplózás | A DE saját központ és folyamatos jelzésfogadás/-kezelés megmarad. A `Jede Meldung, jeder Prüfschritt und jede Eskalationsentscheidung` naplózási állítás továbbra is kijelentő; az `abrufbar` a HU visszakereshetőséghez illeszkedik. FR megőrzi a `propre centre de supervision`, a 24 h/24 és 7 j/7, valamint a minden jelzést/ellenőrzési lépést/eszkálációs döntést lefedő naplózás állítását. A változások nem gyengítik a tulajdonosi PR12 tényeket. |
| FM működési modellek | A DE/FR szolgáltatásokban megmarad a saját teljesítés, szakvállalkozók/alvállalkozók és az ügyfél meglévő partnereinek koordinálása. Nem kerül be kizárólagosság vagy a koordináció titkolt ügyfélre hárítása. |
| CMS és publikálás | A 68 mezős CMS csomag külön tulajdonosi ellenőrzés alatt áll. E review nem minősíti alkalmazottnak és nem helyettesíti a jóváhagyását. Nincs DB-írás, commit, push vagy deploy. |

## Független tartalmi ellenőrzés

A root HU/EN privacy, recruitment privacy, responsible disclosure, trust center és `en.ts` változásai az elfogadott HU tartalomhoz képest jelentéshűek: a jogorvoslatnál az „is” lehetőség visszakerül, a tiltott tesztelés címe egyértelműbb, a cég- és adóazonosító címkék pontosabbak, a nyolc munkanapos B2B panaszválasz megmarad. Ez fordítási ellenőrzés, nem a magyar jogi jóváhagyás újbóli megnyitása.

A DE diffben a munkanap `Arbeitstag`, a jelzésfogadás `Signalempfang`, az utasként végzett tesztút és a GDPR szövegek pontosítása a HU jelentését követi. A DE impresszum dátuma és tényadatai HU-hoz igazodnak; a személy-, cég-, engedély- és elérhetőségi azonosítók jelentése nem változik. A fordítási disclaimerben a magyar irányadó változat megmarad.

A FR diffben a portaszolgálat, a szakcégek, a dokumentált ellenőrzési lépés, az irodaházak és a megállapodott rendezvényi keret pontosítása nem bővíti a vállalást. A 24/7 szóközök tipográfiai változtatások. Az űrlap külön szerződéses/adatvédelmi egyeztetése nem válik szerződéskötési kötelezettséggé; az angol jogi céloldalak jelölése megmarad.

A source review 28 alkalmazás-/tartalomfájl és 8 kapcsolódó teszt aktuális diffjét fogta át; a saját négy KO/ZH fordításfájl tartalmi peer jóváhagyása ebből kifejezetten kivétel. A közös működési módosítások és kiadási korlátok ellenőrzése az összes locale-ra kiterjedt.

## Reprodukálhatóság és korlát

A `final-review-evidence.json` tartalmazza a HEAD-et, a vizsgált forrásfájlok SHA-256 lenyomatát, a 17 védett fájl összehasonlítását, a HU AST és JSX eredményeket, valamint a hat nyelven végrehajtott fallback ellenőrzéseket. A futtató és a HEAD snapshot a repón kívüli `../audit-artifacts/translation-review-2026-10-19/` mappába került, hogy ne legyen része az alkalmazás lintjének. Az első Node-alfolyamat indítás sandbox hibába ütközött; PowerShellből rögzített Git snapshotra váltva az ellenőrzés sikeresen lefutott.

A megállapítás a rögzített forrásállapotra érvényes. A root teljes build/test eredményét és böngészős működési QA-ját nem tüntetem fel saját futtatásként.
