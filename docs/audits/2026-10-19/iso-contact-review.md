# ISO-jelölés és kapcsolati adatút – 2026. október 19.

Alap: `8411529` (PR #16). A tulajdonos az ISO meglétét és a magyar jogi szöveget elfogadta; ezek általános jóváhagyását nem kell újrakérni. Az alábbi forrásjavítások éles státuszát a PR kiadási bizonyítéka határozza meg.

## ISO / EDU-041

- Avenir a tanúsított vállalkozás. A tanúsítvány `Certification`, a vállalkozás `hasCertification` hivatkozásával és a vállalkozásra mutató `about` mezővel.
- A tanúsító az `issuedBy` szervezet. A NAH által elismert akkreditáció a tanúsító `hasCredential` mezőjében szerepel, nem az Avenir saját akkreditációjaként.
- A PDF szerinti nevek maradnak: ISO 9001 – MartonCert Rendszertanúsító Kft.; ISO/IEC 27001 – MCert Rendszertanúsító Kft. A [NAH nyilvántartása](https://nah.gov.hu/hu/szervezet/mcert-rendszertanusito-/) a 2026-04-16-i névváltást és mindkét szabvány akkreditációs hatókörét rögzíti. Száma NAH-4-0047/2023; a megtekintéskor 2028-07-13-ig érvényes.
- A tanúsítványok számai, PDF-jei, kibocsátási és 2029-es lejárati dátumai megmaradnak. Az akkreditáció dátuma más adat, mint a két Avenir-tanúsítvány lejárata.
- A nyilvános `IAF MLA member=true` állítás kikerül. Az adminban a régi adatmező a PDF-en látható jelölést nevezi meg; adatbázis-migráció nem kell.
- A Megfelelőségi központ HU/EN oldalán külön link mutat a tanúsító NAH-akkreditációjára és az IAF tanúsítványkeresőre. Az utóbbi keresőlink: az Avenir közvetlen rekordját a keresés CAPTCHA-ja miatt ebben a menetben nem sikerült megnyitni. Ez nem a tanúsítvány meglétének új kérdése.

A [Schema.org Certification](https://schema.org/Certification), [hasCertification](https://schema.org/hasCertification) és [issuedBy](https://schema.org/issuedBy) modelljét követjük. Az IAF korábbi jelöléseit a [Global ACI átmeneti tájékoztatása](https://global-aci.org/en/faq/) mellett sem értelmezzük új tagsági állításként.

## Kapcsolati adatút

A főoldali és szolgáltatásoldali űrlap a saját `/api/contact` végpontot használja. A validálás és visszaélésvédelem után a megkeresés a Neon `messages` táblájába kerül; a Resend értesítést küld a beállított céges címre. A levélhibától a már mentett megkeresés az adminban megmarad. Az admin Microsoft Entra-belépés és engedélylista mögött érhető el.

A korábbi, engedélyezett éles próba #17 adminbejegyzése és az `info@afm.hu` címre kézbesített értesítés tulajdonosi visszaigazolása a sikeres kézbesítési út bizonyítéka. Új éles beküldés nem történt.

| ID | Eredmény / szükséges intézkedés |
| --- | --- |
| CDF-01 | A főoldali szolgáltatásválasztó értéke kikerül a GA4 sikeres beküldési eseményéből. A jóváhagyott, űrlaptartalmat kizáró sütiszöveg marad az alap; a nyilvános oldal/link kontextusa továbbra is mérhető hozzájárulással. |
| CDF-02 | A Resend teljes hibaobjektuma és nyers kivétele helyett rögzített hibakategória / engedélyezett státusz kerül a naplóba. Nem állítjuk, hogy a korábbi naplóban tényleges adatszivárgás történt; a korlátlan hibaszöveg átvételét szüntetjük meg. |
| CDF-03 | **Nyitott:** a sikertelen ajánlatkérések utolsó kapcsolatfelvételtől számított 12 hónapos megőrzésének végrehajtása. Az admin archiválása visszaállítható, nem törlés. A kód nem ismeri minden külső levél dátumát és a megőrzési kivételeket, ezért automatikus törlést nem kapcsolunk be. Dokumentált felelős/eljárás kell a DB-, levelezési, export- és mentési példányokra. |
| CDF-04 | **Nyitott:** a szolgáltatói leltár kiegészítése a spamvédelmi Redis adatútjával, valamint a céges levelezés és adminhitelesítés dokumentációs helyének azonosítása. A Redis IP-ből képzett stabil hash-kulcsot és számlálót kap, 60 másodperces alkalmazási TTL-lel; nevet, e-mailt vagy üzenetet nem. A publikus tájékoztató célzott kiegészítése külön szövegdöntés. |
| CDF-05 | **Nyitott:** szolgáltatói fiókok tényleges régió-, napló-, mentés- és megőrzési beállításai, GA4 Enhanced Measurement / adatmegosztás, céges postaláda-hozzáférés. A kód nem igazolja ezeket. Beállítás-ellenőrzés szükséges; általános HU jogi jóváhagyás nem. |
| CDF-06 | A régi júniusi követési dokumentumokhoz bekerült az elfogadott magyar jogi alap státusza. A működési és fiókbeállítási bizonyítékok ettől külön nyitva maradnak. |

Források: `components/Contact.tsx`, `components/ServiceQuoteCta.tsx`, `app/api/contact/route.ts`, `lib/contact-schema.ts`, `lib/rate-limit.ts`, `lib/db/schema.ts`, `lib/resend.ts`, `lib/email-templates/notification.ts`, `lib/analytics/events.ts`, `lib/analytics/runtime.ts`, `lib/current-privacy-content.ts`, `app/admin/(dashboard)/messages/_actions.ts`, `ENV.md`.

## Kiadási korlátok

Nincs adatbázis-írás, migráció, új előfizetés, valódi űrlapbeküldés vagy e-mail-küldés. A főoldal jóváhagyott vizuális kialakítása és a HU/EN indexelési, DE/FR/KO/ZH noindex szabály marad. Preview/QA után külön élesítési jóváhagyás szükséges.
