import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Ambil user admin yang sedang login (server-side).
 * Middleware sudah memblokir akses tanpa sesi, ini adalah lapisan
 * verifikasi kedua (defense in depth) di level halaman/Server Component.
 */
export async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return user;
}
