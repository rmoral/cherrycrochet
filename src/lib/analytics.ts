// Medición de conversión (DESIGN §8).
//
// Proveedor: Plausible (o una instancia propia compatible), que no usa cookies. Se activa solo si
// existe NEXT_PUBLIC_PLAUSIBLE_DOMAIN; sin esa variable no se carga ningún script, no se envía nada
// y no se escribe nada en el navegador. NEXT_PUBLIC_ANALYTICS_DEBUG=1 muestra los eventos en la
// consola (útil en desarrollo, también sin proveedor).

export type AnalyticsEvent =
  | "view_item"
  | "select_color"
  | "begin_checkout"
  | "checkout_error"
  | "purchase";

/** Solo valores simples y nunca datos personales (nada de email, nombre ni dirección). */
export type AnalyticsProps = Record<string, string | number>;

export const analytics = {
  domain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "",
  src: process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || "https://plausible.io/js/script.js",
  debug: process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "1",
};

export const analyticsEnabled = () => analytics.domain !== "";

type Plausible = ((event: string, options?: { props?: AnalyticsProps }) => void) & {
  q?: unknown[][];
};

export function track(event: AnalyticsEvent, props: AnalyticsProps = {}) {
  if (typeof window === "undefined") return;
  if (analytics.debug) console.info("[analytics]", event, props);
  if (!analyticsEnabled()) return;
  const w = window as unknown as { plausible?: Plausible };
  // Si el script aún no ha cargado, se encola: Plausible procesa la cola al arrancar.
  w.plausible ??= Object.assign(
    (...args: unknown[]) => {
      (w.plausible!.q ??= []).push(args);
    },
    { q: [] as unknown[][] },
  );
  w.plausible(event, { props });
}

/** «purchase» una sola vez por pedido en este navegador (recargar la página de gracias no repite). */
export function trackPurchaseOnce(order: number, props: AnalyticsProps) {
  if (typeof window === "undefined" || !analyticsEnabled()) return;
  const key = `purchase-tracked:${order}`;
  try {
    if (window.localStorage.getItem(key)) return;
    window.localStorage.setItem(key, "1");
  } catch {
    // Sin almacenamiento disponible: se envía igualmente.
  }
  track("purchase", { order, ...props });
}
