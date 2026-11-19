import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { validateField } from "./validation.ts";

describe("validateField", () => {
  it("campos obligatorios", () => {
    assert.equal(validateField("city", "  "), "required");
    assert.equal(validateField("city", "Girona"), null);
  });
  it("email", () => {
    assert.equal(validateField("email", "ana@example.com"), null);
    assert.equal(validateField("email", "ana@example"), "email");
    assert.equal(validateField("email", "ana example.com"), "email");
  });
  it("teléfono", () => {
    assert.equal(validateField("phone", "+34 600 12 34 56"), null);
    assert.equal(validateField("phone", "(01) 23-45"), null);
    assert.equal(validateField("phone", "123 45"), "phone");
    assert.equal(validateField("phone", "600 abc 123"), "phone");
  });
  it("código postal por país", () => {
    assert.equal(validateField("postal", "08001", "ES"), null);
    assert.equal(validateField("postal", "8001", "ES"), "postal");
    assert.equal(validateField("postal", "AD500", "AD"), null);
    assert.equal(validateField("postal", "500", "AD"), null);
    assert.equal(validateField("postal", "1000-001", "PT"), null);
    assert.equal(validateField("postal", "1012 AB", "NL"), null);
    assert.equal(validateField("postal", "x", "NL"), "postal");
  });
});
