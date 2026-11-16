"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { locales } from "@/lib/config";
import { serviceClient, supabaseConfigured } from "@/lib/supabase/admin";
import { sessionClient } from "@/lib/supabase/server";
import { ORDER_STATUSES, type L10n, type Media, type OrderStatus } from "@/lib/types";

export type FormState = { error: string | null };

export async function login(_prev: FormState, fd: FormData): Promise<FormState> {
  if (!supabaseConfigured()) return { error: "Supabase no está configurado todavía." };
  const supabase = await sessionClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(fd.get("email") ?? ""),
    password: String(fd.get("password") ?? ""),
  });
  if (error) return { error: "Email o contraseña incorrectos." };
  redirect("/admin");
}

export async function logout() {
  const supabase = await sessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const euros = (v: FormDataEntryValue | null) => {
  const n = parseFloat(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
};

export async function saveProduct(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = String(fd.get("id") ?? "");
  const l10n = (field: string): L10n =>
    Object.fromEntries(
      locales.map((l) => [l, String(fd.get(`${field}_${l}`) ?? "").trim()]),
    );

  const name = l10n("name");
  if (!name.es) return { error: "El nombre en español es obligatorio." };
  const price_cents = euros(fd.get("price"));
  if (price_cents <= 0) return { error: "Indica un precio válido." };
  const slug = slugify(String(fd.get("slug") || name.es));
  if (!slug) return { error: "La URL (slug) no es válida." };

  let media: Media[] = [];
  try {
    const parsed = JSON.parse(String(fd.get("media") ?? "[]"));
    media = (Array.isArray(parsed) ? parsed : []).filter(
      (m): m is Media =>
        (m?.type === "image" || m?.type === "video") && typeof m?.url === "string",
    );
  } catch {}

  const compare = euros(fd.get("compare_at"));
  const row = {
    slug,
    name,
    tagline: l10n("tagline"),
    description: l10n("description"),
    price_cents,
    compare_at_cents: compare > 0 ? compare : null,
    media,
    lead_time_days: Math.max(1, parseInt(String(fd.get("lead_time_days"))) || 10),
    sort_order: parseInt(String(fd.get("sort_order"))) || 0,
    featured: fd.get("featured") === "on",
    active: fd.get("active") === "on",
    updated_at: new Date().toISOString(),
  };

  const db = serviceClient();
  const { error } = id
    ? await db.from("products").update(row).eq("id", id)
    : await db.from("products").insert(row);
  if (error)
    return {
      error:
        error.code === "23505"
          ? "Ya existe un producto con esa URL (slug)."
          : `No se pudo guardar: ${error.message}`,
    };

  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function deleteProduct(fd: FormData) {
  await requireAdmin();
  await serviceClient().from("products").delete().eq("id", String(fd.get("id")));
  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function updateOrder(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get("id"));
  const status = String(fd.get("status")) as OrderStatus;
  if (!ORDER_STATUSES.includes(status)) return;
  const text = (k: string) => String(fd.get(k) ?? "").trim() || null;

  const db = serviceClient();
  const { data: current } = await db
    .from("orders")
    .select("shipped_at")
    .eq("id", id)
    .single();
  await db
    .from("orders")
    .update({
      status,
      tracking_number: text("tracking_number"),
      tracking_url: text("tracking_url"),
      admin_notes: text("admin_notes"),
      shipped_at:
        status === "shipped" && !current?.shipped_at
          ? new Date().toISOString()
          : (current?.shipped_at ?? null),
    })
    .eq("id", id);
  revalidatePath("/admin", "layout");
}

/** URL firmada para subir una foto o vídeo directamente desde el navegador a Supabase Storage. */
export async function createUploadUrl(filename: string) {
  await requireAdmin();
  const ext = (filename.split(".").pop() ?? "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${crypto.randomUUID()}.${ext}`;
  const { data, error } = await serviceClient()
    .storage.from("product-media")
    .createSignedUploadUrl(path);
  if (error || !data) throw new Error(error?.message ?? "upload");
  return {
    path,
    token: data.token,
    publicUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-media/${path}`,
  };
}
