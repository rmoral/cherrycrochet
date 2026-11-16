import type { ReactNode } from "react";

/**
 * Iconos SVG en línea, de trazo, que heredan el color del texto (`currentColor`).
 * Decorativos por defecto (`aria-hidden`); si el icono es el único contenido de un
 * control, pasa `label` y se anuncia como imagen.
 */
const paths = {
  check: <path d="M5 12l5 5L20 7" />,
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  play: <path d="M8 5v14l11-7z" fill="currentColor" stroke="none" />,
  pause: <path d="M8 5v14M16 5v14" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  yarn: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M6 10q6-5 12 0M7 15q5-4 10 0" />
    </>
  ),
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  "arrow-left": <path d="M19 12H5M11 6l-6 6 6 6" />,
  external: <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  pointer: <path d="M5 3l14 7-6 2-2 6z" />,
  box: <path d="M3 7.5L12 3l9 4.5v9L12 21l-9-4.5zM3 7.5l9 4.5 9-4.5M12 12v9" />,
  gift: (
    <>
      <rect x="3" y="8" width="18" height="5" rx="1" />
      <path d="M5 13v7h14v-7M12 8v12M12 8C10 4 6 4 6 6.5S10 8 12 8zm0 0c2-4 6-4 6-1.5S14 8 12 8z" />
    </>
  ),
  sparkle: <path d="M11 3l1.8 5.2L18 10l-5.2 1.8L11 17l-1.8-5.2L4 10l5.2-1.8zM19 15v5M16.5 17.5h5" />,
  cloud: <path d="M7 18a4 4 0 0 1-.5-7.97A6 6 0 0 1 18 9.5a4.25 4.25 0 0 1-.5 8.5z" />,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof paths;

export function Icon({
  name,
  size = 20,
  strokeWidth = 2.2,
  label,
  className,
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  /** Texto accesible. Solo si el icono es el único contenido del control. */
  label?: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className ?? ""}`}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      {paths[name]}
    </svg>
  );
}
