/**
 * Utility untuk mengambil site settings dari database.
 * Dipakai di Server Components (halaman public) agar perubahan
 * dari admin langsung terlihat di website tanpa perlu rebuild.
 */
import { createClient } from "@/lib/supabase/server";

export type SiteSettings = Record<string, string>;

let cachedSettings: SiteSettings | null = null;
let cacheTime = 0;
const CACHE_TTL = 60 * 1000; // 60 detik

export async function getSiteSettings(): Promise<SiteSettings> {
  // Cache singkat agar tidak query DB di setiap request
  if (cachedSettings && Date.now() - cacheTime < CACHE_TTL) {
    return cachedSettings;
  }

  try {
    const supabase = createClient();
    const { data } = await supabase.from("site_settings").select("key, value");
    const settings: SiteSettings = {};
    (data || []).forEach((row: { key: string; value: string | null }) => {
      settings[row.key] = row.value || "";
    });
    cachedSettings = settings;
    cacheTime = Date.now();
    return settings;
  } catch {
    return cachedSettings || {};
  }
}

export function s(settings: SiteSettings, key: string, fallback = ""): string {
  return settings[key] || fallback;
}
