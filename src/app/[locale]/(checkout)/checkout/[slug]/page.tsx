import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, shipCountries } from "@/lib/config";
import { getDict } from "@/lib/i18n";
import { getProduct } from "@/lib/data";
import { tr } from "@/lib/types";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata: Metadata = { robots: { index: false } };

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ color?: string | string[] }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const product = await getProduct(slug);
  if (!product) notFound();
  const t = getDict(locale);

  // El color llega de la ficha (?color=id). Si no existe en el producto, se usa el primero.
  const requested = (await searchParams).color;
  const colorId = Array.isArray(requested) ? requested[0] : requested;
  const color = product.colors.find((c) => c.id === colorId) ?? product.colors[0] ?? null;

  const names = new Intl.DisplayNames([locale], { type: "region" });
  // España y Andorra primero; el resto, por orden alfabético en el idioma del cliente.
  const countries = shipCountries
    .map((code, i) => ({ code, name: names.of(code) ?? code, first: i < 2 }))
    .sort((a, b) => Number(b.first) - Number(a.first) || (a.first ? 0 : a.name.localeCompare(b.name, locale)))
    .map(({ code, name }) => ({ code, name }));
  const cover = product.media.find((m) => m.type === "image");

  return (
    <div className="mx-auto w-full max-w-[560px] px-4">
      <CheckoutForm
        locale={locale}
        slug={product.slug}
        name={tr(product.name, locale)}
        image={cover?.url ?? null}
        priceCents={product.price_cents}
        leadTimeDays={product.lead_time_days}
        color={color && { id: color.id, name: tr(color.name, locale) }}
        countries={countries}
        t={t.checkout}
      />
    </div>
  );
}
