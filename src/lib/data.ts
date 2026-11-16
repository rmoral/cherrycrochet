import "server-only";
import { publicClient, supabaseConfigured } from "./supabase/admin";
import { demoProducts } from "./demo";
import type { Product, Review } from "./types";

export const demoMode = () => !supabaseConfigured();

export async function getProducts(): Promise<Product[]> {
  if (demoMode()) return demoProducts;
  const { data, error } = await publicClient()
    .from("products")
    .select("*")
    .eq("active", true)
    .order("sort_order")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getProducts", error.message);
    return [];
  }
  return data as Product[];
}

export async function getProduct(slug: string): Promise<Product | null> {
  if (demoMode()) return demoProducts.find((p) => p.slug === slug) ?? null;
  const { data } = await publicClient()
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();
  return (data as Product) ?? null;
}

/**
 * Reseñas publicadas (más recientes primero). Con `productId`, solo las de ese producto.
 * En modo demo no hay reseñas: nunca se muestran reseñas inventadas.
 */
export async function getReviews(productId?: string): Promise<Review[]> {
  if (demoMode()) return [];
  let query = publicClient()
    .from("reviews")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (productId) query = query.eq("product_id", productId);
  const { data, error } = await query;
  if (error) {
    console.error("getReviews", error.message);
    return [];
  }
  return data as Review[];
}
