import { notFound } from "next/navigation";
import { brand, isLocale } from "@/lib/config";
import { getDict } from "@/lib/i18n";
import { CheckoutLogo } from "@/components/CheckoutLogo";
import { Icon } from "@/components/ui/Icon";

/**
 * Checkout y página de gracias: cabecera mínima (logo + «Pago seguro»), sin barra de anuncio,
 * navegación, selector de idioma ni pie de tienda, para no ofrecer salidas en el último paso.
 */
export default async function CheckoutLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDict(locale).checkout;
  return (
    <>
      <header className="border-b-2 border-ink bg-cream">
        <div className="mx-auto flex max-w-[560px] items-center justify-between gap-3 px-4 py-2.5 md:px-6">
          <CheckoutLogo locale={locale} />
          <span className="flex items-center gap-1.5 text-sm font-extrabold">
            <Icon name="lock" size={18} />
            {t.secure}
          </span>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t-2 border-line px-4 py-4 text-center text-[13px]">
        {t.help}{" "}
        <a href={`mailto:${brand.email}`} className="inline-flex min-h-11 items-center font-extrabold underline">
          {brand.email}
        </a>
      </footer>
    </>
  );
}
