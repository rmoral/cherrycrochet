import "server-only";
import { redirect } from "next/navigation";
import { sessionClient } from "./supabase/server";
import { supabaseConfigured } from "./supabase/admin";

const adminEmails = () =>
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

export async function getAdmin() {
  if (!supabaseConfigured()) return null;
  const supabase = await sessionClient();
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email?.toLowerCase();
  return email && adminEmails().includes(email) ? data.user : null;
}

export async function requireAdmin() {
  const user = await getAdmin();
  if (!user) redirect("/admin/login");
  return user;
}
