# Research summary — verified data + verify-pending

**Készítve:** 2026-04-28 este
**Sources:** WebSearch + WebFetch (Vercel/Resend/Databricks privacy pages)

## Adatfeldolgozók — VERIFIED corp-cím

### Resend
- **Hivatalos jogi entitás:** Plus Five Five, Inc. (DBA "Resend") — Codex 2 finding
- **Bejegyzett székhely:** 2261 Market Street #5039, San Francisco, CA 94114, USA
- **Email:** privacy@resend.com / security@resend.com / support@resend.com
- **DPF-cert:** ✅ certified (per resend.com/changelog/data-privacy-framework-certification)
- **DPF on-screen verify:** ⏳ post-deploy P1 (dataprivacyframework.gov/list)
- **Adatkezelési helyzet:** ⚠️ a szolgáltató publikus tájékoztatása szerint ügyféladatok USA-ban tárolása is megvalósulhat; az email-küldési régió konfiguráció NEM jelent teljes EU-only adattárolást

### Vercel
- **Jogi entitás:** Vercel Inc.
- **Bejegyzett székhely:** 440 N Barranca Avenue #4133, Covina, CA 91723, USA
  - **KORREKCIÓ:** NEM "One World Trade Center NYC" (tévesen szerepelt korai memóriában)
- **Email:** privacy@vercel.com
- **DPF-cert:** ✅ certified (per vercel.com/changelog/vercel-is-now-certified-under-the-eu-us-data-privacy-framework-dpf)
- **DPF on-screen verify:** ⏳ post-deploy P1
- **Adatkezelési helyzet:** ⚠️ statikus tartalom és edge-szolgáltatások globális infrastruktúrán keresztül működhetnek; EU-régió config (`vercel.json: {"regions": ["fra1"]}`) post-deploy P2

### Neon (Databricks subsidiary)
- **Szerződéses szolgáltató:** Neon, LLC mint Databricks, Inc. affiliate (2025 májusi akvizíció)
- **Bejegyzett címe:** 160 Spear Street, Suite 1300, San Francisco, CA 94105, USA (Databricks-cím)
- **Email:** Databricks privacy channel
- **DPF-cert:** ✅ certified (per databricks.com/legal/privacynotice — joint Databricks Inc. + Neon LLC)
- **DPF on-screen verify:** ⏳ post-deploy P1
- **Adatbázis-régió:** AWS Frankfurt / eu-central-1
- **Pontos entitás:** ⏳ a hatályos DPA alapján confirm-elendő (Neon LLC vs Databricks Inc. mint szerződő fél)

## Felügyeleti hatóságok — VERIFIED

### NAIH (adatvédelem)
- 1055 Budapest, Falk Miksa utca 9-11.
- Postacím: 1363 Budapest, Pf.: 9
- Telefon: +36 (1) 391-1400
- Email: ugyfelszolgalat@naih.hu
- Web: https://www.naih.hu
- Source: naih.hu/ugyfelszolgalat-kapcsolat (2026-04-28)

### III. Kerületi Rendőrkapitányság (vagyonvédelem)
- 1036 Budapest, Tímár utca 9/a
- Telefon: +36 (1) 430-4700
- Fax: +36 (1) 430-4722
- Email: 03rk@budapest.police.hu
- Jogszabályi alap: SzVMt. + 329/2007. (XII.13.) Korm. r. 12. § (3) c)

### Alkotmányvédelmi Hivatal Iparbiztonsági Főosztály (Vbt. 120. §)
- 1117 Budapest, Fehérvári út 70.
- Postacím: 1391 Budapest, 62. Pf. 217
- Telefon: +36 (1) 485-2300
- Source: ah.gov.hu/en/contact (2026-04-28) — Iparbiztonsági Főosztály direkt elérhetőség nem külön listázott, központon keresztül

## Felelősségbiztosító — VERIFIED

### Allianz Hungária Biztosító Zrt.
- Hivatalos cégnév: Allianz Hungária Biztosító Zártkörűen Működő Részvénytársaság
- Székhely: 1087 Budapest, Könyves Kálmán krt. 48-52.
- Cégjegyzékszám: Cg. 01-10-041356
- **Avenir-kötvényszám: 341633910**
- Source: allianz.hu/hu_HU/lakossagi/impresszum.html (2026-04-28)

## ISO tanúsítások (a 17. commit-ban már implementálva)

### ISO 9001:2015
- Cert: 843579099
- Kibocsátó: MARTON Szakértő Iroda Kft.
- Érvényes: 2026-03-19 → 2029-03-18
- Akkreditáció: NAH-4-0047/2023

### ISO/IEC 27001:2022
- Cert: 988960032
- Kibocsátó: MARTON Szakértő Iroda Kft.
- Érvényes: 2026-04-27 → 2029-04-26
- Akkreditáció: NAH-4-0047/2023
- Verify: iafcertsearch.org

## Cégbíróság

### Fővárosi Törvényszék Cégbírósága
- 1055 Budapest, Markó utca 27.

## Hatósági engedélyek (3+1)

| Engedély | Szám | Érvényesség | Kiállító |
|---|---|---|---|
| Személy- és vagyonvédelem | 01030-822/4926-7/2023 | 2028.01.31-ig | III. Kerületi Rk. |
| Vagyonvédelmi tervező-szerelő | 01030-822/4927-3/2018 | visszavonásig | III. Kerületi Rk. |
| Magánnyomozói tevékenység | 01030-822/4925-3/2018 | visszavonásig | III. Kerületi Rk. |
| Nemzetbiztonsági névjegyzék (Vbt. 120. §) | AH/37595-14/2024-2 | felülvizsgálat 2026.06.30-ig | AH Iparbiztonsági Főosztály |

## Képviselő (Avenir)

- Kovács Attila ügyvezető
- Vagyonőri ig.: VS0000850
- Magánnyomozói ig.: MA2001317
- Email: info@afm.hu
- **Telefon: +36 70 312 5868** (személyes/jogi kontakt)

**Megjegyzés:** a céges általános telefon `+36 70 316 8218` — két külön szám, NEM elírás.

## DPO — DECISION-PENDING

`TODO_DPO_AKTUALIS_BEJELENTETT_NEV` placeholder a privacy policy 3. szakaszban. User válaszol A/B/C közül (lásd README.md).

## Verify-pending action items (post-deploy)

- **P1** DPF on-screen verify (Resend / Vercel / Databricks) — JS-rendered pages, kézzel
- **P2** vercel.json EU-régió config + post-deploy verify
- **P3** Real cookie audit DevTools → Application
- **P4** ÁSZF + Impresszum + 404/error finomítás konzisztens a Schrems-II 6-szakasszal
