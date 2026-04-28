# 18. commit drafts — 3-AI GDPR-jogi-review után

**Készítve:** 2026-04-28 (drafts 2.0)
**Frissítve:** 2026-04-29 (DPO Csegény Fanni + 4 BLK + 11 IMP fix)
**Státusz:** Drafts 2.1 — kód-fázis MA később / HOLNAP friss aggyal
**Verzió:** 2.1 (3-AI consensus + DPO + BLK/IMP applied)

## Workflow

1. ~~Drafts 1.0~~ (2026-04-28 délután, 7 PRE-Codex2 finomítás)
2. **Drafts 2.0** — JELENLEGI állapot: 3-AI GDPR-jogi-review consensus (Claude Code 7-pass + 2× ChatGPT Codex review) alkalmazva
3. → Felhasználó (Andras) átolvas, esetleg plus-finomítások
4. → JÓVÁHAGYÁS
5. → Kód-fázis HOLNAP REGGEL friss aggyal

## NE módosíts semmit a drafts/ alatt git-tracking nélkül

A drafts/ mappa **NEM tartozik a deploy-build-be** — csak munka-dokumentumok. A
fájlok a kód-fázisban i18n-keys + page-files formába alakulnak át.

## Fájl-lista

| Fájl | Tartalom |
|---|---|
| `README.md` | ezen a dokumentumon vagy |
| `research-summary.md` | verified data + post-deploy verify-pending lista |
| `privacy-policy-hu.md` | HU privacy policy 2.0 — 14 szakasz, mind a 16 mod beépítve |
| `privacy-policy-en.md` | EN privacy policy 2.0 — ugyanaz EN |
| `aszf-hu.md` | HU ÁSZF — magánnyomozói warning + Allianz |
| `aszf-en.md` | EN ÁSZF |
| `impresszum-hu-en.md` | impresszum strukturált adatok HU + EN |
| `contact-form-microcopy.md` | Contact form mikroszöveg — magánnyomozói warning + layered consent + legal-basis |

## Módosítási lista (16 + 7 + 4 = 27 mod)

### 8 deploy-blocker (3-AI consensus)
- **B1 DPO döntés** — TODO_DPO_AKTUALIS_BEJELENTETT_NEV placeholder + user A/B/C döntés
- **B2 4.1 jogalap dual-path** — 6(1)(b) természetes személy + 6(1)(f) B2B-kapcsolattartó
- **B3 Resend entity** — "Plus Five Five, Inc. ('Resend')" jogi név
- **B4 Vercel disclosure** — global infra + EU-config attempt (NEM "EU edge")
- **B5 Neon/Databricks vague** — "tényleges szerződés szerinti entitás"
- **B6 Schrems-II 6. szakasz** — TELJES csere; nem-blanket DPF; Art. 45/46/kiegészítő
- **B7 4.4 új** — különleges/büntetőjogi adat exclusion (privacy policy)
- **+ Contact form micro** — URLAP-on rövidített warning (NEM csak ÁSZF mélyén)

### 8 important fix (2 AI által jelzett)
- **I1 telefon-eltérés** — confirmed: 2 külön szám (céges + ügyvezető)
- **I2 Art. 4(17) wrong label** — fejléc cserélve "Képviseletre jogosult személy és adatvédelmi kapcsolattartás"
- **I3 retention split** — pre-contract 12 hónap / contract 5 év Ptk + 8 év Sztv. + különleges adat törlés
- **I4 4.3 scope-konfliktus** — átnevezés "Sikeres ajánlatkérést követő szerződéses admin"
- **I5 cookie audit nélkül félrevezető** — vague safe wording + post-deploy DevTools-audit
- **I6 http→https** — global replace
- **I7 ISO scope-korlátozás** — IAF MLA-tag sor törölve, scope-claim szigorítva
- **I8 incidens GDPR-osabb wording** — "indokolatlan késedelem nélkül"

### 7 PRE-Codex2 finomítás (még applied)
- DPO szcenárió A/B annotation
- ~~Cookie wording~~ (superseded I5)
- ÁSZF deep-link Contact warning-ban
- EN Infotv. clarification
- 404 multi-CTA (3 button)
- DEPLOY_CHECKLIST.md új fájl (kód-fázisban)
- Privacy §14 version-history (1.0 első kiadás)

### 4 post-deploy action item (NEM 18. commit-blocker)
- **P1 DPF on-screen verify** mind 3 szolgáltatóra (dataprivacyframework.gov)
- **P2 vercel.json EU-régió config** `{"regions": ["fra1"]}` + post-deploy verify
- **P3 Real cookie audit** DevTools → Application → Cookies → tájékoztató frissítés
- **P4 ÁSZF + Impresszum + 404/error finomítás** consistent a privacy update-tel

### 4 BLK + 11 IMP applied (2026-04-29 reggel) — 2.1 állapot
- **BLK-2 Neon** (privacy 5.3): Neon, LLC mint Databricks affiliate **világos szolgáltató-azonosítás**
- **BLK-3 Art. 28 vs Art. 46** (privacy 5.1, 5.2, 5.3): külön **Adatfeldolgozói szerződés (Art. 28)** sor + külön **Harmadik országba történő adattovábbítási garancia (Art. 45/46)** sor
- **BLK-4 Cégnév-konzisztencia** (aszf §1): mind HU + EN — `legalName` (full) + `legalNameShort` (marketing) + B2B-only ügyfélkör explicit
- **BLK-5 B2B-only** (aszf §10 + §12): explicit Ptk. 8:1. § / Hungarian Civil Code § 8:1(1)(3) hivatkozás, 1997. évi CLV. tv. konzument-jogviszony nem alkalmazható
- **IMP-3 Cookie audit-pending** (privacy §7): ⚙️ "Süti-audit folyamatban" annotáció a HU + EN szakasz tetején
- **IMP-4 Right-to-object dual-path** (privacy §8(g)): explicit "mind 4.1 (B2B-kapcsolattartó), mind 4.2 (visszaélés-megelőzés)" megfogalmazás
- **IMP-5 Art. 32 részletek** (privacy §13): adattakarékosság, titkosítás, hozzáférés-korlátozás, naplózás, rendszeres review
- **IMP-6 EN nyelv-elsőbbség** (privacy EN intro): "the Hungarian text prevails" záradék
- **IMP-7 BM-rendelet** (impresszum §4): 22/2006. (IV. 25.) BM rendelet referencia mind HU + EN
- **IMP-9 Anchor-locale** (contact-form-microcopy): per-locale anchor href (`#magannyomozas` HU vs `#private-investigation` EN/DE/ZH)
- **IMP-10 Layered notice** (contact-form-microcopy): "LAYERED CONSENT" → "LAYERED NOTICE" rename (mert NEM consent-alapú a kezelés)

### Nem applied (interpretive risk)
- **IMP-1 + IMP-8 Retention-clock pontosítás** — a current text már explicit ("az utolsó érdemi kapcsolatfelvételtől számított", "a szerződés megszűnésétől"), holnap user verify-elheti
- **IMP-11 HTML-komment stripping verify** — kód-fázis-action: a `<!-- LEGAL_REVIEW_PENDING_* -->` markerek mind a `drafts/`-ban tisztáztak, az i18n-keys formába alakuláskor (HOLNAP) verify-elendő hogy nem kerülnek-e a render-output-ba (TS-comments NEM render-elnek HTML-be, this is a verify-checkbox not an action)

### NTH finomítások (opcionális, nem applied — user válaszra vár)
A 7 NTH finomítás explicit listája nem érkezett meg a jelen üzenetben — kód-fázisban user-verify-szal applikálható.

## DPO-DÖNTÉS — ✅ RESOLVED (2026.04.28)

**Választás:** Belső munkavállaló DPO — **Csegény Fanni**.

| Mező | Érték |
|---|---|
| Név | Csegény Fanni (HU) / Fanni Csegény (EN) |
| Email | dpo@afm.hu (dedikált alias, Art. 38(5) titoktartás) |
| Telefon | +36 70 622 6242 |
| Postai cím | 1039 Budapest, Királyok útja 291. B. ép. 15. ajtó |
| GDPR-tanfolyam | 2026 júniusban (BONUS, NEM Art. 37(5) feltétel) |
| Art. 38(6) konfliktus | NINCS (NEM ügyvezető, NEM adatkezelési cél-döntéshozó) |

**Privacy policy §3 deploy-érett** — TODO_DPO és LEGAL_REVIEW_PENDING markerek mind eltávolítva mind a HU + EN változatból.

**Deploy előtti USER feladatok (HOLNAP REGGEL):**
1. `dpo@afm.hu` email-alias beállítása az email-szolgáltatónál (redirect a kolléga inboxára)
2. NAIH-bejelentés Infotv. 25/L. § szerint Ügyfélkapun (online)
3. (folyamatban) Csegény Fanni GDPR-tanfolyam 2026 júniusban

## Kód-fázis HOLNAP REGGEL — checklist

1. `git stash list` (verify backup ott)
2. Olvasd a `project_18commit_drafts_state.md` memóriát + ezt a README-t
3. Implementáció a drafts/ alapján:
   - lib/seo-data.ts: SEO_EXECUTIVE, SEO_LICENSES, SEO_REGULATORY_BODIES, SEO_LIABILITY, SEO_HOSTING_PROVIDER (Vercel Covina!), SEO_DATA_PROCESSORS (Resend Plus Five Five SF, Vercel Covina, Neon LLC SF)
   - lib/i18n/{hu,en,de,zh}.ts: privacy + terms + impressum + notFound + errorPage + footer + nav.home keys
   - app/[locale]/{adatvedelem,aszf,impresszum}/page.tsx — 3 új page (ÁSZF §4 anchor-id `magannyomozas`/`private-investigation`)
   - app/[locale]/not-found.tsx + error.tsx + app/not-found.tsx (3-CTA layout)
   - components/LegalPageChrome.tsx (shared chrome + JSON-LD breadcrumb)
   - components/Contact.tsx — magánnyomozói warning microcopy + layered consent
   - components/Footer.tsx — locale-prop + locale-prefixed links + license-short + DE/ZH machine-disclaimer
   - app/sitemap.ts — 12 legal-page URL
   - DEPLOY_CHECKLIST.md (új) — `LEGAL_REVIEW_PENDING_*` markers list
   - vercel.json — `{"regions": ["fra1"]}` (P2)
4. DE + ZH machine-grade fordítás (HU/EN véglegesítettből, `LEGAL_REVIEW_PENDING_DE/ZH` markerrel)
5. tsc + build + curl verify (12 legal + 3 404 + API CSRF)
6. Browser-vizuális verify (felhasználó)
7. Commit + push + post-deploy P1+P2+P3+P4

## Stash backup state

`git stash list` → `stash@{0}: WIP: 18. commit régi tervezet, ~931 sor, discard a 3-AI legal review után`

A stash-ben van a régi (1.0 tervezet alapján készült) kód. NE pop, NE drop — referenciaként megőrizzük. Ha a kód-fázisban valami file-szerkezet (LegalPageChrome komponens, page route-ok) reuse-able, manuálisan emeljük ki.
