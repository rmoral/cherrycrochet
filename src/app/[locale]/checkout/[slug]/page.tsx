import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale, shipCountries } from "@/lib/config";
import { getDict } from "@/lib/i18n";
import { getProduct } from "@/lib/data";
import { formatPrice, tr } from "@/lib/types";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata: Metadata = { robots: { index: false } };

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const product = await getProduct(slug);
  if (!product) notFound();
  const t = getDict(locale);
  const names = new Intl.DisplayNames([locale], { type: "region" });
  const countries = shipCountries.map((code) => ({ code, name: names.of(code) ?? code }));
  const cover = product.media.find((m) => m.type === "image");

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-4xl font-extrabold">{t.checkout.title}</h1>
      <div className="card my-6 flex items-center gap-4 p-3">
        {cover && (
          <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-blush">
            <Image src={cover.url} alt="" fill sizes="80px" unoptimized={cover.url.endsWith(".svg")} className="object-cover" />
          </div>
        )}
        <div>
          <p className="font-display text-xl font-bold">{tr(product.name, locale)}</p>
          <p className="font-bold text-coral">{formatPrice(product.price_cents, locale)}</p>
          <p className="text-sm opacity-70">
            {t.product.leadTime.replace("{days}", String(product.lead_time_days))}
          </p>
        </div>
      </div>
      <CheckoutForm
        locale={locale}
        slug={product.slug}
        priceCents={product.price_cents}
        countries={countries}
        t={t.checkout}
      />
    </div>
  );
}
