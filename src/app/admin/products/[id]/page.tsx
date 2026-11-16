import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { serviceClient } from "@/lib/supabase/admin";
import { ProductForm } from "@/components/admin/ProductForm";
import type { Product } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const { data } = await serviceClient().from("products").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  return (
    <>
      <Link href="/admin/products" className="inline-flex items-center gap-1 text-sm font-bold underline">
        <Icon name="arrow-left" size={16} />
        Productos
      </Link>
      <h1 className="mb-6 mt-2 text-4xl font-extrabold">Editar producto</h1>
      <ProductForm product={data as Product} />
    </>
  );
}
