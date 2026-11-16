import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/config";
import { formatPrice, tr, type Product } from "@/lib/types";

const tints = ["bg-blush", "bg-sun/30", "bg-mint/20", "bg-grape/15", "bg-sky/20"];

export function ProductCard({
  product,
  locale,
  index,
  cta,
}: {
  product: Product;
  locale: Locale;
  index: number;
  cta: string;
}) {
  const cover = product.media[0];
  const name = tr(product.name, locale);
  return (
    <Link
      href={`/${locale}/p/${product.slug}`}
      className="card group flex flex-col overflow-hidden transition-transform hover:-translate-y-1"
    >
      <div className={`relative aspect-square ${tints[index % tints.length]}`}>
        {cover?.type === "video" ? (
          <video src={cover.url} muted loop playsInline autoPlay className="size-full object-cover" />
        ) : cover ? (
          <Image
            src={cover.url}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, 33vw"
            unoptimized={cover.url.endsWith(".svg")}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1 border-t-2 border-ink p-4">
        <h3 className="text-xl font-bold">{name}</h3>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-display text-2xl font-extrabold text-coral">
            {formatPrice(product.price_cents, locale)}
          </span>
          <span className="text-sm font-bold underline decoration-sun decoration-4 underline-offset-4">
            {cta} →
          </span>
        </div>
      </div>
    </Link>
  );
}
