import type { ReactNode } from "react";

const ratios = { square: "aspect-square", portrait: "aspect-[4/5]", landscape: "aspect-[4/3]" };
const tones = { blush: "bg-blush", mint: "bg-mint-soft", white: "bg-white" };
const radii = { md: "rounded-[20px]", lg: "rounded-3xl", xl: "rounded-[28px]" };
const shadows = {
  none: "",
  sm: "shadow-[0_4px_0_var(--color-ink)]",
  md: "shadow-[0_5px_0_var(--color-ink)]",
  lg: "shadow-[0_6px_0_var(--color-ink)]",
};

/**
 * Marco para foto o vídeo con relación de aspecto fija (reserva el hueco y evita CLS).
 * El contenido debe ocupar todo el marco: `next/image` con `fill` o `video` con `size-full object-cover`.
 */
export function PhotoFrame({
  children,
  ratio = "square",
  tone = "blush",
  radius = "lg",
  shadow = "md",
  className = "",
}: {
  children?: ReactNode;
  ratio?: keyof typeof ratios;
  tone?: keyof typeof tones;
  /** `md` 20 px (tarjeta móvil) · `lg` 24 px · `xl` 28 px (hero escritorio). */
  radius?: keyof typeof radii;
  shadow?: keyof typeof shadows;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden border-2 border-ink ${ratios[ratio]} ${tones[tone]} ${radii[radius]} ${shadows[shadow]} ${className}`}
    >
      {children}
    </div>
  );
}
