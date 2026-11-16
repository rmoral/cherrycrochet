"use client";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Locale } from "@/lib/config";
import { estimateDelivery, formatDeliveryRange, formatDeliveryShort } from "@/lib/delivery";
import type { Dict } from "@/lib/i18n";
import { fill } from "@/lib/text";
import { buttonClass } from "./ui/Button";
import { Icon } from "./ui/Icon";

type Color = { id: string; hex: string; name: string };

// true en el navegador tras hidratar, false en el servidor: la fecha nunca queda congelada en el HTML estático.
const subscribe = () => () => {};
const useHydrated = () =>
  useSyncExternalStore(subscribe, () => true, () => false);

/**
 * Bloque de compra de la ficha: fecha de entrega, selector de color, CTA principal y barra
 * fija en móvil. Todo lo que depende de la fecha o de la elección se resuelve en el cliente.
 */
export function ProductBuy({
  locale,
  checkoutHref,
  price,
  leadTimeDays,
  leadTimeText,
  colors,
  country,
  t,
  between,
}: {
  locale: Locale;
  checkoutHref: string;
  price: string;
  leadTimeDays: number;
  /** «7 días», ya formateado en el servidor. */
  leadTimeText: string;
  colors: Color[];
  /** Nombre del país de la primera zona de envío (la que se usa sin país conocido). */
  country: string;
  t: Dict["product"];
  between: string;
}) {
  const hydrated = useHydrated();
  const [colorId, setColorId] = useState(colors[0]?.id ?? "");
  const [showBar, setShowBar] = useState(false);
  const cta = useRef<HTMLAnchorElement>(null);

  const range = hydrated ? estimateDelivery(leadTimeDays, "") : null;
  const color = colors.find((c) => c.id === colorId);
  const href = color ? `${checkoutHref}?color=${encodeURIComponent(color.id)}` : checkoutHref;

  // La barra fija aparece cuando el CTA principal sale de pantalla por arriba y se oculta sobre el pie.
  useEffect(() => {
    const button = cta.current;
    const footer = document.querySelector("body > footer");
    if (!button) return;
    // Solo cuando el CTA ya ha quedado por encima (se ha pasado), no antes de llegar a él.
    let ctaPassed = false;
    let footerVisible = false;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === button) ctaPassed = !e.isIntersecting && e.boundingClientRect.bottom <= 0;
        else footerVisible = e.isIntersecting;
      }
      setShowBar(ctaPassed && !footerVisible);
    });
    io.observe(button);
    if (footer) io.observe(footer);
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Fecha de entrega: alto reservado (2 líneas de título) para no mover la página al hidratar */}
      <div className="flex items-center gap-3 rounded-[18px] border-2 border-ink bg-mint-soft px-4 py-3.5">
        <Icon name="calendar" size={28} strokeWidth={2} />
        <div className="flex min-w-0 flex-col">
          <p className="min-h-[2.5em] text-[17px] font-extrabold leading-[1.25] md:min-h-[1.25em]">
            {range && fill(t.deliveryTitle, { range: formatDeliveryRange(range, locale, between) })}
          </p>
          <p className="text-sm">{fill(t.deliveryText, { days: leadTimeText })}</p>
          <p className="text-[13px] text-muted">{fill(t.deliveryNote, { country })}</p>
        </div>
      </div>

      {colors.length > 0 && (
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 font-extrabold">{fill(t.color, { name: color?.name ?? "" })}</legend>
          <div className="flex flex-wrap gap-2.5">
            {colors.map((c) => (
              <label key={c.id} className="relative grid size-[46px] cursor-pointer place-items-center">
                <input
                  type="radio"
                  name="color"
                  value={c.id}
                  checked={c.id === colorId}
                  onChange={() => setColorId(c.id)}
                  aria-label={c.name}
                  className="peer sr-only"
                />
                <span
                  aria-hidden
                  style={{ backgroundColor: c.hex }}
                  className="size-[46px] rounded-full border-2 border-ink peer-checked:shadow-[0_0_0_3px_var(--color-cream),0_0_0_6px_var(--color-ink)] peer-focus-visible:outline-3 peer-focus-visible:outline-offset-[7px] peer-focus-visible:outline-grape"
                />
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="flex flex-col gap-2">
        <Link ref={cta} href={href} className={buttonClass("primary", "lg", "w-full md:text-[22px]")}>
          {fill(t.buyWithPrice, { price })}
        </Link>
        <p className="flex items-center justify-center gap-1.5 text-center text-sm font-bold">
          <Icon name="lock" size={16} />
          {t.payMethods}
        </p>
      </div>

      {/* Barra de compra fija (solo móvil) */}
      <div
        inert={!showBar}
        className={`fixed inset-x-0 bottom-0 z-40 flex items-center gap-3.5 border-t-2 border-ink bg-cream px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-2.5 transition-transform duration-200 motion-reduce:transition-none md:hidden ${
          showBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex flex-col leading-[1.1]">
          <span className="font-display text-[28px] font-extrabold text-coral-deep">{price}</span>
          <span className="min-h-[1.1em] text-xs font-bold">
            {range && fill(t.arrives, { range: formatDeliveryShort(range, locale) })}
          </span>
        </div>
        <Link href={href} tabIndex={showBar ? undefined : -1} className={buttonClass("primary", "md", "flex-1")}>
          {t.buy}
        </Link>
      </div>
    </>
  );
}
