# Javított weboldal élesítése – 2026-10-18

A tulajdonos közvetlenül kérte a javított verzió élesítését, és elfogadta a HUA-004 javasolt szövegét: a helyszíni bejárás és alapvető kockázati áttekintés időpontját az első egyeztetésen közösen rögzítjük.

- Javító commit: `7467d8fbe9ffa846a3462821496be8f074ed5b98`.
- PR #2 beolvasztva; main merge commit: `9b767efe1fce21e7d8b55ab8efc00a38d93037af`.
- Projekt/csapat: `avenir-website` / `andrasvarkonyi-7800s-projects`.
- Vercel Production: `FVGmrdFmBhLAMniZp5ZtE8i5Awt4`, Ready, az afm.hu domain hozzárendelve; 2026-10-18 06:59 CEST.
- Kiadási URL: https://www.afm.hu/hu
- Előző éles kiadás visszaállításhoz: `9N7PPV4E5xSuocSmYe2yZRinf52o`, commit `8f9bba48f2c22d4155b25293a41bc53708aca684`.

## Ellenőrzések

146 unit teszt, ESLint, TypeScript, copy guard (220 fájl, 33 ellenőrzés), staging olvasással végzett build (100/100 oldal) sikeres. A HUA-004 regressziós teszt a javítás előtt hibázott, utána sikeres; igazolja a célzott HU/EN cserét, más szolgáltatás és későbbi CMS-szöveg megőrzését, az adatok változatlanságát és az ismételt alkalmazás stabilitását. A magyar és angol generált HTML tartalmazza a jóváhagyott szöveget.

A pontos javító commit GitHub CI és Vercel Preview ellenőrzése sikeres. A Preview magyar, angol és francia objektumőrzési oldalán a javított időzítés igazolt.

Éles GET-ellenőrzés: 26/26 sikeres — 16 HU/EN szolgáltatásoldal 200 és egy H1; hat főoldal 200, a DE/FR/KO/ZH noindex megtartva; sitemap nyelvi kapu; három HU/EN/DE jogi nyilatkozat DPO-szakasza. A HU/EN objektumőrzés tartalmazza az új időzítést. A böngészőben látható magyar süti-sáv szó szerint tartalmazza a HUA-001 elfogadott mondatát.

## Fennmaradó feladatok

A kiadás nem zárja le automatikusan a fennmaradó 375 nyitott/részleges auditpontot. A magyar tételeket egyenként, a tulajdonossal egyeztetjük tovább. Nem történt adatbázis-írás, migráció, űrlapküldés vagy tesztlevél. A külön CMS-javítási javaslat nem lett alkalmazva. A valós Google-tag visszavonás utáni hálózati viselkedése és az admin/űrlap teljes működési próbája ebben a körben nem volt tesztelve. A külön függőségi PR #3 nincs benne ebben a kiadásban.
