"use client";
import { createClient } from "@supabase/supabase-js";
import { createUploadUrl } from "@/app/actions/admin";

/**
 * Sube un archivo al bucket `product-media` con una URL firmada que genera el servidor
 * (solo para administradores) y devuelve su URL pública.
 */
export async function uploadMedia(file: File): Promise<string> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const { path, token, publicUrl } = await createUploadUrl(file.name);
  const { error } = await supabase.storage
    .from("product-media")
    .uploadToSignedUrl(path, token, file, { contentType: file.type });
  if (error) throw error;
  return publicUrl;
}
