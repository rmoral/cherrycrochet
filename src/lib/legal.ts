import type { Dict } from "./i18n";

/** Un texto con huecos entre corchetes («[PENDIENTE: …]») no está listo para publicarse. */
export const isDraft = (text: string) => /\[[^\]]+\]/.test(text);

/** Política de devoluciones lista para mostrar, o "" mientras siga siendo un hueco. */
export const returnsPolicy = (t: Dict) => (isDraft(t.legal.returns) ? "" : t.legal.returns.trim());

export const LEGAL_PAGES = {
  shipping: "envios-y-devoluciones",
  notice: "aviso-legal",
  privacy: "privacidad",
} as const;
export type LegalPage = keyof typeof LEGAL_PAGES;
