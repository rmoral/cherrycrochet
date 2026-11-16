import { defaultLocale, type Locale } from "./config";

export type L10n = Partial<Record<Locale, string>>;
export type Media = { type: "image" | "video"; url: string };

/** Color en que se puede tejer un producto. `id` viaja en la URL (`?color=`). */
export type ProductColor = { id: string; hex: string; name: L10n };

export type Product = {
  id: string;
  slug: string;
  name: L10n;
  tagline: L10n;
  description: L10n;
  price_cents: number;
  compare_at_cents: number | null;
  media: Media[];
  colors: ProductColor[];
  /** Medidas y materiales, por idioma. */
  details: L10n;
  /** Cuidados, por idioma. */
  care: L10n;
  lead_time_days: number;
  featured: boolean;
  active: boolean;
  sort_order: number;
  created_at?: string;
};

export const ORDER_STATUSES = [
  "pending",
  "paid",
  "in_production",
  "shipped",
  "delivered",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pendiente de pago",
  paid: "Pagado · por tejer",
  in_production: "Tejiendo",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};


export const STATUS_STYLE: Record<OrderStatus, string> = {
  pending: "bg-ink/10",
  paid: "bg-sun",
  in_production: "bg-grape/25",
  shipped: "bg-sky/30",
  delivered: "bg-mint/30",
  cancelled: "bg-coral/25",
};

export type OrderItem = {
  id: string;
  product_id: string | null;
  product_name: string;
  unit_price_cents: number;
  quantity: number;
  /** Nombre del color (en español) en el momento de la compra. */
  color: string | null;
};

/** Reseña real de un cliente. Se muestra en el idioma en que se escribió. */
export type Review = {
  id: string;
  product_id: string | null;
  author: string;
  city: string | null;
  rating: number;
  body: string;
  locale: Locale;
  photo_url: string | null;
  published: boolean;
  created_at: string;
};

export type Order = {
  id: string;
  order_number: number;
  status: OrderStatus;
  locale: string;
  customer_name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  region: string | null;
  postal_code: string;
  country: string;
  notes: string | null;
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  stripe_session_id: string | null;
  stripe_payment_intent: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  admin_notes: string | null;
  paid_at: string | null;
  shipped_at: string | null;
  created_at: string;
  order_items?: OrderItem[];
};

/** Texto en el idioma pedido, con caída al idioma por defecto. */
export const tr = (v: L10n | null | undefined, locale: Locale) =>
  v?.[locale]?.trim() || v?.[defaultLocale] || "";

export const formatPrice = (cents: number, locale: string = "es") =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
