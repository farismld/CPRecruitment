import { createClient as createSupabaseClient } from "@supabase/supabase-js";

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
 *
 * Catatan tipe: client ini SENGAJA tidak diberi generic <Database> seperti
 * client biasa (lib/supabase/server.ts, lib/supabase/client.ts). Data yang
 * masuk ke sini sudah divalidasi lewat Zod di setiap route sebelum dipakai,
 * jadi keamanan tipe di titik ini bukan lapisan pertahanan utama — dan ini
 * menghindari ketidakcocokan versi generic Postgrest yang bisa membuat
 * build gagal di lingkungan deploy yang menarik versi paket terbaru.
 */
export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY belum diset. Tambahkan di file .env.local (jangan commit ke git)."
    );
  }

  return createSupabaseClient(
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
