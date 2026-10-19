# Maradék fordításjavítások — jóváhagyási előnézet

Dátum: 2026-10-19. Állapot: **külön jóváhagyással stagingben alkalmazva és ellenőrizve; élesben még nem**. Az alábbi lista az eredeti teljes előtte–utána változásokat őrzi. Részletek: [staging-validation.md](staging-validation.md).

A csomag **8 idegen nyelvű mezőt, 4 rekordot** érint: EN 3, DE 3, ZH 2. Magyar szöveg, új szolgáltatásígéret, tanúsítási tény, dizájn és indexelési szabály nem változik.

| Terület | Javítás |
| --- | --- |
| Biztonsági őr állás (3 mező) | A magyar „Budapest / országosan” pontos fordítása EN/DE/ZH nyelven. |
| ISO 9001 (2 mező) | A német és kínai leírásban maradt angol hatókörmegnevezés helyére a már meglévő saját nyelvű megnevezés kerül. |
| Weboldal-megújulási hír (2 mező) | Az EN és DE szolgáltatásnevek egyezzenek a szolgáltatásoldalak neveivel. |
| Mystery Shopping angol meta (1 mező) | „process follow-through” → „process adherence”. |

A francia és koreai álláskártya külön kódjavítást kap: a régi és az új angol adatból is országos magyarországi munkavégzést jelenít meg. FR: **Budapest / dans toute la Hongrie**. KO: **부다페스트 / 헝가리 전역**.

**Staging / éles különbség:** az EN hír éles változatában a korábbi ellenőrzés már helyes neveket talált. Ezt a mezőt most stagingben kell egységesíteni; későbbi élesítéskor friss összehasonlítás alapján az egyező értéket ki kell hagyni, nem felülírni. Az éles adatbázist ebben az előkészítési körben nem olvastuk.

A friss staging-lekérdezés csak olvasó tranzakcióban történt. Cél: `calm-glade-02466781 / br-round-fog-al4isa1i / ep-twilight-sound-al2b7jsb / neondb`. A kiszolgáló ugyanazt a branch- és endpointazonosítót, valamint `transaction_read_only=on` értéket igazolta.

A pontos változáslista: [cms-proposal.json](cms-proposal.json).
SHA-256 (`JSON.stringify(parsedArray)`): `944fb91711485680bf69f2ed374570a6c785760cfc1838fcf0cfba4c9a45dfe1`.

## 1. EDU-019 — positions #1, location_en

A magyar országosan jelentése; a regional indokolatlanul szűkítette a helyszínkört.

**Jelenleg:**

```text
Budapest, regional
```

**Javasolt:**

```text
Budapest / nationwide
```

## 2. EDU-019 — positions #1, location_de

A magyar országosan egyértelmű német megfelelője.

**Jelenleg:**

```text
Budapest, Land
```

**Javasolt:**

```text
Budapest / landesweit
```

## 3. EDU-019 — positions #1, location_zh

Budapest és egész Magyarország; nem csak Budapest környéke.

**Jelenleg:**

```text
布达佩斯及周边
```

**Javasolt:**

```text
布达佩斯 / 匈牙利全国
```

## 4. EDU-021 — certifications #1, description_de

A már meglévő német hatókörmegnevezés; a tanúsítványra vonatkozó tények változatlanok.

**Jelenleg:**

```text
ISO 9001 ist der internationale Standard für Qualitätsmanagementsysteme. Der im Zertifikat angegebene Geltungsbereich lautet "Comprehensive security services". Das zertifizierte Managementsystem wurde innerhalb des im Zertifikat definierten Geltungsbereichs durch MartonCert Rendszertanúsító Kft. auditiert. Das Zertifikat ist im Rahmen des IAF MLA-Abkommens international anerkannt.
```

**Javasolt:**

```text
ISO 9001 ist der internationale Standard für Qualitätsmanagementsysteme. Der im Zertifikat angegebene Geltungsbereich lautet "Umfassende Sicherheitsdienstleistungen". Das zertifizierte Managementsystem wurde innerhalb des im Zertifikat definierten Geltungsbereichs durch MartonCert Rendszertanúsító Kft. auditiert. Das Zertifikat ist im Rahmen des IAF MLA-Abkommens international anerkannt.
```

## 5. FKZ-015 — certifications #1, description_zh

A már meglévő kínai hatókörmegnevezés; a tanúsítványra vonatkozó tények változatlanok.

**Jelenleg:**

```text
ISO 9001 是质量管理体系的国际标准。证书中列明的范围为 “Comprehensive security services”。该认证管理体系已由 MartonCert Rendszertanúsító Kft. 按证书定义的范围进行审核。该证书在 IAF MLA 协议下获得国际认可。
```

**Javasolt:**

```text
ISO 9001 是质量管理体系的国际标准。证书中列明的范围为 “全面安保服务”。该认证管理体系已由 MartonCert Rendszertanúsító Kft. 按证书定义的范围进行审核。该证书在 IAF MLA 协议下获得国际认可。
```

## 6. EDU-046 — news #3, body_en

Staging felzárkóztatása az élesben korábban már ellenőrzött kanonikus angol szolgáltatásnevekhez; élesben várhatóan nincs írandó változás.

**Jelenleg:**

```text
Avenir Facility Management Kft. has renewed its website and corporate visual identity. The purpose of the update was to help clients and future partners understand our services, operations and professional background faster, more clearly and more accurately.

The new website presents our main service areas in a cleaner structure: manned guarding, reception and concierge services, security technology solutions, remote monitoring and response services, as well as related Soft FM and Hard FM support.

The renewed visual identity reflects the essence of Avenir’s work: we provide controlled, documented and responsibly organized services in corporate, industrial, logistics and retail environments where security and predictable operations are essential expectations.

As part of the update, we also refreshed our legal and privacy information, as well as the presentation of our certifications and company details. Our goal is for the website to serve not only as a company introduction, but also as a reliable and up-to-date information point for clients and partners.
```

**Javasolt:**

```text
Avenir Facility Management Kft. has renewed its website and corporate visual identity. The purpose of the update was to help clients and future partners understand our services, operations and professional background faster, more clearly and more accurately.

The new website presents our main service areas in a cleaner structure: On-site Security Guarding, Reception and Gatehouse Services, Security Technology, Remote Monitoring and Response Service, as well as related Soft FM and Hard FM support.

The renewed visual identity reflects the essence of Avenir’s work: we provide controlled, documented and responsibly organized services in corporate, industrial, logistics and retail environments where security and predictable operations are essential expectations.

As part of the update, we also refreshed our legal and privacy information, as well as the presentation of our certifications and company details. Our goal is for the website to serve not only as a company introduction, but also as a reliable and up-to-date information point for clients and partners.
```

## 7. EDU-017 — news #3, body_de

A hír két régi szolgáltatásnevének egységesítése a már használt német elnevezésekkel.

**Jelenleg:**

```text
Die Avenir Facility Management Kft. hat ihre Website und ihren Unternehmensauftritt erneuert. Ziel der Aktualisierung war es, Kunden und zukünftigen Partnern einen schnelleren, klareren und genaueren Überblick über unsere Dienstleistungen, unsere Arbeitsweise und unseren fachlichen Hintergrund zu geben.

Die neue Website stellt unsere wichtigsten Leistungsbereiche in einer übersichtlicheren Struktur vor: personelle Objektbewachung, Empfangs- und Portierdienste, sicherheitstechnische Lösungen, Fernüberwachung und Interventionsdienst sowie ergänzende Soft-FM- und Hard-FM-Leistungen.

Der erneuerte Markenauftritt spiegelt den Kern der Arbeit von Avenir wider: Wir erbringen kontrollierte, dokumentierte und verantwortungsvoll organisierte Dienstleistungen in Unternehmens-, Industrie-, Logistik- und Handelsumgebungen, in denen Sicherheit und ein berechenbarer Betrieb grundlegende Anforderungen sind.

Im Rahmen der Aktualisierung haben wir auch unsere rechtlichen Hinweise, unsere Datenschutzhinweise sowie die Darstellung unserer Zertifizierungen und Unternehmensinformationen überarbeitet. Unser Ziel ist es, dass die Website nicht nur als Unternehmensvorstellung dient, sondern auch als verlässlicher und aktueller Informationspunkt für Kunden und Partner.
```

**Javasolt:**

```text
Die Avenir Facility Management Kft. hat ihre Website und ihren Unternehmensauftritt erneuert. Ziel der Aktualisierung war es, Kunden und zukünftigen Partnern einen schnelleren, klareren und genaueren Überblick über unsere Dienstleistungen, unsere Arbeitsweise und unseren fachlichen Hintergrund zu geben.

Die neue Website stellt unsere wichtigsten Leistungsbereiche in einer übersichtlicheren Struktur vor: Objektschutz vor Ort, Empfangs- und Pförtnerdienst, sicherheitstechnische Lösungen, Fernüberwachung und Interventionsdienst sowie ergänzende Soft-FM- und Hard-FM-Leistungen.

Der erneuerte Markenauftritt spiegelt den Kern der Arbeit von Avenir wider: Wir erbringen kontrollierte, dokumentierte und verantwortungsvoll organisierte Dienstleistungen in Unternehmens-, Industrie-, Logistik- und Handelsumgebungen, in denen Sicherheit und ein berechenbarer Betrieb grundlegende Anforderungen sind.

Im Rahmen der Aktualisierung haben wir auch unsere rechtlichen Hinweise, unsere Datenschutzhinweise sowie die Darstellung unserer Zertifizierungen und Unternehmensinformationen überarbeitet. Unser Ziel ist es, dass die Website nicht nur als Unternehmensvorstellung dient, sondern auch als verlässlicher und aktueller Informationspunkt für Kunden und Partner.
```

## 8. ENS-049 — services #3, seo_description_en

Folyamatkövetés mint az előírt folyamat betartásának vizsgálata, az oldalon már javított megfogalmazással összhangban.

**Jelenleg:**

```text
Mystery shopping, brand audit, test journey and service audit for examining customer experience, process follow-through and compliance criteria.
```

**Javasolt:**

```text
Mystery shopping, brand audit, test journey and service audit for examining customer experience, process adherence and compliance criteria.
```

## Jóváhagyási határ

A tulajdonos a fenti nyolc staging-mezőt külön jóváhagyta; célazonosítás, friss régiérték-ellenőrzés, mentés, célzott tranzakció, teljes visszaolvasás és Preview QA sikeres. A későbbi éles módosításhoz új, konkrét kiadási jóváhagyás szükséges; ez még nem történt meg.

