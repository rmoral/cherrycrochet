"use client";
import { useState } from "react";
import { localeNames, locales } from "@/lib/config";
import type { ProductColor } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";

type Row = ProductColor & { key: number };

/**
 * Editor de colores del producto. Envía la lista como JSON en el campo oculto `colors`;
 * el servidor la valida y genera el `id` de los colores nuevos a partir del nombre en español.
 */
export function ColorsEditor({ initial }: { initial: ProductColor[] }) {
  const [rows, setRows] = useState<Row[]>(() => initial.map((c, i) => ({ ...c, key: i })));
  const [nextKey, setNextKey] = useState(initial.length);

  const update = (key: number, patch: Partial<ProductColor>) =>
    setRows((r) => r.map((c) => (c.key === key ? { ...c, ...patch } : c)));
  const move = (i: number, d: number) =>
    setRows((r) => {
      const j = i + d;
      if (j < 0 || j >= r.length) return r;
      const next = [...r];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  const add = () => {
    setRows((r) => [...r, { key: nextKey, id: "", hex: "#FF5C6C", name: {} }]);
    setNextKey((k) => k + 1);
  };

  const value = JSON.stringify(rows.map(({ id, hex, name }) => ({ id, hex, name })));

  return (
    <section className="card p-5">
      <input type="hidden" name="colors" value={value} />
      <h2 className="text-2xl font-bold">Colores</h2>
      <p className="text-sm opacity-70">
        Opcional. Si añades colores, el cliente elige uno en la ficha. El primero es el que aparece
        seleccionado. Si lo dejas vacío, la ficha no muestra selector.
      </p>

      <ol className="mt-4 flex flex-col gap-4">
        {rows.map((c, i) => (
          <li key={c.key} className="rounded-2xl border-2 border-ink/20 p-4">
            <fieldset className="grid gap-3 sm:grid-cols-[auto_1fr]">
              <legend className="sr-only">Color {i + 1}</legend>
              <label className="flex flex-col items-start">
                <span className="label">Tono</span>
                <input
                  type="color"
                  value={c.hex}
                  onChange={(e) => update(c.key, { hex: e.target.value.toUpperCase() })}
                  className="h-12 w-16 cursor-pointer rounded-xl border-2 border-field bg-white p-1"
                />
                <span className="mt-1 font-mono text-xs">{c.hex}</span>
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                {locales.map((l) => (
                  <label key={l}>
                    <span className="label">
                      Nombre · {localeNames[l]}
                      {l === "es" ? " (obligatorio)" : ""}
                    </span>
                    <input
                      value={c.name[l] ?? ""}
                      required={l === "es"}
                      maxLength={40}
                      onChange={(e) => update(c.key, { name: { ...c.name, [l]: e.target.value } })}
                      className="field"
                    />
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="grid size-11 place-items-center rounded-full border-2 border-ink bg-white disabled:opacity-40"
              >
                <Icon name="arrow-left" className="rotate-90" label={`Subir color ${i + 1}`} />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === rows.length - 1}
                className="grid size-11 place-items-center rounded-full border-2 border-ink bg-white disabled:opacity-40"
              >
                <Icon name="arrow-right" className="rotate-90" label={`Bajar color ${i + 1}`} />
              </button>
              <button
                type="button"
                onClick={() => setRows((r) => r.filter((x) => x.key !== c.key))}
                className="ml-auto inline-flex min-h-11 items-center gap-1 px-2 text-sm font-bold text-coral-deep underline"
              >
                <Icon name="x" size={16} />
                Quitar color
              </button>
            </div>
          </li>
        ))}
      </ol>

      <button type="button" onClick={add} className="btn btn-ghost mt-4 text-base">
        <Icon name="plus" />
        Añadir color
      </button>
    </section>
  );
}
