"use client";
import { useEffect } from "react";
import { trackPurchaseOnce } from "@/lib/analytics";

/** Evento «purchase» de la página de gracias, solo con el pedido ya pagado. */
export function TrackPurchase({ order, totalCents }: { order: number; totalCents: number }) {
  useEffect(() => {
    trackPurchaseOnce(order, { value: totalCents / 100, currency: "EUR" });
  }, [order, totalCents]);
  return null;
}
