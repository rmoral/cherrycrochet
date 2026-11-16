import "server-only";
import { publicClient, supabaseConfigured } from "./supabase/admin";
import { demoProducts } from "./demo";
import type { Product } from "./types";

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
