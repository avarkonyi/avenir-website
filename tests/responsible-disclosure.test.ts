import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const RESPONSE_TIME_SLA =
  /within\s+\d+\s+(business\s+)?days?|(?:\d+|egy|két|három)\s+(munka)?napon belül/i;
const REWARD_PROMISE =
  /reward\s+(is|will be)\s+(offered|provided|paid)|jutalmat\s+(biztosítunk|fizetünk)|díjazást\s+(biztosítunk|fizetünk)/i;

function readSource(relativePath: string): string {
  const fullPath = path.join(process.cwd(), relativePath);
  assert.equal(existsSync(fullPath), true, `${relativePath} should exist`);
  return readFileSync(fullPath, "utf8");
}

test("HU and EN responsible disclosure routes exist only on their approved slugs", () => {
  const huRoute = readSource("app/[locale]/felelos-hibabejelentes/page.tsx");
  const enRoute = readSource("app/[locale]/responsible-disclosure/page.tsx");

  assert.match(huRoute, /locale !== "hu"/);
  assert.match(enRoute, /locale !== "en"/);
  assert.equal(existsSync(path.join(process.cwd(), "app/[locale]/de/responsible-disclosure/page.tsx")), false);
});

test("responsible disclosure content includes required HU and EN sections without SLA or bounty promises", () => {
  const source = readSource("lib/responsible-disclosure-content.ts");

  for (const required of [
    "Felelős hibabejelentés",
    "Responsible disclosure",
    "Cél",
    "Purpose",
    "Kapcsolat",
    "Contact",
    "Mit tartalmazzon a bejelentés?",
    "What to include",
    "Scope",
    "Nem engedélyezett tesztek",
    "Out-of-scope testing",
    "Adatvédelem és kárminimalizálás",
    "Privacy and harm minimisation",
    "Visszajelzés",
    "Response",
    "Nincs jutalomprogram",
    "No bug bounty programme",
    "Jóhiszemű bejelentések kezelése",
    "Good-faith reports",
    "security@afm.hu",
    "dpo@afm.hu",
    "info@afm.hu",
    "DoS",
    "DDoS",
    "social engineering",
    "fizikai",
  ]) {
    assert.ok(source.includes(required), `missing ${required}`);
  }

  assert.equal(RESPONSE_TIME_SLA.test(source), false);
  assert.equal(REWARD_PROMISE.test(source), false);
});
