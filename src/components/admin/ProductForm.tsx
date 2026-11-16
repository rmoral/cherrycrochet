"use client";
import { useActionState, useState } from "react";
import {
  deleteProduct,
  saveProduct,
  type FormState,
} from "@/app/actions/admin";
import { localeNames, locales } from "@/lib/config";
import type { Media, Product } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";
import { ColorsEditor } from "./ColorsEditor";
import { uploadMedia } from "./upload";

export function ProductForm({ product }: { product?: Product }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveProduct, { error: null });
  const [media, setMedia] = useState<Media[]>(product?.media ?? []);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setUploadError(null);
    try {
      for (const file of Array.from(files)) {
        const publicUrl = await uploadMedia(file);
        const type: Media["type"] = file.type.startsWith("video") ? "video" : "image";
        setMedia((m) => [...m, { type, url: publicUrl }]);
      }
    } catch (e) {
      setUploadError(`No se pudo subir el archivo: ${(e as Error).message}`);
    } finally {
      setUploading(false);
    }
  }

  const move = (i: number, d: number) =>
    setMedia((m) => {
      const next = [...m];
      const j = i + d;
      if (j < 0 || j >= next.length) return m;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  return (
    <>
      <form action={action} className="flex flex-col gap-6">
        <input type="hidden" name="id" value={product?.id ?? ""} />
        <input type="hidden" name="media" value={JSON.stringify(media)} />

        <section className="card p-5">
          <h2 className="text-2xl font-bold">Fotos y vídeo</h2>
          <p className="text-sm opacity-70">La primera es la portada. Usa las flechas para reordenar.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {media.map((m, i) => (
              <div key={m.url} className="relative size-28 overflow-hidden rounded-xl border-2 border-ink bg-blush">
                {m.type === "video" ? (
                  <video src={m.url} muted className="size-full object-cover" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.url} alt="" className="size-full object-cover" />
                )}
                <div className="absolute inset-x-0 bottom-0 flex justify-between bg-ink/70 px-1 text-white">
                  <button type="button" onClick={() => move(i, -1)} aria-label="Mover antes"><Icon name="arrow-left" size={18} /></button>
                  <button type="button" onClick={() => setMedia((x) => x.filter((_, k) => k !== i))} aria-label="Quitar"><Icon name="x" size={18} /></button>
                  <button type="button" onClick={() => move(i, 1)} aria-label="Mover después"><Icon name="arrow-right" size={18} /></button>
                </div>
              </div>
            ))}
            <label className="grid size-28 cursor-pointer place-items-center rounded-xl border-2 border-dashed border-ink/40 text-center text-sm font-bold hover:bg-blush">
              {uploading ? (
                "Subiendo…"
              ) : (
                <span className="flex flex-col items-center gap-1">
                  <Icon name="plus" />
                  Añadir
                </span>
              )}
              <input
                type="file"
                accept="image/*,video/mp4,video/webm,video/quicktime"
                multiple
                hidden
                disabled={uploading}
                onChange={(e) => {
                  onFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
          {uploadError && <p role="alert" className="mt-3 font-bold text-coral-deep">{uploadError}</p>}
        </section>

        <section className="card grid gap-4 p-5 sm:grid-cols-2">
          <h2 className="text-2xl font-bold sm:col-span-2">Precio y opciones</h2>
          <label>
            <span className="label">Precio (€)</span>
            <input name="price" inputMode="decimal" required defaultValue={product ? (product.price_cents / 100).toFixed(2) : ""} className="field" />
          </label>
          <label>
            <span className="label">Precio anterior tachado (€, opcional)</span>
            <input name="compare_at" inputMode="decimal" defaultValue={product?.compare_at_cents ? (product.compare_at_cents / 100).toFixed(2) : ""} className="field" />
          </label>
          <label>
            <span className="label">Días de elaboración</span>
            <input name="lead_time_days" type="number" min={1} defaultValue={product?.lead_time_days ?? 10} className="field" />
          </label>
          <label>
            <span className="label">Orden (menor = primero)</span>
            <input name="sort_order" type="number" defaultValue={product?.sort_order ?? 0} className="field" />
          </label>
          <label className="sm:col-span-2">
            <span className="label">URL (slug) — vacío = se genera del nombre</span>
            <input name="slug" defaultValue={product?.slug ?? ""} className="field" />
          </label>
          <label className="flex items-center gap-2 font-bold">
            <input type="checkbox" name="active" defaultChecked={product?.active ?? true} className="size-5" />
            Visible en la tienda
          </label>
          <label className="flex items-center gap-2 font-bold">
            <input type="checkbox" name="featured" defaultChecked={product?.featured ?? false} className="size-5" />
            Destacado (portada de la landing)
          </label>
        </section>

        <ColorsEditor initial={product?.colors ?? []} />

        {locales.map((l) => (
          <details key={l} open={l === "es"} className="card p-5">
            <summary className="cursor-pointer font-display text-2xl font-bold">
              Textos · {localeNames[l]}
              {l !== "es" && <span className="ml-2 text-sm font-normal opacity-60">(si lo dejas vacío se muestra el español)</span>}
            </summary>
            <div className="mt-4 grid gap-4">
              <label>
                <span className="label">Nombre</span>
                <input name={`name_${l}`} required={l === "es"} defaultValue={product?.name[l] ?? ""} className="field" />
              </label>
              <label>
                <span className="label">Frase corta</span>
                <input name={`tagline_${l}`} defaultValue={product?.tagline[l] ?? ""} className="field" />
              </label>
              <label>
                <span className="label">Descripción</span>
                <textarea name={`description_${l}`} rows={6} defaultValue={product?.description[l] ?? ""} className="field" />
              </label>
              <label>
                <span className="label">Medidas y materiales</span>
                <textarea
                  name={`details_${l}`}
                  rows={3}
                  placeholder="20 cm de alto · algodón 100 % · relleno hipoalergénico"
                  defaultValue={product?.details?.[l] ?? ""}
                  className="field"
                />
              </label>
              <label>
                <span className="label">Cuidados</span>
                <textarea
                  name={`care_${l}`}
                  rows={3}
                  placeholder="Lavar a mano en agua fría y secar en plano"
                  defaultValue={product?.care?.[l] ?? ""}
                  className="field"
                />
              </label>
            </div>
          </details>
        ))}

        {state.error && <p role="alert" className="rounded-xl bg-coral/15 p-3 font-bold text-coral-deep">{state.error}</p>}
        <button disabled={pending || uploading} className="btn btn-primary w-fit">
          {pending ? "Guardando…" : "Guardar producto"}
        </button>
      </form>

      {product && (
        <form
          action={deleteProduct}
          onSubmit={(e) => {
            if (!confirm("¿Eliminar este producto? Los pedidos existentes se conservan.")) e.preventDefault();
          }}
          className="mt-10 border-t-2 border-ink/10 pt-6"
        >
          <input type="hidden" name="id" value={product.id} />
          <button className="text-sm font-bold text-coral-deep underline">Eliminar producto</button>
        </form>
      )}
    </>
  );
}
