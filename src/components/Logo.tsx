import Link from "next/link";
import { brand } from "@/lib/config";
import { Icon } from "./ui/Icon";

export function Logo({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="flex min-h-11 items-center gap-2 font-display text-[22px] font-extrabold leading-none md:gap-2.5 md:text-[26px]"
    >
      <span
        aria-hidden
        className="grid size-8 place-items-center rounded-full border-2 border-ink bg-sun md:size-9"
      >
        <Icon name="yarn" size={18} strokeWidth={2.4} className="md:size-5" />
      </span>
      {brand.name}
    </Link>
  );
}
