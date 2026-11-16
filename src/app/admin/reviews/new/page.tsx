import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { ReviewForm } from "@/components/admin/ReviewForm";
import { Icon } from "@/components/ui/Icon";
import { productOptions } from "../products";

export default async function NewReview() {
  await requireAdmin();
  return (
    <>
      <Link href="/admin/reviews" className="inline-flex items-center gap-1 text-sm font-bold underline">
        <Icon name="arrow-left" size={16} />
        Reseñas
      </Link>
      <h1 className="mb-6 mt-2 text-4xl font-extrabold">Nueva reseña</h1>
      <ReviewForm products={await productOptions()} />
    </>
  );
}
