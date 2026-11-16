import type { MetadataRoute } from "next";
import { locales, siteUrl } from "@/lib/config";
import { getProducts } from "@/lib/data";

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
  ]);
}
