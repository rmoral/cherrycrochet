"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeNames, locales, type Locale } from "@/lib/config";

/**
 * Cambio de idioma con enlaces (no un `select` que navega al cambiar: con las flechas del teclado
 * saltaba de página). Funciona sin JavaScript y conserva la página actual.
 */
export function LocaleSwitcher({
  locale,
  label,
  tone = "light",
}: {
  locale: Locale;
  /** Nombre accesible de la lista («Idioma»). */
  label: string;
  /** `dark`: sobre fondo tinta (pie). */
  tone?: "light" | "dark";
}) {
  const pathname = usePathname() ?? `/${locale}`;
  const current =
    tone === "dark" ? "bg-cream text-ink" : "bg-ink text-cream";
  return (
    <nav aria-label={label}>
      <ul className="flex items-center gap-1">
        {locales.map((l) => (
          <li key={l}>
            <Link
              href={pathname.replace(/^\/[a-z]{2}(?=\/|$)/, `/${l}`)}
              hrefLang={l}
              lang={l}
              aria-current={l === locale ? "page" : undefined}
              className={`grid min-h-11 min-w-11 place-items-center rounded-full px-2 text-sm font-extrabold ${
                l === locale ? current : "underline-offset-4 hover:underline"
              }`}
            >
              <span aria-hidden>{l.toUpperCase()}</span>
              <span className="sr-only">{localeNames[l]}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
