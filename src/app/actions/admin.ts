"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { isLocale, locales } from "@/lib/config";
import { serviceClient, supabaseConfigured } from "@/lib/supabase/admin";
import { sessionClient } from "@/lib/supabase/server";
import {
  ORDER_STATUSES,
  type L10n,
  type Media,
  type OrderStatus,
  type ProductColor,
} from "@/lib/types";

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

const l10nFrom = (fd: FormData, field: string): L10n =>
  Object.fromEntries(locales.map((l) => [l, String(fd.get(`${field}_${l}`) ?? "").trim()]));

/** Valida la lista de colores del editor. Devuelve un mensaje si hay algún error. */
function parseColors(raw: FormDataEntryValue | null): ProductColor[] | string {
  let list: unknown;
  try {
    list = JSON.parse(String(raw ?? "[]"));
  } catch {
    return "La lista de colores no es válida.";
  }
  if (!Array.isArray(list)) return "La lista de colores no es válida.";
  if (list.length > 20) return "Como máximo 20 colores por producto.";

  const seen = new Set<string>();
  const colors: ProductColor[] = [];
  for (const [i, item] of list.entries()) {
    const hex = String(item?.hex ?? "").trim().toUpperCase();
    if (!/^#[0-9A-F]{6}$/.test(hex)) return `El color ${i + 1} no tiene un tono válido.`;
    const name: L10n = Object.fromEntries(
      locales.map((l) => [l, String(item?.name?.[l] ?? "").trim().slice(0, 40)]),
    );
    if (!name.es) return `El color ${i + 1} necesita nombre en español.`;
    // Se conserva el id de los colores existentes para que no cambien sus URLs (?color=).
    const current = String(item?.id ?? "");
    let id = /^[a-z0-9-]{1,40}$/.test(current) ? current : slugify(name.es) || `color-${i + 1}`;
    for (let n = 2; seen.has(id); n++) id = `${id.replace(/-\d+$/, "")}-${n}`;
    seen.add(id);
    colors.push({ id, hex, name });
  }
  return colors;
}

export async function saveProduct(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = String(fd.get("id") ?? "");
  const l10n = (field: string) => l10nFrom(fd, field);

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

  const colors = parseColors(fd.get("colors"));
  if (typeof colors === "string") return { error: colors };

  const compare = euros(fd.get("compare_at"));
  const row = {
    slug,
    name,
    tagline: l10n("tagline"),
    description: l10n("description"),
    price_cents,
    compare_at_cents: compare > 0 ? compare : null,
    media,
    colors,
    details: l10n("details"),
    care: l10n("care"),
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

// ─── Reseñas ───────────────────────────────────────────────────────────────

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Crea o edita una reseña real. */
export async function saveReview(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const text = (k: string, max: number) => String(fd.get(k) ?? "").trim().slice(0, max);
  const id = text("id", 60);
  const author = text("author", 80);
  const body = text("body", 2000);
  const rating = parseInt(text("rating", 1));
  const locale = text("locale", 2);
  const productId = text("product_id", 60);
  const photo = text("photo_url", 500);

  if (!author) return { error: "Indica el nombre de quien escribe la reseña." };
  if (body.length < 2) return { error: "El texto de la reseña es obligatorio." };
  if (!(rating >= 1 && rating <= 5)) return { error: "La valoración debe ser de 1 a 5." };
  if (!isLocale(locale)) return { error: "Elige el idioma en que está escrita." };
  if (productId && !UUID.test(productId)) return { error: "El producto no es válido." };
  if (photo && !photo.startsWith("https://")) return { error: "La foto no es válida." };

  const row = {
    author,
    city: text("city", 80) || null,
    rating,
    body,
    locale,
    product_id: productId || null,
    photo_url: photo || null,
    published: fd.get("published") === "on",
  };
  const db = serviceClient();
  const { error } =
    id && UUID.test(id)
      ? await db.from("reviews").update(row).eq("id", id)
      : await db.from("reviews").insert(row);
  if (error) return { error: `No se pudo guardar: ${error.message}` };

  revalidatePath("/", "layout");
  redirect("/admin/reviews");
}

export async function setReviewPublished(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get("id") ?? "");
  if (!UUID.test(id)) return;
  await serviceClient()
    .from("reviews")
    .update({ published: fd.get("published") === "true" })
    .eq("id", id);
  revalidatePath("/", "layout");
}

export async function deleteReview(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get("id") ?? "");
  if (UUID.test(id)) await serviceClient().from("reviews").delete().eq("id", id);
  revalidatePath("/", "layout");
  redirect("/admin/reviews");
}
