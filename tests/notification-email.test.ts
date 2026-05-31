import assert from "node:assert/strict";
import test from "node:test";
import { buildNotificationEmail } from "../lib/email-templates";
import type { ContactPayload } from "../lib/contact-schema";

test("contact notification includes embedded service quote context when present", () => {
  const payload: ContactPayload = {
    name: "Teszt Elek",
    company: "Avenir QA",
    email: "teszt@example.com",
    phone: "+36 70 000 0000",
    service: "objektumorzes",
    message: "Teszt üzenet",
    locale: "hu",
    form_variant: "service_embedded",
    source_path: "/hu/szolgaltatasok/objektumorzes",
    _website: "",
  };

  const email = buildNotificationEmail(payload, new Date("2026-05-31T10:00:00Z"));

  assert.match(email.text, /Érdeklődés:\s+Élőerős objektumőrzés/);
  assert.match(email.text, /Szolgáltatás kulcs:\s+objektumorzes/);
  assert.match(email.text, /Űrlap variáns:\s+service_embedded/);
  assert.match(email.text, /Forrás oldal:\s+\/hu\/szolgaltatasok\/objektumorzes/);
  assert.match(email.html, /Élőerős objektumőrzés/);
  assert.match(email.html, /service_embedded/);
  assert.match(email.html, /\/hu\/szolgaltatasok\/objektumorzes/);
});
