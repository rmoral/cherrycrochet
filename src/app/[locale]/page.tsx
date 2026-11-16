import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { brand, isLocale, shipping, type Locale } from "@/lib/config";
import { getDict, type Dict } from "@/lib/i18n";
import { getProducts, getReviews } from "@/lib/data";
import { fill, formatDays } from "@/lib/text";
import { formatPrice, tr, type Product, type Review } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { Accordion } from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { Stars } from "@/components/ui/Stars";

export const revalidate = 60;

const wrap = "mx-auto w-full max-w-[1120px] px-4 md:px-6";
const h2 = "text-[34px] font-extrabold leading-[1.05] md:text-5xl";
const stepColors = ["bg-sun", "bg-mint/50", "bg-coral"];

/** Intervalos que la landing calcula a partir de los productos y de config.ts. */
function facts(products: Product[]) {
  const leads = products.map((p) => p.lead_time_days);
  const transit = shipping.zones.map((z) => z.transitDays);
  return {
    minPrice: products.length ? Math.min(...products.map((p) => p.price_cents)) : null,
    lead: leads.length ? { min: Math.min(...leads), max: Math.max(...leads) } : null,
    transit: {
      min: Math.min(...transit.map((d) => d[0])),
      max: Math.max(...transit.map((d) => d[1])),
    },
  };
}

/** Tarifas de envío por zona en una frase: «España 4,90 €, Andorra 6,90 € y resto de la UE 9,90 €». */
function shippingRates(locale: Locale, t: Dict) {
  const regions = new Intl.DisplayNames([locale], { type: "region" });
  const parts = shipping.zones.map((z) => {
    const name = z.countries.length === 1 ? (regions.of(z.countries[0]) ?? z.id) : t.faq.otherZone;
    return `${name} ${formatPrice(z.cents, locale)}`;
  });
  const rates = new Intl.ListFormat(locale, { type: "conjunction" }).format(parts);
  // «resto de la UE» empieza la frase si es la primera zona; en el resto de casos va en minúscula.
  return fill(t.faq.shipping.a, {
    rates: rates.charAt(0).toUpperCase() + rates.slice(1),
    free: formatPrice(shipping.freeFromCents, locale),
  });
}

/** Hasta 3 reseñas, primero las que tienen foto del cliente. */
const pickReviews = (reviews: Review[]) =>
  [...reviews].sort((a, b) => Number(!!b.photo_url) - Number(!!a.photo_url)).slice(0, 3);

export default async function Landing({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDict(locale);
  const [products, reviews] = await Promise.all([getProducts(), getReviews()]);
  const f = facts(products);
  const home = `/${locale}`;

  const heroProduct = products.find((p) => p.featured) ?? products[0];
  const heroMedia = heroProduct?.media[0];
  const heroPoster = heroProduct?.media.find((m) => m.type === "image")?.url;

  const rating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null;
  const ratingText =
    rating === null
      ? ""
      : new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(rating);

  const heroFacts = [
    f.minPrice !== null && fill(t.hero.from, { price: formatPrice(f.minPrice, locale) }),
    f.lead && fill(t.hero.ready, { days: formatDays(f.lead.min, f.lead.max, t.days) }),
    t.hero.ships,
  ].filter(Boolean);

  const stepDays = [
    "",
    f.lead ? formatDays(f.lead.min, f.lead.max, t.days) : "",
    formatDays(f.transit.min, f.transit.max, t.days),
  ];
  const steps = t.how.steps
    .map((s, i) => ({ ...s, title: fill(s.title, { days: stepDays[i] }) }))
    // Sin productos no hay plazo de elaboración que contar.
    .filter((_, i) => i !== 1 || f.lead);

  const faq = [
    {
      q: t.faq.when.q,
      a: fill(t.faq.when.a, { transit: formatDays(f.transit.min, f.transit.max, t.days) }),
    },
    { q: t.faq.shipping.q, a: shippingRates(locale, t) },
    t.faq.color,
    t.faq.returns,
  ].filter((item) => item.a.trim());

  const showMaker = t.maker.intro.trim() !== "";
  const [contactBefore, contactAfter] = t.maker.contact.split("{email}");

  return (
    <>
      {/* Hero: en móvil, titular, CTA y prueba social antes de la foto */}
      <section id="top" className={`${wrap} flex flex-wrap items-center gap-12 pb-9 pt-7 md:pb-16 md:pt-14`}>
        <div className="flex min-w-0 flex-[1_1_420px] flex-col items-start gap-4 md:gap-5">
          <Badge className="-rotate-2 px-3.5 py-[3px] text-xs uppercase tracking-[0.06em] md:px-4 md:py-1 md:text-[13px]">
            {t.hero.badge}
          </Badge>
          <h1 className="text-balance text-[42px] font-extrabold leading-none md:text-[clamp(44px,6vw,76px)]">
            {t.hero.title}
          </h1>
          <p className="max-w-[460px] text-lg md:text-xl">{t.hero.subtitle}</p>
          <Button href={`${home}#tienda`} size="lg" className="self-stretch md:self-auto">
            {t.hero.cta}
          </Button>
          <p className="text-[15px] font-bold">
            {heroFacts.map((fact, i) => (
              <span key={i}>
                {i > 0 && " · "}
                <span className="whitespace-nowrap">{fact}</span>
              </span>
            ))}
          </p>
          {rating !== null && (
            <a href="#opiniones" className="flex min-h-11 items-center gap-2.5 text-[15px] font-bold">
              <Stars rating={rating} label={fill(t.reviews.stars, { rating: ratingText })} size={20} />
              <span aria-hidden>
                {fill(reviews.length === 1 ? t.reviews.one : t.reviews.other, {
                  rating: ratingText,
                  count: reviews.length,
                })}
              </span>
            </a>
          )}
        </div>

        {heroProduct && heroMedia && (
          <Link
            href={`${home}/p/${heroProduct.slug}`}
            className="relative mx-auto block w-full min-w-0 flex-[1_1_380px] md:max-w-[460px] md:rotate-2"
          >
            <PhotoFrame radius="lg" shadow="md" className="md:rounded-[28px] md:shadow-[0_6px_0_var(--color-ink)]">
              {heroMedia.type === "video" ? (
                <video
                  src={heroMedia.url}
                  poster={heroPoster}
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                  aria-hidden
                  className="size-full object-cover"
                />
              ) : (
                <Image
                  src={heroMedia.url}
                  alt={tr(heroProduct.name, locale)}
                  fill
                  priority
                  sizes="(max-width: 768px) 92vw, 460px"
                  unoptimized={heroMedia.url.endsWith(".svg")}
                  className="object-cover"
                />
              )}
            </PhotoFrame>
            <span className="absolute bottom-4 right-3 flex -rotate-3 flex-col rounded-[14px] border-2 border-ink bg-white px-3.5 py-2 font-extrabold shadow-[0_4px_0_var(--color-ink)] md:-left-3.5 md:bottom-7 md:right-auto md:-rotate-4 md:rounded-2xl md:px-4 md:py-2.5">
              <span className="text-[13px] md:text-sm">{tr(heroProduct.name, locale)}</span>
              <span className="font-display text-2xl leading-none text-coral-deep md:text-[26px]">
                {formatPrice(heroProduct.price_cents, locale)}
              </span>
            </span>
          </Link>
        )}
      </section>

      {/* Franja de confianza */}
      <section className="border-y-2 border-ink bg-grape text-white">
        <ul className={`${wrap} grid grid-cols-2 gap-x-3 gap-y-2 py-3.5 text-center text-sm font-extrabold md:grid-cols-4 md:py-4 md:text-[17px]`}>
          {t.trust.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Productos */}
      <section id="tienda" className={`${wrap} py-11 md:py-[72px]`}>
        <h2 className={h2}>{t.products.title}</h2>
        <p className="mt-1.5 md:mt-2 md:text-[19px]">{t.products.subtitle}</p>
        {products.length === 0 ? (
          <p className="mt-10 text-lg font-bold">{t.products.empty}</p>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-3.5 md:mt-8 md:grid-cols-3 md:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} t={t} />
            ))}
          </div>
        )}
      </section>

      {/* Opiniones: solo con reseñas reales publicadas */}
      {reviews.length > 0 && (
        <section id="opiniones" className="border-y-2 border-ink bg-white">
          <div className={`${wrap} py-11 md:py-[72px]`}>
            <h2 className={h2}>{t.reviews.title}</h2>
            <div className="mt-5 grid gap-3.5 md:mt-8 md:grid-cols-3 md:gap-6">
              {pickReviews(reviews).map((r) => (
                <figure
                  key={r.id}
                  lang={r.locale}
                  className="flex flex-col gap-2.5 rounded-[20px] border-2 border-ink bg-cream p-[18px] md:gap-3 md:rounded-3xl md:p-[22px]"
                >
                  <Stars rating={r.rating} label={fill(t.reviews.stars, { rating: r.rating })} />
                  <blockquote className="text-[17px] md:text-lg">{r.body}</blockquote>
                  <figcaption className="mt-auto flex items-center gap-2.5 text-[15px] font-extrabold md:gap-3 md:text-base">
                    {r.photo_url && (
                      <span className="relative size-12 shrink-0 overflow-hidden rounded-xl border-2 border-ink bg-blush md:size-[52px] md:rounded-[14px]">
                        <Image src={r.photo_url} alt="" fill sizes="52px" className="object-cover" />
                      </span>
                    )}
                    {r.author}
                    {r.city ? ` · ${r.city}` : ""}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cómo funciona */}
      <section id="como" className={`border-b-2 border-ink bg-blush ${reviews.length ? "" : "border-t-2"}`}>
        <div className={`${wrap} py-11 md:py-[72px]`}>
          <h2 className={h2}>{t.how.title}</h2>
          <ol className="mt-5 grid gap-3 md:mt-8 md:grid-cols-3 md:gap-6">
            {steps.map((s, i) => (
              <li
                key={s.text}
                className="flex items-center gap-3.5 rounded-[20px] border-2 border-ink bg-white p-4 md:flex-col md:items-start md:gap-2 md:rounded-3xl md:p-6 md:shadow-[0_5px_0_var(--color-ink)]"
              >
                <span
                  aria-hidden
                  className={`grid size-[46px] shrink-0 place-items-center rounded-full border-2 border-ink font-display text-[22px] font-extrabold md:size-[52px] md:text-[26px] ${stepColors[i]}`}
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-xl font-bold leading-[1.1] md:mt-1.5 md:text-[26px]">{s.title}</h3>
                  <p className="mt-0.5 text-[15px] md:mt-2 md:text-[17px]">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Quién teje: solo si el dueño ha escrito su presentación */}
      {showMaker && (
        <section className={`${wrap} flex flex-wrap items-center gap-4 py-11 md:gap-12 md:py-[72px]`}>
          {brand.makerPhoto && (
            <PhotoFrame
              ratio="portrait"
              tone="mint"
              radius="xl"
              shadow="lg"
              className="w-full flex-[1_1_320px] md:max-w-[400px] md:-rotate-2"
            >
              <Image src={brand.makerPhoto} alt="" fill sizes="(max-width: 768px) 92vw, 400px" className="object-cover" />
            </PhotoFrame>
          )}
          <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-4 md:gap-3.5">
            <h2 className={h2}>{t.maker.title}</h2>
            <p className="md:text-[19px]">{t.maker.intro}</p>
            <p className="md:text-[19px]">
              {contactBefore}
              <a href={`mailto:${brand.email}`} className="font-extrabold underline">
                {brand.email}
              </a>
              {contactAfter}
            </p>
          </div>
        </section>
      )}

      {/* Preguntas */}
      <section id="faq" className={`mx-auto w-full max-w-[760px] px-4 py-11 md:px-6 md:py-[72px] ${showMaker ? "pt-0 md:pt-0" : ""}`}>
        <h2 className={h2}>{t.faq.title}</h2>
        <div className="mt-4 flex flex-col gap-2.5 md:mt-6 md:gap-3">
          {faq.map((item, i) => (
            <Accordion key={item.q} title={item.q} open={i === 0} size="auto">
              <p>{item.a}</p>
            </Accordion>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="border-t-2 border-ink bg-sun">
        <div className="mx-auto flex max-w-[760px] flex-col items-center gap-3 px-4 py-12 text-center md:gap-4 md:px-6 md:py-[72px]">
          <h2 className="text-[40px] font-extrabold leading-none md:text-[clamp(40px,5vw,64px)]">{t.cta.title}</h2>
          <p className="md:text-[19px]">{t.cta.text}</p>
          <Button href={`${home}#tienda`} size="lg" className="self-stretch md:self-auto">
            {t.cta.button}
          </Button>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          }).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
