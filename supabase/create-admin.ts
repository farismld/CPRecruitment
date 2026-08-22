/**
 * Script untuk membuat akun ADMIN PERTAMA menggunakan Supabase Auth
 * (service role). Jalankan sekali di awal setelah schema.sql dieksekusi.
 *
 * Cara pakai:
 *   1. Pastikan .env.local sudah terisi (NEXT_PUBLIC_SUPABASE_URL,
 *      SUPABASE_SERVICE_ROLE_KEY).
 *   2. Jalankan: npm run create-admin -- admin@majubersama.co.id "PasswordAman123" "Nama Admin"
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function main() {
  const [, , email, password, fullName] = process.argv;

  if (!email || !password) {
    console.error(
      "Penggunaan: npm run create-admin -- <email> <password> [\"Nama Admin\"]"
    );
    process.exit(1);
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error(
      "❌ NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY belum diset di .env.local"
    );
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log(`Membuat akun admin untuk ${email}...`);

  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (userError || !userData.user) {
    console.error("❌ Gagal membuat user:", userError?.message);
    process.exit(1);
  }

  const { error: profileError } = await supabase.from("admin_profiles").insert({
    id: userData.user.id,
    full_name: fullName || "Administrator",
    role: "super_admin",
  });

  if (profileError) {
    console.error("❌ Gagal membuat profil admin:", profileError.message);
    process.exit(1);
  }

  console.log("✅ Akun admin berhasil dibuat!");
  console.log(`   Email    : ${email}`);
  console.log(`   Nama     : ${fullName || "Administrator"}`);
  console.log("   Silakan login di /admin/login");
}

main();
