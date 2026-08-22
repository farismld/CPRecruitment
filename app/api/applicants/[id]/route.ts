import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum([
    "Baru",
    "Seleksi Administrasi",
    "Diproses",
    "Interview",
    "Lulus",
    "Tidak Lulus",
  ]),
});

async function assertAuthenticated() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return !!user;
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const isAuth = await assertAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("applicants")
    .select("*, jobs(id, title, slug, department)")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Pelamar tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ data });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const isAuth = await assertAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = statusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("applicants")
      .update({ status: parsed.data.status })
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Gagal memproses permintaan" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const isAuth = await assertAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Ambil path dokumen dulu agar bisa dihapus juga dari Storage
  const { data: applicant } = await admin
    .from("applicants")
    .select("cv_url, cover_letter_url, certificate_url")
    .eq("id", params.id)
    .single();

  if (applicant) {
    const paths = [applicant.cv_url, applicant.cover_letter_url, applicant.certificate_url].filter(
      Boolean
    ) as string[];
    if (paths.length > 0) {
      await admin.storage.from("applicant-documents").remove(paths);
    }
  }

  const { error } = await admin.from("applicants").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
