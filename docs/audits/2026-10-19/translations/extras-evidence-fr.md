# Kiegészítő bizonyítékok — 2026-10-19

Read-only, időben korlátozott vizsgálat. Sem HU jogi, sem FR fordítási, sem közös forrásmódosítás nem történt.

## ENB-015

A HU PDF elérhető, 2024. július 16-i kiadás; az EDPB régi kiadványoldala a v2 által felváltottnak jelöli. A verzióeltérés tehát igazolt, a HU link nem bizonyítottan hibás. [Magyar PDF](https://www.edpb.europa.eu/system/files/2024-12/edpb_dpf_faq-for-individuals_hu.pdf), [régi hivatalos kiadványoldal](https://www.edpb.europa.eu/documents/other-guidance/eu-us-data-privacy-framework-faq-for-european-individuals_en).

A v2 kiadványoldala 2026. január 23-i, a PDF elfogadása január 15. A hivatalos letöltés jelenleg a **2026-04** könyvtárbeli EN PDF, amely olvasható; a kódbeli **2026-01** URL webes lekérése 403-at adott. A vizsgált v2 oldal és célzott EDPB-keresés magyar v2-t nem adott; ebből nem állítható teljes bizonyossággal, hogy máshol sem létezik. [V2 hivatalos oldal](https://www.edpb.europa.eu/documents/other-guidance/eu-us-data-privacy-framework-faq-for-european-individuals-version-20_en), [jelenleg hivatkozott EN PDF](https://www.edpb.europa.eu/system/files/2026-04/edpb_dpf_faq-for-individuals_v2_en.pdf).

Javaslat: az EN link a hivatalos aktuális PDF-re karbantartható; a HU forrás itt változatlan. Magyar v2 URL nem található ki. A régi magyar fordítás megjelölése és az aktuális angol változat kiegészítő hivatkozása külön tartalmi karbantartás lehet.

## EDU-041

**Valós szemantikai pontosítás szükséges.** A `lib/homepage-schema.ts:117` a credential `additionalProperty` mezőjére írja az `IAF MLA member=true` értéket. Nem kifejezetten a kibocsátó szervezethez kapcsolja, de az alanyt sem nevezi meg. Az élő EN snapshot mindkét ISO-credentialjén ugyanez látszik a NAH akkreditáció mellett.

Az MLA aláírója az akkreditáló testület; a tanúsító az általa akkreditált szervezet. Ezért az `Accreditation body is an IAF MLA signatory` vagy credential-tulajdonságként az `Accreditation by an IAF MLA signatory` pontosabb. A tanúsítás ténye és a boolean ettől nem változik. Az IAF forrás ma archiváltként jelölt; jelen vizsgálat a szerepek különbségét támasztja alá, nem új NAH-scope vagy ISO-érvényességi audit. [IAF hivatalos MLA Mark magyarázat](https://iaf.nu/en/mla-mark/).

Érintett címkeforrások: `lib/schema-locale-copy.ts`, `lib/i18n/{hu,en,de,fr,ko,zh}.ts`; schema: `lib/homepage-schema.ts`. Minden nyelv összehangolt pontosítása indokolt, nem csak a német címke stiláris javítása.

## ENB-011 határa

Azonos HU/EN szolgáltatói lista: **nem fordításeltérés és nem új jogi jóváhagyási blokk**. A végső levelezési adatút későbbi működési tényellenőrzés.
