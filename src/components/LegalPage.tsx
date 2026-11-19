import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { brand, isLocale, locales, shipping, type Locale } from "@/lib/config";
import { getDict, type Dict } from "@/lib/i18n";
import { isDraft, LEGAL_PAGES, type LegalPage } from "@/lib/legal";
import { fill, formatDays, shippingRatesText } from "@/lib/text";

type Params = Promise<{ locale: string }>;

/** Textos de la página con los datos que salen de config.ts (tarifas, plazos, email, marca). */
function sections(page: LegalPage, locale: Locale, t: Dict) {
  const regions = new Intl.DisplayNames([locale], { type: "region" });
  const transit = shipping.zones
    .map((z) => {
      const name = z.countries.length === 1 ? (regions.of(z.countries[0]) ?? z.id) : t.faq.otherZone;
      return `${name}: ${formatDays(z.transitDays[0], z.transitDays[1], t.days)}`;
    })
    .join("; ");
  const vars = {
    brand: brand.name,
    rates: shippingRatesText(locale, t),
    transit: transit.charAt(0).toUpperCase() + transit.slice(1) + ".",
    returns: t.legal.returns,
  };
  // {email} se deja para convertirlo en enlace al pintar.
  return t.legal[page].sections.map((s) => ({ title: s.title, body: fill(s.body, vars) }));
}

/** Pinta los huecos [entre corchetes] resaltados y {email} como enlace. */
function rich(text: string): ReactNode[] {
  return text.split(/(\[[^\]]+\]|\{email\})/).map((part, i) => {
    if (part === "{email}")
      return (
        <a key={i} href={`mailto:${brand.email}`} className="font-bold underline">
          {brand.email}
        </a>
      );
    if (/^\[[^\]]+\]$/.test(part))
      return (
        <mark key={i} className="rounded bg-sun/50 px-1 text-ink">
          {part}
        </mark>
      );
    return part;
  });
}

/** Metadatos: noindex mientras quede algún hueco por completar. */
export function legalMetadata(page: LegalPage) {
  return async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const t = getDict(locale);
    const draft = sections(page, locale, t).some((s) => isDraft(s.body));
    const path = LEGAL_PAGES[page];
    return {
      title: t.legal[page].title,
      robots: draft ? { index: false, follow: true } : undefined,
      alternates: {
        canonical: `/${locale}/${path}`,
        languages: Object.fromEntries(locales.map((l) => [l, `/${l}/${path}`])),
      },
    };
  };
}

export async function LegalPageView({ params, page }: { params: Params; page: LegalPage }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDict(locale);
  const list = sections(page, locale, t);
  const draft = list.some((s) => isDraft(s.body));

  return (
    <article className="mx-auto w-full max-w-[760px] px-4 py-11 md:px-6 md:py-[72px]">
      <h1 className="text-[34px] font-extrabold leading-[1.05] md:text-5xl">{t.legal[page].title}</h1>
      {draft && (
        <p className="mt-4 rounded-2xl border-2 border-ink bg-sun/40 p-4 font-bold">{t.legal.draft}</p>
      )}
      <div className="mt-6 flex flex-col gap-6">
        {list.map((s) => (
          <section key={s.title}>
            <h2 className="text-2xl font-bold md:text-[28px]">{s.title}</h2>
            <p className="mt-1.5 whitespace-pre-line">{rich(s.body)}</p>
          </section>
        ))}
      </div>
    </article>
  );
}

/** ¿La página tiene todavía huecos? (para el sitemap). */
export function legalIsDraft(page: LegalPage, locale: Locale) {
  return sections(page, locale, getDict(locale)).some((s) => isDraft(s.body));
}
