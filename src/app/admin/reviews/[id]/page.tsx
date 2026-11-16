import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { serviceClient } from "@/lib/supabase/admin";
import type { Review } from "@/lib/types";
import { ReviewForm } from "@/components/admin/ReviewForm";
import { Icon } from "@/components/ui/Icon";
import { productOptions } from "../products";

export default async function EditReview({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const { data } = await serviceClient().from("reviews").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  return (
    <>
      <Link href="/admin/reviews" className="inline-flex items-center gap-1 text-sm font-bold underline">
        <Icon name="arrow-left" size={16} />
        Reseñas
      </Link>
      <h1 className="mb-6 mt-2 text-4xl font-extrabold">Editar reseña</h1>
      <ReviewForm review={data as Review} products={await productOptions()} />
    </>
  );
}
