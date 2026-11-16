"use client";
import { usePathname, useRouter } from "next/navigation";
import { localeNames, locales, type Locale } from "@/lib/config";

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <select
      aria-label="Idioma / Language"
      value={locale}
      onChange={(e) =>
        router.push(pathname.replace(/^\/[a-z]{2}(?=\/|$)/, `/${e.target.value}`))
      }
      className="min-h-11 rounded-full border-2 border-ink bg-white px-3 text-sm font-bold text-ink"
    >
      {locales.map((l) => (
        <option key={l} value={l}>
          {localeNames[l]}
        </option>
      ))}
    </select>
  );
}
