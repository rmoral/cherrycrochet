import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { serviceClient } from "@/lib/supabase/admin";
import { formatPrice, type Product } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";

export default async function ProductsPage() {
  await requireAdmin();
  const { data } = await serviceClient()
    .from("products")
    .select("*")
    .order("sort_order")
    .order("created_at", { ascending: false });
  const products = (data ?? []) as Product[];

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-4xl font-extrabold">Productos</h1>
        <Link href="/admin/products/new" className="btn btn-primary">
          <Icon name="plus" strokeWidth={2.8} />
          Nuevo
        </Link>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        {products.length === 0 && (
          <p className="rounded-2xl border-2 border-dashed border-ink/30 p-8 text-center font-bold opacity-70">
            Aún no hay productos. Crea el primero.
          </p>
        )}
        {products.map((p) => {
          const cover = p.media.find((m) => m.type === "image");
          return (
            <Link
              key={p.id}
              href={`/admin/products/${p.id}`}
              className="flex items-center gap-4 rounded-2xl border-2 border-ink bg-white p-3 hover:bg-blush"
            >
              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-blush">
                {cover && <Image src={cover.url} alt="" fill sizes="64px" className="object-cover" />}
              </div>
              <div className="min-w-0">
                <p className="truncate font-display text-xl font-bold">{p.name.es}</p>
                <p className="text-sm opacity-70">
                  /{p.slug} · {p.lead_time_days} días · {p.media.length} foto(s)/vídeo(s)
                </p>
              </div>
              <div className="ml-auto text-right">
                <b>{formatPrice(p.price_cents)}</b>
                <span className={`block rounded-full px-2 text-xs font-bold ${p.active ? "bg-mint/30" : "bg-ink/10"}`}>
                  {p.active ? "Visible" : "Oculto"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
