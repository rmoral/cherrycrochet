/** Enlace «Saltar al contenido»: invisible hasta que recibe el foco con el teclado. */
export function SkipLink({ label }: { label: string }) {
  return (
    <a
      href="#contenido"
      className="sr-only z-50 rounded-full border-2 border-ink bg-sun px-4 py-2 font-extrabold focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
    >
      {label}
    </a>
  );
}
