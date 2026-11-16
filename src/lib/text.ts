import type { Dict } from "./i18n";

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
