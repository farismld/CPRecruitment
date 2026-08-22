import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const FIELD_MAP: Record<string, string> = {
  cv: "cv_url",
  cover_letter: "cover_letter_url",
  certificate: "certificate_url",
};

/**
 * Endpoint ini menghasilkan signed URL sementara (berlaku 60 detik) untuk
 * mengunduh dokumen pelamar dari bucket privat. Hanya admin yang sudah
 * login yang bisa mengakses endpoint ini — mencegah dokumen pribadi
 * pelamar bocor ke publik.
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "cv";
  const field = FIELD_MAP[type];

  if (!field) {
    return NextResponse.json({ error: "Tipe dokumen tidak valid" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: applicant, error } = await admin
    .from("applicants")
    .select(field)
    .eq("id", params.id)
    .single();

  const path = (applicant as unknown as Record<string, string | null>)?.[field];

  if (error || !applicant || !path) {
    return NextResponse.json({ error: "Dokumen tidak ditemukan" }, { status: 404 });
  }

  const { data: signed, error: signError } = await admin.storage
    .from("applicant-documents")
    .createSignedUrl(path, 60);

  if (signError || !signed) {
    return NextResponse.json({ error: "Gagal membuat tautan unduhan" }, { status: 500 });
  }

  return NextResponse.redirect(signed.signedUrl);
}
