import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const trackSchema = z.object({
  application_number: z.string().min(5, "Nomor lamaran tidak valid"),
  email: z.string().email("Format email tidak valid"),
});

/**
 * Endpoint publik untuk melacak status lamaran. Menggunakan service role
 * karena tabel applicants tidak punya SELECT policy untuk anon — namun
 * di sini kita SENGAJA hanya mengembalikan field non-sensitif (status,
 * nama posisi, tanggal) dan mewajibkan kombinasi nomor lamaran + email
 * yang cocok sebagai bentuk verifikasi kepemilikan data.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = trackSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("applicants")
      .select("application_number, status, created_at, full_name, jobs(title)")
      .eq("application_number", parsed.data.application_number.trim().toUpperCase())
      .eq("email", parsed.data.email.trim().toLowerCase())
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json(
        { error: "Data lamaran tidak ditemukan. Periksa kembali nomor lamaran dan email Anda." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Gagal memproses permintaan" }, { status: 500 });
  }
}
