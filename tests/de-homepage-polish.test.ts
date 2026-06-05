import assert from "node:assert/strict";
import test from "node:test";
import { de } from "../lib/i18n/de";
import {
  getContactPrivacyHref,
  getFooterLegalLinks,
  getLocaleServiceListLabel,
  getServiceCardDetailLabel,
} from "../lib/locale-ui-helpers";

test("DE homepage polish uses German interim labels without touching other locales", () => {
  assert.equal(de.nav.cta, "Angebot anfordern");
  assert.equal(de.hero.cta2, "Angebot anfordern");
  assert.equal(de.contactSub, "Angebot anfordern");
  assert.equal(de.stats[2]?.n, "AA");
  assert.equal(de.stats[2]?.l, "Hohe Bonitätsbewertung (D&B)");
  assert.equal(de.stats[3]?.l, "Leitstellenbereitschaft");

  assert.deepEqual(
    Object.fromEntries(de.services.map((service) => [service.id, service.t])),
    {
      security: "Objektschutz vor Ort",
      cleaning: "Veranstaltungssicherheit",
      building: "Sicherheitstechnik",
      reception: "Empfangs- und Pförtnerdienst",
      green: "Soft FM – Infrastrukturelles Gebäudemanagement",
      technical: "Fernüberwachung und Interventionsdienst",
      mystery: "Mystery Shopping und Serviceaudit",
      hardfm: "Hard FM – Technisches Gebäudemanagement",
    },
  );
});

test("DE service cards and legal links use review-mode DE legal routes", () => {
  assert.equal(getServiceCardDetailLabel("de"), "Details");
  assert.equal(getServiceCardDetailLabel("hu"), "Részletek");

  assert.deepEqual(getFooterLegalLinks("de", de.footer), [
    {
      href: "/de/adatvedelem",
      label: "Datenschutzerklärung",
    },
    {
      href: "/de/aszf",
      label: "Rechtliche Hinweise",
    },
    {
      href: "/de/impresszum",
      label: "Impressum",
    },
  ]);

  assert.equal(getContactPrivacyHref("de"), "/de/adatvedelem");
  assert.equal(de.form.layeredNoticeLink, "Datenschutzerklärung");
  assert.equal(de.form.successPrivacyLink, "Datenschutzerklärung");
  assert.equal(
    de.legal.terms.dataProtection.privacyLinkHref,
    "/de/adatvedelem",
  );
});

test("DE DB-backed service lists use the interim canonical labels by slug", () => {
  assert.deepEqual(
    [
      "objektumorzes",
      "portaszolgalat",
      "mystery-shopping-helyszini-audit",
      "rendezvenybiztositas",
      "biztonsagtechnika",
      "tavfelugyelet-vonuloszolgalat",
      "hard-fm",
      "soft-fm",
    ].map((slug) => getLocaleServiceListLabel("de", slug, "old fallback")),
    [
      "Objektschutz vor Ort",
      "Empfangs- und Pförtnerdienst",
      "Mystery Shopping und Serviceaudit",
      "Veranstaltungssicherheit",
      "Sicherheitstechnik",
      "Fernüberwachung und Interventionsdienst",
      "Hard FM – Technisches Gebäudemanagement",
      "Soft FM – Infrastrukturelles Gebäudemanagement",
    ],
  );

  assert.equal(
    getLocaleServiceListLabel("en", "objektumorzes", "On-site Security Guarding"),
    "On-site Security Guarding",
  );
  assert.equal(
    getLocaleServiceListLabel("de", "unknown", "Unbekannt"),
    "Unbekannt",
  );
});
