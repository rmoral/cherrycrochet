import "server-only";
import { serviceClient } from "@/lib/supabase/admin";
import type { L10n } from "@/lib/types";

/** Productos (activos u ocultos) para el selector de la reseña. */
export async function productOptions() {
  const { data } = await serviceClient()
    .from("products")
    .select("id, name")
    .order("sort_order")
    .order("created_at", { ascending: false });
  return ((data ?? []) as { id: string; name: L10n }[]).map((p) => ({
    id: p.id,
    name: p.name.es ?? "",
  }));
}
