import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/config";
import { getDict } from "@/lib/i18n";
import { demoMode } from "@/lib/data";
import { serviceClient } from "@/lib/supabase/admin";
import { markOrderPaid, stripe } from "@/lib/stripe";
import { TrackPurchase } from "@/components/TrackPurchase";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = { robots: { index: false } };

async function lookup(sessionId: string | undefined) {
  if (!sessionId || demoMode() || !process.env.STRIPE_SECRET_KEY) return null;
  try {
    const session = await stripe().checkout.sessions.retrieve(sessionId);
    await markOrderPaid(session); // respaldo por si el webhook llega tarde
    const { data } = await serviceClient()
      .from("orders")
      .select("order_number, status, total_cents")
      .eq("stripe_session_id", session.id)
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
}

export default async function Success({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDict(locale).success;
  const order = await lookup((await searchParams).session_id);
  // Pagado o ya en marcha. Un pedido cancelado o pendiente no se da por pagado.
  const paid = !!order && ["paid", "in_production", "shipped", "delivered"].includes(order.status);

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      {paid && order && <TrackPurchase order={order.order_number} totalCents={order.total_cents} />}
      <span className="mx-auto grid size-20 place-items-center rounded-full border-2 border-ink bg-mint-soft text-mint-deep">
        <Icon name="check" size={40} strokeWidth={3} />
      </span>
      <h1 className="mt-4 text-5xl font-extrabold">{t.title}</h1>
      {order && (
        <p className="mx-auto mt-5 w-fit rounded-full border-2 border-ink bg-sun px-5 py-1.5 font-extrabold">
          {t.order} {order.order_number}
        </p>
      )}
      <p className="mt-5 text-lg">{paid ? t.text : t.pending}</p>
      <Link href={`/${locale}`} className="btn btn-primary mt-8">
        {t.back}
      </Link>
    </div>
  );
}
