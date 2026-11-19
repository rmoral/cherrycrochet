import { afterEach, describe, it } from "node:test";
import assert from "node:assert/strict";

// analytics.ts lee las variables al importarse: cada prueba lo importa de nuevo con su entorno.
type FakeWindow = { plausible?: (...args: unknown[]) => void; localStorage: Storage };

function fakeWindow(): FakeWindow {
  const store = new Map<string, string>();
  return {
    localStorage: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
      clear: () => store.clear(),
      key: () => null,
      get length() {
        return store.size;
      },
    },
  };
}

async function load(env: Record<string, string>) {
  for (const k of ["NEXT_PUBLIC_PLAUSIBLE_DOMAIN", "NEXT_PUBLIC_ANALYTICS_DEBUG"]) delete process.env[k];
  Object.assign(process.env, env);
  return import(`./analytics.ts?${Math.random()}`);
}

afterEach(() => {
  delete (globalThis as { window?: unknown }).window;
});

describe("analytics", () => {
  it("sin proveedor no crea nada ni escribe en el navegador", async () => {
    const w = fakeWindow();
    (globalThis as { window?: unknown }).window = w;
    const a = await load({});
    a.track("view_item", { item: "pulpo" });
    a.trackPurchaseOnce(1001, { value: 24 });
    assert.equal(w.plausible, undefined);
    assert.equal(w.localStorage.length, 0);
  });

  it("con proveedor encola los eventos hasta que carga el script", async () => {
    const w = fakeWindow();
    (globalThis as { window?: unknown }).window = w;
    const a = await load({ NEXT_PUBLIC_PLAUSIBLE_DOMAIN: "tienda.example" });
    a.track("select_color", { item: "pulpo", color: "lila" });
    const q = (w.plausible as unknown as { q: unknown[][] }).q;
    assert.deepEqual(q, [["select_color", { props: { item: "pulpo", color: "lila" } }]]);
  });

  it("purchase solo una vez por pedido", async () => {
    const w = fakeWindow();
    const calls: unknown[][] = [];
    w.plausible = (...args) => void calls.push(args);
    (globalThis as { window?: unknown }).window = w;
    const a = await load({ NEXT_PUBLIC_PLAUSIBLE_DOMAIN: "tienda.example" });
    a.trackPurchaseOnce(1001, { value: 28.9, currency: "EUR" });
    a.trackPurchaseOnce(1001, { value: 28.9, currency: "EUR" });
    a.trackPurchaseOnce(1002, { value: 45, currency: "EUR" });
    assert.equal(calls.length, 2);
    assert.deepEqual(calls[0], ["purchase", { props: { order: 1001, value: 28.9, currency: "EUR" } }]);
  });
});
