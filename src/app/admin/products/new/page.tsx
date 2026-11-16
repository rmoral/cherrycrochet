import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { ProductForm } from "@/components/admin/ProductForm";
import { Icon } from "@/components/ui/Icon";

export default async function NewProduct() {
  await requireAdmin();
  return (
    <>
      <Link href="/admin/products" className="inline-flex items-center gap-1 text-sm font-bold underline">
        <Icon name="arrow-left" size={16} />
        Productos
      </Link>
      <h1 className="mb-6 mt-2 text-4xl font-extrabold">Nuevo producto</h1>
      <ProductForm />
    </>
  );
}
