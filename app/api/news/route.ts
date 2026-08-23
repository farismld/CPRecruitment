import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const newsSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  content: z.string().min(20, "Konten minimal 20 karakter"),
  excerpt: z.string().min(10, "Ringkasan minimal 10 karakter").max(300),
  image_url: z.string().url().nullable().optional(),
  category: z.string().min(2),
  author: z.string().min(2),
  status: z.enum(["draft", "published"]),
});

/** Pastikan admin sedang login sebelum operasi tulis */
async function assertAuthenticated() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return !!user;
}

export async function GET(request: Request) {
  const isAuth = await assertAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const isAuth = await assertAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = newsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const admin = createAdminClient();
    const baseSlug = slugify(parsed.data.title);

    // Pastikan slug unik
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const { data: existingData } = await admin.from("news").select("id").eq("slug", slug).maybeSingle();
      const existing = existingData as { id: string } | null;
      if (!existing) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const { data, error } = await admin
      .from("news")
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
