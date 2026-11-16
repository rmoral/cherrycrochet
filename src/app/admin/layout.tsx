import type { Metadata } from "next";
import Link from "next/link";
import "@fontsource-variable/baloo-2";
import "@fontsource-variable/nunito";
import "../globals.css";
import { getAdmin } from "@/lib/auth";
import { brand } from "@/lib/config";
import { logout } from "@/app/actions/admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Back office · ${brand.name}`,
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin();
  return (
    <html lang="es">
      <body className="min-h-dvh antialiased">
        {admin && (
          <header className="border-b-2 border-ink bg-white">
            <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
              <span className="font-display text-xl font-extrabold">🧶 Back office</span>
              <nav className="flex gap-5 font-bold">
                <Link href="/admin" className="hover:text-coral">Pedidos</Link>
                <Link href="/admin/products" className="hover:text-coral">Productos</Link>
                <Link href="/" className="hover:text-coral">Ver tienda ↗</Link>
              </nav>
              <form action={logout} className="ml-auto">
                <button className="text-sm font-bold underline">Salir</button>
              </form>
            </div>
          </header>
        )}
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
