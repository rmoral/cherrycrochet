import type Stripe from "stripe";
import { markOrderPaid, stripe } from "@/lib/stripe";
import { serviceClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) return new Response("Not configured", { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(await req.text(), signature, secret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
      await markOrderPaid(event.data.object);
      break;
    case "checkout.session.expired":
    case "checkout.session.async_payment_failed": {
      const orderId = event.data.object.metadata?.order_id;
      if (orderId)
        await serviceClient()
          .from("orders")
          .update({ status: "cancelled" })
          .eq("id", orderId)
          .eq("status", "pending");
      break;
    }
  }
  return Response.json({ received: true });
}
