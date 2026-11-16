import type { ReactNode } from "react";

/** Pastilla `sun` con borde tinta (distintivos de tarjeta y de hero). */
export function Badge({
  children,
  size = "md",
  className = "",
}: {
  children: ReactNode;
  /** `sm`: tarjeta en móvil · `md`: tarjeta en escritorio y ficha. */
  size?: "sm" | "md";
  className?: string;
}) {
  const sizes = {
    sm: "px-[9px] py-px text-xs",
    md: "px-3 py-0.5 text-[13px]",
  };
  return (
    <span
      className={`inline-block rounded-full border-2 border-ink bg-sun font-extrabold leading-normal text-ink ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}
