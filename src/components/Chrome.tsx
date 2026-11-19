import Link from "next/link";
import { brand, shipping, type Locale } from "@/lib/config";
import { getReviews } from "@/lib/data";
import type { Dict } from "@/lib/i18n";
import { formatPrice } from "@/lib/types";
import { fill } from "@/lib/text";
import { LEGAL_PAGES, type LegalPage } from "@/lib/legal";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Button } from "./ui/Button";
import { Icon } from "./ui/Icon";
import { Logo } from "./Logo";

/** Barra de anuncio (tinta). En móvil solo las dos primeras frases. */
export function AnnounceBar({ locale, t }: { locale: Locale; t: Dict }) {
  const parts = t.announce.map((p) =>
    fill(p, { amount: formatPrice(shipping.freeFromCents, locale) }),
  );
  return (
    <div className="bg-ink px-3 py-2 text-center text-[13px] font-bold text-cream md:px-4 md:py-[9px] md:text-sm">
      {parts.map((p, i) => (
        <span key={p} className={i > 1 ? "hidden sm:inline" : undefined}>
          {i > 0 && " · "}
          {p}
        </span>
      ))}
    </div>
  );
}

export async function Header({ locale, t }: { locale: Locale; t: Dict }) {
  const hasReviews = (await getReviews()).length > 0;
  const home = `/${locale}`;
  const links = [
    { href: `${home}#tienda`, label: t.nav.shop },
    ...(hasReviews ? [{ href: `${home}#opiniones`, label: t.nav.reviews }] : []),
    { href: `${home}#como`, label: t.nav.how },
    { href: `${home}#faq`, label: t.nav.faq },
  ];
  return (
    <header className="border-b-2 border-ink bg-cream">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-3 px-4 py-2.5 md:gap-4 md:px-6 md:py-3.5">
        <Logo href={home} />

        {/* Móvil: un único acceso a la tienda */}
        <Link
          href={`${home}#tienda`}
          className="flex min-h-11 items-center rounded-full border-2 border-ink bg-white px-4 text-[15px] font-extrabold md:hidden"
        >
          {t.nav.shop}
        </Link>

        {/* Escritorio */}
        <div className="hidden items-center gap-6 md:flex">
        <nav aria-label={t.nav.label} className="flex items-center gap-6 font-extrabold">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-coral-deep">
              {l.label}
            </Link>
          ))}
          <Button href={`${home}#tienda`} size="sm">
            {t.hero.cta}
          </Button>
        </nav>
        <LocaleSwitcher locale={locale} label={t.footer.language} />
        </div>
      </div>
    </header>
  );
}

export function Footer({ locale, t }: { locale: Locale; t: Dict }) {
  return (
    <footer className="bg-ink text-cream [--focus-ring:var(--color-sun)]">
      <div className="mx-auto flex max-w-[1120px] flex-col items-center gap-2 px-4 py-8 text-center md:px-6 md:py-10">
        <p className="flex items-center gap-2 font-display text-[22px] font-extrabold md:text-[26px]">
          <Icon name="yarn" size={22} strokeWidth={2.4} />
          {brand.name}
        </p>
        <p className="text-[15px] md:text-base">{t.footer.tagline}</p>
        <p className="flex flex-wrap justify-center gap-x-4 text-sm">
          <a href={`mailto:${brand.email}`} className="inline-flex min-h-11 items-center underline">
            {brand.email}
          </a>
          {brand.instagram && (
            <a href={brand.instagram} className="inline-flex min-h-11 items-center underline" rel="noopener">
              Instagram
            </a>
          )}
        </p>
        <nav aria-label={t.legal.nav} className="flex flex-wrap justify-center gap-x-4 text-sm">
          {(Object.keys(LEGAL_PAGES) as LegalPage[]).map((page) => (
            <Link key={page} href={`/${locale}/${LEGAL_PAGES[page]}`} className="inline-flex min-h-11 items-center underline">
              {t.legal[page].title}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 text-sm">
          <span aria-hidden>{t.footer.language}</span>
          <LocaleSwitcher locale={locale} label={t.footer.language} tone="dark" />
        </div>
        <p className="mt-2 text-xs opacity-80">
          © {new Date().getFullYear()} {brand.name}. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
