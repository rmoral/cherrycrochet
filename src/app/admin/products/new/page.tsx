import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProduct() {
  await requireAdmin();
  return (
    <>
      <Link href="/admin/products" className="text-sm font-bold underline">← Productos</Link>
      <h1 className="mb-6 mt-2 text-4xl font-extrabold">Nuevo producto</h1>
      <ProductForm />
    </>
  );
}
