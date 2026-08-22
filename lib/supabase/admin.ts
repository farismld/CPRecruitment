import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Client Supabase dengan SERVICE ROLE KEY.
 *
 * ⚠️ SANGAT PENTING:
 * - HANYA boleh diimpor di file server-side (Route Handler / Server Action).
 * - JANGAN PERNAH diimpor di Client Component ("use client").
 * - Key ini melewati (bypass) RLS sepenuhnya, dipakai untuk:
 *   1) Insert data pelamar dari form public (karena anon tidak punya
 *      izin INSERT langsung ke tabel applicants).
 *   2) Operasi admin CRUD berita/lowongan/pelamar dari API route setelah
 *      sesi admin diverifikasi terlebih dahulu.
 */
export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY belum diset. Tambahkan di file .env.local (jangan commit ke git)."
    );
  }

  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
