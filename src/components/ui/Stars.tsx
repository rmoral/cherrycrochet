const STAR = "M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z";

/**
 * Valoración de 1 a 5. Se anuncia como una sola imagen; `label` debe venir traducido
 * (p. ej. «4,8 de 5 estrellas»). Solo para valoraciones reales.
 */
export function Stars({
  rating,
  label,
  size = 18,
  className = "",
}: {
  rating: number;
  label: string;
  size?: number;
  className?: string;
}) {
  const filled = Math.round(Math.min(5, Math.max(0, rating)));
  return (
    <span role="img" aria-label={label} className={`inline-flex gap-0.5 text-sun-deep ${className}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          aria-hidden
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i < filled ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinejoin="round"
        >
          <path d={STAR} />
        </svg>
      ))}
    </span>
  );
}
