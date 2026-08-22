import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Pesan generik agar tidak membocorkan apakah email terdaftar atau tidak
      return NextResponse.json(
        { error: "Email atau password salah." },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, user: data.user }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
