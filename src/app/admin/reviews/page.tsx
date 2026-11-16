import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { localeNames } from "@/lib/config";
import { serviceClient } from "@/lib/supabase/admin";
import { setReviewPublished } from "@/app/actions/admin";
import type { L10n, Review } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";
import { Stars } from "@/components/ui/Stars";

type Row = Review & { products: { name: L10n } | null };

export default async function ReviewsPage() {
  await requireAdmin();
  const { data } = await serviceClient()
    .from("reviews")
    .select("*, products(name)")
    .order("created_at", { ascending: false });
  const reviews = (data ?? []) as Row[];
  const published = reviews.filter((r) => r.published).length;

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-4xl font-extrabold">Reseñas</h1>
        <Link href="/admin/reviews/new" className="btn btn-primary">
          <Icon name="plus" strokeWidth={2.8} />
          Nueva
        </Link>
      </div>
      <p className="mt-2 opacity-70">
        {published} publicada(s) de {reviews.length}. La tienda solo muestra las publicadas; si no hay
        ninguna, la sección de opiniones no aparece.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {reviews.length === 0 && (
          <p className="rounded-2xl border-2 border-dashed border-ink/30 p-8 text-center font-bold opacity-70">
            Aún no hay reseñas. Añade opiniones reales de tus clientes.
          </p>
        )}
        {reviews.map((r) => (
          <article key={r.id} className="flex flex-wrap items-start gap-4 rounded-2xl border-2 border-ink bg-white p-4">
            {r.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={r.photo_url} alt="" className="size-16 shrink-0 rounded-xl border-2 border-ink object-cover" />
            ) : (
              <span className="grid size-16 shrink-0 place-items-center rounded-xl border-2 border-ink bg-blush text-xs font-bold">
                Sin foto
              </span>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <Stars rating={r.rating} label={`${r.rating} de 5 estrellas`} size={16} />
                <b>
                  {r.author}
                  {r.city ? ` · ${r.city}` : ""}
                </b>
                <span
                  className={`rounded-full px-2 text-xs font-bold ${r.published ? "bg-mint/30" : "bg-ink/10"}`}
                >
                  {r.published ? "Publicada" : "Oculta"}
                </span>
              </div>
              <p className="mt-1 line-clamp-2">{r.body}</p>
              <p className="mt-1 text-sm opacity-70">
                {r.products?.name.es ?? "Reseña de la tienda"} · {localeNames[r.locale] ?? r.locale}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <form action={setReviewPublished}>
                <input type="hidden" name="id" value={r.id} />
                <input type="hidden" name="published" value={String(!r.published)} />
                <button className="btn btn-ghost px-4 py-2 text-base">{r.published ? "Ocultar" : "Publicar"}</button>
              </form>
              <Link href={`/admin/reviews/${r.id}`} className="inline-flex min-h-11 items-center px-2 font-bold underline">
                Editar
              </Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
