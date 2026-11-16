import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { brand, isLocale, locales, shipping, siteUrl } from "@/lib/config";
import { getDict } from "@/lib/i18n";
import { getProduct, getProducts, getReviews } from "@/lib/data";
import { fill, formatDays, shippingRatesText } from "@/lib/text";
import { formatPrice, tr, type Product } from "@/lib/types";
import { Gallery } from "@/components/Gallery";
import { ProductBuy } from "@/components/ProductBuy";
import { ProductCard, productBadge } from "@/components/ProductCard";
import { Accordion } from "@/components/ui/Accordion";
import { Icon } from "@/components/ui/Icon";
import { Stars } from "@/components/ui/Stars";

export const revalidate = 60;

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ locale: string; slug: string }> };

const abs = (url: string) => (url.startsWith("http") ? url : `${siteUrl}${url}`);
const h2 = "text-[28px] font-extrabold leading-[1.05] md:text-[40px]";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const product = await getProduct(slug);
  if (!product) return {};
  const description = (tr(product.tagline, locale) || tr(product.description, locale)).slice(0, 160);
  const image = product.media.find((m) => m.type === "image")?.url;
  return {
    title: tr(product.name, locale),
    description,
    alternates: {
      canonical: `/${locale}/p/${slug}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/p/${slug}`])),
    },
    openGraph: { title: tr(product.name, locale), description, images: image ? [abs(image)] : [] },
  };
}

/** Venta cruzada: primero las piezas que, junto a esta, alcanzan el envío gratis. */
function crossSell(product: Product, all: Product[]) {
  const reaches = (p: Product) => product.price_cents + p.price_cents >= shipping.freeFromCents;
  return all
    .filter((p) => p.id !== product.id)
    .map((p, i) => ({ p, i }))
    .sort((a, b) => Number(reaches(b.p)) - Number(reaches(a.p)) || a.i - b.i)
    .slice(0, 2)
    .map(({ p }) => p);
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const product = await getProduct(slug);
  if (!product) notFound();
  const t = getDict(locale);
  const [all, reviews] = await Promise.all([getProducts(), getReviews(product.id)]);

  const name = tr(product.name, locale);
  const price = formatPrice(product.price_cents, locale);
  const tagline = tr(product.tagline, locale);
  const minShipping = Math.min(...shipping.zones.map((z) => z.cents));
  const firstCountry =
    new Intl.DisplayNames([locale], { type: "region" }).of(shipping.zones[0].countries[0]) ?? "";

  const rating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null;
  const ratingText =
    rating === null
      ? ""
      : new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(rating);

  const shippingText = [shippingRatesText(locale, t), t.faq.returns.a].filter(Boolean).join(" ");
  const accordions = [
    { title: t.product.description, body: tr(product.description, locale) },
    { title: t.product.details, body: tr(product.details, locale) },
    { title: t.product.shipping, body: shippingText },
    { title: t.product.care, body: tr(product.care, locale) },
  ].filter((a) => a.body.trim());
  const guarantees = [...t.product.guarantees, t.product.guarantee].filter((g) => g.trim());
  const others = crossSell(product, all);

  return (
    <>
      <div className="mx-auto w-full max-w-[1120px] px-4 pb-8 pt-4 md:px-6 md:pb-[72px] md:pt-10">
        {/* Móvil: una columna. Escritorio: galería y detalle a la izquierda; compra a la derecha, fija */}
        <div className="grid gap-5 md:grid-cols-2 md:gap-x-12 md:gap-y-8">
          <div className="min-w-0 md:col-start-1 md:row-start-1">
            <Gallery
              media={product.media}
              alt={name}
              badge={productBadge(product, t.products)}
              t={t.product}
            />
          </div>

          <div className="flex min-w-0 flex-col gap-5 md:sticky md:top-6 md:col-start-2 md:row-span-2 md:row-start-1 md:self-start">
            <div className="flex flex-col gap-1.5">
              <h1 className="text-4xl font-extrabold leading-none md:text-5xl">{name}</h1>
              {tagline && <p className="text-[17px] text-muted">{tagline}</p>}
              {rating !== null && (
                <a href="#opiniones" className="flex min-h-11 items-center gap-2 text-sm font-bold">
                  <Stars rating={rating} label={fill(t.reviews.stars, { rating: ratingText })} size={17} />
                  <span aria-hidden>
                    {fill(reviews.length === 1 ? t.reviews.one : t.reviews.other, {
                      rating: ratingText,
                      count: reviews.length,
                    })}
                  </span>
                </a>
              )}
              <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                <span className="font-display text-[46px] font-extrabold leading-none text-coral-deep">{price}</span>
                <span className="text-sm font-bold">
                  {fill(t.product.shippingFrom, {
                    min: formatPrice(minShipping, locale),
                    free: formatPrice(shipping.freeFromCents, locale),
                  })}
                </span>
              </p>
            </div>

            <ProductBuy
              locale={locale}
              checkoutHref={`/${locale}/checkout/${product.slug}`}
              price={price}
              leadTimeDays={product.lead_time_days}
              leadTimeText={formatDays(product.lead_time_days, product.lead_time_days, t.days)}
              colors={product.colors.map((c) => ({ id: c.id, hex: c.hex, name: tr(c.name, locale) }))}
              country={firstCountry}
              t={t.product}
              between={t.delivery.between}
            />

            <ul className="flex flex-col gap-2 text-[15px] font-bold">
              {guarantees.map((g) => (
                <li key={g} className="flex items-center gap-2.5">
                  <Icon name="check" strokeWidth={3} className="text-mint-deep" />
                  {g}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex min-w-0 flex-col gap-2.5 md:col-start-1 md:row-start-2">
            {accordions.map((a, i) => (
              <Accordion key={a.title} title={a.title} open={i === 0}>
                <p className="whitespace-pre-line">{a.body}</p>
              </Accordion>
            ))}
          </div>
        </div>

        {reviews.length > 0 && (
          <section id="opiniones" className="mt-8 flex flex-col gap-3 md:mt-[72px]">
            <h2 className={h2}>{t.product.reviews}</h2>
            <div className="grid gap-3 md:grid-cols-3 md:gap-6">
              {reviews.slice(0, 6).map((r) => (
                <figure
                  key={r.id}
                  lang={r.locale}
                  className="flex flex-col gap-2 rounded-[18px] border-2 border-ink bg-white p-4"
                >
                  <Stars rating={r.rating} label={fill(t.reviews.stars, { rating: r.rating })} size={17} />
                  <blockquote>{r.body}</blockquote>
                  <figcaption className="mt-auto flex items-center gap-2.5 text-sm font-extrabold">
                    {r.photo_url && (
                      <span className="relative size-12 shrink-0 overflow-hidden rounded-xl border-2 border-ink bg-blush">
                        <Image src={r.photo_url} alt="" fill sizes="48px" className="object-cover" />
                      </span>
                    )}
                    {r.author}
                    {r.city ? ` · ${r.city}` : ""}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {others.length > 0 && (
          <section className="mt-8 flex flex-col gap-3 md:mt-[72px] md:gap-6">
            <h2 className={h2}>{t.product.more}</h2>
            <div className="grid grid-cols-2 gap-3.5 md:max-w-[760px] md:gap-6">
              {others.map((p) => (
                <ProductCard key={p.id} product={p} locale={locale} t={t} />
              ))}
            </div>
          </section>
        )}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name,
            description: tr(product.description, locale),
            image: product.media.filter((m) => m.type === "image").map((m) => abs(m.url)),
            brand: { "@type": "Brand", name: brand.name },
            offers: {
              "@type": "Offer",
              price: (product.price_cents / 100).toFixed(2),
              priceCurrency: "EUR",
              availability: "https://schema.org/MadeToOrder",
              url: `${siteUrl}/${locale}/p/${product.slug}`,
            },
            // Solo con reseñas reales publicadas.
            ...(rating !== null && {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: rating.toFixed(1),
                reviewCount: reviews.length,
                bestRating: 5,
                worstRating: 1,
              },
            }),
          }).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
