import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/config";
import { getDict } from "@/lib/i18n";
import { getProducts } from "@/lib/data";
import { tr } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";

export const revalidate = 60;

const stepColors = ["bg-sun", "bg-mint", "bg-coral"];
const stepIcons = ["👆", "🧶", "📦"];
const whyColors = ["bg-blush", "bg-sun/40", "bg-mint/25"];
const whyIcons = ["✨", "☁️", "🎁"];

export default async function Landing({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDict(locale);
  const products = await getProducts();
  const hero = (products.find((p) => p.featured) ?? products[0])?.media.find(
    (m) => m.type === "image",
  );
  const heroProduct = products.find((p) => p.featured) ?? products[0];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute -left-16 top-10 size-48 rounded-full bg-sun/60" />
        <div aria-hidden className="absolute -right-10 bottom-0 size-64 rounded-full bg-mint/30" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-20">
          <div>
            <p className="mb-4 inline-block -rotate-2 rounded-full border-2 border-ink bg-sun px-4 py-1 text-sm font-extrabold uppercase tracking-wide">
              {t.hero.badge}
            </p>
            <h1 className="text-5xl font-extrabold md:text-7xl">{t.hero.title}</h1>
            <p className="mt-5 max-w-md text-lg md:text-xl">{t.hero.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href={`/${locale}#tienda`} className="btn btn-primary">
                {t.hero.cta}
              </Link>
              <Link href={`/${locale}#como`} className="btn btn-ghost">
                {t.hero.cta2}
              </Link>
            </div>
          </div>
          {hero && heroProduct && (
            <Link
              href={`/${locale}/p/${heroProduct.slug}`}
              className="card relative mx-auto aspect-square w-full max-w-md rotate-2 overflow-hidden bg-blush transition-transform hover:rotate-0"
            >
              <Image
                src={hero.url}
                alt={tr(heroProduct.name, locale)}
                fill
                priority
                sizes="(max-width: 768px) 90vw, 440px"
                unoptimized={hero.url.endsWith(".svg")}
                className="object-cover"
              />
            </Link>
          )}
        </div>
      </section>

      {/* Franja de confianza */}
      <section className="border-y-2 border-ink bg-grape text-white">
        <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-x-4 gap-y-2 px-4 py-4 text-center text-sm font-bold md:grid-cols-4 md:text-base">
          {t.trust.map((item) => (
            <li key={item}>✓ {item}</li>
          ))}
        </ul>
      </section>

      {/* Productos */}
      <section id="tienda" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <h2 className="text-4xl font-extrabold md:text-5xl">{t.products.title}</h2>
        <p className="mt-2 text-lg">{t.products.subtitle}</p>
        {products.length === 0 ? (
          <p className="mt-10 text-lg font-bold">{t.products.empty}</p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} locale={locale} index={i} cta={t.products.view} />
            ))}
          </div>
        )}
      </section>

      {/* Cómo funciona */}
      <section id="como" className="scroll-mt-20 border-y-2 border-ink bg-blush">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-4xl font-extrabold md:text-5xl">{t.how.title}</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {t.how.steps.map((s, i) => (
              <li key={s.title} className="card p-6">
                <span className={`grid size-14 place-items-center rounded-full border-2 border-ink text-2xl ${stepColors[i]}`}>
                  {stepIcons[i]}
                </span>
                <h3 className="mt-4 text-2xl font-bold">
                  {i + 1}. {s.title}
                </h3>
                <p className="mt-2">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Por qué */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-4xl font-extrabold md:text-5xl">{t.why.title}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {t.why.items.map((w, i) => (
            <div key={w.title} className={`rounded-3xl border-2 border-ink p-6 ${whyColors[i]}`}>
              <span className="text-3xl">{whyIcons[i]}</span>
              <h3 className="mt-3 text-2xl font-bold">{w.title}</h3>
              <p className="mt-2">{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-4 pb-16">
        <h2 className="text-4xl font-extrabold md:text-5xl">{t.faq.title}</h2>
        <div className="mt-6 flex flex-col gap-3">
          {t.faq.items.map((f) => (
            <details key={f.q} className="group rounded-2xl border-2 border-ink bg-white p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-extrabold">
                {f.q}
                <span className="text-coral transition-transform group-open:rotate-45">＋</span>
              </summary>
              <p className="mt-3">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="border-t-2 border-ink bg-sun">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h2 className="text-4xl font-extrabold md:text-6xl">{t.cta.title}</h2>
          <p className="mt-3 text-lg">{t.cta.text}</p>
          <Link href={`/${locale}#tienda`} className="btn btn-primary mt-7">
            {t.cta.button}
          </Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: t.faq.items.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
