"use client";
import Image from "next/image";
import { startTransition, useActionState, useState, type FormEvent, type ReactNode } from "react";
import { createCheckout, type CheckoutState } from "@/app/actions/checkout";
import { MAX_QTY, shipping, shippingFor, type Locale } from "@/lib/config";
import { estimateDelivery, formatDeliveryShort } from "@/lib/delivery";
import type { Dict } from "@/lib/i18n";
import { fill } from "@/lib/text";
import { formatPrice } from "@/lib/types";
import {
  CHECKOUT_FIELDS,
  NUMERIC_POSTAL,
  validateField,
  type CheckoutField,
  type FieldError,
} from "@/lib/validation";
import { buttonClass } from "./ui/Button";
import { Icon } from "./ui/Icon";
import { useHydrated } from "./useHydrated";

type Errors = Partial<Record<CheckoutField, FieldError>>;

const inputClass =
  "min-h-12 w-full rounded-xl border-2 border-field bg-white px-3.5 text-base font-normal text-ink outline-none focus:border-grape aria-[invalid=true]:border-coral-deep";

export function CheckoutForm({
  locale,
  slug,
  name,
  image,
  priceCents,
  leadTimeDays,
  color,
  countries,
  t,
}: {
  locale: Locale;
  slug: string;
  name: string;
  image: string | null;
  priceCents: number;
  leadTimeDays: number;
  color: { id: string; name: string } | null;
  countries: { code: string; name: string }[];
  t: Dict["checkout"];
}) {
  const [state, formAction, pending] = useActionState<CheckoutState, FormData>(createCheckout, {
    error: null,
  });
  const hydrated = useHydrated();
  const [qty, setQty] = useState(1);
  const [country, setCountry] = useState(countries[0].code);
  const [errors, setErrors] = useState<Errors>({});

  // Solo informativo: el servidor vuelve a calcular precio y envío desde la base de datos.
  const subtotal = priceCents * qty;
  const ship = shippingFor(country, subtotal) ?? 0;
  const total = subtotal + ship;
  const left = shipping.freeFromCents - subtotal;
  const progress = Math.min(100, Math.round((subtotal / shipping.freeFromCents) * 100));
  const range = hydrated ? estimateDelivery(leadTimeDays, country) : null;

  const check = (field: CheckoutField, value: string, c = country) =>
    setErrors((e) => ({ ...e, [field]: validateField(field, value, c) ?? undefined }));

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const next: Errors = {};
    for (const f of CHECKOUT_FIELDS) {
      const err = validateField(f, String(fd.get(f) ?? ""), country);
      if (err) next[f] = err;
    }
    setErrors(next);
    const first = CHECKOUT_FIELDS.find((f) => next[f]);
    if (first) {
      form.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus();
      return;
    }
    // Se llama a la acción a mano (no con `action` del formulario) para que React no vacíe los
    // campos si el servidor devuelve un error.
    startTransition(() => formAction(fd));
  };

  /** Campo con etiqueta, ayuda y error asociados (aria-describedby / aria-invalid). */
  const field = (
    f: CheckoutField | "address2",
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement>,
    help?: string,
  ): ReactNode => {
    const err = f !== "address2" ? errors[f] : undefined;
    const ids = [help && `${f}-help`, err && `${f}-error`].filter(Boolean).join(" ") || undefined;
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={f} className="text-sm font-extrabold">
          {label}
        </label>
        <input
          id={f}
          name={f}
          maxLength={200}
          aria-invalid={err ? true : undefined}
          aria-describedby={ids}
          onBlur={f !== "address2" ? (e) => check(f, e.target.value) : undefined}
          onChange={
            f !== "address2" && err ? (e) => check(f, e.target.value) : undefined
          }
          className={inputClass}
          {...props}
        />
        {help && (
          <p id={`${f}-help`} className="text-[13px]">
            {help}
          </p>
        )}
        {err && (
          <p id={`${f}-error`} className="flex items-center gap-1 text-sm font-bold text-coral-deep">
            <Icon name="x" size={16} strokeWidth={3} />
            {t.invalid[err]}
          </p>
        )}
      </div>
    );
  };

  return (
    <form action={formAction} onSubmit={onSubmit} noValidate className="flex flex-col">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="quantity" value={qty} />
      {color && <input type="hidden" name="color" value={color.id} />}

      {/* Pasos */}
      <ol aria-label={t.steps.label} className="flex items-center gap-2.5 pt-4 text-[15px] font-extrabold">
        <li aria-current="step" className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-full bg-ink text-sm text-cream">1</span>
          {t.steps.shipping}
        </li>
        <li aria-hidden className="h-0.5 grow bg-ink" />
        <li className="flex items-center gap-2 text-muted">
          <span className="grid size-7 place-items-center rounded-full border-2 border-muted text-sm">2</span>
          {t.steps.payment}
        </li>
      </ol>

      {/* Resumen siempre visible */}
      <section aria-label={t.summary} className="pt-4">
        <div className="flex flex-col gap-3 rounded-[20px] border-2 border-ink bg-white p-3 shadow-[0_4px_0_var(--color-ink)]">
          <div className="flex items-center gap-3">
            <div className="relative size-[72px] shrink-0 overflow-hidden rounded-[14px] border-2 border-ink bg-blush">
              {image && (
                <Image src={image} alt="" fill sizes="72px" unoptimized={image.endsWith(".svg")} className="object-cover" />
              )}
            </div>
            <div className="flex min-w-0 grow flex-col leading-tight">
              <span className="font-display text-[19px] font-bold">{name}</span>
              {color && <span className="text-sm">{fill(t.color, { name: color.name })}</span>}
              <span className="min-h-[1.25em] text-sm font-bold">
                {range && fill(t.arrives, { range: formatDeliveryShort(range, locale) })}
              </span>
            </div>
            <span className="font-display text-[22px] font-extrabold text-coral-deep">
              {formatPrice(subtotal, locale)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 border-t-2 border-line pt-2.5">
            <span id="qty-label" className="font-extrabold">
              {t.quantity}
            </span>
            <div role="group" aria-labelledby="qty-label" className="flex items-center gap-3">
              <button
                type="button"
                aria-label={t.less}
                disabled={qty <= 1}
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid size-11 place-items-center rounded-full border-2 border-ink bg-blush disabled:opacity-40"
              >
                <Icon name="minus" strokeWidth={2.8} />
              </button>
              <output aria-live="polite" className="min-w-5 text-center text-[19px] font-extrabold">
                {qty}
              </output>
              <button
                type="button"
                aria-label={t.more}
                disabled={qty >= MAX_QTY}
                onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
                className="grid size-11 place-items-center rounded-full border-2 border-ink bg-sun disabled:opacity-40"
              >
                <Icon name="plus" strokeWidth={2.8} />
              </button>
            </div>
          </div>

          {/* Empujón al envío gratis */}
          <div className="flex flex-col gap-1.5">
            <p aria-live="polite" className="text-sm font-bold">
              {left > 0 ? fill(t.freeLeft, { amount: formatPrice(left, locale) }) : t.freeDone}
            </p>
            <div aria-hidden className="h-2.5 overflow-hidden rounded-full border-2 border-ink bg-line">
              <div className="h-full bg-mint transition-[width] motion-reduce:transition-none" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </section>

      {/* Datos de envío: una columna, país antes que la dirección */}
      <div className="flex flex-col gap-3.5 pt-6">
        <h1 className="text-[28px] font-extrabold leading-[1.05]">{t.heading}</h1>
        {field("email", t.email, { type: "email", autoComplete: "email", inputMode: "email", placeholder: t.emailPlaceholder }, t.emailHelp)}
        {field("name", t.name, { autoComplete: "name" })}
        {field("phone", t.phone, { type: "tel", autoComplete: "tel" }, t.phoneHelp)}
        <div className="flex flex-col gap-1">
          <label htmlFor="country" className="text-sm font-extrabold">
            {t.country}
          </label>
          <select
            id="country"
            name="country"
            autoComplete="country"
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              // El formato del código postal depende del país.
              const postal = e.currentTarget.form?.elements.namedItem("postal") as HTMLInputElement | null;
              if (postal?.value) check("postal", postal.value, e.target.value);
            }}
            className={`${inputClass} px-2.5`}
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        {field("address1", t.address1, { autoComplete: "address-line1" })}
        {field("address2", t.address2, { autoComplete: "address-line2" })}
        <div className="grid grid-cols-[130px_minmax(0,1fr)] items-start gap-3">
          {field("postal", t.postal, {
            autoComplete: "postal-code",
            inputMode: NUMERIC_POSTAL.has(country) ? "numeric" : "text",
            maxLength: 10,
          })}
          {field("city", t.city, { autoComplete: "address-level2" })}
        </div>
        <details className="group rounded-xl border-2 border-dashed border-field">
          <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 px-3.5 py-2.5 font-extrabold [&::-webkit-details-marker]:hidden">
            <Icon name="plus" className="transition-transform group-open:rotate-45" />
            {t.notesToggle}
          </summary>
          <div className="flex flex-col gap-1 px-3.5 pb-3">
            <label htmlFor="notes" className="text-sm font-extrabold">
              {t.notes}
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              maxLength={500}
              placeholder={t.notesPlaceholder}
              className={`${inputClass} py-2.5`}
            />
          </div>
        </details>
      </div>

      {/* Totales y CTA con el importe */}
      <section className="flex flex-col gap-3 pb-5 pt-6">
        <dl className="grid grid-cols-[1fr_auto] gap-y-1.5">
          <dt>{t.subtotal}</dt>
          <dd className="pl-3 text-right font-extrabold">{formatPrice(subtotal, locale)}</dd>
          <dt>{t.shipping}</dt>
          <dd className="pl-3 text-right font-extrabold">{ship === 0 ? t.free : formatPrice(ship, locale)}</dd>
          <dt className="border-t-2 border-ink pt-2 font-display text-2xl font-extrabold">{t.total}</dt>
          <dd className="border-t-2 border-ink pl-3 pt-2 text-right font-display text-2xl font-extrabold text-coral-deep">
            {formatPrice(total, locale)}
          </dd>
        </dl>
        {state.error && (
          <p role="alert" className="rounded-xl border-2 border-coral-deep bg-blush p-3 font-bold text-coral-deep">
            {state.error}
          </p>
        )}
        <button type="submit" disabled={pending} aria-busy={pending} className={buttonClass("primary", "lg", "w-full")}>
          {pending ? t.paying : fill(t.pay, { total: formatPrice(total, locale) })}
        </button>
        <p className="text-center text-sm">{t.payNote}</p>
      </section>
    </form>
  );
}
