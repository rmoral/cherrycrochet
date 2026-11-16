"use client";
import { useActionState, useState } from "react";
import { createCheckout, type CheckoutState } from "@/app/actions/checkout";
import { MAX_QTY, shippingFor, type Locale } from "@/lib/config";
import type { Dict } from "@/lib/i18n";
import { formatPrice } from "@/lib/types";

export function CheckoutForm({
  locale,
  slug,
  priceCents,
  countries,
  t,
}: {
  locale: Locale;
  slug: string;
  priceCents: number;
  countries: { code: string; name: string }[];
  t: Dict["checkout"];
}) {
  const [state, action, pending] = useActionState<CheckoutState, FormData>(
    createCheckout,
    { error: null },
  );
  const [qty, setQty] = useState(1);
  const [country, setCountry] = useState(countries[0].code);
  const subtotal = priceCents * qty;
  const ship = shippingFor(country, subtotal) ?? 0;

  const input = (
    name: string,
    label: string,
    opts: { type?: string; auto?: string; required?: boolean; span?: boolean } = {},
  ) => (
    <label className={opts.span === false ? "" : "sm:col-span-2"}>
      <span className="label">{label}</span>
      <input
        name={name}
        type={opts.type ?? "text"}
        autoComplete={opts.auto}
        required={opts.required ?? true}
        maxLength={200}
        className="field"
      />
    </label>
  );

  return (
    <form action={action} className="flex flex-col gap-8">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="slug" value={slug} />

      <fieldset>
        <legend className="mb-3 font-display text-2xl font-bold">{t.quantity}</legend>
        <div className="flex w-fit items-center gap-4 rounded-full border-2 border-ink bg-white p-1">
          <button
            type="button"
            aria-label="−"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid size-10 place-items-center rounded-full bg-blush text-2xl font-bold"
          >
            −
          </button>
          <span className="w-6 text-center text-xl font-extrabold">{qty}</span>
          <button
            type="button"
            aria-label="+"
            onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
            className="grid size-10 place-items-center rounded-full bg-sun text-2xl font-bold"
          >
            +
          </button>
          <input type="hidden" name="quantity" value={qty} />
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 font-display text-2xl font-bold">{t.contact}</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          {input("name", t.name, { auto: "name" })}
          {input("email", t.email, { type: "email", auto: "email", span: false })}
          {input("phone", t.phone, { type: "tel", auto: "tel", span: false })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 font-display text-2xl font-bold">{t.address}</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          {input("address1", t.address1, { auto: "address-line1" })}
          {input("address2", t.address2, { auto: "address-line2", required: false })}
          {input("postal", t.postal, { auto: "postal-code", span: false })}
          {input("city", t.city, { auto: "address-level2", span: false })}
          {input("region", t.region, { auto: "address-level1", required: false, span: false })}
          <label>
            <span className="label">{t.country}</span>
            <select
              name="country"
              autoComplete="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="field"
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="sm:col-span-2">
            <span className="label">{t.notes}</span>
            <textarea name="notes" rows={2} maxLength={500} placeholder={t.notesPlaceholder} className="field" />
          </label>
        </div>
      </fieldset>

      <div className="card p-5">
        <dl className="grid grid-cols-2 gap-y-2 text-lg">
          <dt>{t.subtotal}</dt>
          <dd className="text-right font-bold">{formatPrice(subtotal, locale)}</dd>
          <dt>{t.shipping}</dt>
          <dd className="text-right font-bold">{ship === 0 ? t.free : formatPrice(ship, locale)}</dd>
          <dt className="border-t-2 border-ink/10 pt-2 font-display text-2xl font-extrabold">{t.total}</dt>
          <dd className="border-t-2 border-ink/10 pt-2 text-right font-display text-2xl font-extrabold text-coral">
            {formatPrice(subtotal + ship, locale)}
          </dd>
        </dl>
        {state.error && (
          <p role="alert" className="mt-4 rounded-xl bg-coral/15 p-3 font-bold text-coral">
            {state.error}
          </p>
        )}
        <button type="submit" disabled={pending} className="btn btn-primary mt-5 w-full text-xl">
          {pending ? "…" : `${t.pay} →`}
        </button>
        <p className="mt-3 text-center text-sm opacity-70">🔒 {t.payNote}</p>
      </div>
    </form>
  );
}
