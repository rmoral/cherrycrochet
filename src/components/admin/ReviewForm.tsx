"use client";
import { useActionState, useState } from "react";
import { deleteReview, saveReview, type FormState } from "@/app/actions/admin";
import { localeNames, locales } from "@/lib/config";
import type { Review } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";
import { uploadMedia } from "./upload";

export function ReviewForm({
  review,
  products,
}: {
  review?: Review;
  products: { id: string; name: string }[];
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveReview, { error: null });
  const [photo, setPhoto] = useState(review?.photo_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      setPhoto(await uploadMedia(file));
    } catch (e) {
      setUploadError(`No se pudo subir la foto: ${(e as Error).message}`);
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <form action={action} className="flex flex-col gap-6">
        <input type="hidden" name="id" value={review?.id ?? ""} />
        <input type="hidden" name="photo_url" value={photo} />

        <p className="rounded-xl bg-sun/40 p-3 text-sm font-bold">
          Solo opiniones reales de clientes, con su permiso para publicar el nombre y la foto. Copia
          el texto tal como lo escribieron y en su idioma.
        </p>

        <section className="card grid gap-4 p-5 sm:grid-cols-2">
          <label>
            <span className="label">Nombre de quien opina</span>
            <input name="author" required maxLength={80} defaultValue={review?.author ?? ""} className="field" />
          </label>
          <label>
            <span className="label">Ciudad (opcional)</span>
            <input name="city" maxLength={80} defaultValue={review?.city ?? ""} className="field" />
          </label>
          <label>
            <span className="label">Producto</span>
            <select name="product_id" defaultValue={review?.product_id ?? ""} className="field">
              <option value="">Ninguno (reseña de la tienda)</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="label">Valoración</span>
            <select name="rating" defaultValue={String(review?.rating ?? 5)} className="field">
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} de 5
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="label">Idioma en que está escrita</span>
            <select name="locale" defaultValue={review?.locale ?? "es"} className="field">
              {locales.map((l) => (
                <option key={l} value={l}>
                  {localeNames[l]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 self-end font-bold sm:min-h-12">
            <input type="checkbox" name="published" defaultChecked={review?.published ?? false} className="size-5" />
            Publicada en la tienda
          </label>
          <label className="sm:col-span-2">
            <span className="label">Texto</span>
            <textarea name="body" required rows={5} maxLength={2000} defaultValue={review?.body ?? ""} className="field" />
          </label>
        </section>

        <section className="card p-5">
          <h2 className="text-2xl font-bold">Foto del cliente (opcional)</h2>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            {photo && (
              <div className="relative size-28 overflow-hidden rounded-xl border-2 border-ink bg-blush">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt="" className="size-full object-cover" />
              </div>
            )}
            <label className="btn btn-ghost cursor-pointer text-base">
              <Icon name="plus" />
              {uploading ? "Subiendo…" : photo ? "Cambiar foto" : "Subir foto"}
              <input
                type="file"
                accept="image/*"
                hidden
                disabled={uploading}
                onChange={(e) => {
                  onFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
            {photo && (
              <button
                type="button"
                onClick={() => setPhoto("")}
                className="inline-flex min-h-11 items-center gap-1 text-sm font-bold text-coral-deep underline"
              >
                <Icon name="x" size={16} />
                Quitar foto
              </button>
            )}
          </div>
          {uploadError && <p role="alert" className="mt-3 font-bold text-coral-deep">{uploadError}</p>}
        </section>

        {state.error && <p role="alert" className="rounded-xl bg-coral/15 p-3 font-bold text-coral-deep">{state.error}</p>}
        <button disabled={pending || uploading} className="btn btn-primary w-fit">
          {pending ? "Guardando…" : "Guardar reseña"}
        </button>
      </form>

      {review && (
        <form
          action={deleteReview}
          onSubmit={(e) => {
            if (!confirm("¿Borrar esta reseña? No se puede deshacer.")) e.preventDefault();
          }}
          className="mt-10 border-t-2 border-ink/10 pt-6"
        >
          <input type="hidden" name="id" value={review.id} />
          <button className="text-sm font-bold text-coral-deep underline">Borrar reseña</button>
        </form>
      )}
    </>
  );
}
