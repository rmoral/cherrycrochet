import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { serviceClient } from "@/lib/supabase/admin";
import { updateOrder } from "@/app/actions/admin";
import { formatPrice, ORDER_STATUSES, STATUS_LABEL, type Order } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";

const date = (v: string | null) =>
  v ? new Date(v).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" }) : "—";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const { data } = await serviceClient()
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const o = data as Order;
  const country = new Intl.DisplayNames(["es"], { type: "region" }).of(o.country);

  return (
    <>
      <Link href="/admin" className="inline-flex items-center gap-1 text-sm font-bold underline">
        <Icon name="arrow-left" size={16} />
        Pedidos
      </Link>
      <h1 className="mt-2 text-4xl font-extrabold">Pedido #{o.order_number}</h1>
      <p className="opacity-70">
        Creado: {date(o.created_at)} · Pagado: {date(o.paid_at)} · Enviado: {date(o.shipped_at)}
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="card p-5">
          <h2 className="text-2xl font-bold">Artículos</h2>
          <ul className="mt-3 divide-y-2 divide-ink/10">
            {o.order_items?.map((i) => (
              <li key={i.id} className="flex justify-between gap-4 py-2">
                <span>
                  {i.quantity}× {i.product_name}
                  {i.color && (
                    <span className="block text-sm font-bold">Color: {i.color}</span>
                  )}
                </span>
                <b>{formatPrice(i.unit_price_cents * i.quantity)}</b>
              </li>
            ))}
          </ul>
          <dl className="mt-3 grid grid-cols-2 gap-y-1 border-t-2 border-ink pt-3">
            <dt>Subtotal</dt><dd className="text-right">{formatPrice(o.subtotal_cents)}</dd>
            <dt>Envío</dt><dd className="text-right">{formatPrice(o.shipping_cents)}</dd>
            <dt className="text-xl font-extrabold">Total</dt>
            <dd className="text-right text-xl font-extrabold">{formatPrice(o.total_cents)}</dd>
          </dl>
          {o.notes && (
            <p className="mt-4 rounded-xl bg-sun/40 p-3">
              <b>Nota del cliente:</b> {o.notes}
            </p>
          )}
        </section>

        <section className="card p-5">
          <h2 className="text-2xl font-bold">Cliente y envío</h2>
          <address className="mt-3 not-italic leading-relaxed">
            <b>{o.customer_name}</b><br />
            {o.address_line1}<br />
            {o.address_line2 && <>{o.address_line2}<br /></>}
            {o.postal_code} {o.city}{o.region ? `, ${o.region}` : ""}<br />
            {country}
          </address>
          <p className="mt-3">
            <a href={`mailto:${o.email}`} className="underline">{o.email}</a><br />
            <a href={`tel:${o.phone}`} className="underline">{o.phone}</a><br />
            <span className="text-sm opacity-70">Idioma del cliente: {o.locale.toUpperCase()}</span>
          </p>
          {o.stripe_payment_intent && (
            <a
              href={`https://dashboard.stripe.com/payments/${o.stripe_payment_intent}`}
              target="_blank"
              rel="noopener"
              className="mt-3 inline-flex items-center gap-1 text-sm font-bold underline"
            >
              Ver pago en Stripe
              <Icon name="external" size={16} />
            </a>
          )}
        </section>
      </div>

      <form action={updateOrder} className="card mt-6 grid gap-4 p-5 md:grid-cols-2">
        <input type="hidden" name="id" value={o.id} />
        <h2 className="text-2xl font-bold md:col-span-2">Gestión</h2>
        <label>
          <span className="label">Estado</span>
          <select name="status" defaultValue={o.status} className="field">
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABEL[s]}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="label">N.º de seguimiento</span>
          <input name="tracking_number" defaultValue={o.tracking_number ?? ""} className="field" />
        </label>
        <label className="md:col-span-2">
          <span className="label">Enlace de seguimiento</span>
          <input name="tracking_url" type="url" defaultValue={o.tracking_url ?? ""} className="field" />
        </label>
        <label className="md:col-span-2">
          <span className="label">Notas internas</span>
          <textarea name="admin_notes" rows={3} defaultValue={o.admin_notes ?? ""} className="field" />
        </label>
        <button className="btn btn-primary w-fit">Guardar</button>
      </form>
    </>
  );
}
