import Link from "next/link";
import { brand, type Locale } from "@/lib/config";
import type { Dict } from "@/lib/i18n";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function Logo({ href }: { href: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 font-display text-2xl font-extrabold">
      <span aria-hidden className="grid size-9 place-items-center rounded-full border-2 border-ink bg-sun text-lg">
        🧶
      </span>
      {brand.name}
    </Link>
  );
}

export function Header({ locale, t }: { locale: Locale; t: Dict }) {
  return (
    <header className="sticky top-0 z-30 border-b-2 border-ink bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Logo href={`/${locale}`} />
        <nav className="hidden items-center gap-6 font-bold md:flex">
          <Link href={`/${locale}#tienda`} className="hover:text-coral">{t.nav.shop}</Link>
          <Link href={`/${locale}#como`} className="hover:text-coral">{t.nav.how}</Link>
          <Link href={`/${locale}#faq`} className="hover:text-coral">{t.nav.faq}</Link>
        </nav>
        <LocaleSwitcher locale={locale} />
      </div>
    </header>
  );
}

export function Footer({ t }: { t: Dict }) {
  return (
    <footer className="bg-ink text-cream">
      <div className="scallop -mt-px rotate-180 bg-cream text-ink" />
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-10 text-center">
        <p className="font-display text-2xl font-extrabold">🧶 {brand.name}</p>
        <p className="opacity-80">{t.footer.tagline}</p>
        <p className="flex flex-wrap justify-center gap-4 text-sm">
          <a href={`mailto:${brand.email}`} className="underline">{brand.email}</a>
          {brand.instagram && (
            <a href={brand.instagram} className="underline" rel="noopener">Instagram</a>
          )}
        </p>
        <p className="text-xs opacity-60">
          © {new Date().getFullYear()} {brand.name}. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
