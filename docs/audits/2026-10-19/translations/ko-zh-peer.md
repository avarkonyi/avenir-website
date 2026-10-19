# KO/ZH forrásdiff – független ellenőrzés

2026-10-19. Hatókör: `lib/i18n/ko.ts`, `lib/i18n/zh.ts`, `lib/services/ko-service-details.ts`, `lib/services/zh-service-details.ts` aktuális munkafa-diffje. Viszonyítás: `lib/i18n/hu.ts`, a mai `staging-public-services.json` HU szolgáltatásmezői és a tulajdonos elfogadott 24/7-, naplózási és FM-tényei. Nem CMS-review, nem teljes új nyelvi audit.

**Lényegi jelentésellenőrzés: PASS.** A diffben nem találtam új, érdemi félrefordítást, forrás nélküli szolgáltatási ígéretet vagy a jóváhagyott működési tények gyengítését. A saját 24/7 felügyeleti központ, a minden jelzésre/ellenőrzésre/eszkalációra kiterjedő naplózás, valamint a saját dolgozói, jóváhagyott alvállalkozói/szakcéges és ügyféloldali szolgáltatói FM-modell megmarad.

Az összevetett változások közül a KO audit címke, több évtizedes tapasztalat és országos jelenlét, az ismétlődés megelőzése és a következő munkanapos kapcsolatfelvétel a HU állításokat állítják helyre. A ZH bejegyzett székhely, az irányítási rendszerek tanúsításának pontosítása és a szerződéses egyeztetés azonnali szerződéskötés helyetti megnevezése szintén forráshű. A service-diffben az arculat, a zártkörű események, az incidens/esemény különbség, a karbantartási ütemezés és a szolgáltatói koordináció pontosításai megfelelnek a HU mezőknek.

**Egy kisebb, egyértelmű új nyelvtani hiba (P3):** `lib/services/ko-service-details.ts:260`, távfelügyelet adatvédelmi FAQ. A csere után `출입 이벤트은` szerepel. Az `이벤트` magánhangzóra végződik, ezért a helyes partikula `는`: **`출입 이벤트는`**. Ez nem változtatja meg az állítást, de a mechanikus terminológiacsere nyelvtani maradéka; javítandó.

Nem módosítottam forrást, és a kérés szerint nem futtattam új teszteket. A meglévő CMS-csomaghoz nem nyúltam.

Root visszaellenőrzés: a P3 ragozási hibát javítottam (출입 이벤트는); a jelentésben nincs további nyitott finding.
