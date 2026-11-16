import { shipping, type Locale } from "./config";
import type { Dict } from "./i18n";
import { formatPrice } from "./types";

/** Rellena una plantilla de i18n: `fill("Desde {price}", { price: "18 €" })`. */
export const fill = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );

/** «1 día», «7 días» o «5 a 15 días», según el idioma. */
export function formatDays(min: number, max: number, d: Dict["days"]) {
  if (min !== max) return fill(d.range, { min, max });
  return min === 1 ? d.one : fill(d.other, { n: min });
}

/** Tarifas de envío por zona en una frase: «España 4,90 €, Andorra 6,90 € y resto de la UE 9,90 €. Gratis desde 60 €.» */
export function shippingRatesText(locale: Locale, t: Dict) {
  const regions = new Intl.DisplayNames([locale], { type: "region" });
  const parts = shipping.zones.map((z) => {
    const name = z.countries.length === 1 ? (regions.of(z.countries[0]) ?? z.id) : t.faq.otherZone;
    return `${name} ${formatPrice(z.cents, locale)}`;
  });
  const rates = new Intl.ListFormat(locale, { type: "conjunction" }).format(parts);
  return fill(t.faq.shipping.a, {
    rates: rates.charAt(0).toUpperCase() + rates.slice(1),
    free: formatPrice(shipping.freeFromCents, locale),
  });
}
