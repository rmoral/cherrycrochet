import type { ReactNode } from "react";
import { Icon } from "./Icon";

/**
 * Acordeón con `details/summary` nativo: funciona sin JavaScript y con teclado.
 * El `summary` lleva el relleno para que toda la fila sea objetivo táctil (≥ 44 px).
 */
export function Accordion({
  title,
  children,
  open = false,
  size = "md",
  className = "",
}: {
  title: ReactNode;
  children: ReactNode;
  open?: boolean;
  /** `md`: ficha y FAQ en móvil (radio 16) · `lg`: FAQ en escritorio (radio 18, título 19 px). */
  size?: "md" | "lg";
  className?: string;
}) {
  const s =
    size === "lg"
      ? { box: "rounded-[18px]", summary: "px-5 py-[18px] text-[19px]", body: "px-5 pb-[18px]" }
      : { box: "rounded-2xl", summary: "px-4 py-3.5", body: "px-4 pb-3.5 text-[15px]" };
  return (
    <details open={open} className={`group border-2 border-ink bg-white ${s.box} ${className}`}>
      <summary
        className={`flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-extrabold [&::-webkit-details-marker]:hidden ${s.summary}`}
      >
        {title}
        <Icon name="plus" className="text-coral-deep transition-transform group-open:rotate-45" />
      </summary>
      <div className={s.body}>{children}</div>
    </details>
  );
}
