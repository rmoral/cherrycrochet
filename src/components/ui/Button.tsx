import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export type ButtonVariant = "primary" | "ghost";
export type ButtonSize = "lg" | "md" | "sm";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-2 border-ink text-center font-display font-extrabold leading-tight text-ink transition-transform hover:-translate-y-0.5 hover:text-ink active:translate-y-[3px] active:shadow-[0_1px_0_var(--color-ink)] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  // Texto tinta sobre coral (≈ 4,9:1). Nunca blanco.
  primary: "bg-coral",
  ghost: "bg-white",
};

// Valores de docs/design/reference/*.dc.html
const sizes: Record<ButtonSize, string> = {
  lg: "px-6 py-[15px] text-[21px] shadow-[0_5px_0_var(--color-ink)] md:px-9 md:py-4 md:text-[22px]",
  md: "px-5 py-3 text-xl shadow-[0_4px_0_var(--color-ink)]",
  sm: "px-[18px] py-2 text-[17px] shadow-[0_3px_0_var(--color-ink)]",
};

/** Clases del botón, para aplicarlas a otros elementos (p. ej. un `span` dentro de una tarjeta enlazada). */
export const buttonClass = (
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className = "",
) => `${base} ${variants[variant]} ${sizes[size]} ${className}`.trim();

type Common = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};
type AsLink = Common & Omit<ComponentProps<typeof Link>, keyof Common>;
type AsButton = Common & Omit<ComponentProps<"button">, keyof Common> & { href?: undefined };

/** Botón «pegatina». Con `href` se pinta como enlace (`next/link`); sin él, como `button`. */
export function Button(props: AsLink | AsButton) {
  const { variant, size, className, children, ...rest } = props;
  const cls = buttonClass(variant, size, className);
  if (rest.href !== undefined) {
    return (
      <Link {...(rest as Omit<AsLink, keyof Common>)} className={cls}>
        {children}
      </Link>
    );
  }
  const { type = "button", ...buttonProps } = rest as Omit<AsButton, keyof Common>;
  return (
    <button type={type} {...buttonProps} className={cls}>
      {children}
    </button>
  );
}
