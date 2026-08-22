import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";
import { z } from "zod";
import type { Job } from "@/types/database";

const jobUpdateSchema = z.object({
  title: z.string().min(3).optional(),
  department: z.string().min(2).optional(),
  location: z.string().min(2).optional(),
  employment_type: z.enum(["Full-time", "Part-time", "Kontrak", "Magang", "Freelance"]).optional(),
  description: z.string().min(20).optional(),
  requirements: z.string().min(20).optional(),
  deadline: z.string().min(1).optional(),
  status: z.enum(["draft", "active", "closed"]).optional(),
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
  const { data, error } = await supabase.from("jobs").select("*").eq("id", params.id).single();

  if (error || !data) {
    return NextResponse.json({ error: "Lowongan tidak ditemukan" }, { status: 404 });
  }

  const { count } = await supabase
    .from("applicants")
    .select("*", { count: "exact", head: true })
    .eq("job_id", params.id);

  return NextResponse.json({ data: { ...data, applicant_count: count || 0 } });
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
    const parsed = jobUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const admin = createAdminClient();
    const updateData: Partial<Job> = { ...parsed.data };

    if (parsed.data.title) {
      const baseSlug = slugify(parsed.data.title);
      let slug = baseSlug;
      let counter = 1;
      while (true) {
        const { data: existing } = await admin
          .from("jobs")
          .select("id")
          .eq("slug", slug)
          .neq("id", params.id)
          .maybeSingle();
        if (!existing) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      updateData.slug = slug;
    }

    const { data, error } = await admin
      .from("jobs")
      .update(updateData)
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
  // Foreign key applicants -> jobs bersifat ON DELETE CASCADE (lihat schema.sql),
  // sehingga menghapus lowongan otomatis menghapus data pelamar terkait.
  const { error } = await admin.from("jobs").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
