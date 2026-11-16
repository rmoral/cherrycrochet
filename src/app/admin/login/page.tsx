import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { supabaseConfigured } from "@/lib/supabase/admin";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");
  return (
    <>
      {!supabaseConfigured() && (
        <p className="mx-auto max-w-sm rounded-2xl border-2 border-ink bg-sun p-4 font-bold">
          La tienda está en modo demo. Configura Supabase (ver README) para activar el back office.
        </p>
      )}
      <LoginForm />
    </>
  );
}
