import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "@fontsource-variable/baloo-2";
import "@fontsource-variable/nunito";
import "../globals.css";
import { brand, isLocale, locales, siteUrl } from "@/lib/config";
import { getDict } from "@/lib/i18n";
import { AnnounceBar, Footer, Header } from "@/components/Chrome";

export const generateStaticParams = () => locales.map((locale) => ({ locale }));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDict(locale);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: `${brand.name} · ${t.meta.title}`, template: `%s · ${brand.name}` },
    description: t.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
    openGraph: { siteName: brand.name, locale, type: "website" },
  };
}

export default async function LocaleLayout({
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
    <html lang={locale}>
      <body className="flex min-h-dvh flex-col antialiased md:text-[17px]">
        <AnnounceBar locale={locale} t={t} />
        <Header locale={locale} t={t} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} t={t} />
      </body>
    </html>
  );
}
