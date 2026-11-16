import Image from "next/image";
import Link from "next/link";
import { shipping, type Locale } from "@/lib/config";
import type { Dict } from "@/lib/i18n";
import { fill, formatDays } from "@/lib/text";
import { formatPrice, tr, type Product } from "@/lib/types";
import { AutoplayVideo } from "./AutoplayVideo";
import { Badge } from "./ui/Badge";

/** Distintivo de la tarjeta: «Más vendido» si está destacado; si no, «Envío gratis» si lo alcanza solo. */
export function productBadge(product: Product, t: Dict["products"]) {
  if (product.featured) return t.bestseller;
  if (product.price_cents >= shipping.freeFromCents) return t.freeShipping;
  return null;
}

/** Tarjeta de producto. Toda la tarjeta es un enlace a la ficha. */
export function ProductCard({
  product,
  locale,
  t,
}: {
  product: Product;
  locale: Locale;
  t: Dict;
}) {
  const cover = product.media[0];
  const poster = product.media.find((m) => m.type === "image")?.url;
  const name = tr(product.name, locale);
  const badge = productBadge(product, t.products);
  return (
    <Link
      href={`/${locale}/p/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-[20px] border-2 border-ink bg-white shadow-[0_4px_0_var(--color-ink)] transition-transform hover:-translate-y-1 hover:text-ink md:rounded-3xl md:shadow-[0_5px_0_var(--color-ink)]"
    >
      <div className="relative aspect-square bg-blush">
        {cover?.type === "video" ? (
          <AutoplayVideo src={cover.url} poster={poster} aria-hidden className="size-full object-cover" />
        ) : cover ? (
          <Image
            src={cover.url}
            alt="" // el nombre ya está en la tarjeta, que es el enlace
            fill
            sizes="(max-width: 768px) 50vw, 360px"
            unoptimized={cover.url.endsWith(".svg")}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : null}
        {badge && (
          <Badge size="sm" className="absolute left-2 top-2 md:left-3 md:top-3 md:px-3 md:text-[13px]">
            {badge}
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-0.5 border-t-2 border-ink px-3 pb-3 pt-2.5 md:gap-1.5 md:px-[18px] md:pb-[18px] md:pt-4">
        <h3 className="text-lg font-bold leading-[1.15] md:text-[22px] md:leading-[1.1]">{name}</h3>
        <p className="text-[13px] font-bold md:text-sm">
          {fill(t.products.ready, { days: formatDays(product.lead_time_days, product.lead_time_days, t.days) })}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-1.5 md:mt-1 md:pt-0">
          <span className="font-display text-2xl font-extrabold leading-none text-coral-deep md:text-[28px]">
            {formatPrice(product.price_cents, locale)}
          </span>
          <span
            aria-hidden
            className="hidden rounded-full border-2 border-ink bg-coral px-4 py-1.5 font-display text-base font-extrabold leading-tight md:inline-block"
          >
            {t.products.view}
          </span>
        </div>
      </div>
    </Link>
  );
}
