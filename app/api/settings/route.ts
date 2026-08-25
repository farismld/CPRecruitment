import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Convert array ke object { key: value }
  const settings: Record<string, string> = {};
  (data || []).forEach((row: { key: string; value: string | null }) => {
    settings[row.key] = row.value || "";
  });

  return NextResponse.json({ data: settings });
}

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const admin = createAdminClient();

    // Upsert semua key yang dikirim
    const upsertData = Object.entries(body).map(([key, value]) => ({
      key,
      value: String(value),
    }));

    const { error } = await admin
      .from("site_settings")
      .upsert(upsertData, { onConflict: "key" });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Gagal menyimpan pengaturan" }, { status: 500 });
  }
}
