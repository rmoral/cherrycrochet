import type { MetadataRoute } from "next";
import { locales, siteUrl } from "@/lib/config";
import { getProducts } from "@/lib/data";
import { LEGAL_PAGES, type LegalPage } from "@/lib/legal";
import { legalIsDraft } from "@/components/LegalPage";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  return locales.flatMap((l) => [
    { url: `${siteUrl}/${l}`, changeFrequency: "weekly" as const, priority: 1 },
    ...products.map((p) => ({
      url: `${siteUrl}/${l}/p/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    // Las páginas legales entran cuando ya no tienen huecos (hasta entonces son noindex).
    ...(Object.keys(LEGAL_PAGES) as LegalPage[])
      .filter((page) => !legalIsDraft(page, l))
      .map((page) => ({
        url: `${siteUrl}/${l}/${LEGAL_PAGES[page]}`,
        changeFrequency: "yearly" as const,
        priority: 0.2,
      })),
  ]);
}
