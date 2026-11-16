import "server-only";
import Stripe from "stripe";
import { serviceClient } from "./supabase/admin";

let client: Stripe | null = null;
export function stripe() {
  if (!client) client = new Stripe(process.env.STRIPE_SECRET_KEY!);
  return client;
}

/** Marca el pedido como pagado. Idempotente: solo actúa sobre pedidos pendientes. */
export async function markOrderPaid(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.order_id;
  if (!orderId || session.payment_status !== "paid") return;
  await serviceClient()
    .from("orders")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      stripe_payment_intent:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : (session.payment_intent?.id ?? null),
    })
    .eq("id", orderId)
    .eq("status", "pending");
}
