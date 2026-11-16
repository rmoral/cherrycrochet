"use server";
import { redirect } from "next/navigation";
import {
  defaultLocale,
  isLocale,
  MAX_QTY,
  shipCountries,
  shippingFor,
  siteUrl,
} from "@/lib/config";
import { getDict } from "@/lib/i18n";
import { demoMode, getProduct } from "@/lib/data";
import { serviceClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";
import { tr } from "@/lib/types";

export type CheckoutState = { error: string | null };

export async function createCheckout(
  _prev: CheckoutState,
  fd: FormData,
): Promise<CheckoutState> {
  const get = (k: string) => String(fd.get(k) ?? "").trim().slice(0, 500);
  const rawLocale = get("locale");
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = getDict(locale).checkout;

  if (demoMode() || !process.env.STRIPE_SECRET_KEY) return { error: t.errorDemo };

  const data = {
    customer_name: get("name"),
    email: get("email").toLowerCase(),
    phone: get("phone"),
    address_line1: get("address1"),
    address_line2: get("address2") || null,
    city: get("city"),
    region: get("region") || null,
    postal_code: get("postal"),
    country: get("country").toUpperCase(),
    notes: get("notes") || null,
  };
  const quantity = Math.min(MAX_QTY, Math.max(1, parseInt(get("quantity")) || 1));

  const valid =
    data.customer_name.length > 1 &&
    /^\S+@\S+\.\S+$/.test(data.email) &&
    data.phone.length > 5 &&
    data.address_line1 &&
    data.city &&
    data.postal_code &&
    shipCountries.includes(data.country);
  if (!valid) return { error: t.errorFields };

  // El precio se lee SIEMPRE de la base de datos, nunca del formulario.
  const product = await getProduct(get("slug"));
  if (!product) return { error: t.errorGeneric };

  const subtotal = product.price_cents * quantity;
  const ship = shippingFor(data.country, subtotal);
  if (ship === null) return { error: t.errorFields };
  const productName = tr(product.name, locale);

  // Color: debe existir en el producto. Se guarda su nombre en español para el back office.
  const colorId = get("color");
  const color = colorId ? product.colors.find((c) => c.id === colorId) : undefined;
  if (colorId && !color) return { error: t.errorFields };

  let url: string | null = null;
  try {
    const db = serviceClient();
    const { data: order, error } = await db
      .from("orders")
      .insert({
        ...data,
        locale,
        subtotal_cents: subtotal,
        shipping_cents: ship,
        total_cents: subtotal + ship,
      })
      .select("id")
      .single();
    if (error) throw error;

    const { error: itemError } = await db.from("order_items").insert({
      order_id: order.id,
      product_id: product.id,
      product_name: productName,
      unit_price_cents: product.price_cents,
      quantity,
      color: color ? tr(color.name, "es") : null,
    });
    if (itemError) throw itemError;

    const images = product.media
      .filter((m) => m.type === "image" && m.url.startsWith("https://"))
      .slice(0, 1)
      .map((m) => m.url);

    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      locale: locale === "ca" ? "es" : locale, // Stripe Checkout no tiene catalán
      customer_email: data.email,
      line_items: [
        {
          quantity,
          price_data: {
            currency: "eur",
            unit_amount: product.price_cents,
            product_data: { name: productName, images },
          },
        },
      ],
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: t.shipping,
            fixed_amount: { amount: ship, currency: "eur" },
          },
        },
      ],
      metadata: { order_id: order.id },
      payment_intent_data: { metadata: { order_id: order.id } },
      success_url: `${siteUrl}/${locale}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/${locale}/checkout/${product.slug}`,
    });

    await db.from("orders").update({ stripe_session_id: session.id }).eq("id", order.id);
    url = session.url;
  } catch (e) {
    console.error("createCheckout", e);
    return { error: t.errorGeneric };
  }

  if (!url) return { error: t.errorGeneric };
  redirect(url);
}
