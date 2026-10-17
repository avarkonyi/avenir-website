# AFM kereshetőség és fordítások – végrehajtási terv

> Végrehajtás: superpowers:subagent-driven-development; önálló haladás a felhasználó kifejezett megbízása alapján.

**Cél:** az élő AFM-oldal bizonyítékos kereshetőségi felülvizsgálata, igazolt hibáinak javítása, a látható fordítási hiányok pótlása és francia változat előkészítése.

**Architektúra:** a meglévő Next.js 16 / Drizzle / Neon / Vercel alkalmazás és CMS megtartása. A forrásban lévő szótárak és meglévő lokalizációs minták bővítése; a CMS publikációs és fordítási készültségi szabályai érvényben maradnak. Jogi és idegen nyelvi kiadási döntés nélkül a review nyelvek noindex állapota megmarad. A francia tartalom ellenőrizhető előnézetként készül el, a nem fordított tartalmak nem kapnak hamis francia URL-t.

**Munkapéldány:** avarkonyi/avenir-website, kiinduló commit 75b2cd7, elkülönített klón és codex/seo-translations-fr ág. Az eredeti C:/Users/andra/avenir-website checkout változatlan marad.

- [x] Élő URL-leltár: robots, sitemap, belső linkek, nyelvek, canonical, hreflang, státusz, HTML, címsorok, metaadatok; mentés docs/audits/2026-10-17 alá.
- [x] Fordítási felmérés: lib/i18n, locale-ui-helpers, szolgáltatás- és állásadatok, tanúsítványok, cookie-felület, nyelvváltó. Francia szótár és szükséges UI bekötés, hiányzó látható fordítások pótlása. Nem jóváhagyott jogi szövegekhez egyértelműen jelölt, létező angol link.
- [x] Célozott tesztek: francia útvonal felismerése és saját metaadatok; szótár alakja; részleges nyelvek indexelési kizárása; robots publikus/admin/API erőforrások botcsoportonként; sitemap fordítási és időbélyeg konzisztencia.
- [x] Igazolt SEO-hibák javítása a reprodukáló teszt után: sitemap frissülés és tényleges módosítási dátumok; hibás schema vagy metaadatok. GPTBot/Google-Extended meglévő szabályait változatlanul kell hagyni.
- [x] Ellenőrzés: npm run lint; npx tsc --noEmit; npm test; npm run qa:copy; npm run build. Mobil/asztali böngészős ellenőrzés, űrlapvalidáció küldés nélkül; kizárólag izolált tesztkörnyezetben küldési teszt.
- [x] Specifikáció- és kódreview, hibajavítás, magyar átadási dokumentáció, külön kód/preview/éles állapot. Éles kiadás kizárólag a projekt jóváhagyási rendje szerint.

Alternatívák: új i18n/CMS-rendszer bevezetése aránytalan kockázat; hiányos nyelvek indexelésének engedélyezése hibás keresési jelzést adna. A meglévő készültségi kapuk mellett kiegészített fordítások a választott megoldás.
