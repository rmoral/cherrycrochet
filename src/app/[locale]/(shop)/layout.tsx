import { notFound } from "next/navigation";
import { isLocale } from "@/lib/config";
import { getDict } from "@/lib/i18n";
import { AnnounceBar, Footer, Header } from "@/components/Chrome";
import { SkipLink } from "@/components/SkipLink";

/** Tienda: barra de anuncio, cabecera completa y pie. */
export default async function ShopLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDict(locale);
  return (
    <>
      <SkipLink label={t.nav.skip} />
      <AnnounceBar locale={locale} t={t} />
      <Header locale={locale} t={t} />
      <main id="contenido" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <Footer locale={locale} t={t} />
    </>
  );
}
