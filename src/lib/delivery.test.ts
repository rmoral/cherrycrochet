import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { estimateDelivery, formatDeliveryRange, formatDeliveryShort } from "./delivery.ts";

// Fechas locales (año, mes 0-11, día) para que las pruebas no dependan de la zona horaria.
const day = (y: number, m: number, d: number) => new Date(y, m, d, 10, 0, 0);
const ymd = (d: Date) => [d.getFullYear(), d.getMonth() + 1, d.getDate()];

describe("estimateDelivery", () => {
  it("suma elaboración y transporte de la zona (España: 2–3 días)", () => {
    const r = estimateDelivery(7, "ES", day(2026, 10, 16));
    assert.deepEqual(ymd(r.min), [2026, 11, 25]);
    assert.deepEqual(ymd(r.max), [2026, 11, 26]);
  });

  it("usa la zona del país (Andorra 3–5, UE 4–7)", () => {
    const ad = estimateDelivery(10, "AD", day(2026, 0, 1));
    assert.deepEqual(ymd(ad.min), [2026, 1, 14]);
    assert.deepEqual(ymd(ad.max), [2026, 1, 16]);
    const fr = estimateDelivery(10, "fr", day(2026, 0, 1));
    assert.deepEqual(ymd(fr.min), [2026, 1, 15]);
    assert.deepEqual(ymd(fr.max), [2026, 1, 18]);
  });

  it("sin país conocido usa la primera zona", () => {
    const r = estimateDelivery(5, "", day(2026, 5, 1));
    assert.deepEqual(ymd(r.min), [2026, 6, 8]);
    assert.deepEqual(ymd(r.max), [2026, 6, 9]);
    const us = estimateDelivery(5, "US", day(2026, 5, 1));
    assert.deepEqual(ymd(us.min), ymd(r.min));
  });

  it("cruza el cambio de mes", () => {
    const r = estimateDelivery(7, "ES", day(2026, 10, 25)); // 25 nov
    assert.deepEqual(ymd(r.min), [2026, 12, 4]);
    assert.deepEqual(ymd(r.max), [2026, 12, 5]);
  });

  it("cruza el cambio de año", () => {
    const r = estimateDelivery(15, "DE", day(2026, 11, 20)); // 20 dic, UE 4–7
    assert.deepEqual(ymd(r.min), [2027, 1, 8]);
    assert.deepEqual(ymd(r.max), [2027, 1, 11]);
  });

  it("cruza febrero en año bisiesto", () => {
    const r = estimateDelivery(10, "ES", day(2028, 1, 18)); // 18 feb 2028
    assert.deepEqual(ymd(r.min), [2028, 3, 1]);
    assert.deepEqual(ymd(r.max), [2028, 3, 2]);
  });

  it("no modifica la fecha de partida y tolera plazos no válidos", () => {
    const from = day(2026, 10, 16);
    const r = estimateDelivery(Number.NaN, "ES", from);
    assert.deepEqual(ymd(from), [2026, 11, 16]);
    assert.deepEqual(ymd(r.min), [2026, 11, 18]);
    const neg = estimateDelivery(-3, "ES", from);
    assert.deepEqual(ymd(neg.min), [2026, 11, 18]);
  });
});

describe("formatDeliveryRange", () => {
  const same = { min: day(2026, 10, 24), max: day(2026, 10, 29) };
  const cross = { min: day(2026, 10, 28), max: day(2026, 11, 3) };
  const year = { min: day(2026, 11, 30), max: day(2027, 0, 2) };

  it("mismo mes: solo el día en la primera fecha", () => {
    assert.equal(formatDeliveryRange(same, "es", "entre el {min} y el {max}"), "entre el 24 y el 29 de noviembre");
    assert.equal(formatDeliveryRange(same, "fr", "entre le {min} et le {max}"), "entre le 24 et le 29 novembre");
    assert.equal(formatDeliveryRange(same, "en", "between {min} and {max}"), "between 24 and 29 November");
  });

  it("meses distintos y cambio de año", () => {
    assert.equal(formatDeliveryRange(cross, "es", "entre el {min} y el {max}"), "entre el 28 de noviembre y el 3 de diciembre");
    assert.equal(formatDeliveryRange(year, "es", "entre el {min} y el {max}"), "entre el 30 de diciembre y el 2 de enero");
  });

  it("catalán: apostrofa l'1 y l'11", () => {
    const r = { min: day(2026, 11, 1), max: day(2026, 11, 11) };
    assert.equal(formatDeliveryRange(r, "ca", "entre el {min} i el {max}"), "entre l'1 i l'11 de desembre");
  });

  it("formato corto", () => {
    assert.match(formatDeliveryShort(same, "es"), /^24\s*[–-]\s*29 nov/);
  });
});
