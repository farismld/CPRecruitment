import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

/**
 * Client Supabase untuk digunakan di Client Component ("use client").
 * Memakai ANON KEY — aman dipakai di browser karena akses data
 * dibatasi oleh Row Level Security (RLS) di database.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
