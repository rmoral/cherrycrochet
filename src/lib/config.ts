// ─── Configuración de la tienda: cambia aquí marca, idiomas y envíos ───

export const brand = {
  name: "Punto Alegre", // ← nombre provisional: pon el de tu marca
  email: "hola@tudominio.com",
  instagram: "", // URL completa o vacío para ocultarlo
};

export const locales = ["es", "ca", "en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";
export const localeNames: Record<Locale, string> = {
  es: "Español",
  ca: "Català",
  en: "English",
  fr: "Français",
};
export const isLocale = (v: string): v is Locale =>
  (locales as readonly string[]).includes(v);

export const currency = "EUR";
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export type ShippingZone = {
  id: string;
  countries: string[];
  /** Coste en céntimos. */
  cents: number;
  /** Días de transporte [mín, máx] desde que sale el paquete. Ajústalos a tu transportista. */
  transitDays: [number, number];
};

// Tarifas y plazos de envío por zona. Envío gratis a partir de `freeFromCents`.
// La primera zona es la que se usa cuando aún no se conoce el país (ficha de producto).
export const shipping: { freeFromCents: number; zones: ShippingZone[] } = {
  freeFromCents: 6000,
  zones: [
    { id: "es", countries: ["ES"], cents: 490, transitDays: [2, 3] },
    { id: "ad", countries: ["AD"], cents: 690, transitDays: [3, 5] },
    {
      id: "eu",
      countries: [
        "PT", "FR", "DE", "IT", "BE", "NL", "LU", "IE", "AT", "DK", "SE", "FI",
        "PL", "CZ", "SK", "SI", "HR", "HU", "RO", "BG", "GR", "EE", "LV", "LT",
        "MT", "CY",
      ],
      cents: 990,
      transitDays: [4, 7],
    },
  ],
};

export const shipCountries = shipping.zones.flatMap((z) => z.countries);

/** Coste de envío en céntimos, o null si no enviamos a ese país. */
export function shippingFor(country: string, subtotalCents: number) {
  const zone = shipping.zones.find((z) => z.countries.includes(country));
  if (!zone) return null;
  return subtotalCents >= shipping.freeFromCents ? 0 : zone.cents;
}

export const MAX_QTY = 10;
