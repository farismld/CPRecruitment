import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const jobSchema = z.object({
  title: z.string().min(3, "Judul posisi minimal 3 karakter"),
  department: z.string().min(2, "Departemen wajib diisi"),
  location: z.string().min(2, "Lokasi wajib diisi"),
  employment_type: z.enum(["Full-time", "Part-time", "Kontrak", "Magang", "Freelance"]),
  description: z.string().min(20, "Deskripsi minimal 20 karakter"),
  requirements: z.string().min(20, "Persyaratan minimal 20 karakter"),
  deadline: z.string().min(1, "Batas pendaftaran wajib diisi"),
  status: z.enum(["draft", "active", "closed"]),
});

async function assertAuthenticated() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return !!user;
}

export async function GET() {
  const isAuth = await assertAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
  }

  const supabase = createClient();
  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Hitung jumlah pelamar per lowongan
  const { data: applicantCounts } = await supabase.from("applicants").select("job_id");
  const countMap: Record<string, number> = {};
  (applicantCounts || []).forEach((a) => {
    countMap[a.job_id] = (countMap[a.job_id] || 0) + 1;
  });

  const data = (jobs || []).map((j) => ({ ...j, applicant_count: countMap[j.id] || 0 }));

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const isAuth = await assertAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = jobSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const admin = createAdminClient();
    const baseSlug = slugify(parsed.data.title);

    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const { data: existing } = await admin.from("jobs").select("id").eq("slug", slug).maybeSingle();
      if (!existing) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const { data, error } = await admin
      .from("jobs")
      .insert({ ...parsed.data, slug })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Gagal memproses permintaan" }, { status: 500 });
  }
}
