// Reglas de los campos del checkout. Las usan el navegador (al salir de cada campo) y el
// servidor (que vuelve a validarlo todo): una sola fuente de verdad.

export type FieldError = "required" | "name" | "email" | "phone" | "postal";

export const CHECKOUT_FIELDS = ["email", "name", "phone", "address1", "postal", "city"] as const;
export type CheckoutField = (typeof CHECKOUT_FIELDS)[number];

/** Países cuyo código postal es solo de cifras y sin espacios: en móvil, teclado numérico. */
export const NUMERIC_POSTAL = new Set([
  "ES", "FR", "DE", "IT", "BE", "AT", "DK", "FI", "HR", "HU", "BG", "SI", "EE", "CY", "LU",
]);

const POSTAL: Record<string, RegExp> = {
  ES: /^\d{5}$/,
  FR: /^\d{5}$/,
  DE: /^\d{5}$/,
  IT: /^\d{5}$/,
  PT: /^\d{4}-?\d{3}$/,
  AD: /^(AD)?\d{3}$/i,
};

/** Devuelve el tipo de error del campo, o null si es válido. */
export function validateField(field: CheckoutField, raw: string, country = ""): FieldError | null {
  const v = raw.trim();
  if (!v) return "required";
  switch (field) {
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? null : "email";
    case "name":
      return v.length >= 2 ? null : "name";
    case "phone": {
      const digits = v.replace(/\D/g, "");
      return /^[+\d\s().-]+$/.test(v) && digits.length >= 6 && digits.length <= 15 ? null : "phone";
    }
    case "postal": {
      const rule = POSTAL[country] ?? /^[A-Za-z0-9][A-Za-z0-9 -]{1,8}[A-Za-z0-9]$/;
      return rule.test(v) ? null : "postal";
    }
    default:
      return null;
  }
}
