import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";
import { z } from "zod";
import type { News } from "@/types/database";

const newsUpdateSchema = z.object({
  title: z.string().min(5).optional(),
  content: z.string().min(20).optional(),
  excerpt: z.string().min(10).max(300).optional(),
  image_url: z.string().url().nullable().optional(),
  category: z.string().min(2).optional(),
  author: z.string().min(2).optional(),
  status: z.enum(["draft", "published"]).optional(),
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
    .from("news")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Berita tidak ditemukan" }, { status: 404 });
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
    const parsed = newsUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const admin = createAdminClient();
    const updateData: Partial<News> = { ...parsed.data };

    // Regenerate slug jika judul berubah
    if (parsed.data.title) {
      const baseSlug = slugify(parsed.data.title);
      let slug = baseSlug;
      let counter = 1;
      while (true) {
        const { data: existing } = await admin
          .from("news")
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
      .from("news")
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
  const { error } = await admin.from("news").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
