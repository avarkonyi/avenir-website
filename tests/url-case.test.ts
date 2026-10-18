import assert from "node:assert/strict";
import test from "node:test";
import { lowercaseAsciiPath } from "../lib/url-case";

test("mixed-case locale paths are lowercased", () => {
  assert.equal(lowercaseAsciiPath("/hu/Szolgaltatasok/objektumorzes"), "/hu/szolgaltatasok/objektumorzes");
  assert.equal(lowercaseAsciiPath("/HU/Impresszum"), "/hu/impresszum");
  assert.equal(lowercaseAsciiPath("/en/HIREK"), "/en/hirek");
});

test("lowercase paths are unchanged, so the redirect cannot loop", () => {
  for (const path of ["/hu", "/en/szolgaltatasok/hard-fm", "/hu/hirek/megujult-az-avenir-weboldala-es-arculata"]) {
    assert.equal(lowercaseAsciiPath(path), path);
  }
});

test("percent-escapes keep their hex case", () => {
  assert.equal(lowercaseAsciiPath("/hu/Teszt-%C3%A9"), "/hu/teszt-%C3%A9");
});
