import { shipping, type Locale } from "./config.ts";

// Importa config con extensión `.ts` para que `node --test` pueda ejecutar las pruebas
// sin compilar (Node quita los tipos pero no resuelve rutas sin extensión).

export type DeliveryRange = { min: Date; max: Date };

const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

/**
 * Fecha estimada de entrega: hoy + días de elaboración + días de transporte de la zona.
 * Sin país conocido (o fuera de zona) se usa la primera zona de `shipping.zones`.
 */
export function estimateDelivery(
  leadTimeDays: number,
  country: string,
  from: Date = new Date(),
): DeliveryRange {
  const zone =
    shipping.zones.find((z) => z.countries.includes(country.toUpperCase())) ??
    shipping.zones[0];
  const lead = Math.max(0, Math.round(leadTimeDays) || 0);
  const [tMin, tMax] = zone.transitDays;
  return { min: addDays(from, lead + tMin), max: addDays(from, lead + tMax) };
}

// Formato día-mes en los cuatro idiomas (en-GB para que el inglés también vaya «24 November»).
const intlLocale = (locale: Locale) => (locale === "en" ? "en-GB" : locale);

/**
 * Rango largo para frases: «entre el 24 y el 29 de noviembre».
 * `template` viene de i18n (`{min}` y `{max}`); si ambas fechas caen en el mismo mes,
 * la primera se escribe solo con el día.
 */
export function formatDeliveryRange(range: DeliveryRange, locale: Locale, template: string) {
  const loc = intlLocale(locale);
  const dayMonth = new Intl.DateTimeFormat(loc, { day: "numeric", month: "long" });
  const sameMonth =
    range.min.getMonth() === range.max.getMonth() &&
    range.min.getFullYear() === range.max.getFullYear();
  const min = sameMonth
    ? new Intl.DateTimeFormat(loc, { day: "numeric" }).format(range.min)
    : dayMonth.format(range.min);
  let text = template.replace("{min}", min).replace("{max}", dayMonth.format(range.max));
  // Catalán: «el 1» y «el 11» se apostrofan («l'1», «l'11»).
  if (locale === "ca") text = text.replace(/\bel (1|11)\b/g, "l'$1");
  return text;
}

/** Rango corto para la barra fija y el resumen del checkout: «24–29 nov». */
export function formatDeliveryShort(range: DeliveryRange, locale: Locale) {
  return new Intl.DateTimeFormat(intlLocale(locale), { day: "numeric", month: "short" }).formatRange(
    range.min,
    range.max,
  );
}
