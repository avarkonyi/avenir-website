# SEO — findings

Coverage:
- Crawl data: all 76 `S\crawl\pages\*.json` records (HU 17, EN 17, DE 14, FR 9, KO 9, ZH 9, root 1). For each one I checked status, robots meta, X-Robots-Tag, canonical, hreflang, `html lang`, title and description length, H1 count, heading order, OG and Twitter tags, image alt attributes, JSON-LD types, FAQ visibility and every internal link (79 distinct internal targets). I also checked `sitemap.xml` (32 URLs, including lastmod and `xhtml:link` alternates), `robots.txt`, `security.txt`, and the URLs listed in `llms.txt`/`llms-full.txt` (URL scan only).
- Live requests: about 110 light `curl.exe` GETs against www.afm.hu. They covered the http/https and apex/www chain, trailing slash, upper-case variants, `?service=`/UTM variants, 48 legacy slug URLs (8 slugs × 6 locales), unknown locales, closed review-locale routes, 404/410 pages, OG image routes and the certificate PDFs. I also opened `/ko/opengraph-image` once in the browser pane to check visually that the Hangul glyphs render.
- Code read: `app/sitemap.ts`, `lib/public-sitemap.ts`, `app/robots.ts`, `proxy.ts`, `app/[locale]/layout.tsx`, `generateMetadata` for the service, legal, impresszum, disclosure and news pages, `app/[locale]/opengraph-image.tsx`, `app/[locale]/not-found.tsx`, `lib/seo-data.ts`, `lib/homepage-schema.ts`, `lib/services/publication.ts`, `lib/services/review-services.ts`, `lib/services/approved-process-copy.ts`, `lib/news-routing.ts`, `lib/legal-routes.ts`, `lib/responsible-disclosure-content.ts`, `lib/locale-ui-helpers.ts` (footer links), `components/Nav.tsx` (language switcher), `scripts/qa-preview-smoke.mjs`, `tests/seo-publication.test.ts`. Docs read: both June audits (SEO sections, F-005/F-006/F-012, 2134 P2-08), `docs/audits/2026-10-17/README.md`, the owner confirmations and the open-items CSV, which I cross-referenced for SEO rows.
- Not covered: Search Console, Bing Webmaster and real bot logs (no access), Lighthouse/CWV (excluded by the brief), Google Rich Results Test (not run), and keyword search-volume data. Title recommendations below are therefore qualitative. Review-locale (DE/FR/KO/ZH) titles and descriptions got only a light check. CJK description length thresholds do not apply and were not scored.

## Findings

### SEO-001 — Responsible-disclosure pages are indexable but missing from the sitemap and only reachable through the orphaned Trust Center
- Severity: P2
- Category: SEO-indexing
- Where: https://www.afm.hu/hu/felelos-hibabejelentes and https://www.afm.hu/en/responsible-disclosure. Root cause: `lib/public-sitemap.ts:103-163` has no entry for them, the deferral is documented in `scripts/qa-preview-smoke.mjs:384-385`, and the x-default is set in `lib/responsible-disclosure-content.ts:187`.
- Evidence: both pages are 200, `robots: "index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1"`, self-canonical, with reciprocal HU/EN hreflang, but `sitemap: false`. The sitemap has 32 URLs and neither of these. The smoke script comment says: "Responsible-disclosure pages are intentionally discoverable through security.txt in this pass; the sitemap policy is not expanded here." The only internal links to them come from `/hu/megfelelosegi-kozpont` and `/en/trust-center` (see SEO-002) and from each other's language switcher. Their hreflang sets `x-default=/en/responsible-disclosure`, while every other HU/EN pair uses the HU page as x-default.
- Problem: AGENTS.md says "Only real, published, useful URLs should be indexable" and that sitemap, route and metadata must follow the same readiness logic. These pages are ready: security.txt `Policy:` points at the EN page, and the copy is reviewed. The bug is on the sitemap side; the pages should not be noindexed. As things stand, indexable and in-sitemap are two different sets, and the pages depend on a single orphaned hub to be discovered.
- Fix: in `buildPublicSitemap` add `...(["hu","en"] as const).map(locale => ({ url: responsibleDisclosureUrl(locale), changeFrequency: "yearly", priority: 0.3, alternates: { languages: responsibleDisclosureAlternateLanguages() } }))`. Add `responsibleDisclosureUrl` to the required list in `checkSitemap` and delete the comment. To match the site-wide pattern, set `"x-default": responsibleDisclosureUrl("hu")`. Keeping EN is defensible because security.txt is EN-first, but then document it. Add a footer legal link: HU "Felelős hibabejelentés", EN "Responsible disclosure".
- Status: NEW. The June 2134 route matrix accepted "HU/EN disclosure … not required in sitemap"; this finding reverses that decision.
- Confidence: high

### SEO-002 — Trust Center is an orphan page (no nav, footer or homepage link); news index is only weakly linked
- Severity: P2
- Category: SEO-internal-linking
- Where: `/hu/megfelelosegi-kozpont` and `/en/trust-center`. Footer legal links are built in `lib/locale-ui-helpers.ts:173-185`; the nav uses `components/Nav.tsx` (homepage anchors).
- Evidence: in the full crawl the only inbound links to `/hu/megfelelosegi-kozpont` are from `/en/trust-center` (language switcher) and the page itself, and the reverse holds for `/en/trust-center`. `getFooterLegalLinks` returns only `adatvedelem`, `aszf` and `impresszum`. The pages are in the sitemap, so search engines can find them, but they get no internal link equity and no visitor path. The news index pages `/hu/hirek` and `/en/hirek` are linked only from the article breadcrumb and the switcher, because the nav "Hírek"/"News" item goes to `/hu#news`.
- Problem: the procurement proof hub (ISO, licences, disclosure, recruitment notice) cannot be reached from any page a visitor or crawler arrives on, and it is the only path to the disclosure pages (SEO-001).
- Fix: add `{ href: trustCenterPath(locale), label: "Megfelelőségi központ" | "Trust Center" }` to `getFooterLegalLinks` for `hu`/`en` only. Review locales keep the EN fallback or no link. Also link it from the homepage certifications section, e.g. HU "Tanúsítványok és megfelelőségi adatok" → `/hu/megfelelosegi-kozpont`. In the homepage news section, add a link to the index: HU "Összes hír" → `/hu/hirek`, EN "All news" → `/en/hirek`.
- Status: NEW. This was June 2134 audit P2-08 ("Trust Center nem érhető el a footerből") and is still not fixed. There is no open-items row.
- Confidence: high

### SEO-003 — Every page except the homepages loses og:image, og:locale and twitter:image; legal/trust pages also carry the homepage twitter:title
- Severity: P2
- Category: SEO-social-metadata
- Where: the 16 HU/EN service pages, 6 HU/EN legal pages, 2 recruitment pages, 2 Trust Center pages, 2 disclosure pages, 2 news index pages, and every DE/FR/KO/ZH subpage. Sources: `app/[locale]/szolgaltatasok/[slug]/page.tsx:116-131`, `app/[locale]/adatvedelem/page.tsx:45` (and the same pattern in `aszf`, `impresszum`, `lib/recruitment-privacy-routes.ts:69`, the disclosure pages and the Trust Center), `app/[locale]/hirek/page.tsx:79-90`.
- Evidence: on `/en/szolgaltatasok/objektumorzes` the OG tags are only `og:title`, `og:description`, `og:url`, `og:site_name` and `og:type`. There is no `og:image`, no `og:locale`, and no `twitter:image` even though `twitter:card` is `summary_large_image`. Only the 6 homepages (`/hu/opengraph-image?5e44a1ee2e3a1bff`, 1200×630) and the news article (blob JPG) have an image. On 15 pages, including `/hu/adatvedelem`, `/hu/megfelelosegi-kozpont`, `/en/trust-center` and `/hu/felelos-hibabejelentes`, `twitter:title` is the homepage title "Avenir Facility Management Kft. — Vagyonvédelem és FM" / "… — Security and FM" and the twitter description is the homepage description. Legal, Trust Center and disclosure pages also have no `og:site_name`. Service and legal pages output `robots: "index, follow"` and lose the layout's `max-image-preview:large`.
- Problem: Next.js merges metadata shallowly. A page-level `openGraph`, `twitter` or `robots` object replaces the layout object entirely, including the file-based image from `app/[locale]/opengraph-image.tsx`. The service pages add `images` only when `detail.imageUrl` is set, and it is empty for every live row. The legal pages never set `twitter`, so they inherit the homepage one. As a result, LinkedIn and Teams shares of service pages show no preview image and some shares show the wrong title. This matters for the planned LinkedIn auto-posting.
- Fix: add one helper, e.g. `buildPageMetadata({ locale, title, description, url, type, image })`. It should always return `openGraph: { siteName: SEO_DATA.name, locale: OG_LOCALE_MAP[locale], type, title, description, url, images: [{ url: image ?? \`${SEO_DATA.url}/${locale}/opengraph-image\`, width: 1200, height: 630 }] }`, `twitter: { card: "summary_large_image", title, description, images: [sameImage] }` and `robots: { index, follow: true, "max-image-preview": "large", "max-snippet": -1 }`. Use it in every page's `generateMetadata`. Optional: EN copy uses British spelling ("organised", "organisers"), so `OG_LOCALE_MAP.en` could be `en_GB`.
- Status: NEW. The June 2134 audit checked only the homepage OG image. The same code existed at `75b2cd7`, so this is not a regression.
- Confidence: high for the observation; medium for the exact merge mechanism.

### SEO-004 — Legal page meta descriptions are cut at 160 characters mid-word; the EN Legal Notice description contains "Kft.."
- Severity: P2
- Category: SEO-snippet
- Where: `/hu/adatvedelem`, `/en/adatvedelem`, `/hu/aszf`, `/en/aszf`, `/hu/palyazoi-adatkezeles`, `/en/recruitment-privacy` (indexed), and `/de/adatvedelem`, `/de/aszf`, `/de/impresszum` (review). Code: `app/[locale]/adatvedelem/page.tsx:32,64`, `app/[locale]/aszf/page.tsx:33,65`, `app/[locale]/impresszum/page.tsx:42-44,268`, `lib/recruitment-privacy-routes.ts:57`. The same truncated string also feeds the WebPage JSON-LD `description`.
- Evidence: EN privacy: "…in particular during the c". EN legal statements: "…the legal statements published on the websit". HU privacy: "…megadott személyes adatokat, különösen ". HU legal statements: "…közzétett jogi nyilatkozatokra vo". EN recruitment: "…to give applicants concise, tr". DE impresszum includes raw newlines: "Offizieller Firmenname: … \nKurzbezeichnung laut Handelsregister: Avenir Facility Kft.\nMarketi". EN impresszum: "Avenir Facility Management Kft.. Registered office: …". The double period comes from the template `${SEO_DATA.legalNameShort}. Registered office` where `legalNameShort` already ends in "Kft.".
- Problem: `intro.slice(0, 160)` cuts words in half, so indexed search snippets and the WebPage schema show broken words.
- Fix: give each legal page its own `metaDescription` field in the content modules, kept to 155 characters or fewer, and use it for both the meta tag and `pageDescription`. Proposed text:
  - HU adatvedelem: "Az Avenir Facility Management Kft. adatkezelési tájékoztatója a www.afm.hu kapcsolatfelvételi és ajánlatkérési folyamatában megadott személyes adatokról." (153)
  - EN adatvedelem: "Privacy Policy of Avenir Facility Management Kft. for personal data provided through the www.afm.hu contact and quote-request process." (134)
  - HU aszf: "Jogi nyilatkozatok a www.afm.hu weboldal használatáról, a kapcsolatfelvételi és ajánlatkérési folyamatról és a weboldalon közzétett tartalmakról." (145)
  - EN aszf: "Legal statements on the use of the www.afm.hu website, the contact and quote-request process, and the content published on the site." (132)
  - HU pályázói: "Hogyan kezeli az Avenir Facility Management Kft. az álláspályázatok során megadott személyes adatokat – tájékoztató jelentkezőknek." (131)
  - EN recruitment: "How Avenir Facility Management Kft. processes personal data provided in job applications – information for applicants before they apply." (136)
  - EN impresszum: drop the extra period with `${SEO_DATA.legalNameShort} Registered office: …`, or use `SEO_DATA.legalName`.
  - If no hand-written descriptions are wanted, at least use a word-boundary truncation helper that appends "…".
- Status: NEW. HUB-050 covers only the HU impresszum address order.
- Confidence: high

### SEO-005 — WebSite JSON-LD `inLanguage` still lists every locale and now includes FR as well
- Severity: P2
- Category: schema
- Where: all 76 pages. Source: `lib/homepage-schema.ts:112` (`inLanguage: [...SEO_LOCALES]`).
- Evidence: `/hu` JSON-LD WebSite has `"inLanguage": ["hu","en","de","zh","ko","fr"]`. Only `hu` and `en` are indexable; `publication.ts` limits `INDEXABLE_SERVICE_LOCALES` to `["hu","en"]`.
- Problem: June F-006 and 2134 P2-01 asked for this to be narrowed to HU/EN. It was not changed, and this release added `fr`, so the site-level schema now overstates five review locales. `Organization.contactPoint.availableLanguage` is already HU/EN only.
- Fix: `inLanguage: ["hu", "en"]`. Better, import `INDEXABLE_SERVICE_LOCALES` (or a shared `INDEXABLE_LOCALES`) so schema, sitemap and metadata use the same gate.
- Status: REGRESSION (F-006). It was never fixed and widened from 5 to 6 locales.
- Confidence: high

### SEO-006 — Production smoke matrix is out of date: ZH/KO service pages returning 200 is intended; the matrix is wrong
- Severity: P2
- Category: QA / SEO-indexing governance
- Where: `scripts/qa-preview-smoke.mjs:14-15` (`READY_SERVICE_LOCALES = ["hu","en","de"]`, `UNREADY_SERVICE_LOCALES = ["zh","ko"]`), `:150-167` (EXPECTED_200 has `/ko` but not `/de`, `/fr`, `/zh`), `:179-193` (SITEMAP_FORBIDDEN has no `/fr`, `/zh` or `/de` homepage entries), and `:509-575` (noindex is checked only for DE service, legal and news pages).
- Evidence: `S\checks\qa-preview.txt` reports 16 FAILs, "/zh/szolgaltatasok/objektumorzes status: expected 404, got 200", and the same for the other ZH and KO slugs. The current source policy renders them on purpose. `lib/services/review-services.ts:30-35` adds the DE/FR/KO/ZH review paths for every active HU/EN slug. `tests/seo-publication.test.ts` asserts FR/KO/ZH are not indexable. `docs/audits/2026-10-17/README.md` says "FR/KO/ZH részletes szolgáltatások … 24 új részletező; noindex, sitemap/hreflang nélkül". The live crawl matches: all 24 FR/KO/ZH service pages are 200, `noindex, follow`, self-canonical, with no hreflang and not in the sitemap.
- Problem: production is correct and the matrix is stale. The 16 false FAILs make the smoke result red on every run, which hides real regressions. The matrix also never checks that FR pages, or the ZH/KO/FR service pages, stay noindex. If a review locale leaked into the index, the smoke test would not catch it.
- Fix: replace the locale constants with `INDEXED = ["hu","en"]` and `REVIEW_SERVICE_LOCALES = ["de","fr","ko","zh"]`. Expect 200 plus `noindex, follow` plus no `<link rel="alternate" hreflang>` for the 32 review service URLs and for `/de`, `/fr`, `/ko`, `/zh`. Add FR to the 404 lists (`/fr/adatvedelem|aszf|impresszum|hirek|trust-center|felelos-hibabejelentes|palyazoi-adatkezeles|recruitment-privacy`, `/fr/szolgaltatasok/<legacy>`). Add `"/de"`, `"/fr"`, `"/zh"` to `SITEMAP_FORBIDDEN`; the boundary matcher already covers sub-paths. Add one check that HU/EN indexable HTML only declares `hu`, `en` and `x-default` hreflangs. For the governance docs, see SEO-018.
- Status: NEW
- Confidence: high

### SEO-007 — Apex domain redirect is temporary (307) and the HTTP apex chain takes 3 hops
- Severity: P3
- Category: SEO-redirects
- Where: Vercel domain configuration for `afm.hu`.
- Evidence: `https://afm.hu/` → `307 https://www.afm.hu/`. `https://afm.hu/hu/szolgaltatasok/objektumorzes` → `307 https://www.afm.hu/hu/szolgaltatasok/objektumorzes`. `http://afm.hu/` → `308 https://afm.hu/` → `307 https://www.afm.hu/` → `308 /hu`.
- Problem: a 307 tells search engines the apex URL may come back, which weakens consolidation of backlinks pointing at `afm.hu`.
- Fix: in Vercel Project → Domains, set `afm.hu` to "Redirect to www.afm.hu" with 308 (permanent). This needs the Vercel project access noted as blocked in the October README.
- Status: KNOWN (`docs/audits/2026-10-17/README.md` P3 "Nem-www domain ideiglenes átirányítása"; no open-items CSV row)
- Confidence: high

### SEO-008 — Root redirect `/` → `/hu` drops the query string (UTM and `?service=` prefill are lost)
- Severity: P3
- Category: SEO-redirects / analytics attribution
- Where: `proxy.ts:111-115` (`NextResponse.redirect(new URL(\`/${DEFAULT_LOCALE}\`, req.url), 308)`).
- Evidence: `https://www.afm.hu/?service=objektumorzes` → `308 /hu`. `https://www.afm.hu/?utm_source=linkedin&utm_medium=social` → `308 https://www.afm.hu/hu`. By comparison, the locale-case redirect keeps the query: `/HU?service=objektumorzes` → `/hu?service=objektumorzes`.
- Problem: campaign and LinkedIn links to the bare domain lose their UTM parameters, and a bare-domain contact prefill link loses the selected service.
- Fix: `const url = req.nextUrl.clone(); url.pathname = \`/${DEFAULT_LOCALE}\`; return withNoindexHeader(req, NextResponse.redirect(url, 308));`
- Status: NEW
- Confidence: high

### SEO-009 — Mixed-case static path segments return 200 duplicates instead of redirecting
- Severity: P3
- Category: SEO-duplicate-URLs
- Where: `proxy.ts:94-104`, which lowercases only the locale segment.
- Evidence: `/hu/Szolgaltatasok/objektumorzes`, `/hu/SZOLGALTATASOK/objektumorzes`, `/hu/Impresszum` and `/hu/HIREK` all return 200 with the lowercase canonical (e.g. `<link rel="canonical" href="https://www.afm.hu/hu/szolgaltatasok/objektumorzes"/>`). For comparison, `/HU` → 308 and `/hu/szolgaltatasok/OBJEKTUMORZES` → 404.
- Problem: the canonical tag limits the damage, but every static route can be reached under any capitalisation, and the three behaviours (308, 200, 404) are inconsistent.
- Fix: in `proxy.ts`, when `pathname !== pathname.toLowerCase()` for a locale-prefixed path, 308 to the lowercased pathname (clone `nextUrl` to keep the query). All public slugs are lowercase ASCII.
- Status: NEW
- Confidence: high for the observation; low for why the router matches case-insensitively.

### SEO-010 — News article titles are still longer than 60 characters
- Severity: P3
- Category: SEO-titles
- Where: `/hu|en|de/hirek/megujult-az-avenir-weboldala-es-arculata`. Code: `app/[locale]/hirek/[slug]/page.tsx:87` (`${article.title} - ${SEO_DATA.legalNameShort}`).
- Evidence: "Megújult az Avenir weboldala és arculata - Avenir Facility Management Kft." (74), "Avenir Launches Renewed Website and Brand Identity - Avenir Facility Management Kft." (84), "Avenir mit erneuerter Website und Markenauftritt - Avenir Facility Management Kft." (82, noindex). These are the same lengths June measured.
- Problem: the brand suffix alone is 34 characters, so the titles get truncated in SERPs.
- Fix: use `${article.title} | Avenir`, which gives "Megújult az Avenir weboldala és arculata | Avenir" (49) and "Avenir Launches Renewed Website and Brand Identity | Avenir" (59). Alternatively add a CMS `seoTitle` field that falls back to that pattern.
- Status: KNOWN (June F-012, still open, no regression)
- Confidence: high

### SEO-011 — Homepage titles and H1s carry little service keyword relevance for B2B search
- Severity: P3
- Category: SEO-on-page
- Where: `/hu`, `/en`. Titles come from `app/[locale]/layout.tsx:63-64` with `META_TAGLINES` (`lib/seo-data.ts:227-234`); the H1 is `hero.h1a/h1b`.
- Evidence: HU title "Avenir Facility Management Kft. — Vagyonvédelem és FM". EN title "Avenir Facility Management Kft. — Security and FM". H1 "Kevesebb kockázat. Több kontroll." / "Less risk. More control.".
- Problem: the legal brand takes about 31 of roughly 60 visible characters. "FM" is jargon that Hungarian buyers rarely search for (they search "létesítményüzemeltetés", "őrzés-védelem", "vagyonvédelem"). The EN title shows the Hungarian "Kft." form. The H1 is a slogan with no service term. The service pages are fine (e.g. "Élőerős objektumőrzés vállalatoknak | Avenir").
- Fix (copy decision for the owner; no new claims): HU title "Vagyonvédelem és létesítményüzemeltetés országosan | Avenir" (59; "országosan" is already used in the approved meta description). EN title "Security and Facility Management in Hungary | Avenir" (52). Keep the slogan visually but add a keyword line to the H1 or an eyebrow above it, e.g. HU "Vagyonvédelem és létesítményüzemeltetés vállalatoknak". Optional for short service titles: HU "Rendezvénybiztosítás céges és nyilvános eseményekre | Avenir" (60), EN "Event Security Services in Hungary | Avenir" (43).
- Status: NEW (KO tagline: KNOWN FKZ-028)
- Confidence: medium (no search-volume data)

### SEO-012 — Title separators and casing are inconsistent
- Severity: P3
- Category: SEO-titles / consistency
- Where: titles across HU/EN.
- Evidence: homepage and legal pages use " — " ("Impresszum — Avenir Facility Management Kft."). News uses " - " ("Hírek és tudásanyag - Avenir Facility Management Kft."). Services use " | Avenir". Trust Center uses " | Avenir Facility Management Kft.". EN service titles mix casing: "On-site Security Guarding for businesses", "Security Technology for corporate sites", "Soft FM Services for corporate sites" next to "Hard FM and Technical Operations", "Remote Monitoring and Response Service".
- Problem: the brand string is inconsistent across the SERP and the EN casing looks unedited.
- Fix: use one template, `<Page topic> | Avenir`, for services, legal, Trust Center and news, and keep the full legal name only in the impresszum. Use consistent EN casing, e.g. "On-site Security Guarding for Businesses | Avenir", "Security Technology for Corporate Sites | Avenir", "Soft FM Services for Corporate Sites | Avenir". The service seoTitles are CMS fields, so this is a staging-first CMS edit.
- Status: KNOWN (HUA-024, HUB-050, ENB-033). The EN service-title casing part is NEW.
- Confidence: high

### SEO-013 — Sitemap lastmod is real-but-coarse: 16 identical service timestamps that miss the 2026-10-18 copy change; legal pages have no lastmod
- Severity: P3
- Category: SEO-sitemap
- Where: `lib/public-sitemap.ts:134-140` (service `lastModified: updatedAt` from `services.updatedAt`), `lib/services/approved-process-copy.ts`, applied at `lib/db/queries/services.ts:363`.
- Evidence: all 16 service `<lastmod>` values are exactly `2026-09-15T09:22:20.640Z`, identical to the millisecond, which points to one bulk DB write rather than editorial edits. `/hu|en/szolgaltatasok/objektumorzes` changed visibly in this release: live text "A helyszíni bejárás és az alapvető kockázati áttekintés időpontját az első egyeztetésen közösen rögzítjük." comes from a code-level override (commit 7467d8f, 2026-10-18), but its lastmod still says 2026-09-15. Eight legal/trust content modules changed in `75b2cd7..9b767ef` (`git diff --stat`), and those URLs have no lastmod at all. The news lastmod (2026-05-08) is plausible.
- Problem: this is not wrong in the sense June F-005 was; the static date is gone. But lastmod understates real content changes, and Google trusts lastmod only when it is consistently accurate.
- Fix: compute service lastmod as `max(row.updatedAt, CODE_COPY_UPDATED_AT[slug])`, where the code-override module exports its own date. Add a small `ROUTE_CONTENT_UPDATED_AT` map for the legal, Trust Center and disclosure modules and update it in the same commit as content changes. Otherwise keep omitting lastmod for those routes.
- Status: NEW (June F-005 itself is fixed)
- Confidence: medium

### SEO-014 — Localized 404 responses carry conflicting robots metas, a homepage canonical and the homepage title
- Severity: P3
- Category: SEO-404
- Where: `/hu/nem-letezo`, `/en/szolgaltatasok/security`, `/fr/hirek` and others. Root cause: `app/[locale]/layout.tsx:74-108`; layout metadata applies to the client `app/[locale]/not-found.tsx`. Root `/xx`: `app/not-found.tsx`.
- Evidence: `/hu/nem-letezo` (HTTP 404) outputs `<meta name="robots" content="noindex"/>` and also `<meta name="robots" content="index, follow, max-video-preview:-1, …"/>`, `<link rel="canonical" href="https://www.afm.hu/hu"/>` and `<title>Avenir Facility Management Kft. — Vagyonvédelem és FM</title>`. `/xx` outputs no `<title>` and no `lang`.
- Problem: there is no indexing risk because the status is a real 404 and the stricter rule wins. However, a canonical pointing to the homepage on error pages, plus a homepage title in browser tabs and analytics, is untidy and can confuse soft-404 heuristics.
- Fix: move `alternates.canonical` and `robots` out of the layout into each page's metadata (or the helper from SEO-003), so 404s inherit neither. Render a server `not-found.tsx` per locale that exports `metadata = { title: "Az oldal nem található | Avenir", robots: { index: false } }` (localized). Root 404: see FKZ-013.
- Status: KNOWN in part (FKZ-013, HUA-040 for language/title). The robots/canonical conflict is NEW.
- Confidence: high

### SEO-015 — Structured-data polish: hard-coded "Magyarország", fragment breadcrumb, ItemList without URLs
- Severity: P3
- Category: schema
- Where: `app/[locale]/szolgaltatasok/[slug]/page.tsx:229` and `:192-216`, `lib/homepage-schema.ts` ItemList.
- Evidence: Service JSON-LD on every EN/DE/FR/KO/ZH service page has `"areaServed": {"@type":"Country","name":"Magyarország"}`, while LocalBusiness on DE says "Ungarn". BreadcrumbList position 2 is `"item": "https://www.afm.hu/en#services"`, a fragment of the position-1 URL. The layout ItemList has 8 `Service` items with `name` and `description` but no `url`, so they do not link to the eight detail pages. `/hu/hirek` and `/en/hirek` have no BreadcrumbList or CollectionPage.
- Problem: these are weaker entity signals and slightly inconsistent localized schema. None of them is invalid.
- Fix: `areaServed: { "@type": "Country", name: copy.country, identifier: "HU" }` using `schema-locale-copy`. Either drop breadcrumb level 2 or point it at the canonical homepage without the fragment. Add `url: \`${SEO_DATA.url}/${locale}/szolgaltatasok/${slug}\`` to each ItemList Service (HU/EN only). Add `CollectionPage` and `BreadcrumbList` to the news index.
- Status: NEW
- Confidence: high

### SEO-016 — News article lead image has an empty alt
- Severity: P3
- Category: SEO-images / a11y
- Where: `/hu|en|de/hirek/megujult-az-avenir-weboldala-es-arculata`. Code: `app/[locale]/hirek/[slug]/page.tsx:316`.
- Evidence: `<img alt="" … src="/_next/image?url=…news%2F7323ef3e-84e3-4f0c-914b-5a9a25e98f00.jpg…">`. The same image is the Article `image` and the `og:image`.
- Problem: the article's main content image gets no description for image search or screen readers. The homepage news card can keep `alt=""` because it is decorative next to the title.
- Fix: `alt={article.imageAlt ?? article.title}`, ideally with a CMS `imageAlt` field.
- Status: NEW
- Confidence: high

### SEO-017 — Indexable HU/EN pages link to unreviewed noindex review pages through the language switcher
- Severity: P3
- Category: SEO-internal-linking
- Where: `components/Nav.tsx:71-82` (`availableLocales`).
- Evidence: `/hu`, `/en` and `/` link to `/de`, `/fr`, `/ko`, `/zh`. Each of the 16 HU/EN service pages links to its `/de|fr|ko|zh/szolgaltatasok/<slug>` versions. HU/EN legal and news pages link to `/de/adatvedelem|aszf|impresszum|hirek…`. All targets are 200 `noindex, follow`, and no hreflang points at them, which is correct.
- Problem: SEO risk is low (noindex,follow, small site). However, every indexed page exposes unreviewed FR/KO/ZH/DE translations to visitors and crawlers, and some service sources contain legal sentences that have not yet been reviewed (see the DES/FRS/KOS/ZHS rows).
- Fix (owner decision): keep the links but label the review languages in the switcher, e.g. "Deutsch (Vorschau)". Or limit the switcher on HU/EN pages to `hu`/`en` until each locale is released. Do not add `nofollow`; it is not needed.
- Status: NEW
- Confidence: high

### SEO-018 — Governance docs contradict the live indexing policy
- Severity: P3
- Category: documentation / SEO-governance
- Where: `AGENTS.md:89-91`, `README.md:381`, `docs/staging_runbook.md:498`, `docs/code_architecture.md:243,936`.
- Evidence: AGENTS.md says "DE/ZH are homepage/partial-localization surfaces only … Do not start DE/ZH service rollout, EN/DE/ZH article routes…". README and runbook say "DE/ZH service detail URLs return 404 until localized fields exist". Live, all 32 DE/FR/KO/ZH service review pages are 200 noindex, and `/en/hirek` plus the EN article are indexed and in the sitemap (approved in the June route matrix).
- Problem: agents and QA scripts follow these docs, and SEO-006 is a direct result of the drift.
- Fix: update these lines to the owner-approved model: HU/EN indexed; DE (home, services, legal, news) and FR/KO/ZH (home and 8 services) are 200 noindex review surfaces, outside sitemap and hreflang; EN news is live and indexed. AGENTS.md edits need owner approval.
- Status: NEW
- Confidence: high

### SEO-019 — Review-locale title and description lengths (fix before any locale release)
- Severity: P3
- Category: SEO-titles (noindex pages)
- Where: FR and DE review pages.
- Evidence: `/fr` title "Avenir Facility Management Kft. — Sécurité et gestion des installations" (71). `/fr/szolgaltatasok/biztonsagtechnika` "Technologies de sécurité pour les sites professionnels | Avenir" (63). `/fr/szolgaltatasok/mystery-shopping-helyszini-audit` description is 168 characters. `/de/szolgaltatasok/hard-fm` description is 164. `/de/szolgaltatasok/rendezvenybiztositas` description is 163. `/de/hirek/megujult…` description is 162.
- Problem: no impact while these pages are noindex; they will truncate once a locale is released.
- Fix: FR tagline "Sécurité et facility management" gives "Avenir Facility Management Kft. — Sécurité et facility management" (65), or use the SEO-011 pattern "Sécurité et facility management en Hongrie | Avenir" (51). Trim the listed descriptions to 155 characters or fewer during the native review.
- Status: NEW (KO tagline: KNOWN FKZ-028)
- Confidence: high

## Verified OK
- Sitemap: all 32 URLs (16 service, 6 legal, 2 recruitment, 2 Trust Center, 2 homepages, 4 news) return 200 `index, follow` with self-canonicals, and their `xhtml:link` alternates match the HTML hreflang exactly. There are no DE/FR/KO/ZH URLs in the sitemap. Every indexable HU/EN page is in the sitemap except the two disclosure pages (SEO-001).
- Review locales: all 38 DE/FR/KO/ZH pages are `noindex, follow`, self-canonical and have no hreflang. No indexable page declares hreflang to a review page. Review homepages keep `og:locale` correct.
- hreflang: 100% reciprocal on HU/EN pairs, including the locale-specific slug pairs (`palyazoi-adatkezeles` ↔ `recruitment-privacy`, `megfelelosegi-kozpont` ↔ `trust-center`, disclosure). URLs are absolute and on www. `x-default` is HU everywhere except disclosure (SEO-001).
- `html lang` matches the URL locale on all 76 pages. Each page has exactly one H1 and no heading level is skipped. No `<img>` lacks an alt attribute.
- Redirects and status codes: http→https 308. Trailing slash 308 (`/hu/` → `/hu`, `/hu/szolgaltatasok/objektumorzes/` → no slash). Upper-case locale 308. Root `/` 308 → `/hu`. All 48 legacy slug URLs (`security`, `reception`, `building`, `technical`, `mystery`, `cleaning`, `hardfm`, `green` × hu/en/de/fr/zh/ko) return 404. Unknown locales (`/xx`, `/es`, `/en-us`, `/de-DE`, `/ru/...`) return 404. Closed routes return 404: FR legal/news/trust/disclosure/recruitment, ZH/KO news, wrong slug pairs, `/szolgaltatasok/...` without locale, `/hu/szolgaltatasok` index. `/mall`, `/tw` and `/cgi-sys/...` return 410 with `X-Robots-Tag: noindex, nofollow`. There are no soft-404 redirects to the homepage.
- `?service=` (canonical and legacy aliases) and `?utm_*` variants return 200 with the clean canonical.
- Production HTML has no `X-Robots-Tag`; the preview noindex header is limited to non-production hosts (`proxy.ts:27-34`). `robots.txt` allows public pages and the named AI bots, disallows `/admin` and `/api`, does not block `_next` or the review locales (so their noindex can be seen), and declares an absolute sitemap.
- No broken internal links: all 79 distinct internal targets return 200, including both ISO PDFs (`application/pdf`) and `/.well-known/security.txt`.
- JSON-LD: Service and BreadcrumbList are on every service page. FAQPage appears only where the FAQ renders; all questions are visible and the answers are in collapsed `<details>` in the server HTML. Article JSON-LD has `inLanguage`, `datePublished` and `dateModified`. `openingHoursSpecification` is gone from the live JSON-LD, so ENB-027, HUB-031 and HUA-041 can be checked for closure by their owners. Organization `sameAs` contains only LinkedIn.
- June F-005 is fixed: the static `2026-05-07` lastmod was removed and real CMS `updatedAt` values are used.
- Per-locale OG images: `/hu|en|de|fr|zh|ko/opengraph-image` all return 200 `image/png` at 1200×630. The KO image renders Hangul correctly (checked visually).
- Among indexable HU/EN pages there are no duplicate titles or descriptions. HU/EN service titles are 23–56 characters and service descriptions 120–150 characters, all within range.
- Smoke drift question: production is correct and `scripts/qa-preview-smoke.mjs` is wrong (SEO-006).
