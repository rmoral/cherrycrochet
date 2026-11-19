"use client";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/config";
import { Logo } from "./Logo";

/** En el checkout el logo vuelve a la ficha del producto; en el resto, a la portada. */
export function CheckoutLogo({ locale }: { locale: Locale }) {
  const slug = usePathname().match(/\/checkout\/([^/]+)/)?.[1];
  return <Logo href={slug ? `/${locale}/p/${slug}` : `/${locale}`} />;
}
