import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { brand, isLocale, locales, shipping, siteUrl } from "@/lib/config";
import { getDict } from "@/lib/i18n";
import { getProduct, getProducts } from "@/lib/data";
import { formatPrice, tr } from "@/lib/types";
import { Gallery } from "@/components/Gallery";
import { ProductCard } from "@/components/ProductCard";
import { Icon } from "@/components/ui/Icon";

export const revalidate = 60;

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ locale: string; slug: string }> };

const abs = (url: string) => (url.startsWith("http") ? url : `${siteUrl}${url}`);

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

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const product = await getProduct(slug);
  if (!product) notFound();
  const t = getDict(locale);
  const name = tr(product.name, locale);
  const price = formatPrice(product.price_cents, locale);
  const buyHref = `/${locale}/checkout/${product.slug}`;
  const others = (await getProducts()).filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pb-28 pt-6 md:pb-16">
        <Link href={`/${locale}#tienda`} className="inline-flex items-center gap-1 text-sm font-bold underline">
          <Icon name="arrow-left" size={16} />
          {t.product.back}
        </Link>
        <div className="mt-4 grid gap-8 md:grid-cols-2 md:gap-12">
          <Gallery media={product.media} alt={name} />
          <div>
            <h1 className="text-4xl font-extrabold md:text-5xl">{name}</h1>
            {tr(product.tagline, locale) && (
              <p className="mt-2 text-lg opacity-80">{tr(product.tagline, locale)}</p>
            )}
            <p className="mt-4 flex items-baseline gap-3">
              <span className="font-display text-5xl font-extrabold text-coral-deep">{price}</span>
              {product.compare_at_cents && product.compare_at_cents > product.price_cents && (
                <s className="text-xl opacity-50">{formatPrice(product.compare_at_cents, locale)}</s>
              )}
            </p>
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-sun px-4 py-1.5 text-sm font-extrabold">
              <Icon name="yarn" size={18} strokeWidth={2.4} />
              {t.product.leadTime.replace("{days}", String(product.lead_time_days))}
            </p>
            <Link href={buyHref} className="btn btn-primary mt-6 hidden w-full text-xl md:flex">
              {t.product.buy}
            </Link>
            <ul className="mt-6 grid gap-2 text-sm font-bold">
              <li className="flex items-center gap-2">
                <Icon name="check" strokeWidth={3} className="text-mint-deep" />
                {t.product.handmade}
              </li>
              <li className="flex items-center gap-2">
                <Icon name="check" strokeWidth={3} className="text-mint-deep" />
                {t.product.freeShipping.replace(
                  "{amount}",
                  formatPrice(shipping.freeFromCents, locale),
                )}
              </li>
              <li className="flex items-center gap-2">
                <Icon name="check" strokeWidth={3} className="text-mint-deep" />
                {t.product.secure}
              </li>
            </ul>
            <h2 className="mt-8 text-2xl font-bold">{t.product.description}</h2>
            <div className="mt-2 whitespace-pre-line text-lg leading-relaxed">
              {tr(product.description, locale)}
            </div>
          </div>
        </div>

        {others.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-extrabold">{t.product.more}</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
              {others.map((p, i) => (
                <ProductCard key={p.id} product={p} locale={locale} index={i + 1} cta={t.products.view} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Barra de compra fija en móvil */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-4 border-t-2 border-ink bg-cream px-4 py-3 md:hidden">
        <span className="font-display text-3xl font-extrabold text-coral-deep">{price}</span>
        <Link href={buyHref} className="btn btn-primary flex-1">
          {t.product.buy}
        </Link>
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
          }).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
