import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { serviceClient } from "@/lib/supabase/admin";
import {
  formatPrice,
  ORDER_STATUSES,
  STATUS_LABEL,
  STATUS_STYLE,
  type Order,
} from "@/lib/types";


export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin();
  const { status } = await searchParams;
  const filter = ORDER_STATUSES.find((s) => s === status);
  const db = serviceClient();

  let query = db
    .from("orders")
    .select("*, order_items(product_name, quantity)")
    .order("created_at", { ascending: false })
    .limit(200);
  // Por defecto se ocultan los pedidos sin pagar (carritos abandonados)
  query = filter ? query.eq("status", filter) : query.neq("status", "pending");
  const [{ data: orders }, { data: all }] = await Promise.all([
    query,
    db.from("orders").select("status"),
  ]);
  const counts = Object.fromEntries(
    ORDER_STATUSES.map((s) => [s, (all ?? []).filter((o) => o.status === s).length]),
  );

  return (
    <>
      <h1 className="text-4xl font-extrabold">Pedidos</h1>
      <nav className="mt-4 flex flex-wrap gap-2 text-sm font-bold">
        <Link href="/admin" className={`rounded-full border-2 border-ink px-3 py-1 ${!filter ? "bg-ink text-white" : "bg-white"}`}>
          Todos los pagados
        </Link>
        {ORDER_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin?status=${s}`}
            className={`rounded-full border-2 border-ink px-3 py-1 ${filter === s ? "bg-ink text-white" : "bg-white"}`}
          >
            {STATUS_LABEL[s]} ({counts[s]})
          </Link>
        ))}
      </nav>

      <div className="mt-6 flex flex-col gap-3">
        {(orders as Order[] | null)?.length ? (
          (orders as Order[]).map((o) => (
            <Link
              key={o.id}
              href={`/admin/orders/${o.id}`}
              className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-2xl border-2 border-ink bg-white p-4 hover:bg-blush"
            >
              <span className="font-display text-xl font-extrabold">#{o.order_number}</span>
              <span className={`rounded-full px-3 py-0.5 text-sm font-bold ${STATUS_STYLE[o.status]}`}>
                {STATUS_LABEL[o.status]}
              </span>
              <span className="font-bold">{o.customer_name}</span>
              <span className="text-sm opacity-70">
                {o.order_items?.map((i) => `${i.quantity}× ${i.product_name}`).join(", ")}
              </span>
              <span className="ml-auto text-right">
                <b>{formatPrice(o.total_cents)}</b>
                <span className="block text-xs opacity-60">
                  {new Date(o.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })} · {o.country}
                </span>
              </span>
            </Link>
          ))
        ) : (
          <p className="rounded-2xl border-2 border-dashed border-ink/30 p-8 text-center font-bold opacity-70">
            No hay pedidos en esta vista.
          </p>
        )}
      </div>
    </>
  );
}
